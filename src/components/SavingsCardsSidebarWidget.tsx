import React from 'react';
import { 
  Plus, 
  CreditCard, 
  Wallet, 
  ShieldCheck, 
  Pencil, 
  Trash2, 
  ArrowUpRight, 
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';
import { FinancialAccount } from '../types';

export interface SavingsCardsSidebarWidgetProps {
  savingsCards: FinancialAccount[];
  onOpenAddModal: (preset?: 'cashapp' | 'venmo' | 'zelle' | 'applecash' | 'paypal' | 'moneylion' | 'forumcu' | 'custom') => void;
  onOpenEditModal: (card: FinancialAccount) => void;
  onOpenDepositModal: (card: FinancialAccount) => void;
  onDeleteCard: (id: string) => void;
}

export const SavingsCardsSidebarWidget: React.FC<SavingsCardsSidebarWidgetProps> = ({
  savingsCards,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDepositModal,
  onDeleteCard
}) => {
  const totalSeparatedBalance = savingsCards.reduce((sum, c) => sum + (c.balance || 0), 0);

  const getCardBranding = (card: FinancialAccount) => {
    const instLower = (card.institutionName || '').toLowerCase();
    const accLower = (card.accountName || '').toLowerCase();
    const preset = card.cardProviderPreset;

    if (preset === 'cashapp' || instLower.includes('cash app') || accLower.includes('cash app')) {
      return {
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        cardBg: 'from-[#032e11]/80 via-[#051c0d]/90 to-black/90',
        border: 'border-emerald-500/30 hover:border-emerald-400',
        textColor: 'text-emerald-400',
        iconLetter: '$',
        iconBg: 'bg-emerald-500 text-black',
        label: 'Cash App'
      };
    }

    if (preset === 'venmo' || instLower.includes('venmo') || accLower.includes('venmo')) {
      return {
        badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        cardBg: 'from-[#031d36]/80 via-[#021124]/90 to-black/90',
        border: 'border-blue-500/30 hover:border-blue-400',
        textColor: 'text-blue-400',
        iconLetter: 'V',
        iconBg: 'bg-blue-500 text-white',
        label: 'Venmo'
      };
    }

    if (preset === 'zelle' || instLower.includes('zelle') || accLower.includes('zelle')) {
      return {
        badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        cardBg: 'from-[#25093e]/80 via-[#150426]/90 to-black/90',
        border: 'border-purple-500/30 hover:border-purple-400',
        textColor: 'text-purple-400',
        iconLetter: 'Z',
        iconBg: 'bg-purple-600 text-white',
        label: 'Zelle'
      };
    }

    if (preset === 'moneylion' || instLower.includes('moneylion') || accLower.includes('moneylion')) {
      return {
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        cardBg: 'from-[#062c1d]/80 via-[#031910]/90 to-black/90',
        border: 'border-emerald-500/30 hover:border-emerald-400',
        textColor: 'text-emerald-400',
        iconLetter: '🦁',
        iconBg: 'bg-emerald-600 text-white',
        label: 'MoneyLion'
      };
    }

    if (preset === 'forumcu' || instLower.includes('forum') || accLower.includes('forum')) {
      return {
        badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
        cardBg: 'from-[#042f2e]/80 via-[#021f1e]/90 to-black/90',
        border: 'border-teal-500/30 hover:border-teal-400',
        textColor: 'text-teal-400',
        iconLetter: 'FCU',
        iconBg: 'bg-teal-600 text-white',
        label: 'FORUM CU'
      };
    }

    if (preset === 'applecash' || instLower.includes('apple') || accLower.includes('apple')) {
      return {
        badgeBg: 'bg-white/10 text-slate-200 border-white/20',
        cardBg: 'from-[#1e293b]/80 via-[#0f172a]/90 to-black/90',
        border: 'border-slate-400/30 hover:border-slate-300',
        textColor: 'text-slate-200',
        iconLetter: '',
        iconBg: 'bg-white text-black',
        label: 'Apple Cash'
      };
    }

    if (preset === 'paypal' || instLower.includes('paypal') || accLower.includes('paypal')) {
      return {
        badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        cardBg: 'from-[#081f3d]/80 via-[#041124]/90 to-black/90',
        border: 'border-indigo-500/30 hover:border-indigo-400',
        textColor: 'text-indigo-300',
        iconLetter: 'P',
        iconBg: 'bg-indigo-600 text-white',
        label: 'PayPal'
      };
    }

    return {
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      cardBg: 'from-[#2e1d05]/80 via-[#1c1102]/90 to-black/90',
      border: 'border-amber-500/30 hover:border-amber-400',
      textColor: 'text-amber-400',
      iconLetter: '★',
      iconBg: 'bg-amber-500 text-black',
      label: card.institutionName || 'Savings Card'
    };
  };

  return (
    <div className="space-y-3 pt-3 border-t border-emerald-500/20">
      {/* Subheader */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
            Dedicated Savings Cards
          </span>
        </div>
        <button
          type="button"
          onClick={() => onOpenAddModal('custom')}
          className="text-[9px] font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline transition-all"
          title="Add a dedicated card to separate savings"
        >
          <Plus className="w-3 h-3" />
          <span>Add Card</span>
        </button>
      </div>

      {/* Quick 1-Click Preset Buttons */}
      <div className="grid grid-cols-4 gap-1 px-0.5">
        <button
          type="button"
          onClick={() => onOpenAddModal('cashapp')}
          className="px-1.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 text-[9px] font-mono font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
          title="Add Cash App Card / Savings"
        >
          <span className="w-3 h-3 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[8px] font-bold">$</span>
          <span className="truncate">Cash App</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenAddModal('venmo')}
          className="px-1.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/30 hover:border-blue-400 text-blue-300 text-[9px] font-mono font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
          title="Add Venmo Card / Vault"
        >
          <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">V</span>
          <span className="truncate">Venmo</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenAddModal('zelle')}
          className="px-1.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 hover:border-purple-400 text-purple-300 text-[9px] font-mono font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
          title="Add Zelle Linked Stash"
        >
          <span className="w-3 h-3 rounded-full bg-purple-600 text-white flex items-center justify-center text-[8px] font-bold">Z</span>
          <span className="truncate">Zelle</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenAddModal('custom')}
          className="px-1.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/30 hover:border-amber-400 text-amber-300 text-[9px] font-mono font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
          title="Add Custom Card of Choice"
        >
          <Plus className="w-2.5 h-2.5" />
          <span className="truncate">Custom</span>
        </button>
      </div>

      {/* List of Separated Cards */}
      {savingsCards.length === 0 ? (
        <div className="p-3 bg-black/40 rounded-xl border border-white/5 border-dashed text-center space-y-1">
          <p className="text-[10px] font-mono text-slate-400">
            No separated savings cards added yet.
          </p>
          <p className="text-[9px] font-mono text-slate-500">
            Tap <strong className="text-emerald-400">Cash App</strong>, <strong className="text-blue-400">Venmo</strong>, <strong className="text-purple-400">Zelle</strong>, or <strong className="text-amber-400">Custom</strong> above to isolate your reserves.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-0.5">
          {savingsCards.map((card) => {
            const branding = getCardBranding(card);
            return (
              <div
                key={card.id}
                className={`p-2.5 rounded-xl bg-gradient-to-br ${branding.cardBg} border ${branding.border} shadow-md transition-all group relative`}
              >
                {/* Top Row: Brand & Actions */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-4 h-4 rounded-md ${branding.iconBg} flex items-center justify-center text-[9px] font-bold shrink-0 shadow`}>
                      {branding.iconLetter}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-white truncate max-w-[110px]">
                      {card.accountName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Quick Adjust Funds */}
                    <button
                      type="button"
                      onClick={() => onOpenDepositModal(card)}
                      className="px-1.5 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-[9px] font-mono font-bold flex items-center gap-0.5 transition-all"
                      title="Deposit or withdraw money from this card"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>Funds</span>
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => onOpenEditModal(card)}
                      className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-all"
                      title="Edit Card"
                    >
                      <Pencil className="w-2.5 h-2.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDeleteCard(card.id)}
                      className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-all"
                      title="Remove Card"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Balance & Purpose */}
                <div className="flex items-baseline justify-between pt-0.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] font-mono text-emerald-500 font-bold">$</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      {(card.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {card.savingsPurpose && (
                      <span className="text-[8px] font-mono text-amber-300/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 truncate max-w-[85px]">
                        {card.savingsPurpose}
                      </span>
                    )}
                    <span className="text-[8px] font-mono text-slate-400">
                      •••• {card.last4}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary of Separated Funds across all Cards */}
      {savingsCards.length > 0 && (
        <div className="p-2 rounded-xl bg-black/60 border border-amber-500/20 flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>Total Separated in Cards:</span>
          </div>
          <span className="text-amber-300 font-bold">
            ${totalSeparatedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      )}
    </div>
  );
};
