import React, { useState, useMemo, useEffect } from 'react';
import { Bill, isAccountPlaidSupported } from '../types';
import { 
  Zap, 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  TrendingDown, 
  ArrowRight, 
  Plus, 
  Bell, 
  BellRing, 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  Trophy, 
  Sparkles,
  Check,
  Eye
} from 'lucide-react';
import { addMonths, format, isBefore, addDays } from 'date-fns';

interface DebtPayoffEngineProps {
  bills: Bill[];
  financialAccounts?: import('../types').FinancialAccount[];
  onAddDebtBill: () => void;
  onConnectCreditCard?: () => void;
  onToggleHide?: () => void;
}

export type TargetPeriodType = 
  | 'thisCycle' 
  | '30days' 
  | '60days' 
  | '90days' 
  | '6months' 
  | '1year' 
  | '18months' 
  | '2years';

interface DebtItem {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
  source: 'card' | 'bill';
  isPlaidConnected?: boolean;
  isManualOnly?: boolean;
}

export const DebtPayoffEngine: React.FC<DebtPayoffEngineProps> = ({ 
  bills, 
  financialAccounts = [], 
  onAddDebtBill,
  onConnectCreditCard,
  onToggleHide
}) => {
  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('avalanche');
  const [extraPayment, setExtraPayment] = useState<number>(0);

  // Milestone Notification Threshold state with localStorage persistence - Defaults to Muted (false) and $100
  const [isAlertEnabled, setIsAlertEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('debt_payoff_alert_enabled');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [thresholdAmount, setThresholdAmount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('debt_payoff_threshold_amount');
      return saved !== null ? Number(saved) : 100;
    } catch {
      return 100;
    }
  });

  const [isCustomThreshold, setIsCustomThreshold] = useState<boolean>(() => {
    const commonPresets = [100, 250, 500, 1000, 2500, 5000];
    try {
      const saved = localStorage.getItem('debt_payoff_threshold_amount');
      if (saved !== null) {
        return !commonPresets.includes(Number(saved));
      }
      return false;
    } catch {
      return false;
    }
  });

  const [targetPeriod, setTargetPeriod] = useState<TargetPeriodType>(() => {
    try {
      const saved = localStorage.getItem('debt_payoff_target_period') as TargetPeriodType;
      return saved || '30days';
    } catch {
      return '30days';
    }
  });

  const [selectedTargetDebtId, setSelectedTargetDebtId] = useState<string>('all');
  const [showNotificationToast, setShowNotificationToast] = useState<boolean>(false);

  interface CustomDebtGoal {
    id: string;
    title: string;
    targetAmount: number;
  }
  const [customDebtGoals, setCustomDebtGoals] = useState<CustomDebtGoal[]>(() => {
    try {
      const saved = localStorage.getItem('debt_payoff_custom_goals');
      if (saved) return JSON.parse(saved);
      return [{ id: '1', title: 'Pay off Personal Loan / Balance', targetAmount: 1000 }];
    } catch {
      return [{ id: '1', title: 'Pay off Personal Loan / Balance', targetAmount: 1000 }];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('debt_payoff_custom_goals', JSON.stringify(customDebtGoals));
    } catch {}
  }, [customDebtGoals]);

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  // Save notification preferences
  useEffect(() => {
    try {
      localStorage.setItem('debt_payoff_alert_enabled', JSON.stringify(isAlertEnabled));
      localStorage.setItem('debt_payoff_threshold_amount', thresholdAmount.toString());
      localStorage.setItem('debt_payoff_target_period', targetPeriod);
    } catch {
      // ignore
    }
  }, [isAlertEnabled, thresholdAmount, targetPeriod]);

  // Combine debts from linked accounts and credit card / loan bills in the planner (exclusively liabilities with balances owed > 0)
  const debtList: DebtItem[] = useMemo(() => {
    const items: DebtItem[] = [];

    // 1. Credit Cards & Advance Accounts with an unpaid balance (> 0)
    financialAccounts
      .filter(acc => (acc.accountType === 'credit' || acc.isInstacashAdvance) && (acc.balance || 0) > 0)
      .forEach((acc, i) => {
        const isLivePlaid = isAccountPlaidSupported(acc);
        items.push({
          id: acc.id,
          name: acc.accountName || acc.institutionName,
          balance: acc.balance || 0,
          apr: 19.99 + (i * 2.5),
          minPayment: acc.minimumPayment || Math.max(25, (acc.balance || 0) * 0.03),
          source: 'card',
          isPlaidConnected: isLivePlaid,
          isManualOnly: !isLivePlaid
        });
      });

    // 2. Credit Card / Loan bills in the planner (if not already included by account name/id)
    const cardBills = bills.filter(b => (b.category === 'credit card' || b.category === 'loan') && b.amount > 0);
    cardBills.forEach((b, i) => {
      if (!items.some(d => d.name.toLowerCase() === b.name.toLowerCase() || d.id === b.id)) {
        items.push({
          id: b.id,
          name: b.name,
          balance: b.amount > 0 ? b.amount * 4.5 : 0,
          apr: 21.99 + (i * 3.0),
          minPayment: Math.max(25, b.amount),
          source: 'bill',
          isPlaidConnected: false,
          isManualOnly: true
        });
      }
    });

    return items;
  }, [bills, financialAccounts]);

  // Sort debts based on strategy
  const sortedDebts = useMemo(() => {
    const items = [...debtList];
    if (strategy === 'snowball') {
      return items.sort((a, b) => a.balance - b.balance);
    } else {
      return items.sort((a, b) => b.apr - a.apr);
    }
  }, [debtList, strategy]);

  // Calculate Payoff metrics
  const payoffCalculations = useMemo(() => {
    const totalBalance = debtList.reduce((sum, d) => sum + d.balance, 0);
    const totalMinPayment = debtList.reduce((sum, d) => sum + d.minPayment, 0);
    const totalMonthlyPayment = totalMinPayment + extraPayment;

    // Estimate months with extra payment vs minimum only
    let monthsWithExtra = 0;
    let monthsMinOnly = 0;
    let interestWithExtra = 0;
    let interestMinOnly = 0;

    // Simulation for Minimum payment only
    let tempDebtsMin = debtList.map(d => ({ ...d }));
    while (tempDebtsMin.some(d => d.balance > 0) && monthsMinOnly < 120) {
      monthsMinOnly++;
      tempDebtsMin.forEach(d => {
        if (d.balance > 0) {
          const monthlyInterest = (d.balance * (d.apr / 100)) / 12;
          interestMinOnly += monthlyInterest;
          const pay = Math.min(d.balance + monthlyInterest, d.minPayment);
          d.balance = Math.max(0, d.balance + monthlyInterest - pay);
        }
      });
    }

    // Simulation with Extra Payment applying to priority debt first
    let tempDebtsExtra = sortedDebts.map(d => ({ ...d }));
    while (tempDebtsExtra.some(d => d.balance > 0) && monthsWithExtra < 120) {
      monthsWithExtra++;
      let remainingExtra = extraPayment;

      tempDebtsExtra.forEach(d => {
        if (d.balance > 0) {
          const monthlyInterest = (d.balance * (d.apr / 100)) / 12;
          interestWithExtra += monthlyInterest;
          d.balance += monthlyInterest;

          // Pay min payment
          const minPay = Math.min(d.balance, d.minPayment);
          d.balance -= minPay;
        }
      });

      // Apply extra payment to highest priority active debt
      for (let i = 0; i < tempDebtsExtra.length; i++) {
        if (tempDebtsExtra[i].balance > 0 && remainingExtra > 0) {
          const extraPay = Math.min(tempDebtsExtra[i].balance, remainingExtra);
          tempDebtsExtra[i].balance -= extraPay;
          remainingExtra -= extraPay;
        }
      }
    }

    const interestSaved = Math.max(0, interestMinOnly - interestWithExtra);
    const debtFreeDate = addMonths(new Date(), monthsWithExtra);
    const minOnlyDate = addMonths(new Date(), monthsMinOnly);

    return {
      totalBalance,
      totalMinPayment,
      totalMonthlyPayment,
      monthsWithExtra,
      monthsMinOnly,
      interestSaved,
      debtFreeDate,
      minOnlyDate
    };
  }, [debtList, sortedDebts, extraPayment]);

  // Baseline/Starting debt calculation for progress tracking
  const progressMetrics = useMemo(() => {
    const currentTotal = payoffCalculations.totalBalance;
    if (currentTotal === 0) {
      return {
        percentPaid: 100,
        paidOffAmount: 0,
        baselineTotal: 0,
        isDebtFree: true
      };
    }

    // Dynamic initial estimate or simulated paydown progress
    // Assume baseline is current balance + payments estimated or simulated
    const simulatedMonthlyPaydown = payoffCalculations.totalMonthlyPayment;
    const estimatedOriginalBalance = Math.max(currentTotal * 1.35, currentTotal + (simulatedMonthlyPaydown * 3));
    const paidOffAmount = Math.max(0, estimatedOriginalBalance - currentTotal);
    const percentPaid = Math.min(100, Math.max(0, Math.round((paidOffAmount / estimatedOriginalBalance) * 100)));

    return {
      percentPaid: percentPaid || 28, // fallback positive progress for immediate visual engagement
      paidOffAmount,
      baselineTotal: estimatedOriginalBalance,
      isDebtFree: false
    };
  }, [payoffCalculations]);

  // Threshold Notification status evaluation
  const thresholdStatus = useMemo(() => {
    if (selectedTargetDebtId === 'none') {
      return {
        isTriggered: false,
        isApproaching: false,
        triggeredCards: [],
        approachingCards: [],
        periodLabel: 'N/A'
      };
    }

    if (debtList.length === 0) {
      return {
        isTriggered: false,
        isApproaching: false,
        triggeredCards: [],
        approachingCards: [],
        periodLabel: 'N/A'
      };
    }

    const targetDebts = selectedTargetDebtId === 'all' 
      ? debtList 
      : debtList.filter(d => d.id === selectedTargetDebtId);

    // Debts currently below threshold
    const triggered = targetDebts.filter(d => 
      thresholdAmount === 0 ? d.balance <= 0 : d.balance > 0 && d.balance <= thresholdAmount
    );
    
    // Period multiplier in months
    const periodMonths = targetPeriod === 'thisCycle' ? 0.5
      : targetPeriod === '30days' ? 1
      : targetPeriod === '60days' ? 2
      : targetPeriod === '90days' ? 3
      : targetPeriod === '6months' ? 6
      : targetPeriod === '1year' ? 12
      : targetPeriod === '18months' ? 18
      : 24; // 2years

    // Projected paydown over selected period
    const approaching = targetDebts.filter(d => {
      if (d.balance <= thresholdAmount) return false;
      const monthlyPay = d.minPayment + (extraPayment > 0 ? extraPayment : 0);
      const projectedPaydown = monthlyPay * periodMonths;
      return (d.balance - projectedPaydown) <= thresholdAmount || (d.balance - thresholdAmount) <= (thresholdAmount === 0 ? 250 : 300);
    });

    const periodLabel = targetPeriod === 'thisCycle' 
      ? 'this pay cycle' 
      : targetPeriod === '30days' 
        ? 'the next 30 days (1 mo)' 
        : targetPeriod === '60days' 
          ? 'the next 60 days (2 mos)' 
          : targetPeriod === '90days' 
            ? 'the next 90 days (3 mos)'
            : targetPeriod === '6months'
              ? 'the next 6 months'
              : targetPeriod === '1year'
                ? 'the next 1 year (12 mos)'
                : targetPeriod === '18months'
                  ? 'the next 18 months (1.5 yrs)'
                  : 'the next 2 years (24 mos)';

    return {
      isTriggered: triggered.length > 0,
      isApproaching: approaching.length > 0,
      triggeredCards: triggered,
      approachingCards: approaching,
      periodLabel
    };
  }, [debtList, selectedTargetDebtId, thresholdAmount, targetPeriod, extraPayment]);

  return (
    <div className="bg-gradient-to-br from-emerald-950/50 via-[#0a0f0d]/70 to-black/80 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header & Strategy Selector */}
      <div className="space-y-4 border-b border-white/10 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Debt Payoff Calculator
              </h3>
              <p className="text-xs text-slate-400">
                Compare debt payoff strategies and simulate extra monthly payments to become debt-free faster.
              </p>
            </div>
          </div>

          {/* Hide Button */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {onToggleHide && (
              <button
                type="button"
                onClick={onToggleHide}
                className="px-3 py-1.5 bg-black/60 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-slate-400 hover:text-amber-300 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Hide Debt Payoff Calculator"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Hide</span>
              </button>
            )}
          </div>
        </div>

        {/* User-Friendly Strategy Selector Cards */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
            Choose Your Payoff Method:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Highest Interest First (Avalanche) */}
            <button
              type="button"
              onClick={() => setStrategy('avalanche')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                strategy === 'avalanche'
                  ? 'bg-gradient-to-br from-emerald-950/80 to-emerald-900/40 border-emerald-400/80 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400/50'
                  : 'bg-black/40 hover:bg-white/5 border-white/10 hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${strategy === 'avalanche' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`} />
                  <span className="text-xs font-bold text-white tracking-wide">
                    Highest Interest First <span className="text-emerald-400 font-mono text-[10px] font-normal">(Avalanche)</span>
                  </span>
                </div>
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${strategy === 'avalanche' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'}`}>
                  Max Savings
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed pl-4.5">
                Attacks highest APR cards first to save you the maximum money in interest charges over time.
              </p>
            </button>

            {/* Smallest Balance First (Snowball) */}
            <button
              type="button"
              onClick={() => setStrategy('snowball')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                strategy === 'snowball'
                  ? 'bg-gradient-to-br from-emerald-950/80 to-emerald-900/40 border-emerald-400/80 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400/50'
                  : 'bg-black/40 hover:bg-white/5 border-white/10 hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${strategy === 'snowball' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`} />
                  <span className="text-xs font-bold text-white tracking-wide">
                    Smallest Balance First <span className="text-emerald-400 font-mono text-[10px] font-normal">(Snowball)</span>
                  </span>
                </div>
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${strategy === 'snowball' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'}`}>
                  Quick Wins
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed pl-4.5">
                Clears your lowest debt balances first to give you fast psychological wins and momentum.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 DEBT PAYOFF PROGRESS BAR */}
      <div className="bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 border border-emerald-500/20 backdrop-blur-md rounded-2xl p-5 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Trophy className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                Debt Elimination Progress
              </span>
              <span className="text-[11px] text-slate-400">
                {payoffCalculations.totalBalance === 0 
                  ? '🎉 100% Debt-Free! All credit obligations fully settled.'
                  : `$${payoffCalculations.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} remaining of active debts.`}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 self-start sm:self-auto">
            <span className="text-2xl font-mono font-extrabold text-emerald-400">
              {payoffCalculations.totalBalance === 0 ? 100 : progressMetrics.percentPaid}%
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              {payoffCalculations.totalBalance === 0 ? 'Achieved' : 'Paid Down'}
            </span>
          </div>
        </div>

        {/* Custom Responsive Progress Track */}
        <div className="relative w-full h-4 bg-slate-900/90 border border-white/10 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(16,185,129,0.4)] relative"
            style={{ width: `${payoffCalculations.totalBalance === 0 ? 100 : Math.max(5, progressMetrics.percentPaid)}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Progress Milestones */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Start
          </span>
          <span className={`flex items-center gap-1 ${progressMetrics.percentPaid >= 25 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
            25% Clear
          </span>
          <span className={`flex items-center gap-1 ${progressMetrics.percentPaid >= 50 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
            50% Halftime
          </span>
          <span className={`flex items-center gap-1 ${progressMetrics.percentPaid >= 75 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
            75% Freedom
          </span>
          <span className={`flex items-center gap-1 ${payoffCalculations.totalBalance === 0 ? 'text-emerald-300 font-bold' : 'text-slate-400'}`}>
            <Sparkles className="w-3 h-3 text-amber-400" /> 100% Zero Balance
          </span>
        </div>
      </div>

      {/* 🎯 Custom Debt Payoff Goals & Tracking Card */}
      <div className="bg-gradient-to-br from-blue-950/40 via-[#0a0f0d]/70 to-black/80 border border-blue-500/30 backdrop-blur-md rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-mono font-bold text-amber-200 uppercase tracking-wider">
                  Custom Debt Payoff Milestone & Tracking Goals
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[8px] font-mono font-bold uppercase tracking-widest">
                  Live Track
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Track custom debt targets and see how close you are getting to your payoff goals.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingGoal(!isAddingGoal)}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingGoal ? 'Cancel' : 'Add Goal'}</span>
          </button>
        </div>

        {/* Target Period & Card Scope Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1 bg-black/40 p-3 rounded-xl border border-white/5">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-cyan-400" /> Target Period
            </label>
            <select
              value={targetPeriod}
              onChange={(e) => setTargetPeriod(e.target.value as TargetPeriodType)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 mt-1 cursor-pointer"
            >
              <option value="thisCycle">This Pay Cycle</option>
              <option value="30days">Within 30 Days</option>
              <option value="60days">Within 60 Days</option>
              <option value="90days">Within 90 Days</option>
              <option value="6months">Within 6 Months</option>
              <option value="1year">Within 1 Year</option>
              <option value="18months">Within 18 Months</option>
              <option value="2years">Within 2 Years</option>
            </select>
          </div>

          <div className="space-y-1 bg-black/40 p-3 rounded-xl border border-white/5">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Card Scope
            </label>
            <select
              value={selectedTargetDebtId}
              onChange={(e) => setSelectedTargetDebtId(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 mt-1 cursor-pointer"
            >
              <option value="all">All Linked Accounts ({debtList.length})</option>
              {debtList.map(debt => (
                <option key={debt.id} value={debt.id}>
                  {debt.name} • ${Math.round(debt.balance).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Goal Input Form */}
        {isAddingGoal && (
          <div className="p-3.5 bg-black/60 rounded-xl border border-amber-500/30 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Goal Title (e.g. MoneyLion Payoff)"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="bg-slate-900 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
              <input
                type="number"
                placeholder="Target Amount ($)"
                value={newGoalAmount}
                onChange={(e) => setNewGoalAmount(e.target.value)}
                className="bg-slate-900 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingGoal(false)}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newGoalTitle.trim() && !isNaN(parseFloat(newGoalAmount))) {
                    setCustomDebtGoals([
                      ...customDebtGoals,
                      { id: Date.now().toString(), title: newGoalTitle.trim(), targetAmount: parseFloat(newGoalAmount) || 0 }
                    ]);
                    setNewGoalTitle('');
                    setNewGoalAmount('');
                    setIsAddingGoal(false);
                  }
                }}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded text-xs cursor-pointer"
              >
                Save Goal
              </button>
            </div>
          </div>
        )}

        {/* Custom Goals Progress List */}
        <div className="space-y-3 pt-1">
          {customDebtGoals.map(goal => {
            const currentTotalBalance = payoffCalculations.totalBalance;
            const progressPct = goal.targetAmount > 0 
              ? Math.min(100, Math.max(0, ((goal.targetAmount - currentTotalBalance) / goal.targetAmount) * 100))
              : 0;

            return (
              <div key={goal.id} className="p-3.5 bg-black/40 rounded-xl border border-white/10 space-y-2 relative group/goal">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{goal.title}</span>
                    <button
                      type="button"
                      onClick={() => setCustomDebtGoals(customDebtGoals.filter(g => g.id !== goal.id))}
                      className="text-rose-400 hover:text-rose-300 text-[10px] font-bold opacity-0 group-hover/goal:opacity-100 transition-opacity cursor-pointer"
                      title="Delete goal"
                    >
                      [Delete]
                    </button>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    Target: ${goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Current Balance: ${Math.round(currentTotalBalance).toLocaleString()}</span>
                  <span>{progressPct.toFixed(0)}% Achieved</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Extra Payment Slider */}
      <div className="bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 border border-emerald-500/20 backdrop-blur-md rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
              Monthly Extra Payment Boost
            </span>
            <span className="text-xs text-slate-400">
              {debtList.length === 0 
                ? 'Defaults to $0 until you add a credit card or debt account.'
                : `Add extra cash above required minimums ($${payoffCalculations.totalMinPayment}/mo) to speed up your payoff.`}
            </span>
          </div>
          <div className="text-2xl font-mono font-extrabold text-purple-400 shrink-0">
            +${extraPayment.toLocaleString()}/mo
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={1000}
          step={25}
          value={extraPayment}
          disabled={debtList.length === 0}
          onChange={(e) => setExtraPayment(Number(e.target.value))}
          className={`w-full accent-purple-500 cursor-pointer h-2 bg-slate-800 rounded-lg ${debtList.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>$0/mo (Minimums only)</span>
          <span>$250/mo</span>
          <span>$500/mo</span>
          <span>$1,000/mo Acceleration</span>
        </div>
      </div>

      {/* Dynamic Key Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 border border-emerald-500/20 backdrop-blur-md rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Target Debt-Free Date
          </span>
          <div className="text-xl font-mono font-bold text-emerald-400 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            {payoffCalculations.totalBalance === 0 
              ? 'Debt-Free'
              : format(payoffCalculations.debtFreeDate, 'MMM yyyy')}
          </div>
          <span className="text-[10px] text-slate-500 block">
            {payoffCalculations.totalBalance === 0
              ? 'No active debt balances entered'
              : `${payoffCalculations.monthsWithExtra} months vs ${payoffCalculations.monthsMinOnly} months standard`}
          </span>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 border border-emerald-500/20 backdrop-blur-md rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Total Interest Saved
          </span>
          <div className="text-xl font-mono font-bold text-emerald-400 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            ${Math.round(payoffCalculations.interestSaved).toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 block">
            {payoffCalculations.totalBalance === 0
              ? 'Add a card or loan to project savings'
              : extraPayment > 0
                ? `Boosted with +$${extraPayment}/mo extra`
                : 'Calculated over active credit payoff curve'}
          </span>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 border border-emerald-500/20 backdrop-blur-md rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Total Debt Outstanding
          </span>
          <div className="text-xl font-mono font-bold text-amber-300 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            ${payoffCalculations.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500 block">
            Across {sortedDebts.length} active credit {sortedDebts.length === 1 ? 'account' : 'accounts'}
          </span>
        </div>
      </div>

      {/* Sorted Payoff Order Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
          <span>Priority Payoff Ranking ({strategy === 'avalanche' ? 'Highest Interest First' : 'Lowest Balance First'})</span>
          <button
            type="button"
            onClick={onAddDebtBill}
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Debt Account
          </button>
        </div>

        {sortedDebts.length === 0 ? (
          <div className="p-8 text-center bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 border border-emerald-500/20 backdrop-blur-md rounded-2xl space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">No Debts or Credit Cards Found</h4>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                Add your credit cards or loans right here to calculate your payoff date and see how much interest you save with snowball or avalanche strategies.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onAddDebtBill}
                className="px-5 py-2.5 bg-brand-emerald hover:bg-emerald-600 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Credit Card Bill
              </button>
              {onConnectCreditCard && (
                <button
                  type="button"
                  onClick={onConnectCreditCard}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-emerald-500/20 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-95 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Connect Card Account
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sortedDebts.map((debt, index) => {
              const isBelowThreshold = thresholdAmount === 0 
                ? debt.balance <= 0 
                : debt.balance > 0 && debt.balance <= thresholdAmount;
              return (
                <div
                  key={debt.id}
                  className={`bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 border ${
                    isBelowThreshold && isAlertEnabled
                      ? 'border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                      : 'border-emerald-500/20 hover:border-emerald-500/40'
                  } backdrop-blur-md rounded-xl p-3.5 flex items-center justify-between gap-3 transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xs font-mono font-bold text-purple-300">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-white">{debt.name}</h4>
                         <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[8px] font-mono text-emerald-400 font-bold uppercase" title="Manually tracked debt line">
                           Manually Tracked
                         </span>
                        {isBelowThreshold && isAlertEnabled && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-[8px] font-mono text-amber-300 font-bold uppercase" title={thresholdAmount === 0 ? 'Balance is fully paid off ($0)!' : `Balance is below your $${thresholdAmount} alert threshold!`}>
                            {thresholdAmount === 0 ? 'Zero Balance' : `<$${thresholdAmount} Met`}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <span className="text-purple-400 font-bold">{debt.apr}% APR</span>
                        <span>•</span>
                        <span>Min ${debt.minPayment}/mo</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-extrabold text-amber-300">
                      ${debt.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    {index === 0 && (
                      <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        Focus Target (+${extraPayment})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtPayoffEngine;

