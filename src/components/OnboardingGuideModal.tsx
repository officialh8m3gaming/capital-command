import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  CheckCircle2, 
  X, 
  Landmark, 
  TrendingUp, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Lock, 
  Wifi, 
  WifiOff, 
  Zap, 
  Calendar, 
  DollarSign, 
  ChevronRight,
  Shield
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Bill, FinancialAccount } from '../types';

interface OnboardingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  bills: Bill[];
  financialAccounts: FinancialAccount[];
  monthlyIncome: string;
  onOpenBankModal: () => void;
  onOpenIncomeEditor: () => void;
  onOpenAddBillModal: () => void;
  onOpenPinModal: () => void;
  onOpenConnectionModeModal: () => void;
}

export const OnboardingGuideModal: React.FC<OnboardingGuideModalProps> = ({
  isOpen,
  onClose,
  bills,
  financialAccounts,
  monthlyIncome,
  onOpenBankModal,
  onOpenIncomeEditor,
  onOpenAddBillModal,
  onOpenPinModal,
  onOpenConnectionModeModal,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const hasBank = financialAccounts.length > 0;
  const hasIncome = (parseFloat(monthlyIncome) || 0) > 0;
  const hasBills = bills.length > 0;

  const guideSteps = [
    {
      id: 1,
      title: "1. Connect Bank or Liquid Cash",
      subtitle: "Establish your real-time starting liquidity",
      icon: Landmark,
      isCompleted: hasBank,
      summary: "Add your bank accounts and credit cards manually with official brand logos and visual helpers. Capital Command automatically calculates liquid cash vs credit limits.",
      points: [
        "100% Manual Entry: Add Chase, Bank of America, Wells Fargo, Citi, Capital One, or Credit Unions easily.",
        "Visual Brand Logos: Assign official bank and card logos as visual helpers to quickly identify accounts.",
        "Clearance Calculation: Real-time net liquidity and credit utilization tracking."
      ],
      actionLabel: hasBank ? "Manage Linked Accounts" : "Connect Bank or Card Now",
      onAction: () => {
        onClose();
        onOpenBankModal();
      }
    },
    {
      id: 2,
      title: "2. Set Monthly Income & Paydays",
      subtitle: "Calibrate periodic cashflow inflows",
      icon: TrendingUp,
      isCompleted: hasIncome,
      summary: "Input your monthly or bi-weekly take-home paycheck. The system calculates exact spendable clearance between paycycles.",
      points: [
        "Dual Cycle Support: Switch between Monthly and Bi-Weekly (26 paychecks/yr) models anytime.",
        "Automatic Clearance Math: Inflow minus upcoming unpaid obligations yields your true safe-to-spend clearance.",
        "Real-Time Adjustments: Edit income figures on the fly with instant balance recalculation."
      ],
      actionLabel: hasIncome ? "Adjust Income Settings" : "Set Your Income Now",
      onAction: () => {
        onClose();
        onOpenIncomeEditor();
      }
    },
    {
      id: 3,
      title: "3. Log Recurring Bills & Liabilities",
      subtitle: "Map out upcoming financial obligations",
      icon: CreditCard,
      isCompleted: hasBills,
      summary: "Add your rent, utilities, insurance, credit card payments, or loans. Set recurring frequencies (monthly, bi-weekly, weekly) for automatic scheduling.",
      points: [
        "12-Month Projected Calendar: Visual day-by-day liability mapping with automated total daily sums.",
        "1-Click Google Calendar Sync: Push bill due dates with custom reminders directly to your Google Calendar.",
        "Liability Clearance: Mark bills paid with a single tap to instantly update remaining period obligations."
      ],
      actionLabel: hasBills ? "Add Another Bill" : "Add Your First Bill",
      onAction: () => {
        onClose();
        onOpenAddBillModal();
      }
    },
    {
      id: 4,
      title: "4. Set App Preferences & Low Balance Alerts",
      subtitle: "Configure custom safety thresholds and notifications",
      icon: ShieldCheck,
      isCompleted: true,
      summary: "Tailor your Capital Command experience by setting low balance alert thresholds on any and all accounts or credit cards, with automatic push notifications to your calendar.",
      points: [
        "Per-Card Safety Floors: Set custom minimum balance alert thresholds on any account or credit card.",
        "Calendar Push Notifications: Automatically push low balance warnings and reminders directly to your Google Calendar.",
        "Executive Settings: Fine-tune currency, inflow calculation math, and security parameters."
      ],
      actionLabel: "Manage Account Alerts",
      onAction: () => {
        onClose();
        onOpenBankModal();
      }
    },
    {
      id: 5,
      title: "5. Air-Gapped Privacy & Security PIN",
      subtitle: "Lock down your vault with hardware-grade privacy",
      icon: Shield,
      isCompleted: true,
      summary: "Capital Command supports 100% Offline Mode (air-gapped local storage) and 4-Digit Pro Vault Security PIN locking.",
      points: [
        "Offline Mode: Switch between Online (Cloud Vault) and Offline (Local Device Only) anytime in the top header.",
        "Pro Vault PIN: Set a 4-digit PIN with auto-lock timer to protect ledger privacy on shared devices.",
        "Beta Testing Suite: Export offline ZIP backups or install as a standalone PWA desktop app."
      ],
      actionLabel: "Configure Security PIN",
      onAction: () => {
        onClose();
        onOpenPinModal();
      }
    }
  ];

  const currentStepData = guideSteps.find(s => s.id === activeStep) || guideSteps[0];
  const StepIcon = currentStepData.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[90]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-xl"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-2xl bg-gradient-to-br from-[#0c1611] via-[#090f0c] to-black border border-emerald-500/40 rounded-[2.5rem] p-6 sm:p-8 z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 w-96 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 font-mono text-[10px] font-bold uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5" />
              <span>Capital Command Quick Start Guide</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              Frictionless Onboarding Walkthrough
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Step-by-step master guide to setting up your personal financial command center.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shrink-0 border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Tabs Bar */}
        <div className="grid grid-cols-5 gap-2 py-4 shrink-0 relative z-10">
          {guideSteps.map((step) => {
            const Icon = step.icon;
            const isSelected = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  "p-2.5 rounded-2xl border transition-all flex flex-col items-center text-center gap-1.5",
                  isSelected
                    ? "bg-gradient-to-b from-emerald-500/25 to-teal-500/10 border-emerald-500/60 shadow-md ring-1 ring-emerald-400/30"
                    : "bg-black/40 border-white/10 hover:border-white/20 text-slate-400 hover:text-white"
                )}
              >
                <div className="flex items-center gap-1">
                  <Icon className={cn("w-3.5 h-3.5", isSelected ? "text-emerald-400" : "text-slate-400")} />
                  {step.isCompleted && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-mono font-bold uppercase tracking-tight truncate w-full",
                  isSelected ? "text-white" : "text-slate-400"
                )}>
                  Step {step.id}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step Content Card */}
        <div className="space-y-4 overflow-y-auto custom-scrollbar pr-1 grow py-2 relative z-10">
          <div className="p-5 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-4 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md shrink-0">
                <StepIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                  {currentStepData.title}
                </h4>
                <p className="text-xs font-mono text-emerald-400">
                  {currentStepData.subtitle}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              {currentStepData.summary}
            </p>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 block">
                Key Operations & Insights:
              </span>
              <ul className="space-y-2">
                {currentStepData.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs font-mono text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10 shrink-0 relative z-10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={activeStep === 1}
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none border border-white/10 transition-all font-mono text-xs"
              title="Previous Step"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              disabled={activeStep === 4}
              onClick={() => setActiveStep(prev => Math.min(4, prev + 1))}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none border border-white/10 transition-all font-mono text-xs"
              title="Next Step"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-xs font-mono font-bold uppercase transition-all"
            >
              Dismiss
            </button>

            <button
              type="button"
              onClick={currentStepData.onAction}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 active:scale-95"
            >
              <span>{currentStepData.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
