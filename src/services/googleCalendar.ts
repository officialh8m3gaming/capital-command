import { Bill, FinancialAccount } from '../types';

export interface CalendarSyncResult {
  success: boolean;
  syncedCount: number;
  totalBills: number;
  message: string;
  errors?: string[];
}

/**
 * Creates or updates events on the user's primary Google Calendar for each bill and low-balance alert.
 */
export async function syncBillsToGoogleCalendar(
  bills: Bill[],
  accessToken: string,
  financialAccounts: FinancialAccount[] = []
): Promise<CalendarSyncResult> {
  if (!accessToken) {
    throw new Error('No Google access token provided.');
  }

  const validBills = (bills || []).filter(b => b.dueDate && b.name);
  const accountsToSync = (financialAccounts || []).filter(acc => acc.enableLowBalanceCalendarAlert);

  if (validBills.length === 0 && accountsToSync.length === 0) {
    return {
      success: true,
      syncedCount: 0,
      totalBills: 0,
      message: 'No bills or low-balance alerts found to synchronize.'
    };
  }

  let syncedCount = 0;
  const errors: string[] = [];

  // Fetch existing events created by Capital Command to avoid duplicates
  let existingEventsMap = new Map<string, string>(); // refId -> eventId
  try {
    const listRes = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=2500&singleEvents=true',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json'
        }
      }
    );

    if (listRes.ok) {
      const listData = await listRes.json();
      if (Array.isArray(listData.items)) {
        for (const item of listData.items) {
          const privateBillId = item.extendedProperties?.private?.capitalCommandBillId;
          const privateAccId = item.extendedProperties?.private?.capitalCommandAccountId;
          if (privateBillId) {
            existingEventsMap.set(privateBillId, item.id);
          } else if (privateAccId) {
            existingEventsMap.set(privateAccId, item.id);
          }
        }
      }
    }
  } catch (err: any) {
    console.warn('Could not list existing Google Calendar events for deduplication:', err);
  }

  // Sync each valid bill
  for (const bill of validBills) {
    try {
      const statusText = bill.isPaid ? 'PAID' : 'UNPAID';
      const eventPayload = {
        summary: `💰 Bill Due: ${bill.name} ($${Number(bill.amount).toFixed(2)}) [${statusText}]`,
        description: [
          `Capital Command Liability Schedule`,
          `Liability: ${bill.name}`,
          `Amount: $${Number(bill.amount).toFixed(2)}`,
          `Category: ${bill.category || 'General'}`,
          `Status: ${bill.isPaid ? 'Paid' : 'Pending / Unpaid'}`,
          `Frequency: ${bill.frequency || 'None'}`,
          `Sync Reference: ${bill.id}`
        ].join('\n'),
        start: {
          date: bill.dueDate
        },
        end: {
          date: bill.dueDate
        },
        transparency: 'transparent',
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 1440 },
            { method: 'popup', minutes: 60 }
          ]
        },
        extendedProperties: {
          private: {
            capitalCommandBillId: bill.id,
            source: 'CapitalCommand'
          }
        }
      };

      const existingEventId = existingEventsMap.get(bill.id);
      let response: Response;

      if (existingEventId) {
        response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${existingEventId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventPayload)
          }
        );
      } else {
        response = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventPayload)
          }
        );
      }

      if (response.ok) {
        syncedCount++;
      } else {
        const errorBody = await response.text();
        console.warn(`Failed to sync bill "${bill.name}":`, errorBody);
        errors.push(`${bill.name}: HTTP ${response.status}`);
      }
    } catch (billError: any) {
      console.warn(`Error writing bill "${bill.name}" to Google Calendar:`, billError);
      errors.push(`${bill.name}: ${billError?.message || 'Network error'}`);
    }
  }

  // Sync low balance alerts for cards/accounts
  const todayStr = new Date().toISOString().split('T')[0];
  for (const acc of accountsToSync) {
    try {
      const threshold = acc.lowBalanceAlertThreshold ?? 50;
      const eventDate = acc.dueDate || todayStr;
      const eventPayload = {
        summary: `⚠️ Low Balance Warning: ${acc.accountName} ($${acc.balance.toFixed(2)} <= $${threshold.toFixed(2)})`,
        description: [
          `Capital Command Low Balance Safety Alert`,
          `Account: ${acc.institutionName} - ${acc.accountName} (...${acc.last4})`,
          `Current Balance: $${acc.balance.toFixed(2)}`,
          `Safety Threshold: $${threshold.toFixed(2)}`,
          `Sync Reference: ${acc.id}`
        ].join('\n'),
        start: { date: eventDate },
        end: { date: eventDate },
        transparency: 'transparent',
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 1440 },
            { method: 'popup', minutes: 60 }
          ]
        },
        extendedProperties: {
          private: {
            capitalCommandAccountId: acc.id,
            source: 'CapitalCommandLowBalanceAlert'
          }
        }
      };

      const existingEventId = existingEventsMap.get(acc.id);
      let response: Response;

      if (existingEventId) {
        response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${existingEventId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventPayload)
          }
        );
      } else {
        response = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventPayload)
          }
        );
      }

      if (response.ok) {
        syncedCount++;
      } else {
        const errorBody = await response.text();
        console.warn(`Failed to sync account alert "${acc.accountName}":`, errorBody);
        errors.push(`${acc.accountName}: HTTP ${response.status}`);
      }
    } catch (accError: any) {
      console.warn(`Error writing account alert "${acc.accountName}" to Google Calendar:`, accError);
      errors.push(`${acc.accountName}: ${accError?.message || 'Network error'}`);
    }
  }

  const totalItems = validBills.length + accountsToSync.length;
  return {
    success: syncedCount > 0 || totalItems === 0,
    syncedCount,
    totalBills: totalItems,
    message: `Successfully synchronized ${syncedCount} of ${totalItems} item(s) (bills & low-balance alerts) to Google Calendar!`,
    errors: errors.length > 0 ? errors : undefined
  };
}
