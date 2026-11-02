import React, { useState, useMemo } from 'react';
import { Calculator, Percent, ShieldCheck, ArrowRight, DollarSign, Calendar, Lock, Power, Eye } from 'lucide-react';

interface TaxLiabilityReserveProps {
  paychecks?: any[];
  totalMonthlyIncome: number;
  onToggleHide?: () => void;
}

export const TaxLiabilityReserve: React.FC<TaxLiabilityReserveProps> = ({
  totalMonthlyIncome,
  onToggleHide
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [taxRate, setTaxRate] = useState<number>(25);
  const [autoHold, setAutoHold] = useState<boolean>(false);
  const [grossContractorRevenue, setGrossContractorRevenue] = useState<number>(0);

  // Quarterly targets calculation
  const effectiveRevenue = isEnabled ? grossContractorRevenue : 0;

  const quarterlyTarget = useMemo(() => {
    if (!isEnabled || effectiveRevenue <= 0) return 0;
    const annualGross = effectiveRevenue * 12;
    const annualTax = annualGross * (taxRate / 100);
    return annualTax / 4;
  }, [isEnabled, effectiveRevenue, taxRate]);

  const totalMonthlyTaxReserve = useMemo(() => {
    if (!isEnabled || effectiveRevenue <= 0) return 0;
    return effectiveRevenue * (taxRate / 100);
  }, [isEnabled, effectiveRevenue, taxRate]);

  // Quarterly Due Dates for current year
  const currentYear = new Date().getFullYear();
  const quarterlySchedule = [
    { q: 'Q1 Tax Payment', due: `Apr 15, ${currentYear}`, target: quarterlyTarget, paidProgress: isEnabled && effectiveRevenue > 0 ? 0 : 0 },
    { q: 'Q2 Tax Payment', due: `Jun 16, ${currentYear}`, target: quarterlyTarget, paidProgress: isEnabled && effectiveRevenue > 0 ? 0 : 0 },
    { q: 'Q3 Tax Payment', due: `Sep 15, ${currentYear}`, target: quarterlyTarget, paidProgress: isEnabled && effectiveRevenue > 0 ? 0 : 0 },
    { q: 'Q4 Tax Payment', due: `Jan 15, ${currentYear + 1}`, target: quarterlyTarget, paidProgress: isEnabled && effectiveRevenue > 0 ? 0 : 0 }
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-950/50 via-[#0a0f0d]/70 to-black/80 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Calculator className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Tax Reserve & Savings Calculator
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-white/10'
              }`}>
                {isEnabled ? 'Active ($' + totalMonthlyTaxReserve.toFixed(0) + '/mo)' : 'Optional ($0 Hold)'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Optional 1099 contractor withholding calculator with automatic reserve holds & quarterly IRS milestones.
            </p>
          </div>
        </div>

        {/* Enable / Disable Option Toggle & Hide Control */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 bg-black/60 p-2 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center gap-2 px-2">
              <Power className={`w-3.5 h-3.5 ${isEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="text-[10px] font-mono font-bold uppercase text-slate-300">
                {isEnabled ? 'Tax Reserve Enabled' : 'Enable Tax Calculator'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !isEnabled;
                setIsEnabled(next);
                if (next && grossContractorRevenue === 0 && totalMonthlyIncome > 0) {
                  setGrossContractorRevenue(totalMonthlyIncome);
                }
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isEnabled ? 'bg-brand-emerald' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {onToggleHide && (
            <button
              type="button"
              onClick={onToggleHide}
              className="px-3 py-2 bg-black/60 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-slate-400 hover:text-amber-300 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Hide Tax Reserve Module"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Hide</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Controls (Visible or Enabled) */}
      {isEnabled ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 border border-emerald-500/20 backdrop-blur-md rounded-2xl p-5">
            {/* Gross Revenue Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                  Monthly 1099 Gross Revenue
                </label>
                {totalMonthlyIncome > 0 && grossContractorRevenue !== totalMonthlyIncome && (
                  <button
                    type="button"
                    onClick={() => setGrossContractorRevenue(totalMonthlyIncome)}
                    className="text-[10px] font-mono text-teal-400 hover:text-teal-300 underline"
                  >
                    Match Income (${totalMonthlyIncome.toLocaleString()})
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">$</span>
                <input
                  type="number"
                  value={grossContractorRevenue === 0 ? '' : grossContractorRevenue}
                  onChange={(e) => setGrossContractorRevenue(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full bg-black/80 border border-teal-500/30 focus:border-teal-400 rounded-xl pl-8 pr-4 py-2.5 text-lg font-mono font-bold text-white focus:outline-none transition-colors"
                  placeholder="0.00"
                />
              </div>
              <span className="text-[10px] text-slate-500 block">
                Annualized 1099 Gross Income: ${(grossContractorRevenue * 12).toLocaleString()}
              </span>
            </div>

            {/* Tax Rate Percentage Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                  Estimated Tax Rate Percentage
                </label>
                <span className="text-lg font-mono font-extrabold text-teal-400">
                  {taxRate}%
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={45}
                step={1}
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>5% Min</span>
                <span>25% Standard</span>
                <span>45% Max</span>
              </div>
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 border border-emerald-500/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Monthly Tax Hold Requirement
                </span>
                <div className="text-2xl font-mono font-extrabold text-emerald-400">
                  ${totalMonthlyTaxReserve.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                ACTIVE HOLD
              </span>
            </div>

            <div className="bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 border border-emerald-500/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Estimated Quarterly Payment Target
                </span>
                <div className="text-2xl font-mono font-extrabold text-white">
                  ${quarterlyTarget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/5 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                IRS EST. Q1-Q4
              </span>
            </div>
          </div>

          {/* Quarterly Tax Payment Schedule */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
              <span>IRS Quarterly Estimated Tax Due Dates</span>
              <span>Target Amount</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quarterlySchedule.map((qItem) => (
                <div key={qItem.q} className="bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 border border-emerald-500/20 backdrop-blur-md rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-white">
                    <span>{qItem.q}</span>
                    <span className="text-emerald-400 font-mono">${qItem.target.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Due Date: <strong className="text-amber-300">{qItem.due}</strong></span>
                    <span>Quarterly Target</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Standby / Zero State for Optional Calculator */
        <div className="p-6 bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 border border-emerald-500/20 backdrop-blur-md rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Tax Withholding Option: Inactive ($0.00 Reserve)
            </div>
            <p className="text-xs text-slate-400">
              Tax reserve calculation is turned off and set to $0 by default. Turn it on anytime if you need to calculate 1099 contractor withholdings or quarterly IRS estimates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsEnabled(true);
              if (grossContractorRevenue === 0 && totalMonthlyIncome > 0) {
                setGrossContractorRevenue(totalMonthlyIncome);
              }
            }}
            className="px-5 py-2.5 bg-brand-emerald hover:bg-emerald-600 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 active:scale-95 shadow-lg"
          >
            + Activate Tax Calculator
          </button>
        </div>
      )}
    </div>
  );
};

export default TaxLiabilityReserve;
