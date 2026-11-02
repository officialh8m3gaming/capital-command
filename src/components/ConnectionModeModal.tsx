import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  HardDrive, 
  Cloud, 
  Check, 
  X, 
  Lock, 
  Layers, 
  RefreshCw, 
  ArrowRight,
  Sparkles,
  Package
} from 'lucide-react';

interface ConnectionModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  appConnectionMode: 'online' | 'offline';
  onSelectMode: (mode: 'online' | 'offline') => void;
  onOpenBetaModal: () => void;
}

export const ConnectionModeModal: React.FC<ConnectionModeModalProps> = ({
  isOpen,
  onClose,
  appConnectionMode,
  onSelectMode,
  onOpenBetaModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 via-[#07130f] to-black border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl shadow-emerald-950/60 relative animate-in fade-in zoom-in-95 duration-200">
        
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 flex items-center justify-center text-amber-400 shadow-lg">
            {appConnectionMode === 'online' ? (
              <Wifi className="w-6 h-6 text-emerald-400" />
            ) : (
              <WifiOff className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-white tracking-tight">
                Connection &amp; Storage Mode
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest ${
                appConnectionMode === 'online'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {appConnectionMode === 'online' ? 'ONLINE ACTIVE' : 'OFFLINE ACTIVE'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Choose how Capital Command stores and synchronizes your financial calculations.
            </p>
          </div>
        </div>

        {/* Mode Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          
          {/* Card 1: Offline Mode */}
          <div 
            onClick={() => onSelectMode('offline')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
              appConnectionMode === 'offline'
                ? 'bg-gradient-to-b from-amber-950/40 to-black/80 border-amber-500 ring-2 ring-amber-400/40 shadow-xl shadow-amber-950/40'
                : 'bg-white/5 border-white/10 hover:border-amber-500/40 hover:bg-white/10'
            }`}
          >
            {appConnectionMode === 'offline' && (
              <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-xs shadow-md">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <WifiOff className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Offline Mode
                </h3>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
                <strong>100% Local Device Storage.</strong> All records, budgets, and bill cycles remain strictly inside your browser's private local cache. Zero network transmissions.
              </p>
              <ul className="space-y-1.5 text-[10px] font-mono text-slate-400">
                <li className="flex items-center gap-1.5 text-amber-300">
                  <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" /> Air-gapped privacy
                </li>
                <li className="flex items-center gap-1.5 text-amber-300">
                  <HardDrive className="w-3 h-3 text-amber-400 shrink-0" /> No account or email needed
                </li>
                <li className="flex items-center gap-1.5 text-amber-300">
                  <Lock className="w-3 h-3 text-amber-400 shrink-0" /> Works completely without internet
                </li>
              </ul>
            </div>
            <button
              type="button"
              className={`mt-5 w-full py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                appConnectionMode === 'offline'
                  ? 'bg-amber-400 text-black font-extrabold shadow-md'
                  : 'bg-white/10 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300'
              }`}
            >
              {appConnectionMode === 'offline' ? 'Active Mode' : 'Switch to Offline'}
            </button>
          </div>

          {/* Card 2: Online Mode */}
          <div 
            onClick={() => onSelectMode('online')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
              appConnectionMode === 'online'
                ? 'bg-gradient-to-b from-emerald-950/40 to-black/80 border-emerald-500 ring-2 ring-emerald-400/40 shadow-xl shadow-emerald-950/40'
                : 'bg-white/5 border-white/10 hover:border-emerald-500/40 hover:bg-white/10'
            }`}
          >
            {appConnectionMode === 'online' && (
              <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-emerald-400 text-black flex items-center justify-center font-bold text-xs shadow-md">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Wifi className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Online Mode
                </h3>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
                <strong>Cloud Vault &amp; Calendar Sync.</strong> Synchronize your manual financial ledger across devices and push bills to Google Calendar. Requires user sign-in.
              </p>
              <ul className="space-y-1.5 text-[10px] font-mono text-slate-400">
                <li className="flex items-center gap-1.5 text-emerald-300">
                  <Cloud className="w-3 h-3 text-emerald-400 shrink-0" /> Multi-device Firestore vault (requires sign-in)
                </li>
                <li className="flex items-center gap-1.5 text-emerald-300">
                  <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" /> Google Calendar bi-directional push
                </li>
              </ul>
            </div>
            <button
              type="button"
              className={`mt-5 w-full py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                appConnectionMode === 'online'
                  ? 'bg-emerald-400 text-black font-extrabold shadow-md'
                  : 'bg-white/10 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300'
              }`}
            >
              {appConnectionMode === 'online' ? 'Active Mode' : 'Switch to Online'}
            </button>
          </div>

        </div>

        {/* Beta Tester Distribution Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-amber-950/20 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Package className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold text-white">Sending to Beta Testers?</p>
              <p className="text-[11px] text-slate-400">Package as an installable standalone app or executable installer.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBetaModal();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <span>Package App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
