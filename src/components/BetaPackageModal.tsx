import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  Download, 
  Share2, 
  Smartphone, 
  Monitor, 
  Check, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  ExternalLink, 
  X,
  Package,
  HardDrive,
  Globe,
  Wifi,
  WifiOff,
  Loader2
} from 'lucide-react';

interface BetaPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  appConnectionMode: 'online' | 'offline';
  onToggleConnectionMode: (mode: 'online' | 'offline') => void;
  deferredPrompt: any;
  onInstallPwa: () => void;
  isPwaInstalled: boolean;
}

export const BetaPackageModal: React.FC<BetaPackageModalProps> = ({
  isOpen,
  onClose,
  appConnectionMode,
  onToggleConnectionMode,
  deferredPrompt,
  onInstallPwa,
  isPwaInstalled
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedElectronCommand, setCopiedElectronCommand] = useState(false);
  const [activeTab, setActiveTab] = useState<'pwa' | 'desktop' | 'offline_zip'>('pwa');
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  if (!isOpen) return null;

  const sharedUrl = 'https://ais-pre-6jcnkg7cv3geoxxgegun5p-191139478196.us-east5.run.app';
  const electronCommand = `npx @nativefier/nativefier --name "Capital Command" --icon "public/icon.svg" "${sharedUrl}"`;

  const copyUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(sharedUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const copyCommand = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(electronCommand);
      setCopiedElectronCommand(true);
      setTimeout(() => setCopiedElectronCommand(false), 2500);
    }
  };

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      const zip = new JSZip();
      const filePaths = [
        'package.json',
        'tsconfig.json',
        'vite.config.ts',
        'server.js',
        'index.html',
        'firebase-applet-config.json',
        '.env.example',
        'public/manifest.json',
        'public/icon.svg',
        'src/main.tsx',
        'src/App.tsx',
        'src/types.ts',
        'src/index.css',
        'src/lib/firebase.ts',
        'src/lib/utils.ts',
        'src/services/googleCalendar.ts',
        'src/components/BetaPackageModal.tsx',
        'src/components/ConnectionModeModal.tsx',
        'src/components/DebtPayoffEngine.tsx',
        'src/components/FeatureSuggestionsModal.tsx',
        'src/components/LegalSafeguardsModal.tsx',
        'src/components/LuxuryGoldGeometricBackground.tsx',
        'src/components/OnboardingGuideModal.tsx',
        'src/components/PhoneBookModal.tsx',
        'src/components/PinVaultModal.tsx',
        'src/components/QuickStartGuideBanner.tsx',
        'src/components/SavingsCardDepositModal.tsx',
        'src/components/SavingsCardModal.tsx',
        'src/components/SavingsCardsSidebarWidget.tsx',
        'src/components/TaxLiabilityReserve.tsx',
        'src/components/Upcoming7DayBanner.tsx'
      ];

      for (const path of filePaths) {
        try {
          const res = await fetch('/' + path);
          if (res.ok) {
            const text = await res.text();
            zip.file(path, text);
          }
        } catch (e) {
          console.warn('Could not fetch ' + path, e);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'capital-command-source.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip', err);
      alert('Failed to generate zip file. You can also download the project from the AI Studio export menu.');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 via-[#07130f] to-black border border-emerald-500/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white shadow-2xl shadow-emerald-950/60 relative animate-in fade-in zoom-in-95 duration-200">
        
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
            <Package className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-white tracking-tight">
                Package &amp; Distribute to Beta Testers
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold uppercase tracking-widest">
                BETA SUITE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Deliver Capital Command as a standalone program or web app to your testing team.
            </p>
          </div>
        </div>

        {/* Mode Selector Notice */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {appConnectionMode === 'online' ? (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Wifi className="w-4 h-4 text-emerald-400" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <WifiOff className="w-4 h-4 text-amber-400" />
              </div>
            )}
            <div>
              <p className="text-xs font-mono text-white font-bold">
                Current App Environment:{' '}
                <span className={appConnectionMode === 'online' ? 'text-emerald-400' : 'text-amber-400'}>
                  {appConnectionMode === 'online' ? 'Online Mode (Cloud Vault & Sync)' : 'Offline Mode (100% Local Ledger)'}
                </span>
              </p>
              <p className="text-[11px] text-slate-400">
                {appConnectionMode === 'online'
                  ? 'Beta testers can sync their manual ledger with cloud vault and Google Calendar (requires sign-in).'
                  : 'Beta testers run completely air-gapped without cloud account dependencies.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleConnectionMode('online')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                appConnectionMode === 'online'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Wifi className="w-3 h-3" />
              <span>Online</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleConnectionMode('offline')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                appConnectionMode === 'offline'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pwa')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'pwa'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>1. Instant Install (PWA Program)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('desktop')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'desktop'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>2. Native Desktop App (.exe / .dmg)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('offline_zip')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'offline_zip'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>3. Standalone ZIP Export</span>
          </button>
        </div>

        {/* Tab 1: PWA */}
        {activeTab === 'pwa' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <h3 className="text-sm font-mono font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Fastest Method: 1-Click Install for Testers (Desktop &amp; Mobile)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Capital Command is configured as a Progressive Web Application (PWA). Beta testers can open your shared URL in Chrome, Edge, Safari, Windows, Mac, iOS, or Android, and click <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong> to run it as a standalone, borderless windowed application.
              </p>

              <div className="bg-[#0b1015] p-3 rounded-xl border border-white/10 font-mono text-[11px] text-emerald-400 break-all">
                {sharedUrl}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onInstallPwa}
                  disabled={isPwaInstalled}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{isPwaInstalled ? 'App Already Installed' : 'Install Capital Command on this Device'}</span>
                </button>

                <button
                  type="button"
                  onClick={copyUrl}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-slate-200 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Beta Link Copied!' : 'Copy Beta Tester Link'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 font-mono">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" /> Desktop (Windows / Mac)
                </p>
                <p className="text-[11px] text-slate-400">
                  Open link in Chrome or Edge &rarr; Click the <strong>Install</strong> icon in the address bar (or Menu &rarr; "Install Capital Command").
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <p className="text-teal-400 font-bold flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" /> Mobile (iOS / Android)
                </p>
                <p className="text-[11px] text-slate-400">
                  In Safari: tap <strong>Share &rarr; Add to Home Screen</strong>. In Android Chrome: tap <strong>Add to Home Screen</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Desktop Executable */}
        {activeTab === 'desktop' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <h3 className="text-sm font-mono font-bold text-amber-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                Package as a Native Desktop App (.exe / .dmg / .app)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                If you want to send an actual executable file (`.exe` for Windows or `.dmg` for macOS) directly to beta testers without web installation, you can build a native wrapper in 30 seconds using Nativefier or Electron:
              </p>

              <div className="bg-[#0b1015] p-3.5 rounded-xl border border-white/15 font-mono text-[11px] text-emerald-300 relative group">
                <code>{electronCommand}</code>
                <button
                  type="button"
                  onClick={copyCommand}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
                  title="Copy terminal command"
                >
                  {copiedElectronCommand ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 space-y-2 font-mono">
              <p className="text-white font-bold">Alternative: PWABuilder (No Coding Required)</p>
              <p className="text-[11px]">
                1. Go to <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline inline-flex items-center gap-1">PWABuilder.com <ExternalLink className="w-3 h-3" /></a><br />
                2. Paste your Capital Command URL.<br />
                3. Download pre-packaged store bundles for <strong>Windows (.msix / .exe)</strong>, <strong>macOS</strong>, and <strong>Android APK</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Standalone ZIP */}
        {activeTab === 'offline_zip' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <h3 className="text-sm font-mono font-bold text-teal-300 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-teal-400" />
                Download Standalone Source ZIP
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Click the button below to instantly package and download the complete Capital Command source code and offline assets as a `.zip` archive right from this app:
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={isDownloadingZip}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-teal-950/50 disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {isDownloadingZip ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-teal-200" />
                      <span>Packaging Source Files into ZIP...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Complete Source ZIP (.zip)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400 font-mono space-y-1.5">
                <p className="text-slate-300 font-bold">Alternative Method (AI Studio Export):</p>
                <p className="text-[11px]">
                  You can also click the <strong>Project Settings / Export</strong> menu at the top-right of Google AI Studio to download a full workspace backup at any time.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-server dependencies required for local offline testing</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold uppercase tracking-wider transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
