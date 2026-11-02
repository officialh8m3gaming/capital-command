import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CreditCard, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  Lock, 
  Check, 
  ArrowRight,
  Wallet,
  Landmark
} from 'lucide-react';
import { FinancialAccount } from '../types';

export interface SavingsCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCard: (card: Omit<FinancialAccount, 'id'> & { id?: string }, addToGoalAmount?: number) => void;
  editingCard?: FinancialAccount | null;
  initialPreset?: PresetCardType;
}

export type PresetCardType = 'cashapp' | 'venmo' | 'zelle' | 'applecash' | 'paypal' | 'moneylion' | 'forumcu' | 'custom';

interface PresetConfig {
  id: PresetCardType;
  name: string;
  badge: string;
  defaultInstName: string;
  defaultAccountName: string;
  defaultPurpose: string;
  themeColor: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  accentBadge: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  iconLetter: string;
  description: string;
}

const PRESETS: PresetConfig[] = [
  {
    id: 'cashapp',
    name: 'Cash App',
    badge: 'Sutton Bank / Lincoln Savings',
    defaultInstName: 'Cash App (Sutton Bank)',
    defaultAccountName: 'Cash App Savings Stash',
    defaultPurpose: 'Emergency & Quick Reserve',
    themeColor: '#00D632',
    bgGradient: 'from-[#032e11] via-[#051c0d] to-black',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    textColor: 'text-emerald-400',
    accentBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    identifierLabel: 'Last 4 Digits or $Cashtag',
    identifierPlaceholder: 'e.g. 4821 or $johndoe',
    iconLetter: '$',
    description: 'FDIC-insured through Sutton Bank (Cash Card) & Lincoln Savings Bank (Savings). Syncs live balances without random fluctuation.'
  },
  {
    id: 'venmo',
    name: 'Venmo',
    badge: 'Venmo Debit & Vault',
    defaultInstName: 'Venmo',
    defaultAccountName: 'Venmo Savings Vault',
    defaultPurpose: 'Discretionary & Peer Stash',
    themeColor: '#008CFF',
    bgGradient: 'from-[#031d36] via-[#021124] to-black',
    borderColor: 'border-blue-500/40 hover:border-blue-400',
    textColor: 'text-blue-400',
    accentBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    identifierLabel: 'Last 4 Digits or @Handle',
    identifierPlaceholder: 'e.g. 9102 or @username',
    iconLetter: 'V',
    description: 'Separate peer transfers, split payments, and side-hustle reserves.'
  },
  {
    id: 'zelle',
    name: 'Zelle',
    badge: 'Zelle Stash / Linked Bank',
    defaultInstName: 'Zelle (Linked Bank)',
    defaultAccountName: 'Zelle Emergency Vault',
    defaultPurpose: 'Direct Instant Reserve',
    themeColor: '#7414CA',
    bgGradient: 'from-[#25093e] via-[#150426] to-black',
    borderColor: 'border-purple-500/40 hover:border-purple-400',
    textColor: 'text-purple-400',
    accentBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    identifierLabel: 'Last 4 Digits or Linked Phone/Email',
    identifierPlaceholder: 'e.g. 3349 or 555-0199',
    iconLetter: 'Z',
    description: 'Instant zero-fee transfer buffer linked with your credit union or secondary bank.'
  },
  {
    id: 'applecash',
    name: 'Apple Cash',
    badge: 'Apple Card & Cash',
    defaultInstName: 'Apple Cash',
    defaultAccountName: 'Apple Cash Savings',
    defaultPurpose: 'Daily Cash & High Yield',
    themeColor: '#E2E8F0',
    bgGradient: 'from-[#1e293b] via-[#0f172a] to-black',
    borderColor: 'border-slate-400/40 hover:border-slate-300',
    textColor: 'text-slate-200',
    accentBadge: 'bg-white/10 text-slate-200 border-white/20',
    identifierLabel: 'Last 4 Digits',
    identifierPlaceholder: 'e.g. 1042',
    iconLetter: '',
    description: 'Ring-fence Apple Card Daily Cash cashbacks and high-yield wallet reserves.'
  },
  {
    id: 'moneylion',
    name: 'MoneyLion',
    badge: 'Instacash & RoarMoney',
    defaultInstName: 'MoneyLion',
    defaultAccountName: 'MoneyLion Instacash Stash',
    defaultPurpose: 'Emergency Advance & Reserve',
    themeColor: '#10B981',
    bgGradient: 'from-[#062c1d] via-[#031910] to-black',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    textColor: 'text-emerald-300',
    accentBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    identifierLabel: 'Last 4 Digits',
    identifierPlaceholder: 'e.g. 8820',
    iconLetter: '🦁',
    description: 'Link your Instacash 0% APR cash advance line and isolated reserve cushion.'
  },
  {
    id: 'forumcu',
    name: 'FORUM CU',
    badge: 'Credit Union Savings',
    defaultInstName: 'FORUM Credit Union',
    defaultAccountName: 'FORUM CU Savings Vault',
    defaultPurpose: 'High Yield Reserve',
    themeColor: '#14B8A6',
    bgGradient: 'from-[#042f2e] via-[#021f1e] to-black',
    borderColor: 'border-teal-500/40 hover:border-teal-400',
    textColor: 'text-teal-300',
    accentBadge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    identifierLabel: 'Last 4 Digits',
    identifierPlaceholder: 'e.g. 9182',
    iconLetter: 'FCU',
    description: 'Federally insured credit union high-yield savings and rainy-day reserve.'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    badge: 'PayPal Balance & Savings',
    defaultInstName: 'PayPal',
    defaultAccountName: 'PayPal Reserve Stash',
    defaultPurpose: 'Online Commerce Buffer',
    themeColor: '#003087',
    bgGradient: 'from-[#081f3d] via-[#041124] to-black',
    borderColor: 'border-indigo-500/40 hover:border-indigo-400',
    textColor: 'text-indigo-300',
    accentBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    identifierLabel: 'Last 4 Digits or Account Email',
    identifierPlaceholder: 'e.g. 7731',
    iconLetter: 'P',
    description: 'Protect online shopping and merchant payouts in an isolated holding balance.'
  },
  {
    id: 'custom',
    name: 'Custom Card / Bank',
    badge: 'Card of Your Choice',
    defaultInstName: '',
    defaultAccountName: 'Separated Savings Card',
    defaultPurpose: 'Dedicated Savings Fund',
    themeColor: '#F59E0B',
    bgGradient: 'from-[#2e1d05] via-[#1c1102] to-black',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    textColor: 'text-amber-400',
    accentBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    identifierLabel: 'Last 4 Digits of Card',
    identifierPlaceholder: 'e.g. 5678',
    iconLetter: '★',
    description: 'Connect any prepaid card, credit union debit, Chime, SoFi, or secondary savings card.'
  }
];

export const SavingsCardModal: React.FC<SavingsCardModalProps> = ({
  isOpen,
  onClose,
  onSaveCard,
  editingCard,
  initialPreset
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetCardType>(initialPreset || 'cashapp');
  const [instName, setInstName] = useState('Cash App');
  const [accountName, setAccountName] = useState('Cash App Savings Stash');
  const [last4, setLast4] = useState('');
  const [balance, setBalance] = useState('');
  const [savingsPurpose, setSavingsPurpose] = useState('Emergency & Quick Reserve');
  const [contributeToMainGoal, setContributeToMainGoal] = useState(false);
  const [goalContributionAmount, setGoalContributionAmount] = useState('');

  // Sync state with editing card or default
  useEffect(() => {
    if (editingCard) {
      const presetMatch = PRESETS.find(p => p.id === editingCard.cardProviderPreset) || 
        (editingCard.institutionName.toLowerCase().includes('cash app') ? PRESETS[0] :
         editingCard.institutionName.toLowerCase().includes('venmo') ? PRESETS[1] :
         editingCard.institutionName.toLowerCase().includes('zelle') ? PRESETS[2] :
         editingCard.institutionName.toLowerCase().includes('apple') ? PRESETS[3] :
         editingCard.institutionName.toLowerCase().includes('moneylion') ? PRESETS[4] :
         editingCard.institutionName.toLowerCase().includes('forum') ? PRESETS[5] :
         editingCard.institutionName.toLowerCase().includes('paypal') ? PRESETS[6] : PRESETS[7]);

      setSelectedPreset(presetMatch.id);
      setInstName(editingCard.institutionName);
      setAccountName(editingCard.accountName);
      setLast4(editingCard.last4);
      setBalance(editingCard.balance.toString());
      setSavingsPurpose(editingCard.savingsPurpose || presetMatch.defaultPurpose);
      setContributeToMainGoal(false);
      setGoalContributionAmount('');
    } else {
      const targetId = initialPreset || 'cashapp';
      const preset = PRESETS.find(p => p.id === targetId) || PRESETS[0];
      setSelectedPreset(preset.id);
      setInstName(preset.defaultInstName);
      setAccountName(preset.defaultAccountName);
      setLast4('');
      setBalance('');
      setSavingsPurpose(preset.defaultPurpose);
      setContributeToMainGoal(false);
      setGoalContributionAmount('');
    }
  }, [editingCard, isOpen, initialPreset]);

  const handleSelectPreset = (preset: PresetConfig) => {
    setSelectedPreset(preset.id);
    if (!editingCard) {
      setInstName(preset.defaultInstName);
      setAccountName(preset.defaultAccountName);
      setSavingsPurpose(preset.defaultPurpose);
    }
  };

  const currentPreset = PRESETS.find(p => p.id === selectedPreset) || PRESETS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const balNum = parseFloat(balance) || 0;
    const finalLast4 = last4.trim() ? last4.trim().slice(-4) : '0000';
    const finalInst = instName.trim() || currentPreset.name;
    const finalAccName = accountName.trim() || `${finalInst} Savings`;

    const cardPayload: Omit<FinancialAccount, 'id'> & { id?: string } = {
      ...(editingCard ? { id: editingCard.id } : {}),
      institutionName: finalInst,
      accountName: finalAccName,
      accountType: 'savings',
      last4: finalLast4,
      balance: balNum,
      isSavingsCard: true,
      cardProviderPreset: selectedPreset,
      savingsPurpose: savingsPurpose.trim() || 'General Savings',
      lastSyncedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const contributionNum = contributeToMainGoal && goalContributionAmount ? parseFloat(goalContributionAmount) : undefined;

    onSaveCard(cardPayload, contributionNum);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[75] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-2xl bg-gradient-to-br from-[#0c1611] via-[#090f0c] to-black border border-emerald-500/30 rounded-[2.5rem] p-6 md:p-8 z-10 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-start shrink-0">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                Savings Separation Vault
              </div>
              <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                {editingCard ? 'Edit Savings Card / Account' : 'Add Savings Card / Separate Vault'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Add Cash App, Venmo, Zelle, or a custom card to keep your savings and emergency reserves strictly isolated from daily checking.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Preset Selector Grid */}
          <div className="space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Select Preferred Card / Provider
              </label>
              <span className="text-[9px] font-mono text-slate-400">Tap to auto-configure</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRESETS.map((p) => {
                const isSelected = selectedPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? `bg-gradient-to-br ${p.bgGradient} border-2 ${p.borderColor} shadow-lg ring-1 ring-white/20`
                        : 'bg-black/50 border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs font-mono shadow-md ${
                          isSelected ? p.accentBadge : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {p.iconLetter}
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white font-mono">{p.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono truncate">{p.badge}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Preset Visual Card Preview */}
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentPreset.bgGradient} border ${currentPreset.borderColor} shadow-xl relative overflow-hidden space-y-2 shrink-0`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${currentPreset.accentBadge}`}>
                  {currentPreset.name} Isolated Reserve
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Funds Separated
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-slate-300">
                {last4 ? `•••• ${last4.slice(-4)}` : '•••• ----'}
              </span>
            </div>
            
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Available Isolated Balance</p>
                <p className="text-xl font-mono font-bold text-white">
                  ${balance ? parseFloat(balance || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Purpose</p>
                <p className="text-xs font-mono font-semibold text-amber-300 truncate max-w-[150px]">
                  {savingsPurpose || currentPreset.defaultPurpose}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-mono italic pt-1 border-t border-white/10">
              {currentPreset.description}
            </p>
          </div>

          {/* Form Details */}
          <form onSubmit={handleSubmit} className="space-y-4 grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                  <Landmark className="w-3 h-3 text-slate-400" />
                  Card / Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  placeholder="e.g. Cash App, Venmo, Zelle, Chime"
                  className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-slate-400" />
                  Card Nickname / Account Title *
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. Cash App Rainy Day, Venmo Vault"
                  className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                  {currentPreset.identifierLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={last4}
                  onChange={(e) => setLast4(e.target.value)}
                  placeholder={currentPreset.identifierPlaceholder}
                  className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                  Current Isolated Balance ($) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="500.00"
                    className="w-full bg-black/60 border border-border-subtle rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                Savings Purpose / Separation Tag
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {[
                  'Emergency Reserve',
                  'Discretionary Stash',
                  'Taxes & Deductions',
                  'Vacation Fund',
                  'Buffer / Safety Net',
                  'Goal Savings'
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSavingsPurpose(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
                      savingsPurpose === tag
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={savingsPurpose}
                onChange={(e) => setSavingsPurpose(e.target.value)}
                placeholder="e.g. Emergency Fund, Taxes, Discretionary"
                className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Optional checkbox to sync initial balance with Emergency Reserve Goal */}
            {!editingCard && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contributeToMainGoal}
                    onChange={(e) => {
                      setContributeToMainGoal(e.target.checked);
                      if (e.target.checked && !goalContributionAmount && balance) {
                        setGoalContributionAmount(balance);
                      }
                    }}
                    className="w-4 h-4 rounded text-emerald-500 bg-black/60 border-white/20 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-mono text-emerald-300 font-semibold">
                    Also credit this balance to your main Sidebar Emergency Reserve Goal?
                  </span>
                </label>
                {contributeToMainGoal && (
                  <div className="pl-6 pt-1">
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">
                      Amount to add to Goal Balance ($):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={goalContributionAmount}
                      onChange={(e) => setGoalContributionAmount(e.target.value)}
                      placeholder="e.g. 500.00"
                      className="w-full max-w-xs bg-black/80 border border-emerald-500/40 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-border-subtle font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 font-mono flex items-center justify-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                {editingCard ? 'Update Savings Card' : 'Save & Isolate Card'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
