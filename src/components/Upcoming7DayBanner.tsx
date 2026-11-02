import React from 'react';
import { Bill } from '../types';
import { format, parseISO, startOfDay } from 'date-fns';
import { AlertTriangle, Check, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Upcoming7DayBannerProps {
  bills: Bill[];
  activeBiWeeklyPeriod?: {
    id: string;
    start: Date;
    end: Date;
    label: string;
    days: Date[];
  };
  onTogglePaid: (id: string) => void;
  onSelectBill: (bill: Bill) => void;
}

export const Upcoming7DayBanner: React.FC<Upcoming7DayBannerProps> = ({
  bills,
  activeBiWeeklyPeriod,
  onTogglePaid,
  onSelectBill
}) => {
  const today = startOfDay(new Date());

  const payPeriodBills = bills.filter(bill => {
    if (!activeBiWeeklyPeriod) return false;
    const due = parseISO(bill.dueDate);
    const isInPeriod = due >= activeBiWeeklyPeriod.start && due < activeBiWeeklyPeriod.end;
    const isPastUnpaid = due < activeBiWeeklyPeriod.start && !bill.isPaid;
    return isInPeriod || isPastUnpaid;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  if (payPeriodBills.length === 0) {
    return (
      <div className="bg-gradient-to-r from-emerald-950/50 via-[#0a0f0d]/70 to-black/80 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              {activeBiWeeklyPeriod ? `Pay Period (${activeBiWeeklyPeriod.label}) Clear` : 'Pay Period Clear'}
            </h4>
            <p className="text-xs text-slate-400">No pending bills scheduled in this pay period.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-950/50 via-[#0a0f0d]/70 to-black/80 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 relative overflow-hidden backdrop-blur-xl shadow-2xl space-y-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-amber-200 uppercase tracking-wider">
              Pay Period Upcoming Bills
            </h3>
            <p className="text-[11px] text-slate-400">
              {activeBiWeeklyPeriod ? `${activeBiWeeklyPeriod.label} • ` : ''}{payPeriodBills.length} bill{payPeriodBills.length > 1 ? 's' : ''} scheduled or overdue in current pay period
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full uppercase">
          Pay Period Tracker
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {payPeriodBills.map(bill => {
          const due = startOfDay(parseISO(bill.dueDate));
          const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          let badgeText = '';
          let badgeBg = '';

          if (diff < 0) {
            badgeText = `Overdue ${Math.abs(diff)} Day${Math.abs(diff) > 1 ? 's' : ''}`;
            badgeBg = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
          } else if (diff === 0) {
            badgeText = 'Due Today';
            badgeBg = 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
          } else if (diff === 1) {
            badgeText = 'Due Tomorrow';
            badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
          } else {
            badgeText = `Due in ${diff} Days`;
            badgeBg = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
          }

          return (
            <div
              key={bill.id}
              className={cn(
                "p-3 backdrop-blur-md rounded-xl flex items-center justify-between gap-3 transition-all duration-500 cursor-pointer shadow-sm relative overflow-hidden border",
                bill.isPaid
                  ? "bg-gradient-to-r from-emerald-950/70 via-emerald-900/40 to-emerald-950/70 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : "bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 border-emerald-500/20 hover:border-amber-500/40"
              )}
              onClick={() => onSelectBill(bill)}
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">{bill.name}</span>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                    {badgeText}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span className="text-amber-300 font-bold">${bill.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span>•</span>
                  <span className="text-amber-200/80 font-medium">{format(parseISO(bill.dueDate), 'MMM d')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePaid(bill.id);
                }}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all active:scale-95 border",
                  bill.isPaid
                    ? "bg-emerald-500/30 hover:bg-emerald-500/40 border-emerald-500/60 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    : "bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-300"
                )}
              >
                <Check className="w-3.5 h-3.5" />
                {bill.isPaid ? 'PAID' : 'Mark Paid'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Upcoming7DayBanner;
