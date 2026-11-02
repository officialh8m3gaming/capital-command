import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  Minus, 
  ArrowRight, 
  DollarSign, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  Wallet
} from 'lucide-react';
import { FinancialAccount } from '../types';

export interface SavingsCardDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: FinancialAccount | null;
  onUpdateCardBalance: (cardId: string, newBalance: number, delta: number, transferToGoal?: boolean) => void;
}

export const SavingsCardDepositModal: React.FC<SavingsCardDepositModalProps> = ({
  isOpen,
  onClose,
  card,
  onUpdateCardBalance
}) => {
  const [actionType, setActionType] = useState<'deposit' | 'withdraw' | 'transfer_goal'>('deposit');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen || !card) return null;

  const currentBalance = card.balance || 0;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) return;

    if (actionType === 'deposit') {
      const newBal = currentBalance + amtNum;
      onUpdateCardBalance(card.id, newBal, amtNum, false);
    } else if (actionType === 'withdraw') {
      const newBal = Math.max(0, currentBalance - amtNum);
      onUpdateCardBalance(card.id, newBal, -amtNum, false);
    } else if (actionType === 'transfer_goal') {
      const newBal = Math.max(0, currentBalance - amtNum);
      onUpdateCardBalance(card.id, newBal, -amtNum, true);
    }

    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[80] overflow-y-auto">
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
          className="relative w-full max-w-md bg-gradient-to-br from-[#0c1611] via-[#090f0c] to-black border border-emerald-500/30 rounded-[2.5rem] p-6 md:p-8 z-10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Ledger Envelope Adjuster (Tracking Only)
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                {card.accountName}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {card.institutionName} •••• {card.last4} ({card.savingsPurpose || 'Savings Vault'})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Safety & Non-Custodial Tracking Disclosure */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-200/90 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Budget Ledger Only:</strong> This tool only updates your visual budgeting envelope numbers. It does <em>not</em> execute real bank transfers, wires, or ACH debits.
            </span>
          </div>

          {/* Current Balance Display */}
          <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/20 shadow-inner flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Tracked Ledger Balance</span>
              <span className="text-2xl font-mono font-bold text-emerald-400">
                ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Isolated Ledger
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/70 rounded-xl border border-white/10 text-[10px] font-mono font-bold">
            <button
              type="button"
              onClick={() => setActionType('deposit')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                actionType === 'deposit'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-3 h-3" />
              + Ledger
            </button>
            <button
              type="button"
              onClick={() => setActionType('withdraw')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                actionType === 'withdraw'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Minus className="w-3 h-3" />
              - Ledger
            </button>
            <button
              type="button"
              onClick={() => setActionType('transfer_goal')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                actionType === 'transfer_goal'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowRight className="w-3 h-3" />
              To Goal
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleApply} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                {actionType === 'deposit' ? 'Amount to Credit to Ledger ($)' : actionType === 'withdraw' ? 'Amount to Debit from Ledger ($)' : 'Amount to Allocate to Goal Ledger ($)'}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-mono">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50.00"
                  className="w-full bg-black/60 border border-border-subtle rounded-xl pl-8 pr-4 py-3 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-mono font-bold"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {['10', '25', '50', '100', '250', '500'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className="px-2.5 py-1 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-mono font-bold transition-all active:scale-95"
                  >
                    +${preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                Tracking Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Paycheck allocation, Weekly savings"
                className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-mono"
              />
            </div>

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
                className={`flex-1 py-3 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg font-mono flex items-center justify-center gap-2 active:scale-95 ${
                  actionType === 'deposit'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                    : actionType === 'withdraw'
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                    : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                }`}
              >
                {actionType === 'deposit' ? 'Update Ledger (+)' : actionType === 'withdraw' ? 'Update Ledger (-)' : 'Allocate to Goal Ledger'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
