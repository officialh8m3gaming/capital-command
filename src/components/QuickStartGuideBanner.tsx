import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ArrowRight, 
  Landmark, 
  TrendingUp, 
  CreditCard, 
  Sparkles, 
  X, 
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Bill, FinancialAccount } from '../types';

interface QuickStartGuideBannerProps {
  bills: Bill[];
  financialAccounts: FinancialAccount[];
  monthlyIncome: string;
  onOpenBankModal: () => void;
  onOpenIncomeEditor: () => void;
  onOpenAddBillModal: () => void;
  onOpenFullGuideModal: () => void;
}

export const QuickStartGuideBanner: React.FC<QuickStartGuideBannerProps> = ({
  bills,
  financialAccounts,
  monthlyIncome,
  onOpenBankModal,
  onOpenIncomeEditor,
  onOpenAddBillModal,
  onOpenFullGuideModal,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const hasBankOrCash = financialAccounts.length > 0;
  const hasIncome = (parseFloat(monthlyIncome) || 0) > 0;
  const hasBill = bills.length > 0;
  const hasMultipleBills = bills.length >= 2;

  const steps = [
    {
      id: 1,
      number: '1',
      title: 'Connect Bank / Cash',
      desc: 'Link checking, savings, or manual card',
      icon: Landmark,
      isCompleted: hasBankOrCash,
      actionText: hasBankOrCash ? 'Manage' : 'Connect Bank',
      onClick: onOpenBankModal,
      accentColor: 'text-blue-400',
      bgGlow: 'from-blue-500/20 to-indigo-500/10'
    },
    {
      id: 2,
      number: '2',
      title: 'Set Monthly Income',
      desc: 'Enter your paycheck amount & cycle',
      icon: TrendingUp,
      isCompleted: hasIncome,
      actionText: hasIncome ? 'Edit' : 'Set Income',
      onClick: onOpenIncomeEditor,
      accentColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/20 to-teal-500/10'
    },
    {
      id: 3,
      number: '3',
      title: 'Add Your Bills',
      desc: 'Log rent, utilities, cards, or loans',
      icon: CreditCard,
      isCompleted: hasBill,
      actionText: hasBill ? 'Add More' : 'Add Bill',
      onClick: onOpenAddBillModal,
      accentColor: 'text-purple-400',
      bgGlow: 'from-purple-500/20 to-pink-500/10'
    }
  ];

  const completedCount = steps.filter(s => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const allComplete = completedCount === steps.length;

  if (allComplete) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-4 sm:p-5 rounded-[2rem] bg-gradient-to-br from-[#0a1410] via-[#080d0b] to-black border border-emerald-500/30 shadow-2xl mb-6 overflow-hidden group"
    >
      {/* Subtle luxury ambient gold and emerald glow */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 via-emerald-500/20 to-teal-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md shrink-0">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-serif font-bold text-white tracking-tight flex items-center gap-2">
                Frictionless Onboarding Guide
              </h3>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border",
                allComplete 
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                  : "bg-amber-500/15 text-amber-300 border-amber-500/30"
              )}>
                {allComplete ? 'Ready For Launch • 100%' : `${completedCount} of 3 Complete • ${progressPercent}%`}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Follow these 3 core steps to prime your zero-liability cashflow cockpit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenFullGuideModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="Open Interactive Walkthrough Guide & Philosophy"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Guide</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors border border-white/10"
            title={isCollapsed ? "Expand Guide Steps" : "Collapse Guide Steps"}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden relative z-10">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 3 Step Action Cards */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-4 relative z-10 overflow-hidden"
          >
            {steps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.id}
                  className={cn(
                    "p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 relative group/step shadow-md",
                    step.isCompleted
                      ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50"
                      : "bg-black/50 border-white/10 hover:border-amber-500/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 border",
                        step.isCompleted
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                          : "bg-white/5 text-slate-300 border-white/10"
                      )}>
                        {step.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span>{step.number}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-white font-serif truncate">
                          {step.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono leading-tight mt-0.5 line-clamp-2">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className={cn(
                      "text-[9px] font-mono font-bold uppercase",
                      step.isCompleted ? "text-emerald-400" : "text-amber-400/90"
                    )}>
                      {step.isCompleted ? '✓ Completed' : '• Pending'}
                    </span>

                    <button
                      type="button"
                      onClick={step.onClick}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-95",
                        step.isCompleted
                          ? "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                          : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30"
                      )}
                    >
                      <span>{step.actionText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
