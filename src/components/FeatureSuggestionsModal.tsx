import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  PiggyBank, 
  Wallet, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Bell, 
  BookOpen, 
  Smartphone, 
  Wifi, 
  Calculator, 
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Layers
} from 'lucide-react';

interface FeatureSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnableFeature: (featureId: string) => void;
  activeFeatures: Record<string, boolean>;
}

export const FeatureSuggestionsModal: React.FC<FeatureSuggestionsModalProps> = ({
  isOpen,
  onClose,
  onEnableFeature,
  activeFeatures
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'savings' | 'tracking' | 'sync' | 'productivity'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const suggestions = [
    {
      id: 'savings_vault',
      title: 'Personal Savings Vault',
      category: 'savings',
      icon: PiggyBank,
      color: 'from-emerald-500/20 to-teal-500/30 border-emerald-500/40 text-emerald-400',
      description: 'Add money from your paycheck and credit cards into a dedicated savings vault to build emergency funds and separate liquid reserves.',
      benefit: 'Helps protect your savings from accidental spending.'
    },
    {
      id: 'borrowed_money',
      title: 'Borrowed Money Tracker',
      category: 'tracking',
      icon: Wallet,
      color: 'from-amber-500/20 to-yellow-500/30 border-amber-500/40 text-amber-400',
      description: 'Keep a clean personal reminder of money you have borrowed from friends or family, without tying it into your bank ledger calculations.',
      benefit: 'Stress-free personal debt tracking at a glance.'
    },
    {
      id: 'tax_reserve',
      title: 'Tax Liability Reserve',
      category: 'savings',
      icon: TrendingUp,
      color: 'from-blue-500/20 to-indigo-500/30 border-blue-500/40 text-blue-400',
      description: 'Automatically set aside tax percentages from your biweekly paychecks so tax season never catches you by surprise.',
      benefit: 'Accurate tax withholding and estimation.'
    },
    {
      id: 'debt_payoff',
      title: 'Debt Payoff Engine',
      category: 'tracking',
      icon: Layers,
      color: 'from-purple-500/20 to-pink-500/30 border-purple-500/40 text-purple-400',
      description: 'Simulate Debt Snowball and Debt Avalanche strategies to pay off credit cards faster and save thousands in interest.',
      benefit: 'Accelerates financial freedom and debt elimination.'
    },
    {
      id: 'google_calendar',
      title: 'Google Calendar Sync',
      category: 'sync',
      icon: CalendarIcon,
      color: 'from-red-500/20 to-orange-500/30 border-red-500/40 text-red-400',
      description: 'Sync your bill due dates and paycheck schedules directly to your Google Calendar with 1-click authentication.',
      benefit: 'Never miss a due date with native calendar reminders.'
    },
    {
      id: 'web_notifications',
      title: 'Bill Reminders & Push Alerts',
      category: 'productivity',
      icon: Bell,
      color: 'from-teal-500/20 to-cyan-500/30 border-teal-500/40 text-teal-400',
      description: 'Enable browser notifications for upcoming 7-day bills so you get alerted before payments are due.',
      benefit: 'Proactive alerts prevent late fees and overdrafts.'
    },
    {
      id: 'phone_book',
      title: 'Payee Phone Book & Contacts',
      category: 'productivity',
      icon: BookOpen,
      color: 'from-violet-500/20 to-purple-500/30 border-violet-500/40 text-violet-400',
      description: 'Save customer service numbers, account numbers, and support notes for your utility providers, landlords, and credit cards.',
      benefit: 'Quick access to support numbers right when you need them.'
    },
    {
      id: 'pwa_install',
      title: 'Standalone App Mode (PWA)',
      category: 'productivity',
      icon: Smartphone,
      color: 'from-sky-500/25 to-blue-500/35 border-sky-500/40 text-sky-400',
      description: 'Install Capital Command as a standalone desktop app or mobile app on your home screen for distraction-free budgeting.',
      benefit: 'Runs in its own dedicated window without browser tabs.'
    }
  ];

  const filteredSuggestions = suggestions.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 via-[#0a1411] to-black border border-emerald-500/40 rounded-3xl max-w-4xl w-full p-6 sm:p-8 text-white shadow-2xl shadow-emerald-950/70 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/30 border border-emerald-500/50 flex items-center justify-center text-amber-400 shadow-lg shadow-emerald-950/50">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-white tracking-tight">
                App Feature Suggestions &amp; Add-ons
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold uppercase tracking-widest">
                DISCOVERY SUITE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Explore and enable powerful financial modules designed to customize Capital Command to your workflow.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {(['all', 'savings', 'tracking', 'sync', 'productivity'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all capitalize shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75vh] sm:max-h-[80vh] overflow-y-auto pr-1">
          {filteredSuggestions.map((feat) => {
            const IconComponent = feat.icon;
            const isActive = activeFeatures[feat.id];

            return (
              <div 
                key={feat.id}
                className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center shrink-0 border`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {isActive ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Enabled
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider">
                        Available
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-serif font-bold text-white mb-1.5 tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                    {feat.description}
                  </p>
                  <p className="text-[11px] text-emerald-400/90 font-mono flex items-center gap-1.5 bg-emerald-950/30 p-2 rounded-xl border border-emerald-500/20">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{feat.benefit}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Category: {feat.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => onEnableFeature(feat.id)}
                    className={`px-4 py-2 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/20'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-950/50'
                    }`}
                  >
                    <span>{isActive ? 'Configure / View' : 'Enable Feature'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All features run locally with private encryption</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Close Explorer
          </button>
        </div>

      </div>
    </div>
  );
};
