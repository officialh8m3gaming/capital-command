import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ShieldAlert, X, Lock, FileText, CheckCircle2, Award, Check, Eye, Database } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type LegalDocTab = 'terms' | 'privacy';

interface LegalSafeguardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  initialTab?: LegalDocTab;
  forceConsent?: boolean;
  onConsentGranted?: (consentData: any) => void;
}

export const LegalSafeguardsModal: React.FC<LegalSafeguardsModalProps> = ({
  isOpen,
  onClose,
  user,
  initialTab = 'terms',
  forceConsent = false,
  onConsentGranted
}) => {
  const [activeTab, setActiveTab] = useState<LegalDocTab>(initialTab);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [auditRecord, setAuditRecord] = useState<{ timestamp: string; userId: string; agreedAt?: string } | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [showConsentWarning, setShowConsentWarning] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('capital_command_legal_consent');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAuditRecord(parsed);
        setHasAgreed(true);
      }
    } catch (e) {
      console.warn('Could not read local consent record:', e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropOrCloseAttempt = () => {
    if (forceConsent && !hasAgreed) {
      setShowConsentWarning(true);
      setTimeout(() => setShowConsentWarning(false), 4000);
      return;
    }
    onClose();
  };

  const handleAgree = async () => {
    setIsLogging(true);
    const timestampIso = new Date().toISOString();
    const agreedAtFormatted = new Date().toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
    const resolvedUserId = user?.uid || localStorage.getItem('vault_user_id') || `vault-${Math.random().toString(36).substring(2, 9)}`;
    const userEmail = user?.email || localStorage.getItem('syncedUserEmail') || 'local-vault-user';

    if (!localStorage.getItem('vault_user_id')) {
      localStorage.setItem('vault_user_id', resolvedUserId);
    }

    const consentData = {
      userId: resolvedUserId,
      userEmail,
      timestamp: timestampIso,
      agreedAt: agreedAtFormatted,
      termsVersion: '2.6 - Non-Custodial Zero-Liability & Offline Financial Privacy Policy',
      ipOrAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'WebClient',
      status: 'CONSENT_GRANTED'
    };

    // Save to local storage for instant offline & local availability
    try {
      localStorage.setItem('capital_command_legal_consent', JSON.stringify(consentData));
      setAuditRecord(consentData);
      setHasAgreed(true);
    } catch (err) {
      console.warn('Local storage write error:', err);
    }

    if (onConsentGranted) {
      onConsentGranted(consentData);
    }

    // Save permanent audit trail to Firestore if Firebase is active
    try {
      if (db) {
        const auditDocRef = doc(db, 'legal_consent_audit', `${resolvedUserId}_${Date.now()}`);
        await setDoc(auditDocRef, {
          ...consentData,
          firestoreServerTimestamp: serverTimestamp()
        }, { merge: true });

        if (user?.uid) {
          const userConsentRef = doc(db, 'users', user.uid, 'legal_consent', 'terms_v2_6');
          await setDoc(userConsentRef, {
            ...consentData,
            firestoreServerTimestamp: serverTimestamp()
          }, { merge: true });
        }
      }
    } catch (firestoreErr) {
      console.warn('Firestore legal audit logging note (fallback to local audit trail):', firestoreErr);
    } finally {
      setIsLogging(false);
      setTimeout(() => {
        onClose();
      }, 400);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropOrCloseAttempt}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-2xl bg-[#0d120f] border border-amber-500/40 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.2)] space-y-5 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col"
        >
          {/* First-time mandatory notice if forced */}
          {forceConsent && !hasAgreed && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-amber-200 shrink-0">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-mono block">Required First-Time Verification:</strong>
                <span>Please review the non-custodial operating terms and data privacy policy below, then click <strong>"I Understand &amp; Agree"</strong> to begin using Capital Command.</span>
              </div>
            </div>
          )}

          {showConsentWarning && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-200 text-xs font-mono flex items-center gap-2 shrink-0"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>You must click "I Understand &amp; Agree" at the bottom to continue into the app.</span>
            </motion.div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/10 pb-4 shrink-0">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Legal Governance &amp; Permanent Audit Record
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {activeTab === 'terms' ? 'Terms of Service & Disclaimers' : 'Privacy & Data Policy'}
              </h2>
              <p className="text-xs text-slate-400">
                {activeTab === 'terms' 
                  ? 'Limitation of liability, non-custodial operating model, and user responsibilities.'
                  : 'How your financial data is stored locally and protected.'}
              </p>
            </div>
            {!forceConsent && (
              <button
                onClick={handleBackdropOrCloseAttempt}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Document Switcher Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-black/60 rounded-2xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'terms'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Terms of Service &amp; Disclaimers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'privacy'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Privacy &amp; Data Policy
            </button>
          </div>

          {/* Audit Trail Badge */}
          {auditRecord && (
            <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl flex items-center justify-between flex-wrap gap-2 font-mono text-xs text-emerald-300 shrink-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">Permanent Legal Consent Logged</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Timestamp: <span className="text-white font-bold">{auditRecord.agreedAt || auditRecord.timestamp}</span>
              </div>
            </div>
          )}

          {/* TAB 1: TERMS OF SERVICE & DISCLAIMERS */}
          {activeTab === 'terms' && (
            <div className="space-y-5 flex-1">
              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <Lock className="w-4 h-4" />
                    100% Manual &amp; Offline-First
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Capital Command operates entirely as an offline-first, manual-entry financial ledger. No external bank synchronization or API credentials are used.
                  </p>
                </div>

                <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    Zero Financial Liability
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    The software author and hosts are legally exempt from any liability arising from device loss, manual entry discrepancies, or budgeting calculations.
                  </p>
                </div>
              </div>

              {/* Detailed Legal Clauses */}
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-4">
                {/* Clause 1 */}
                <div className="space-y-1.5">
                  <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    1. Manual-Entry Ledger &amp; Non-Banking Status
                  </h4>
                  <p className="text-slate-400 pl-5 text-[11px]">
                    Capital Command is strictly a manual-entry financial ledger and budgeting calculator. It does not connect to bank APIs, execute electronic transfers, hold deposits, or initiate wire transactions. All account balances, transaction records, and bill payments are manually entered by the user for personal tracking and planning.
                  </p>
                </div>

                {/* Clause 2 */}
                <div className="space-y-1.5">
                  <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    2. Absolute Limitation of Liability &amp; Hold Harmless
                  </h4>
                  <p className="text-slate-400 pl-5 text-[11px]">
                    To the maximum extent permitted under applicable law, you expressly agree to release, indemnify, and hold harmless the application creator, developer(s), contributors, and service hosts from any direct, indirect, incidental, special, consequential, or exemplary damages. This includes, without limitation, damages for device compromises, data loss, manual math errors, or missed financial deadlines.
                  </p>
                </div>

                {/* Clause 3 */}
                <div className="space-y-1.5">
                  <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    3. User Responsibility for Security &amp; Data
                  </h4>
                  <p className="text-slate-400 pl-5 text-[11px]">
                    You retain 100% exclusive responsibility for safeguarding your device, maintaining your Master Security PIN, and securing your local data or private vault.
                  </p>
                </div>

                {/* Clause 4 */}
                <div className="space-y-1.5">
                  <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    4. "AS-IS" Software Warranty Disclaimer
                  </h4>
                  <p className="text-slate-400 pl-5 text-[11px]">
                    This software is provided on an "AS-IS" and "AS-AVAILABLE" basis without warranties of any kind. Calculations, net worth totals, and debt payoff projections are mathematical simulations based solely on user-provided manual inputs and do not constitute professional financial advice.
                  </p>
                </div>

                {/* Clause 5 */}
                <div className="space-y-1.5">
                  <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    5. Mandatory Individual Arbitration &amp; Class Action Waiver
                  </h4>
                  <p className="text-slate-400 pl-5 text-[11px]">
                    You agree that any dispute arising out of or relating to this software shall be settled strictly through binding, individual arbitration rather than in court, expressly waiving any right to participate in class actions or representative lawsuits.
                  </p>
                </div>

                {/* Clause 6 */}
                <div className="space-y-1.5">
                  <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    6. Aggregate Liability Cap &amp; Sole Remedy
                  </h4>
                  <p className="text-slate-400 pl-5 text-[11px]">
                    Under no circumstances shall the developer's or host's total cumulative liability for all claims related to this application exceed ten dollars ($10.00 USD).
                  </p>
                </div>

                {/* Clause 7 */}
                <div className="space-y-1.5">
                  <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    7. No Fiduciary Duty
                  </h4>
                  <p className="text-slate-400 pl-5 text-[11px]">
                    The creator and operator of Capital Command do not act as registered investment advisors, broker-dealers, CPAs, or fiduciaries.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY & DATA POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 flex-1">
              {/* Privacy Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <Eye className="w-4 h-4" />
                    Zero Data Monetization
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    We never sell, broker, license, or analyze your manual financial ledger entries to advertising networks or third parties.
                  </p>
                </div>

                <div className="p-4 bg-teal-950/20 border border-teal-500/30 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <Database className="w-4 h-4" />
                    Offline-First &amp; Local Storage
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Your manual account balances, bills, and budget data remain entirely under your control on your device or in your private vault.
                  </p>
                </div>
              </div>

              {/* Detailed Privacy Clauses */}
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-4">
                {/* Privacy Clause 1 */}
                <div className="space-y-1.5">
                  <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    1. Information You Voluntarily Provide
                  </h4>
                  <p className="text-slate-400 pl-5 text-[11px]">
                    Capital Command processes only the data you explicitly type into the application (such as manual account names, balances, and bill due dates). We do not collect banking credentials, account numbers, or external transaction feeds.
                  </p>
                </div>

                {/* Privacy Clause 2 */}
                <div className="space-y-1.5">
                  <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    2. Local Storage &amp; Secure Cloud Vaults
                  </h4>
                  <p className="text-slate-400 pl-5 text-[11px]">
                    Your ledger is stored locally in your browser storage. If you choose to sign in, your encrypted manual ledger records sync exclusively to your private cloud vault. No third party or financial institution has access to your private vault data.
                  </p>
                </div>

                {/* Privacy Clause 3 */}
                <div className="space-y-1.5">
                  <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    3. Right to Erase &amp; Data Portability
                  </h4>
                  <p className="text-slate-400 pl-5 text-[11px]">
                    You retain the absolute right at any time to export your ledger in JSON format or instantly wipe all locally stored data using the reset tools in settings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Version 2.6 • Audit Trail Enabled</span>
            </div>
            <button
              type="button"
              onClick={handleAgree}
              disabled={isLogging}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{hasAgreed ? 'Agreement Re-Confirmed & Logged' : 'I Understand & Agree'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LegalSafeguardsModal;
