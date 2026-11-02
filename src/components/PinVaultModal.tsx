import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  LockKeyhole, 
  Unlock, 
  ShieldCheck, 
  KeyRound, 
  Check, 
  Sparkles, 
  Eye, 
  EyeOff,
  AlertCircle
} from 'lucide-react';

interface PinVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPinEnabled: boolean;
  setIsPinEnabled: (val: boolean) => void;
  appPin: string;
  setAppPin: (val: string) => void;
  onLockNow: () => void;
}

export const PinVaultModal: React.FC<PinVaultModalProps> = ({
  isOpen,
  onClose,
  isPinEnabled,
  setIsPinEnabled,
  appPin,
  setAppPin,
  onLockNow
}) => {
  const [newPin, setNewPin] = useState(appPin || '');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'view' | 'change'>(appPin ? 'view' : 'change');
  const [showDigits, setShowDigits] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNewPin(appPin || '');
      setConfirmPin('');
      setErrorMessage(null);
      setSuccessMessage(null);
      setStep(appPin ? 'view' : 'change');
    }
  }, [isOpen, appPin]);

  if (!isOpen) return null;

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setErrorMessage('PIN must be exactly 4 numeric digits (0-9).');
      return;
    }

    if (newPin !== confirmPin) {
      setErrorMessage('PINs do not match. Please re-enter the same 4 digits.');
      return;
    }

    setAppPin(newPin);
    setIsPinEnabled(true);
    localStorage.setItem('appPin', newPin);
    localStorage.setItem('isPinEnabled', 'true');
    setSuccessMessage('4-Digit Security PIN successfully updated & activated!');
    setTimeout(() => {
      setStep('view');
      setSuccessMessage(null);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#0c120e] border border-emerald-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.15)] flex flex-col"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-[#0e1f16] to-black p-6 sm:p-7 border-b border-emerald-500/20 relative overflow-hidden shrink-0">
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/10 border border-emerald-500/40 flex items-center justify-center text-amber-400 shadow-md">
                  <LockKeyhole className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold font-serif text-white">
                      Pro Vault Security PIN
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] uppercase font-bold border border-amber-500/40">
                      4-Digit Lock
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Hardware-grade client-side encryption & screen lock.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-7 space-y-6 text-slate-300">
            {successMessage && (
              <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-emerald-300 font-mono text-xs flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-rose-300 font-mono text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {step === 'view' ? (
              <div className="space-y-5">
                {/* Status Card */}
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className={isPinEnabled ? "w-5 h-5 text-emerald-400" : "w-5 h-5 text-slate-500"} />
                      <div>
                        <span className="text-xs font-mono font-bold uppercase text-white block">
                          Vault Security Status
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isPinEnabled ? 'Screen-lock active and enforced' : 'PIN disabled — App open without lock'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const next = !isPinEnabled;
                        setIsPinEnabled(next);
                        localStorage.setItem('isPinEnabled', String(next));
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isPinEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isPinEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {isPinEnabled && (
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">Current PIN:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-amber-300 tracking-widest px-3 py-1 bg-black/60 rounded-xl border border-white/10">
                          {showDigits ? appPin : '••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowDigits(!showDigits)}
                          className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/10 transition-colors"
                          title={showDigits ? "Hide PIN" : "Show PIN"}
                        >
                          {showDigits ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNewPin('');
                      setConfirmPin('');
                      setStep('change');
                    }}
                    className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/10"
                  >
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    Change 4-Digit PIN
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLockNow();
                    }}
                    className="py-3 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40"
                  >
                    <LockKeyhole className="w-4 h-4 text-amber-400" />
                    Lock Screen Now
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveNewPin} className="space-y-5">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                  <div>
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-2">
                      Enter New 4-Digit PIN
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-3 text-center text-2xl font-mono font-bold text-amber-300 tracking-[0.5em] focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-2">
                      Confirm 4-Digit PIN
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-3 text-center text-2xl font-mono font-bold text-amber-300 tracking-[0.5em] focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  {appPin && (
                    <button
                      type="button"
                      onClick={() => {
                        setStep('view');
                        setErrorMessage(null);
                      }}
                      className="w-1/3 py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border border-white/10"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/40"
                  >
                    Save & Activate PIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PinVaultModal;
