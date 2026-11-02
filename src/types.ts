export type BillCategory = 'utilities' | 'rent' | 'credit card' | 'insurance' | 'subscription' | 'other';
export type BillFrequency = 'none' | 'weekly' | 'bi-weekly' | 'monthly' | 'yearly';

export interface Bill {
  id: string;
  name: string;
  amount: number;
  category: BillCategory;
  dueDate: string; // ISO string for the specific day
  isPaid: boolean;
  frequency: BillFrequency;
  recurringParentId?: string; // Links instances of the same recurring bill
  accountId?: string; // Linked bank account or credit card ID
  createdAt?: any;
  updatedAt?: any;
}

export type CategoryInfo = {
  label: string;
  color: string;
  icon: string;
};

export type CategoryConfig = {
  [key in BillCategory]: CategoryInfo;
};

export const DEFAULT_CATEGORIES: CategoryConfig = {
  utilities: { label: 'Utilities', color: 'blue', icon: 'zap' },
  rent: { label: 'Rent/Mortgage', color: 'emerald', icon: 'home' },
  'credit card': { label: 'Credit Card', color: 'purple', icon: 'credit-card' },
  insurance: { label: 'Insurance', color: 'amber', icon: 'shield' },
  subscription: { label: 'Subscription', color: 'pink', icon: 'refresh-cw' },
  other: { label: 'Other', color: 'slate', icon: 'more-horizontal' },
};

export const COLOR_OPTIONS = [
  { id: 'blue', name: 'Blue', text: 'text-blue-500', bg: 'bg-blue-100', dot: 'bg-blue-500', calBg: 'bg-blue-900/20', calBorder: 'border-blue-900/50' },
  { id: 'emerald', name: 'Emerald', text: 'text-emerald-500', bg: 'bg-emerald-100', dot: 'bg-emerald-500', calBg: 'bg-emerald-900/20', calBorder: 'border-emerald-900/50' },
  { id: 'purple', name: 'Purple', text: 'text-purple-500', bg: 'bg-purple-100', dot: 'bg-purple-500', calBg: 'bg-purple-900/20', calBorder: 'border-purple-900/50' },
  { id: 'orange', name: 'Orange', text: 'text-orange-500', bg: 'bg-orange-100', dot: 'bg-orange-500', calBg: 'bg-orange-900/20', calBorder: 'border-orange-900/50' },
  { id: 'pink', name: 'Pink', text: 'text-pink-500', bg: 'bg-pink-100', dot: 'bg-pink-500', calBg: 'bg-pink-900/20', calBorder: 'border-pink-900/50' },
  { id: 'slate', name: 'Slate', text: 'text-slate-400', bg: 'bg-slate-500', dot: 'bg-slate-500', calBg: 'bg-slate-900/20', calBorder: 'border-slate-900/50' },
  { id: 'rose', name: 'Rose', text: 'text-rose-500', bg: 'bg-rose-100', dot: 'bg-rose-500', calBg: 'bg-rose-900/20', calBorder: 'border-rose-900/50' },
  { id: 'amber', name: 'Amber', text: 'text-amber-500', bg: 'bg-amber-500', dot: 'bg-amber-500', calBg: 'bg-amber-900/20', calBorder: 'border-amber-900/50' },
  { id: 'indigo', name: 'Indigo', text: 'text-indigo-500', bg: 'bg-indigo-100', dot: 'bg-indigo-500', calBg: 'bg-indigo-900/20', calBorder: 'border-indigo-900/50' },
  { id: 'cyan', name: 'Cyan', text: 'text-cyan-500', bg: 'bg-cyan-100', dot: 'bg-cyan-500', calBg: 'bg-cyan-900/20', calBorder: 'border-cyan-900/50' },
];

export interface SavingsDeposit {
  id: string;
  name: string;
  amount: number;
  date: string; // ISO string (YYYY-MM-DD)
  targetAccount: string; // e.g. Emergency Fund, HYSA, Roth IRA, 401(k), Brokerage
  createdAt?: any;
  updatedAt?: any;
}

export interface GoalDeposit {
  id: string;
  goalName: string;
  amount: number;
  date: string; // ISO string (YYYY-MM-DD)
  timestamp: string; // Formatted display timestamp e.g. "Aug 15, 2026 • 8:49 PM"
  note?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const SAVINGS_ACCOUNT_OPTIONS = [
  'Emergency Fund',
  'HYSA (High-Yield Savings)',
  'Roth IRA',
  '401(k) / Retirement',
  'Brokerage / Investments',
  'General Savings'
];

export type AccountType = 'checking' | 'savings' | 'debit' | 'credit' | 'investment';

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  website: string;
  notes?: string;
  updatedAt?: string;
}

export interface FinancialAccount {
  id: string;
  institutionName: string;
  accountName: string;
  accountType: AccountType;
  last4: string;
  balance: number; // Available Balance for liquid, or Current Statement Balance for Credit Card
  creditLimit?: number; // Credit Cards
  dueDate?: string; // Credit Cards (YYYY-MM-DD or day of month)
  minimumPayment?: number; // Credit Cards
  linkedAccountId?: string; // Debit Cards
  isPlaidConnected?: boolean;
  plaidInstitutionId?: string;
  plaidAccountId?: string;
  plaidItemId?: string;
  accessToken?: string;
  lastSyncedAt?: string; // ISO timestamp
  logoBg?: string;
  hasInstacashBoost?: boolean;
  instacashBoostLabel?: string;
  isInstacashAdvance?: boolean;
  isSavingsCard?: boolean;
  savingsPurpose?: string; // e.g. "Emergency Fund", "Discretionary Reserve", "Taxes Stash"
  cardProviderPreset?: 'cashapp' | 'venmo' | 'zelle' | 'applecash' | 'paypal' | 'moneylion' | 'forumcu' | 'custom';
  isManualOnly?: boolean;
  manualTrackingTag?: string;
  lowBalanceAlertThreshold?: number;
  enableLowBalanceCalendarAlert?: boolean;
  syncStatus?: 'healthy' | 'reauth_required' | 'sync_delayed' | 'mfa_required' | 'error';
  syncErrorMessage?: string;
  syncErrorCode?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface PlaidInstitution {
  id: string;
  name: string;
  logo: string;
  color: string;
  bgGradient: string;
  isManualOnly?: boolean;
  manualReason?: string;
  defaultAccounts: Omit<FinancialAccount, 'id'>[];
}

export function isAccountPlaidSupported(acc?: { institutionName?: string; accountName?: string; plaidInstitutionId?: string; isManualOnly?: boolean; isPlaidConnected?: boolean } | null): boolean {
  if (!acc) return false;
  if (acc.isManualOnly) return false;

  const cleanStr = (s?: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const instId = cleanStr(acc.plaidInstitutionId);
  const instName = cleanStr(acc.institutionName);
  const accName = cleanStr(acc.accountName);

  const unsupportedNormalized = [
    'cashapp', 'cashcard', 'suttonbank', 'lincolnsavings',
    'applecash', 'applecard',
    'dave', 'extracash',
    'brigit', 
    'earnin', 
    'klarna', 
    'affirm', 
    'afterpay', 
    'chime',
    'storecard'
  ];

  if (unsupportedNormalized.some(k => instId.includes(k) || instName.includes(k) || accName.includes(k))) {
    return false;
  }

  const rawCombined = `${acc.plaidInstitutionId || ''} ${acc.institutionName || ''} ${acc.accountName || ''}`.toLowerCase();
  if (
    rawCombined.includes('$cash') || 
    rawCombined.includes('cash app') || 
    rawCombined.includes('cash card') ||
    rawCombined.includes('sutton bank') ||
    rawCombined.includes('lincoln savings') ||
    rawCombined.includes('apple card') ||
    rawCombined.includes('apple cash') ||
    rawCombined.includes('dave') ||
    rawCombined.includes('brigit') ||
    rawCombined.includes('earnin')
  ) {
    return false;
  }

  return Boolean(acc.isPlaidConnected);
}

export interface AutoPayEntry {
  id: string;
  name: string;
  amount: number;
  category: BillCategory;
  dueDate: string; // YYYY-MM-DD
  frequency: BillFrequency;
  isPaid?: boolean;
}

