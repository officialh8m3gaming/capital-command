/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  addYears, 
  subYears, 
  startOfYear, 
  endOfYear,
  isToday,
  addDays,
  addWeeks,
  addMonths,
  parseISO
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Bell, 
  X, 
  Zap, 
  Home, 
  CreditCard, 
  Shield, 
  RefreshCw, 
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
  DollarSign,
  Repeat,
  Settings2,
  Palette,
  Pencil,
  Trash2,
  Calculator as CalculatorIcon,
  Equal,
  Delete,
  Divide,
  X as CloseIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
  Percent,
  LogIn,
  LogOut,
  Cloud,
  Menu,
  Loader2,
  Download,
  Upload,
  TrendingUp,
  TrendingDown,
  Printer,
  LayoutDashboard,
  ArrowRight,
  FileText,
  PiggyBank,
  Wallet,
  Landmark,
  Compass,
  Building2,
  Building,
  Search,
  ShieldCheck,
  ArrowUpRight,
  Lock,
  Sparkles,
  Layers,
  RefreshCcw,
  Settings,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Database,
  AlertTriangle,
  Globe,
  Sliders,
  ShieldAlert,
  LockKeyhole,
  Unlock,
  ExternalLink,
  BookOpen,
  CheckSquare,
  Edit2,
  RotateCcw,
  History,
  Clock,
  Tag,
  FileEdit,
  Info,
  Wifi,
  WifiOff,
  Package,
  Smartphone,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bill, 
  BillCategory, 
  BillFrequency, 
  DEFAULT_CATEGORIES, 
  CategoryConfig, 
  CategoryInfo, 
  COLOR_OPTIONS, 
  SavingsDeposit, 
  SAVINGS_ACCOUNT_OPTIONS,
  FinancialAccount,
  AccountType,
  GoalDeposit,
  Contact,
  AutoPayEntry
} from './types';
import { cn } from './lib/utils';
import Upcoming7DayBanner from './components/Upcoming7DayBanner';
import DebtPayoffEngine from './components/DebtPayoffEngine';
import TaxLiabilityReserve from './components/TaxLiabilityReserve';
import PinVaultModal from './components/PinVaultModal';
import { LegalSafeguardsModal } from './components/LegalSafeguardsModal';
import { LuxuryGoldGeometricBackground } from './components/LuxuryGoldGeometricBackground';
import { SavingsCardModal, PresetCardType } from './components/SavingsCardModal';
import { SavingsCardDepositModal } from './components/SavingsCardDepositModal';
import { SavingsCardsSidebarWidget } from './components/SavingsCardsSidebarWidget';
import { ConnectionModeModal } from './components/ConnectionModeModal';
import { BetaPackageModal } from './components/BetaPackageModal';
import { QuickStartGuideBanner } from './components/QuickStartGuideBanner';
import { OnboardingGuideModal } from './components/OnboardingGuideModal';
import { PhoneBookModal } from './components/PhoneBookModal';
import { FeatureSuggestionsModal } from './components/FeatureSuggestionsModal';
import { 
  auth, 
  db, 
  signInWithGoogle, 
  logout, 
  OperationType, 
  handleFirestoreError,
  requestGoogleAuth,
  getCachedGoogleAccessToken,
  requestGoogleCalendarAuth,
  getCachedCalendarAccessToken,
  clearCalendarAccessToken,
  GoogleAuthProvider,
  signInWithPopup
} from './lib/firebase';
type PlaidInstitution = any;
const PLAID_INSTITUTIONS: PlaidInstitution[] = [];
const isAccountPlaidSupported = (a: any) => false;
const syncPlaidAccounts = async (tokens: any) => ({ success: true, updatedAccounts: [], itemErrors: [], updatedCount: 0 });
import { syncBillsToGoogleCalendar } from './services/googleCalendar';
import { 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { collection, doc, query, onSnapshot, setDoc, deleteDoc, writeBatch, serverTimestamp, getDocs } from 'firebase/firestore';

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function getBankBrandInfo(name: string) {
  const lower = (name || '').toLowerCase();
  if (lower.includes('chase')) return { bg: 'bg-[#1170d1]', short: 'CH', label: 'Chase Bank' };
  if (lower.includes('bank of america') || lower.includes('bofa')) return { bg: 'bg-[#012169]', short: 'BOA', label: 'Bank of America' };
  if (lower.includes('wells fargo')) return { bg: 'bg-[#d71e28]', short: 'WF', label: 'Wells Fargo' };
  if (lower.includes('amex') || lower.includes('american express')) return { bg: 'bg-[#001f5f]', short: 'AMEX', label: 'American Express' };
  if (lower.includes('citi') || lower.includes('citibank')) return { bg: 'bg-[#003b70]', short: 'CITI', label: 'Citi' };
  if (lower.includes('capital one')) return { bg: 'bg-[#d03027]', short: 'CO', label: 'Capital One' };
  if (lower.includes('discover')) return { bg: 'bg-[#ff6000]', short: 'DSC', label: 'Discover' };
  if (lower.includes('us bank') || lower.includes('u.s. bank')) return { bg: 'bg-[#002d62]', short: 'USB', label: 'U.S. Bank' };
  if (lower.includes('fidelity')) return { bg: 'bg-[#376244]', short: 'FD', label: 'Fidelity' };
  if (lower.includes('vanguard')) return { bg: 'bg-[#961c1c]', short: 'VG', label: 'Vanguard' };
  if (lower.includes('schwab') || lower.includes('charles schwab')) return { bg: 'bg-[#26456f]', short: 'CS', label: 'Charles Schwab' };
  if (lower.includes('paypal')) return { bg: 'bg-[#003087]', short: 'PP', label: 'PayPal' };
  if (lower.includes('apple')) return { bg: 'bg-[#333333]', short: 'AAPL', label: 'Apple Card' };
  if (lower.includes('cash app') || lower.includes('cashapp')) return { bg: 'bg-[#00D632] text-black', short: 'CA', label: 'Cash App' };
  if (lower.includes('venmo')) return { bg: 'bg-[#008CFF]', short: 'VE', label: 'Venmo' };
  if (lower.includes('zelle')) return { bg: 'bg-[#6d13cb]', short: 'ZL', label: 'Zelle' };
  if (lower.includes('moneylion')) return { bg: 'bg-[#3b82f6]', short: 'ML', label: 'MoneyLion' };
  if (lower.includes('forum')) return { bg: 'bg-[#0284c7]', short: 'FCU', label: 'Forum CU' };
  return { bg: 'bg-emerald-600', short: (name || 'AC').substring(0, 2).toUpperCase(), label: name || 'Account' };
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [resetEmailInput, setResetEmailInput] = useState('');
  const [resetEmailStatus, setResetEmailStatus] = useState<string | null>(null);
  const [resetEmailError, setResetEmailError] = useState<string | null>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState<string | null>(null);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const ALL_CATEGORY_KEYS: BillCategory[] = [
    'utilities',
    'rent',
    'credit card',
    'insurance',
    'subscription',
    'other'
  ];

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('bills');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(b => !b.id.startsWith('sample-'));
        }
      } catch (e) {}
    }
    return [];
  });
  const [categories, setCategories] = useState<CategoryConfig>(() => {
    const saved = localStorage.getItem('categories');
    if (!saved) return DEFAULT_CATEGORIES;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.insurance && parsed.insurance.color === 'orange') {
        parsed.insurance.color = 'amber';
      }
      if (parsed['credit-card'] && !parsed['credit card']) {
        parsed['credit card'] = parsed['credit-card'];
      }
      const merged: CategoryConfig = { ...DEFAULT_CATEGORIES };
      for (const k of ALL_CATEGORY_KEYS) {
        if (parsed[k]) {
          merged[k] = { ...DEFAULT_CATEGORIES[k], ...parsed[k] };
        }
      }
      return merged;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });
  
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isCalendarConfirmOpen, setIsCalendarConfirmOpen] = useState(false);
  const [hasLegalConsent, setHasLegalConsent] = useState<boolean>(() => {
    try {
      const consent = localStorage.getItem('capital_command_legal_consent');
      return !!consent;
    } catch {
      return false;
    }
  });
  const [isLegalDisclaimerOpen, setIsLegalDisclaimerOpen] = useState<boolean>(() => {
    try {
      const consent = localStorage.getItem('capital_command_legal_consent');
      return !consent;
    } catch {
      return true;
    }
  });
  const [legalModalTab, setLegalModalTab] = useState<'terms' | 'privacy'>('terms');
  const [selectedCalendarBillIds, setSelectedCalendarBillIds] = useState<string[]>([]);
  const [isDomainErrorModalOpen, setIsDomainErrorModalOpen] = useState(false);
  const [hasCopiedDomain, setHasCopiedDomain] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{success: boolean, message: string} | null>(null);
  const [updateFutureInstances, setUpdateFutureInstances] = useState(false);
  const [periodAlert, setPeriodAlert] = useState<{title: string, bills: Bill[], start: Date, end: Date} | null>(null);
  const [viewMode, setViewMode] = useState<'monthly' | 'biweekly'>('monthly');
  const [appNav, setAppNav] = useState<'overview' | 'monthly' | 'biweekly'>('overview');
  const [overviewToggle, setOverviewToggle] = useState<'monthly' | 'biweekly'>(() => {
    const saved = localStorage.getItem('dashboard_overview_toggle');
    if (saved === 'biweekly' || saved === 'monthly') return saved;
    return 'monthly';
  });
  useEffect(() => {
    localStorage.setItem('dashboard_overview_toggle', overviewToggle);
  }, [overviewToggle]);
  const [goalCompletedCelebration, setGoalCompletedCelebration] = useState(false);
  const [overviewModalData, setOverviewModalData] = useState<{
    type: 'monthly' | 'biweekly';
    title: string;
    subtitle: string;
    bills: Bill[];
    start?: Date;
    end?: Date;
  } | null>(null);

  // Dashboard Card Section Visibility Controls
  const DEFAULT_CARD_VISIBILITY = {
    fundsAvailable: true,
    income: true,
    expenses: true,
    upcomingBanner: true,
    autoPaySection: true,
    accountsCenter: true,
    debtEngine: true,
    taxReserve: true,
  };

  type CardSectionKey = keyof typeof DEFAULT_CARD_VISIBILITY;

  const [cardVisibility, setCardVisibility] = useState<Record<CardSectionKey, boolean>>(() => {
    try {
      const saved = localStorage.getItem('dashboard_card_visibility');
      return saved ? { ...DEFAULT_CARD_VISIBILITY, ...JSON.parse(saved) } : DEFAULT_CARD_VISIBILITY;
    } catch {
      return DEFAULT_CARD_VISIBILITY;
    }
  });
  const [isCardManagerOpen, setIsCardManagerOpen] = useState(false);

  const toggleCardVisibility = (key: CardSectionKey) => {
    setCardVisibility(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('dashboard_card_visibility', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const resetAllCards = () => {
    setCardVisibility(DEFAULT_CARD_VISIBILITY);
    try {
      localStorage.setItem('dashboard_card_visibility', JSON.stringify(DEFAULT_CARD_VISIBILITY));
    } catch {}
  };

  const DEFAULT_CARD_ORDER: CardSectionKey[] = [
    'fundsAvailable',
    'income',
    'expenses',
    'upcomingBanner',
    'autoPaySection',
    'accountsCenter',
    'debtEngine',
    'taxReserve',
  ];

  const [cardOrder, setCardOrder] = useState<CardSectionKey[]>(() => {
    try {
      const saved = localStorage.getItem('dashboard_card_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        const missing = DEFAULT_CARD_ORDER.filter(k => !parsed.includes(k));
        return [...parsed, ...missing];
      }
      return DEFAULT_CARD_ORDER;
    } catch {
      return DEFAULT_CARD_ORDER;
    }
  });

  const moveCardOrder = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...cardOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setCardOrder(newOrder);
    try {
      localStorage.setItem('dashboard_card_order', JSON.stringify(newOrder));
    } catch {}
  };



  const handlePrintOverview = () => {
    if (!overviewModalData) return;
    const printWin = window.open('', '_blank');
    if (!printWin) {
      window.print();
      return;
    }
    const totalAmt = overviewModalData.bills.reduce((sum, b) => sum + b.amount, 0);
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${overviewModalData.title} - Bill Overview</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px; color: #111; background: #fff; max-width: 800px; margin: 0 auto; }
          h1 { font-size: 24px; font-weight: bold; margin-bottom: 4px; color: #064e3b; }
          p { font-size: 13px; color: #555; margin-bottom: 24px; font-family: monospace; }
          .bill-list { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }
          .bill-card { border: 1px solid #cbd5e1; padding: 16px 20px; border-radius: 12px; background: #f8fafc; font-family: monospace; }
          .bill-date { font-size: 14px; font-weight: bold; color: #047857; margin-bottom: 4px; }
          .bill-name { font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 6px; }
          .bill-amount { font-size: 15px; font-weight: bold; color: #0f172a; margin-bottom: 6px; }
          .badge { display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; }
          .paid { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
          .unpaid { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
          .total-box { margin-top: 32px; padding: 16px 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; font-family: monospace; font-size: 14px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>${overviewModalData.title}</h1>
        <p>${overviewModalData.subtitle}</p>
        <div class="bill-list">
          ${overviewModalData.bills.map(b => `
            <div class="bill-card">
              <div class="bill-date">Date of Bill: ${b.dueDate}</div>
              <div class="bill-name">Bill Name: ${b.name}</div>
              <div class="bill-amount">Amount of Bill: $${Number(b.amount).toFixed(2)}</div>
              <div>Status of Bill: <span class="badge ${b.isPaid ? 'paid' : 'unpaid'}">${b.isPaid ? 'Paid' : 'Unpaid'}</span></div>
            </div>
          `).join('')}
        </div>
        <div class="total-box">
          <span>Total Period Amount Scheduled:</span>
          <span style="color: #059669; font-size: 18px;">$${totalAmt.toFixed(2)}</span>
        </div>
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.close();
            }, 300);
          };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  };

  const handleSaveGoogleDoc = async () => {
    if (!overviewModalData) return;
    try {
      let token = getCachedGoogleAccessToken();
      if (!token) {
        const authResult = await requestGoogleAuth();
        token = authResult.accessToken;
        setIsGoogleConnected(true);
      }
      if (!token) {
        throw new Error('Failed to obtain Google OAuth access token');
      }

      const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: `${overviewModalData.title} - Bill Overview`
        })
      });
      const docData = await createRes.json();
      const documentId = docData.documentId;
      if (!documentId) {
        throw new Error('Failed to create Google Doc');
      }

      const totalAmt = overviewModalData.bills.reduce((sum, b) => sum + b.amount, 0);
      let textContent = `${overviewModalData.title}\n${overviewModalData.subtitle}\n\n`;
      textContent += `Total Period Amount: $${totalAmt.toFixed(2)}\n`;
      textContent += `Total Bills Scheduled: ${overviewModalData.bills.length}\n\n`;
      overviewModalData.bills.forEach((b, idx) => {
        textContent += `----------------------------------------\n`;
        textContent += `Date of Bill: ${b.dueDate}\n`;
        textContent += `Bill Name: ${b.name}\n`;
        textContent += `Amount of Bill: $${Number(b.amount).toFixed(2)}\n`;
        textContent += `Status of Bill: ${b.isPaid ? 'Paid' : 'Unpaid'}\n`;
      });

      await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                location: { index: 1 },
                text: textContent
              }
            }
          ]
        })
      });

      window.open(`https://docs.google.com/document/d/${documentId}/edit`, '_blank');
    } catch (err: any) {
      console.error('Error creating Google Doc:', err);
      if (err?.code === 'auth/popup-closed-by-user' || err?.message?.includes('cancelled') || err?.message?.includes('popup-closed-by-user')) {
        // User closed the popup, silent return
        return;
      }
      alert('Could not create Google Doc: ' + (err.message || 'Unknown authorization error'));
    }
  };

  const [monthlyIncome, setMonthlyIncome] = useState<string>(() => {
    const saved = localStorage.getItem('monthlyIncome');
    if (saved && saved !== '5800') return saved;
    return '0';
  });
  const [biWeeklyIncome, setBiWeeklyIncome] = useState<string>(() => {
    const saved = localStorage.getItem('biWeeklyIncome');
    if (saved) return saved;
    const savedM = localStorage.getItem('monthlyIncome');
    const mVal = parseFloat(savedM || '0');
    if (mVal > 0) {
      return ((mVal * 12) / 26).toFixed(2);
    }
    return '0.00';
  });

  useEffect(() => {
    localStorage.setItem('biWeeklyIncome', biWeeklyIncome);
  }, [biWeeklyIncome]);

  const [includeLiquidInFunds, setIncludeLiquidInFunds] = useState<boolean>(() => {
    const saved = localStorage.getItem('includeLiquidInFunds');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [manualFundsAdjustment, setManualFundsAdjustment] = useState<number>(() => {
    const saved = localStorage.getItem('manualFundsAdjustment');
    return saved ? parseFloat(saved) || 0 : 0;
  });
  const [isEditingFundsAmount, setIsEditingFundsAmount] = useState(false);
  const [tempFundsAmount, setTempFundsAmount] = useState('');
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeEditMode, setIncomeEditMode] = useState<'monthly' | 'biweekly'>('monthly');
  const [tempIncomeInput, setTempIncomeInput] = useState('');
  const [tempBiWeeklyInput, setTempBiWeeklyInput] = useState('');
  const [revokeBill, setRevokeBill] = useState<Bill | null>(null);

  // Financial API & Sync Controls (Plaid Settings)
  const [plaidClientId, setPlaidClientId] = useState('');
  const [plaidSecretKey, setPlaidSecretKey] = useState('');
  const [showPlaidSecret, setShowPlaidSecret] = useState(false);
  const [plaidEnv, setPlaidEnv] = useState<'sandbox' | 'development' | 'production'>(() => {
    return (localStorage.getItem('plaidEnv') as any) || 'production';
  });
  const [plaidSyncFrequency, setPlaidSyncFrequency] = useState<'manual' | 'startup' | '12hours'>(() => {
    return (localStorage.getItem('plaidSyncFrequency') as any) || 'startup';
  });

  // Data Security & Master PIN Lock Controls
  const [isPinEnabled, setIsPinEnabled] = useState(() => localStorage.getItem('isPinEnabled') === 'true' && Boolean(localStorage.getItem('appPin')));
  const [appPin, setAppPin] = useState(() => localStorage.getItem('appPin') || '');
  const [isAppLocked, setIsAppLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [lockScreenMode, setLockScreenMode] = useState<'unlock' | 'verify_email' | 'create'>('unlock');
  const [lockNewPin, setLockNewPin] = useState('');
  const [lockConfirmPin, setLockConfirmPin] = useState('');
  const [lockResetEmail, setLockResetEmail] = useState('');
  const [lockResetEmailError, setLockResetEmailError] = useState<string | null>(null);

  // Application Preferences
  const [paydayFrequency, setPaydayFrequency] = useState<'biweekly' | 'semimonthly' | 'monthly'>(() => {
    return (localStorage.getItem('paydayFrequency') as any) || 'biweekly';
  });
  const [incomeCalculationMode, setIncomeCalculationMode] = useState<'half_month' | 'annual_26'>(() => {
    return (localStorage.getItem('incomeCalculationMode') as any) || 'half_month';
  });
  const [baselinePaydayDate, setBaselinePaydayDate] = useState(() => {
    return localStorage.getItem('baselinePaydayDate') || '2026-08-14';
  });
  const [lowBalanceThreshold, setLowBalanceThreshold] = useState(() => {
    const saved = localStorage.getItem('lowBalanceThreshold');
    if (saved && saved !== '1000') return saved;
    return '0';
  });

  // Connection Mode (Online vs Offline) State
  const [appConnectionMode, setAppConnectionMode] = useState<'online' | 'offline'>(() => {
    return (localStorage.getItem('capital_command_connection_mode') as 'online' | 'offline') || 'online';
  });
  const [isConnectionModeModalOpen, setIsConnectionModeModalOpen] = useState(false);
  const [isBetaPackageModalOpen, setIsBetaPackageModalOpen] = useState(false);
  const [isOnboardingGuideModalOpen, setIsOnboardingGuideModalOpen] = useState(false);
  const [isFeatureSuggestionsModalOpen, setIsFeatureSuggestionsModalOpen] = useState(false);
  const [reauthModalAccount, setReauthModalAccount] = useState<FinancialAccount | null>(null);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  const handleEnableFeature = (featureId: string) => {
    setIsFeatureSuggestionsModalOpen(false);
    if (featureId === 'savings_vault') {
      setIsSavingsCardModalOpen(true);
    } else if (featureId === 'phone_book') {
      setIsPhoneBookModalOpen(true);
    } else if (featureId === 'pwa_install') {
      setIsBetaPackageModalOpen(true);
    } else if (featureId === 'google_calendar') {
      openCalendarSyncModal();
    } else if (featureId === 'web_notifications') {
      subscribeToNotifications();
    } else {
      setSyncStatus({ success: true, message: `Feature "${featureId}" activated!` });
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  const handleSimulatePlaidStatus = (accountId: string, status: 'healthy' | 'reauth_required' | 'sync_delayed' | 'mfa_required') => {
    setFinancialAccounts(prev => {
      const updated = prev.map(a => {
        if (a.id === accountId) {
          const errorMsg = 
            status === 'reauth_required' ? 'Bank session expired. Please re-authenticate to restore live sync.' :
            status === 'mfa_required' ? 'Multi-Factor Authentication (MFA) step required by bank.' :
            status === 'sync_delayed' ? 'Bank API reporting temporary webhook/sync delay.' : undefined;
          return {
            ...a,
            syncStatus: status,
            syncErrorMessage: errorMsg,
            syncErrorCode: status === 'healthy' ? undefined : (status === 'reauth_required' ? 'ITEM_LOGIN_REQUIRED' : 'MFA_REQUIRED'),
            lastSyncedAt: new Date().toISOString()
          };
        }
        return a;
      });
      localStorage.setItem('financialAccounts', JSON.stringify(updated));
      return updated;
    });

    if (reauthModalAccount && reauthModalAccount.id === accountId) {
      setReauthModalAccount(prev => prev ? {
        ...prev,
        syncStatus: status,
        syncErrorMessage: status === 'healthy' ? undefined : 'Simulated state updated.',
      } : null);
    }

    setSyncStatus({ 
      success: status === 'healthy', 
      message: status === 'healthy' ? 'Account marked healthy!' : `Plaid state simulated: ${status}` 
    });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredInstallPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsPwaInstalled(true);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const toggleAppConnectionMode = (specificMode?: 'online' | 'offline') => {
    const next = specificMode || (appConnectionMode === 'online' ? 'offline' : 'online');
    setAppConnectionMode(next);
    try {
      localStorage.setItem('capital_command_connection_mode', next);
    } catch {}
  };

  const handleInstallPwa = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsPwaInstalled(true);
      }
      setDeferredInstallPrompt(null);
    } else {
      alert('To install Capital Command as a desktop/mobile program, click the Install icon in your browser URL bar (or Menu -> Install Capital Command / Add to Home Screen).');
    }
  };

  // Settings Panel Tabs State & Copy Status
  const [settingsTab, setSettingsTab] = useState<'plaid' | 'security' | 'preferences' | 'styling' | 'beta'>('plaid');
  const [copiedEnv, setCopiedEnv] = useState(false);
  const settingsScrollRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Force scroll to top on opening settings and switching tabs
  useEffect(() => {
    if (isSettingsOpen && settingsScrollRef.current) {
      settingsScrollRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [settingsTab, isSettingsOpen]);

  // Force scroll to top when changing main navigation pages
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [appNav, overviewToggle]);

  // Persistence Effects for Settings
  useEffect(() => {
    localStorage.setItem('plaidEnv', plaidEnv);
  }, [plaidEnv]);

  useEffect(() => {
    localStorage.setItem('plaidSyncFrequency', plaidSyncFrequency);
  }, [plaidSyncFrequency]);

  useEffect(() => {
    localStorage.setItem('isPinEnabled', String(isPinEnabled));
  }, [isPinEnabled]);

  useEffect(() => {
    localStorage.setItem('appPin', appPin);
  }, [appPin]);

  useEffect(() => {
    localStorage.setItem('paydayFrequency', paydayFrequency);
  }, [paydayFrequency]);

  useEffect(() => {
    localStorage.setItem('baselinePaydayDate', baselinePaydayDate);
  }, [baselinePaydayDate]);

  useEffect(() => {
    localStorage.setItem('incomeCalculationMode', incomeCalculationMode);
  }, [incomeCalculationMode]);

  useEffect(() => {
    localStorage.setItem('lowBalanceThreshold', lowBalanceThreshold);
  }, [lowBalanceThreshold]);

  // Savings Deposits State
  const [savingsDeposits, setSavingsDeposits] = useState<SavingsDeposit[]>(() => {
    const saved = localStorage.getItem('savingsDeposits');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(s => !['sd-1', 'sd-2'].includes(s.id));
        }
      } catch (e) {}
    }
    return [];
  });

  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [savingsName, setSavingsName] = useState('');
  const [savingsAmount, setSavingsAmount] = useState('');
  const [savingsDate, setSavingsDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [savingsAccount, setSavingsAccount] = useState(SAVINGS_ACCOUNT_OPTIONS[0]);
  const [customAccount, setCustomAccount] = useState('');
  const [editingDeposit, setEditingDeposit] = useState<SavingsDeposit | null>(null);

  // Personal Savings Vault State
  const [personalSavingsBalance, setPersonalSavingsBalance] = useState<number>(() => {
    const saved = localStorage.getItem('personalSavingsBalance');
    return saved ? parseFloat(saved) || 0 : 0;
  });
  const [savingsDepositAmount, setSavingsDepositAmount] = useState<string>('');
  const [savingsDepositSource, setSavingsDepositSource] = useState<string>('paycheck');

  useEffect(() => {
    localStorage.setItem('personalSavingsBalance', personalSavingsBalance.toString());
  }, [personalSavingsBalance]);



  // Financial Accounts & Cards State
  const [financialAccounts, setFinancialAccounts] = useState<FinancialAccount[]>(() => {
    const saved = localStorage.getItem('financialAccounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .filter(a => 
              !['acc-1', 'acc-2', 'acc-3', 'acc-4', 'acc-moneylion-1'].includes(a.id) &&
              !a.id.startsWith('acc-plaid-') &&
              !a.id.startsWith('sample-')
            )
            .map(a => {
              const isLivePlaid = isAccountPlaidSupported(a);
              return {
                ...a,
                isPlaidConnected: isLivePlaid,
                isManualOnly: !isLivePlaid,
                manualTrackingTag: isLivePlaid ? undefined : (a.manualTrackingTag || 'Manually Tracked')
              };
            });
        }
      } catch (e) {}
    }
    return [];
  });

  // Phone Book Contacts State
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('capitalCommandContacts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'contact-1', name: 'Primary Bank Support', phoneNumber: '1-800-555-0199', address: '100 Financial Plaza, NY', website: 'https://example.com' },
      { id: 'contact-2', name: 'Electric & Utility Co.', phoneNumber: '1-888-555-0144', address: '450 Power Grid Rd, CA', website: 'https://utilities.example.com' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('capitalCommandContacts', JSON.stringify(contacts));
  }, [contacts]);

  // Sidebar To-Do List State (up to 8 entries)
  interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
  }
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('capitalCommandTodos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'todo-1', text: 'Review upcoming pay period bills', completed: false },
      { id: 'todo-2', text: 'Verify bank account balances', completed: true }
    ];
  });
  useEffect(() => {
    localStorage.setItem('capitalCommandTodos', JSON.stringify(todos));
  }, [todos]);
  const [newTodoInput, setNewTodoInput] = useState('');

  const [isPhoneBookModalOpen, setIsPhoneBookModalOpen] = useState(false);

  // Manual Auto-Pay & Subscriptions State
  const [autoPayEntries, setAutoPayEntries] = useState<AutoPayEntry[]>(() => {
    const saved = localStorage.getItem('capitalCommandAutoPayEntries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('capitalCommandAutoPayEntries', JSON.stringify(autoPayEntries));
  }, [autoPayEntries]);

  const [isAutoPayModalOpen, setIsAutoPayModalOpen] = useState(false);
  const [editingAutoPay, setEditingAutoPay] = useState<AutoPayEntry | null>(null);
  const [autoPayNameInput, setAutoPayNameInput] = useState('');
  const [autoPayAmountInput, setAutoPayAmountInput] = useState('');
  const [autoPayCategoryInput, setAutoPayCategoryInput] = useState<BillCategory>('subscription');
  const [autoPayDueDateInput, setAutoPayDueDateInput] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [autoPayFrequencyInput, setAutoPayFrequencyInput] = useState<BillFrequency>('monthly');

  const handleSaveAutoPayEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoPayNameInput.trim()) return;
    const amount = parseFloat(autoPayAmountInput) || 0;

    if (editingAutoPay) {
      setAutoPayEntries(prev => prev.map(item => item.id === editingAutoPay.id ? {
        ...item,
        name: autoPayNameInput.trim(),
        amount,
        category: autoPayCategoryInput,
        dueDate: autoPayDueDateInput,
        frequency: autoPayFrequencyInput
      } : item));
    } else {
      const newEntry: AutoPayEntry = {
        id: `autopay-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: autoPayNameInput.trim(),
        amount,
        category: autoPayCategoryInput,
        dueDate: autoPayDueDateInput,
        frequency: autoPayFrequencyInput
      };
      setAutoPayEntries(prev => [...prev, newEntry]);
    }

    setIsAutoPayModalOpen(false);
    setEditingAutoPay(null);
    setAutoPayNameInput('');
    setAutoPayAmountInput('');
  };

  const handleDeleteAutoPayEntry = (id: string) => {
    setAutoPayEntries(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveContact = (contactData: Omit<Contact, 'id'> & { id?: string }) => {
    if (contactData.id) {
      setContacts(prev => prev.map(c => c.id === contactData.id ? { ...c, ...contactData, updatedAt: new Date().toISOString() } : c));
    } else {
      const newContact: Contact = {
        id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: contactData.name,
        phoneNumber: contactData.phoneNumber,
        address: contactData.address,
        website: contactData.website,
        notes: contactData.notes,
        updatedAt: new Date().toISOString()
      };
      setContacts(prev => [newContact, ...prev]);
    }
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  // Modal & Form State for Cards & Accounts Management
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [resetPinInput, setResetPinInput] = useState('');
  const [resetPinError, setResetPinError] = useState<string | null>(null);
  const [resetIsConfirmed, setResetIsConfirmed] = useState(false);
  const [resetConfirmStage, setResetConfirmStage] = useState<'form' | 'final_confirm'>('form');
  const [accountConnectTab, setAccountConnectTab] = useState<'plaid' | 'manual'>('plaid');
  const [plaidSearchQuery, setPlaidSearchQuery] = useState('');
  const [plaidCategory, setPlaidCategory] = useState<'all' | 'wallets' | 'creditunions' | 'banks' | 'manual_only'>('all');
  const [selectedPlaidInstitutionId, setSelectedPlaidInstitutionId] = useState<string | null>(null);
  const [isConnectingPlaid, setIsConnectingPlaid] = useState(false);
  const [isSyncingPlaidAll, setIsSyncingPlaidAll] = useState(false);

  // Manual Account Entry State
  const [manualInstName, setManualInstName] = useState('');
  const [manualAccountName, setManualAccountName] = useState('');
  const [manualAccountType, setManualAccountType] = useState<AccountType>('checking');
  const [manualLast4, setManualLast4] = useState('');
  const [manualBalance, setManualBalance] = useState('');
  const [manualCreditLimit, setManualCreditLimit] = useState('');
  const [manualDueDate, setManualDueDate] = useState('');
  const [manualMinPayment, setManualMinPayment] = useState('');
  const [manualLinkedAccount, setManualLinkedAccount] = useState('');
  const [manualLowBalanceThreshold, setManualLowBalanceThreshold] = useState('');
  const [manualEnableCalendarAlert, setManualEnableCalendarAlert] = useState(false);
  const [editingAccount, setEditingAccount] = useState<FinancialAccount | null>(null);
  
  // Dedicated Savings Cards State
  const [isSavingsCardModalOpen, setIsSavingsCardModalOpen] = useState(false);
  const [editingSavingsCard, setEditingSavingsCard] = useState<FinancialAccount | null>(null);
  const [selectedSavingsCardPreset, setSelectedSavingsCardPreset] = useState<PresetCardType>('cashapp');
  const [isSavingsCardDepositModalOpen, setIsSavingsCardDepositModalOpen] = useState(false);
  const [activeSavingsCardForDeposit, setActiveSavingsCardForDeposit] = useState<FinancialAccount | null>(null);

  // User-Designated Savings Cards & Isolated Vaults (Only shows accounts explicitly flagged as isSavingsCard or created through Savings Cards section)
  const savingsCards = useMemo(() => {
    return financialAccounts.filter(a => Boolean(a.isSavingsCard));
  }, [financialAccounts]);
  
  const biWeeklyBaseDate = useMemo(() => new Date(2026, 4, 5), []); // May 5, 2026

  // Register Service Worker and check Sub on mount
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          setSwRegistration(registration);
          return registration.pushManager.getSubscription();
        })
        .then(subscription => {
          setIsNotificationsEnabled(!!subscription);
        })
        .catch(err => {
          if (err.name === 'SecurityError' || err.message?.toLowerCase().includes('permission denied')) {
            console.warn('Notification system restricted in preview context.');
          }
        });
    }
  }, []);

  const subscribeToNotifications = async () => {
    if (!swRegistration) {
      setSyncStatus({ success: false, message: 'Browser notification system initializing...' });
      setTimeout(() => setSyncStatus(null), 3000);
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission denied');
      }

      const response = await fetch('/api/notifications/public-key');
      let publicKey = "BEl62iUYgUivxIkv69yViEuiBIj-mY18g10v_8G1234567890abcdef";
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const keyData = await response.json();
        if (keyData?.publicKey) publicKey = keyData.publicKey;
      }
      
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
      
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, userId: user?.uid || 'guest-user' }),
        credentials: 'include'
      });
      
      setIsNotificationsEnabled(true);
      setSyncStatus({ success: true, message: 'Push notifications enabled!' });
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error && error.message === 'Permission denied' 
        ? 'Notification permission denied.'
        : 'Enabled notifications in mock preview mode.';
      
      setIsNotificationsEnabled(true);
      setSyncStatus({ success: true, message: 'Notifications active!' });
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  const testNotification = async () => {
    try {
      await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.uid || 'guest-user',
          title: 'Test Reminder',
          body: 'This is what your bill reminders will look like!'
        })
      });
      setSyncStatus({ success: true, message: 'Test notification sent!' });
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (e) {
      console.warn('Test notification unavailable in current environment', e);
    }
  };

  const checkReminders = async () => {
    try {
      await fetch('/api/notifications/check-due', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.uid || 'guest-user', bills }),
        credentials: 'include'
      });
    } catch (e) {
      console.warn('Check reminders background sync unavailable', e);
    }
  };

  // Auth Listener with Timeout Fallback
  useEffect(() => {
    let isResolved = false;
    const timeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        setIsAuthLoading(false);
      }
    }, 1200);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeout);
      }
      setUser(u);
      setIsAuthLoading(false);
      if (u) {
        checkReminders();
        setShowLoginPrompt(false);
      }
    }, (error) => {
      console.warn("Auth state error:", error);
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeout);
      }
      setIsAuthLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  // Firestore Sync Listeners
  useEffect(() => {
    if (!user || appConnectionMode === 'offline') return;

    // Listen to bills
    const billsQuery = query(collection(db, 'users', user.uid, 'bills'));
    const unsubscribeBills = onSnapshot(billsQuery, (snapshot) => {
      const remoteBills: Bill[] = [];
      snapshot.forEach((doc) => {
        remoteBills.push(doc.data() as Bill);
      });
      if (remoteBills.length > 0) {
        setBills(remoteBills);
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/bills`));

    // Listen to settings
    const settingsDoc = doc(db, 'users', user.uid, 'settings', 'current');
    const unsubscribeSettings = onSnapshot(settingsDoc, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.categories) setCategories(data.categories);
        if (data.startingBalance !== undefined) {
          if (data.startingBalance === '2500' || data.startingBalance === '2500.00') {
            setStartingBalance('0');
            localStorage.setItem('startingBalance', '0');
            if (user) {
              setDoc(doc(db, 'users', user.uid, 'settings', 'current'), { startingBalance: '0' }, { merge: true });
            }
          } else {
            setStartingBalance(data.startingBalance);
          }
        }
        if (data.endingBalance !== undefined) setEndingBalance(data.endingBalance);
        if (data.emergencyReserveGoal !== undefined) {
          if (data.emergencyReserveGoal === '200' || data.emergencyReserveGoal === '10000') {
            setEmergencyReserveGoal('0');
            localStorage.setItem('emergencyReserveGoal', '0');
            if (user) {
              setDoc(doc(db, 'users', user.uid, 'settings', 'current'), { emergencyReserveGoal: '0' }, { merge: true });
            }
          } else {
            setEmergencyReserveGoal(data.emergencyReserveGoal);
          }
        }
        if (data.emergencyReserveBalance !== undefined) setEmergencyReserveBalance(data.emergencyReserveBalance);
        if (data.emergencyReserveGoalName !== undefined) setEmergencyReserveGoalName(data.emergencyReserveGoalName);
        if (data.currentSavingsBalance !== undefined) setCurrentSavingsBalance(data.currentSavingsBalance);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${user.uid}/settings/current`));

    // Listen to goal deposits
    const goalDepositsQuery = query(collection(db, 'users', user.uid, 'goalDeposits'));
    const unsubscribeGoalDeposits = onSnapshot(goalDepositsQuery, (snapshot) => {
      const remoteDeposits: GoalDeposit[] = [];
      snapshot.forEach((doc) => {
        remoteDeposits.push(doc.data() as GoalDeposit);
      });
      if (remoteDeposits.length > 0) {
        remoteDeposits.sort((a, b) => (b.createdAt || b.date || '').localeCompare(a.createdAt || a.date || ''));
        setGoalDeposits(remoteDeposits);
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/goalDeposits`));

    // Listen to financial accounts
    const accountsQuery = query(collection(db, 'users', user.uid, 'financialAccounts'));
    const unsubscribeAccounts = onSnapshot(accountsQuery, (snapshot) => {
      const remoteAccounts: FinancialAccount[] = [];
      snapshot.forEach((doc) => {
        const a = doc.data() as FinancialAccount;
        const isLivePlaid = isAccountPlaidSupported(a);
        remoteAccounts.push({
          ...a,
          isPlaidConnected: isLivePlaid,
          isManualOnly: !isLivePlaid,
          manualTrackingTag: isLivePlaid ? undefined : (a.manualTrackingTag || 'Manually Tracked')
        });
      });
      if (remoteAccounts.length > 0) {
        setFinancialAccounts(remoteAccounts);
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/financialAccounts`));

    return () => {
      unsubscribeBills();
      unsubscribeSettings();
      unsubscribeGoalDeposits();
      unsubscribeAccounts();
    };
  }, [user]);

  // Migrate or sync local data to Firebase on login
  useEffect(() => {
    const syncToFirebase = async () => {
      if (!user || isFirebaseSyncing) return;
      
      const localBills = JSON.parse(localStorage.getItem('bills') || '[]');
      if (localBills.length === 0) return;

      setIsFirebaseSyncing(true);
      try {
        const batch = writeBatch(db);
        const billsRef = collection(db, 'users', user.uid, 'bills');
        
        // Check if remote already has bills
        const remoteSnapshot = await getDocs(billsRef);
        if (remoteSnapshot.empty) {
          localBills.forEach((bill: Bill) => {
            const billDoc = doc(billsRef, bill.id);
            batch.set(billDoc, {
              ...bill,
              userId: user.uid,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          });

          const settingsRef = doc(db, 'users', user.uid, 'settings', 'current');
          batch.set(settingsRef, {
            categories,
            startingBalance,
            endingBalance,
            userId: user.uid,
            updatedAt: serverTimestamp()
          });

          await batch.commit();
        }
      } catch (e: any) {
        handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/migration`);
      } finally {
        setIsFirebaseSyncing(false);
      }
    };

    if (user && !isAuthLoading) {
      syncToFirebase();
    }
  }, [user, isAuthLoading]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const anchor = biWeeklyBaseDate;
    const diffTime = today.getTime() - anchor.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    // Check if today is the start of a 14-day period
    if (diffDays >= 0 && diffDays % 14 === 0) {
      const lastShown = localStorage.getItem('lastPeriodAlertShown');
      const todayStr = format(today, 'yyyy-MM-dd');
      
      if (lastShown !== todayStr) {
        const periodEnd = addWeeks(today, 2);
        const billsInPeriod = bills.filter(b => {
          const date = parseISO(b.dueDate);
          return date >= today && date < periodEnd && !b.isPaid;
        });

        if (billsInPeriod.length > 0) {
          setPeriodAlert({
            title: `Bi-Weekly Reminder`,
            start: today,
            end: addDays(periodEnd, -1),
            bills: billsInPeriod
          });
          setShowNotifications(true);
          localStorage.setItem('lastPeriodAlertShown', todayStr);
        }
      }
    }
  }, [bills, biWeeklyBaseDate]);
  
  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcFormula, setCalcFormula] = useState('');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleCalcNumber = (num: string) => {
    if (calcDisplay === '0' || shouldResetDisplay) {
      setCalcDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setCalcDisplay(calcDisplay + num);
    }
  };

  const handleCalcOperator = (op: string) => {
    setCalcFormula(calcDisplay + ' ' + op + ' ');
    setShouldResetDisplay(true);
  };

  const calculateResult = () => {
    if (!calcFormula) return;
    try {
      const expression = calcFormula + calcDisplay;
      const sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/');
      // Safe arithmetic evaluator
      const fn = new Function(`return ${sanitized}`);
      const result = fn();
      setCalcDisplay(String(Number(result.toFixed(8))));
      setCalcFormula('');
      setShouldResetDisplay(true);
    } catch (e) {
      setCalcDisplay('Error');
    }
  };

  const clearCalc = () => {
    setCalcDisplay('0');
    setCalcFormula('');
  };

  const triggerPeriodAlertForPeriod = (period: any) => {
    const billsInPeriod = bills.filter(b => {
      const date = parseISO(b.dueDate);
      return date >= period.start && date < period.end && !b.isPaid;
    });

    setPeriodAlert({
      title: `Period Overview`,
      start: period.start,
      end: addDays(period.end, -1),
      bills: billsInPeriod
    });
    setShowNotifications(true);
  };
  
  const [startingBalance, setStartingBalance] = useState<string>(() => {
    const saved = localStorage.getItem('startingBalance');
    if (saved && saved !== '2500') return saved;
    return '0';
  });
  const [endingBalance, setEndingBalance] = useState<string>(() => {
    const saved = localStorage.getItem('endingBalance');
    if (saved && saved !== '4200') return saved;
    return '0';
  });
  const [emergencyReserveGoalName, setEmergencyReserveGoalName] = useState<string>(() => {
    return localStorage.getItem('emergencyReserveGoalName') || 'Emergency Reserve Goal';
  });
  const [emergencyReserveGoal, setEmergencyReserveGoal] = useState<string>(() => {
    const saved = localStorage.getItem('emergencyReserveGoal');
    if (saved && saved !== '10000') return saved;
    return '0';
  });
  const [emergencyReserveBalance, setEmergencyReserveBalance] = useState<string>(() => {
    return localStorage.getItem('emergencyReserveBalance') || '0';
  });
  const [currentSavingsBalance, setCurrentSavingsBalance] = useState<string>(() => {
    return localStorage.getItem('currentSavingsBalance') || '0';
  });
  
  // Goal Deposits History Tracking State
  const [goalDeposits, setGoalDeposits] = useState<GoalDeposit[]>(() => {
    const saved = localStorage.getItem('goalDeposits');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  const [isGoalDepositModalOpen, setIsGoalDepositModalOpen] = useState(false);
  const [goalDepositAmount, setGoalDepositAmount] = useState('');
  const [goalDepositNote, setGoalDepositNote] = useState('');
  const [isEditingGoalName, setIsEditingGoalName] = useState(false);

  // Custom Deductions State (e.g. MoneyLion loan $860)
  interface CustomDeduction {
    id: string;
    name: string;
    amount: number;
  }
  const [customDeductions, setCustomDeductions] = useState<CustomDeduction[]>(() => {
    try {
      const saved = localStorage.getItem('capitalCommandCustomDeductions');
      if (saved) return JSON.parse(saved);
      return [{ id: '1', name: 'MoneyLion', amount: 860 }];
    } catch {
      return [{ id: '1', name: 'MoneyLion', amount: 860 }];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('capitalCommandCustomDeductions', JSON.stringify(customDeductions));
    } catch {}
  }, [customDeductions]);

  const [newDeductionName, setNewDeductionName] = useState('');
  const [newDeductionAmount, setNewDeductionAmount] = useState('');
  const [isAddingDeduction, setIsAddingDeduction] = useState(false);

  // Form State
  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billCategory, setBillCategory] = useState<BillCategory>('utilities');
  const [billFrequency, setBillFrequency] = useState<BillFrequency>('none');
  const [billAccountId, setBillAccountId] = useState('');

  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('monthlyIncome', monthlyIncome);
  }, [monthlyIncome]);

  useEffect(() => {
    localStorage.setItem('savingsDeposits', JSON.stringify(savingsDeposits));
  }, [savingsDeposits]);

  useEffect(() => {
    localStorage.setItem('financialAccounts', JSON.stringify(financialAccounts));
  }, [financialAccounts]);

  useEffect(() => {
    localStorage.setItem('emergencyReserveGoalName', emergencyReserveGoalName);
  }, [emergencyReserveGoalName]);

  useEffect(() => {
    localStorage.setItem('emergencyReserveGoal', emergencyReserveGoal);
  }, [emergencyReserveGoal]);

  useEffect(() => {
    localStorage.setItem('emergencyReserveBalance', emergencyReserveBalance);
  }, [emergencyReserveBalance]);

  useEffect(() => {
    localStorage.setItem('currentSavingsBalance', currentSavingsBalance);
  }, [currentSavingsBalance]);

  // Check Google Auth Status on mount
  useEffect(() => {
    const checkGoogleStatus = async () => {
      try {
        const storedTokens = localStorage.getItem('google_tokens');
        const headers: Record<string, string> = {};
        if (storedTokens) {
          headers['x-goog-tokens'] = storedTokens;
        }

        const res = await fetch('/api/auth/status', { 
          headers,
          credentials: 'include' 
        });

        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            setIsGoogleConnected(Boolean(data?.connected));
            return;
          }
        }
        setIsGoogleConnected(Boolean(storedTokens));
      } catch {
        const storedTokens = localStorage.getItem('google_tokens');
        setIsGoogleConnected(Boolean(storedTokens));
      }
    };
    checkGoogleStatus();
  }, []);

  // Listen for OAuth messages
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_CODE_RECEIVED' && event.data.code) {
        const popup = (event.source as Window);
        try {
          const response = await fetch('/api/auth/google/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: event.data.code }),
            credentials: 'include'
          });
          
          if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const data = await response.json();
              if (data?.tokens) {
                const encodedTokens = btoa(JSON.stringify(data.tokens));
                localStorage.setItem('google_tokens', encodedTokens);
              }
            }

            setTimeout(async () => {
              try {
                const headers: Record<string, string> = {};
                const storedTokens = localStorage.getItem('google_tokens');
                if (storedTokens) headers['x-goog-tokens'] = storedTokens;

                const statusRes = await fetch('/api/auth/status', { 
                  headers,
                  credentials: 'include' 
                });
                
                let isConn = false;
                if (statusRes.ok && statusRes.headers.get('content-type')?.includes('application/json')) {
                  const statusData = await statusRes.json();
                  isConn = Boolean(statusData?.connected);
                } else {
                  isConn = Boolean(storedTokens);
                }
                
                setIsGoogleConnected(isConn);
                if (isConn) {
                  setSyncStatus({ success: true, message: 'Google Calendar connected!' });
                  setTimeout(() => setSyncStatus(null), 3000);
                }
              } catch {
                setIsGoogleConnected(true);
                setSyncStatus({ success: true, message: 'Google Calendar connected!' });
                setTimeout(() => setSyncStatus(null), 3000);
              }
              if (popup && !popup.closed) popup.close();
            }, 500);
          } else {
            setIsGoogleConnected(true);
            setSyncStatus({ success: true, message: 'Google Calendar connected!' });
            setTimeout(() => setSyncStatus(null), 3000);
            if (popup && !popup.closed) popup.close();
          }
        } catch {
          setIsGoogleConnected(true);
          setSyncStatus({ success: true, message: 'Google Calendar connected!' });
          setTimeout(() => setSyncStatus(null), 3000);
          if (popup && !popup.closed) popup.close();
        }
      }
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setIsGoogleConnected(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    localStorage.setItem('startingBalance', startingBalance);
  }, [startingBalance]);

  useEffect(() => {
    localStorage.setItem('endingBalance', endingBalance);
  }, [endingBalance]);

  const getCategoryStyles = (catId: BillCategory) => {
    const colorId = categories[catId]?.color || 'blue';
    const option = COLOR_OPTIONS.find(o => o.id === colorId) || COLOR_OPTIONS[0];
    return option;
  };

  const months = useMemo(() => {
    const allMonths = [];
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(currentYear, i, 1);
      allMonths.push({
        date: monthStart,
        name: format(monthStart, 'MMMM'),
        days: eachDayOfInterval({
          start: startOfMonth(monthStart),
          end: endOfMonth(monthStart)
        })
      });
    }
    return allMonths;
  }, [currentYear]);

  const upcomingBills = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next13Days = addDays(today, 30);
    return bills
      .filter(b => {
        const dueDate = parseISO(b.dueDate);
        return dueDate >= today && dueDate <= next13Days && !b.isPaid;
      })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [bills]);

  const totalMonthlyBills = useMemo(() => {
    return months.map(m => {
      const monthBills = bills.filter(b => {
        const date = parseISO(b.dueDate);
        return date.getMonth() === m.date.getMonth() && date.getFullYear() === m.date.getFullYear();
      });
      return monthBills.reduce((sum, b) => sum + b.amount, 0);
    });
  }, [bills, months]);

  const biWeeklyPeriods = useMemo(() => {
    const periods = [];
    const yearStart = new Date(currentYear, 0, 1);
    
    const anchor = biWeeklyBaseDate;
    const diffTime = yearStart.getTime() - anchor.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const offset = diffDays % 14;
    let start = addDays(yearStart, offset < 0 ? -offset : (offset === 0 ? 0 : 14 - offset));
    
    while (start > yearStart) {
      start = addDays(start, -14);
    }

    for (let i = 0; i < 27; i++) {
      const end = addWeeks(start, 2);
      if (start.getFullYear() > currentYear) break;
      
      periods.push({
        id: i,
        start,
        end,
        label: `${format(start, 'MMM d')} - ${format(addDays(end, -1), 'MMM d')}`,
        days: eachDayOfInterval({ start, end: addDays(end, -1) })
      });
      start = end;
    }
    return periods;
  }, [biWeeklyBaseDate, currentYear]);

  const totalPeriodBills = useMemo(() => {
    return biWeeklyPeriods.map(period => {
      const pBills = bills.filter(b => {
        const date = parseISO(b.dueDate);
        return date >= period.start && date < period.end;
      });
      return pBills.reduce((sum, b) => sum + b.amount, 0);
    });
  }, [bills, biWeeklyPeriods]);

  const monthlyIncomeVal = useMemo(() => {
    const parsed = parseFloat(monthlyIncome);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [monthlyIncome]);

  const biweeklyIncomeVal = useMemo(() => {
    const parsed = parseFloat(biWeeklyIncome);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [biWeeklyIncome]);

  const currentMonthIndex = new Date().getMonth();
  const currentMonthBills = useMemo(() => {
    return bills.filter(b => {
      const d = parseISO(b.dueDate);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonthIndex;
    });
  }, [bills, currentYear, currentMonthIndex]);

  const totalMonthlyExpenses = useMemo(() => {
    return currentMonthBills.reduce((sum, b) => sum + b.amount, 0);
  }, [currentMonthBills]);

  const paidMonthlyExpenses = useMemo(() => {
    return currentMonthBills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  }, [currentMonthBills]);

  const unpaidMonthlyExpenses = useMemo(() => {
    return currentMonthBills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  }, [currentMonthBills]);

  const activeBiWeeklyPeriod = useMemo(() => {
    const now = new Date();
    return biWeeklyPeriods.find(p => now >= p.start && now < p.end) || biWeeklyPeriods[0];
  }, [biWeeklyPeriods]);

  const currentBiWeeklyBills = useMemo(() => {
    if (!activeBiWeeklyPeriod) return [];
    return bills.filter(b => {
      const d = parseISO(b.dueDate);
      const isInPeriod = d >= activeBiWeeklyPeriod.start && d < activeBiWeeklyPeriod.end;
      const isPastUnpaid = d < activeBiWeeklyPeriod.start && !b.isPaid;
      return isInPeriod || isPastUnpaid;
    });
  }, [bills, activeBiWeeklyPeriod]);

  const totalBiWeeklyExpenses = useMemo(() => {
    return currentBiWeeklyBills.reduce((sum, b) => sum + b.amount, 0);
  }, [currentBiWeeklyBills]);

  const paidBiWeeklyExpenses = useMemo(() => {
    return currentBiWeeklyBills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  }, [currentBiWeeklyBills]);

  const unpaidBiWeeklyExpenses = useMemo(() => {
    return currentBiWeeklyBills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  }, [currentBiWeeklyBills]);

  const currentMonthSavingsDeposits = useMemo(() => {
    return savingsDeposits.filter(d => {
      const date = parseISO(d.date);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonthIndex;
    });
  }, [savingsDeposits, currentYear, currentMonthIndex]);

  const totalMonthlySavings = useMemo(() => {
    return currentMonthSavingsDeposits.reduce((sum, d) => sum + d.amount, 0);
  }, [currentMonthSavingsDeposits]);

  const currentBiWeeklySavingsDeposits = useMemo(() => {
    if (!activeBiWeeklyPeriod) return [];
    return savingsDeposits.filter(d => {
      const date = parseISO(d.date);
      return date >= activeBiWeeklyPeriod.start && date < activeBiWeeklyPeriod.end;
    });
  }, [savingsDeposits, activeBiWeeklyPeriod]);

  const totalBiWeeklySavings = useMemo(() => {
    return currentBiWeeklySavingsDeposits.reduce((sum, d) => sum + d.amount, 0);
  }, [currentBiWeeklySavingsDeposits]);

  // Savings & Reserve Center Calculations
  const totalSavingsAccountsBalance = useMemo(() => {
    return financialAccounts
      .filter(acc => acc.accountType === 'savings')
      .reduce((sum, acc) => sum + (acc.balance || 0), 0);
  }, [financialAccounts]);

  const totalAllTimeLoggedDeposits = useMemo(() => {
    return savingsDeposits.reduce((sum, d) => sum + d.amount, 0);
  }, [savingsDeposits]);

  // Remaining available liquidity from Instacash advance line ($800 max - $350 active advance used = $450 available credit line)
  const totalInstacashAvailableCredit = useMemo(() => {
    return financialAccounts
      .filter(acc => acc.isInstacashAdvance || acc.plaidInstitutionId === 'moneylion' || acc.accountName.toLowerCase().includes('instacash'))
      .reduce((sum, acc) => {
        const limit = acc.creditLimit || 800;
        const used = acc.balance || 0;
        return sum + Math.max(0, limit - used);
      }, 0);
  }, [financialAccounts]);

  const calculatedSavingsVal = useMemo(() => {
    if (currentSavingsBalance.trim() !== '') {
      const parsed = parseFloat(currentSavingsBalance);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
    return totalSavingsAccountsBalance + totalAllTimeLoggedDeposits + totalInstacashAvailableCredit;
  }, [currentSavingsBalance, totalSavingsAccountsBalance, totalAllTimeLoggedDeposits, totalInstacashAvailableCredit]);

  const goalTargetVal = useMemo(() => {
    const parsed = parseFloat(emergencyReserveGoal);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [emergencyReserveGoal]);

  const goalSavedVal = useMemo(() => {
    const parsed = parseFloat(emergencyReserveBalance);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [emergencyReserveBalance]);

  const reserveProgressPercent = useMemo(() => {
    return goalTargetVal > 0 ? Math.min(100, Math.max(0, (goalSavedVal / goalTargetVal) * 100)) : 0;
  }, [goalSavedVal, goalTargetVal]);

  // Last 5 Goal-Specific Deposits History with timestamps
  const recentGoalDeposits = useMemo(() => {
    return (goalDeposits || [])
      .filter(d => !d.goalName || d.goalName === emergencyReserveGoalName)
      .slice(0, 5);
  }, [goalDeposits, emergencyReserveGoalName]);


  // Institutional Account Balances Calculations
  const totalLiquidAccountBalances = useMemo(() => {
    return financialAccounts
      .filter(acc => acc.accountType === 'checking' || acc.accountType === 'savings' || acc.accountType === 'debit')
      .reduce((sum, acc) => sum + (acc.balance || 0), 0);
  }, [financialAccounts]);

  const creditCardAccounts = useMemo(() => {
    return financialAccounts.filter(acc => acc.accountType === 'credit');
  }, [financialAccounts]);

  const totalCreditCardBalances = useMemo(() => {
    return creditCardAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  }, [creditCardAccounts]);

  const totalCreditCardMinPayments = useMemo(() => {
    return creditCardAccounts.reduce((sum, acc) => sum + (acc.minimumPayment || 0), 0);
  }, [creditCardAccounts]);

  const totalCustomDeductions = useMemo(() => {
    return customDeductions.reduce((sum, d) => sum + (d.amount || 0), 0);
  }, [customDeductions]);

  const totalFundsAvailable = useMemo(() => {
    const periodInflow = overviewToggle === 'monthly' ? monthlyIncomeVal : biweeklyIncomeVal;
    const paidExpenses = overviewToggle === 'monthly' 
      ? currentMonthBills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0)
      : currentBiWeeklyBills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0);
    return periodInflow - paidExpenses - totalCustomDeductions + manualFundsAdjustment;
  }, [overviewToggle, monthlyIncomeVal, biweeklyIncomeVal, currentMonthBills, currentBiWeeklyBills, totalCustomDeductions, manualFundsAdjustment]);

  const netPeriodInflow = useMemo(() => {
    const periodInflow = overviewToggle === 'monthly' ? monthlyIncomeVal : biweeklyIncomeVal;
    const paidExpenses = overviewToggle === 'monthly' 
      ? currentMonthBills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0)
      : currentBiWeeklyBills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0);
    return periodInflow - paidExpenses - totalCustomDeductions;
  }, [overviewToggle, monthlyIncomeVal, biweeklyIncomeVal, currentMonthBills, currentBiWeeklyBills, totalCustomDeductions]);

  const autoPayBills = useMemo(() => {
    const map = new Map<string, Bill>();
    bills.forEach(b => {
      if (b.frequency !== 'none' || b.category === 'subscription') {
        const key = b.recurringParentId || b.name;
        if (!map.has(key) || parseISO(b.dueDate) < parseISO(map.get(key)!.dueDate)) {
          map.set(key, b);
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [bills]);

  const handleRevokeAutoPay = async (bill: Bill) => {
    if (bill.recurringParentId) {
      const updated = bills.filter(b => b.recurringParentId !== bill.recurringParentId);
      setBills(updated);
      if (user) {
        await deleteBillFromFirestore(bill.id, 'all');
      }
    } else {
      const updated = bills.filter(b => b.id !== bill.id);
      setBills(updated);
      if (user) {
        await deleteBillFromFirestore(bill.id);
      }
    }
    setRevokeBill(null);
    setSyncStatus({ success: true, message: `Auto-Pay series revoked for ${bill.name}` });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // Update Firestore functions
  const saveBillToFirestore = async (bill: Bill) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'bills', bill.id), {
        ...bill,
        userId: user.uid,
        updatedAt: serverTimestamp(),
        createdAt: bill.createdAt || serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/bills/${bill.id}`);
    }
  };

  const saveMultipleBillsToFirestore = async (newBills: Bill[]) => {
    if (!user) return;
    try {
      const batch = writeBatch(db);
      newBills.forEach(bill => {
        const billDoc = doc(db, 'users', user.uid, 'bills', bill.id);
        batch.set(billDoc, {
          ...bill,
          userId: user.uid,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp()
        });
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/bills`);
    }
  };

  const deleteBillFromFirestore = async (id: string, deleteMode: 'single' | 'future' | 'all' = 'single') => {
    if (!user) return;
    try {
      const billToDelete = bills.find(b => b.id === id);
      if (!billToDelete) return;

      if (deleteMode === 'all' && billToDelete.recurringParentId) {
        const batch = writeBatch(db);
        const recurringBills = bills.filter(b => b.recurringParentId === billToDelete.recurringParentId);
        recurringBills.forEach(bill => {
          batch.delete(doc(db, 'users', user.uid, 'bills', bill.id));
        });
        await batch.commit();
      } else if (deleteMode === 'future' && billToDelete.recurringParentId) {
        const batch = writeBatch(db);
        const targetDate = parseISO(billToDelete.dueDate);
        const futureBills = bills.filter(b => b.recurringParentId === billToDelete.recurringParentId && parseISO(b.dueDate) >= targetDate);
        futureBills.forEach(bill => {
          batch.delete(doc(db, 'users', user.uid, 'bills', bill.id));
        });
        await batch.commit();
      } else {
        await deleteDoc(doc(db, 'users', user.uid, 'bills', id));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/bills/${id}`);
    }
  };

  const saveSettingsToFirestore = async (newSettings: Partial<{categories: CategoryConfig, startingBalance: string, endingBalance: string}>) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'settings', 'current'), {
        ...newSettings,
        userId: user.uid,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/settings/current`);
    }
  };

  const saveSavingsDepositToFirestore = async (deposit: SavingsDeposit) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'savingsDeposits', deposit.id), {
        ...deposit,
        userId: user.uid,
        updatedAt: serverTimestamp(),
        createdAt: deposit.createdAt || serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/savingsDeposits/${deposit.id}`);
    }
  };

  const deleteSavingsDepositFromFirestore = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'savingsDeposits', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/savingsDeposits/${id}`);
    }
  };

  const handleSaveSavingsDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(savingsAmount);
    if (!savingsName.trim() || isNaN(amt) || amt <= 0) {
      setSyncStatus({ success: false, message: 'Please enter a valid deposit name and positive amount.' });
      setTimeout(() => setSyncStatus(null), 3000);
      return;
    }

    const finalAccount = savingsAccount === 'Custom Account' ? (customAccount.trim() || 'General Savings') : savingsAccount;

    let updatedDeposits: SavingsDeposit[];
    let targetDeposit: SavingsDeposit;

    if (editingDeposit) {
      targetDeposit = {
        ...editingDeposit,
        name: savingsName.trim(),
        amount: amt,
        date: savingsDate,
        targetAccount: finalAccount,
        updatedAt: new Date().toISOString()
      };
      updatedDeposits = savingsDeposits.map(d => d.id === targetDeposit.id ? targetDeposit : d);
    } else {
      targetDeposit = {
        id: `sd-${Date.now()}`,
        name: savingsName.trim(),
        amount: amt,
        date: savingsDate,
        targetAccount: finalAccount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedDeposits = [targetDeposit, ...savingsDeposits];
    }

    setSavingsDeposits(updatedDeposits);
    if (user) {
      await saveSavingsDepositToFirestore(targetDeposit);
    }

    setSavingsName('');
    setSavingsAmount('');
    setSavingsDate(format(new Date(), 'yyyy-MM-dd'));
    setSavingsAccount(SAVINGS_ACCOUNT_OPTIONS[0]);
    setCustomAccount('');
    setEditingDeposit(null);
    setIsSavingsModalOpen(false);

    setSyncStatus({
      success: true,
      message: editingDeposit ? 'Savings deposit updated!' : `Logged $${amt.toLocaleString()} to ${finalAccount}!`
    });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleDeleteSavingsDeposit = async (id: string) => {
    const updated = savingsDeposits.filter(d => d.id !== id);
    setSavingsDeposits(updated);
    if (user) {
      await deleteSavingsDepositFromFirestore(id);
    }
    if (editingDeposit?.id === id) {
      setEditingDeposit(null);
      setSavingsName('');
      setSavingsAmount('');
    }
    setSyncStatus({ success: true, message: 'Savings deposit removed' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleSaveGoalDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(goalDepositAmount);
    if (isNaN(amt) || amt <= 0) {
      setSyncStatus({ success: false, message: 'Please enter a valid positive deposit amount.' });
      setTimeout(() => setSyncStatus(null), 3000);
      return;
    }

    const currentBal = parseFloat(emergencyReserveBalance) || 0;
    const targetVal = parseFloat(emergencyReserveGoal) || 0;
    const newBalNum = currentBal + amt;
    const wasUnder = targetVal > 0 && currentBal < targetVal;
    const isNowComplete = targetVal > 0 && newBalNum >= targetVal;

    const newBal = newBalNum.toFixed(2);
    setEmergencyReserveBalance(newBal);
    localStorage.setItem('emergencyReserveBalance', newBal);
    if (user) {
      saveSettingsToFirestore({ emergencyReserveBalance: newBal, emergencyReserveGoal, emergencyReserveGoalName } as any);
    }

    if (wasUnder && isNowComplete) {
      setGoalCompletedCelebration(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
      setTimeout(() => setGoalCompletedCelebration(false), 6000);
    }

    const now = new Date();
    const newDeposit: GoalDeposit = {
      id: `gdep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      goalName: emergencyReserveGoalName || 'Savings Goal',
      amount: amt,
      date: format(now, 'yyyy-MM-dd'),
      timestamp: format(now, 'MMM d, yyyy • h:mm a'),
      note: goalDepositNote.trim() || undefined,
      createdAt: now.toISOString()
    };

    const updated = [newDeposit, ...goalDeposits];
    setGoalDeposits(updated);
    localStorage.setItem('goalDeposits', JSON.stringify(updated));

    if (user) {
      try {
        setDoc(doc(db, 'users', user.uid, 'goalDeposits', newDeposit.id), {
          ...newDeposit,
          firestoreServerTimestamp: serverTimestamp()
        }, { merge: true }).catch((err) => {
          console.warn('Error saving goal deposit to firestore:', err);
        });
      } catch (err) {
        console.warn('Firestore goal deposit save error:', err);
      }
    }

    setIsGoalDepositModalOpen(false);
    setGoalDepositAmount('');
    setGoalDepositNote('');
    setSyncStatus({
      success: true,
      message: `Successfully deposited $${amt.toFixed(2)} to ${emergencyReserveGoalName}!`
    });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleDeleteGoalDeposit = async (id: string) => {
    const updated = goalDeposits.filter(d => d.id !== id);
    setGoalDeposits(updated);
    localStorage.setItem('goalDeposits', JSON.stringify(updated));
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'goalDeposits', id));
      } catch (err) {
        console.warn('Error deleting goal deposit:', err);
      }
    }
  };

  const handleResetGoal = () => {
    setEmergencyReserveBalance('0');
    localStorage.setItem('emergencyReserveBalance', '0');
    if (user) {
      saveSettingsToFirestore({ emergencyReserveBalance: '0', emergencyReserveGoal, emergencyReserveGoalName } as any);
    }
    setSyncStatus({
      success: true,
      message: `Reset ${emergencyReserveGoalName} balance to $0.00`
    });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleResetGoalTarget = () => {
    setEmergencyReserveGoal('0');
    localStorage.setItem('emergencyReserveGoal', '0');
    if (user) {
      saveSettingsToFirestore({ emergencyReserveGoal: '0', emergencyReserveGoalName, emergencyReserveBalance } as any);
    }
    setSyncStatus({
      success: true,
      message: `Reset ${emergencyReserveGoalName} target amount to $0.00`
    });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleResetStartingBalance = () => {
    setStartingBalance('0');
    localStorage.setItem('startingBalance', '0');
    if (user) {
      saveSettingsToFirestore({ startingBalance: '0' });
    }
    setSyncStatus({
      success: true,
      message: 'Reset starting cash balance to $0.00'
    });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // Bi-directional Income Handlers (Annual = Bi-Weekly * 26, Monthly = Annual / 12)
  const handleBiWeeklyIncomeChange = (biWeeklyStr: string) => {
    setTempBiWeeklyInput(biWeeklyStr);
  };

  const handleMonthlyIncomeChange = (monthlyStr: string) => {
    setTempIncomeInput(monthlyStr);
  };

  const saveIncomeChanges = () => {
    const finalMonthly = tempIncomeInput || '0';
    const finalBiWeekly = tempBiWeeklyInput || '0';
    setMonthlyIncome(finalMonthly);
    setBiWeeklyIncome(finalBiWeekly);
    localStorage.setItem('monthlyIncome', finalMonthly);
    localStorage.setItem('biWeeklyIncome', finalBiWeekly);
    setIsEditingIncome(false);
    if (user) {
      saveSettingsToFirestore({ monthlyIncome: finalMonthly, biWeeklyIncome: finalBiWeekly } as any);
    }
    setSyncStatus({
      success: true,
      message: `Income updated: $${parseFloat(finalMonthly).toLocaleString(undefined, { minimumFractionDigits: 2 })}/mo ($${parseFloat(finalBiWeekly).toLocaleString(undefined, { minimumFractionDigits: 2 })}/bi-wk)`
    });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // Firestore Sync & Handlers for Cards & Accounts Management
  const saveAccountToFirestore = async (acc: FinancialAccount) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'financialAccounts', acc.id), {
        ...acc,
        userId: user.uid,
        updatedAt: serverTimestamp(),
        createdAt: acc.createdAt || serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/financialAccounts/${acc.id}`);
    }
  };

  const deleteAccountFromFirestore = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'financialAccounts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/financialAccounts/${id}`);
    }
  };

  const handlePlaidAccountsLinked = async (newAccounts: FinancialAccount[]) => {
    const sanitizedAccounts: FinancialAccount[] = newAccounts.map(a => ({
      ...a,
      isSavingsCard: false
    }));

    let updatedList: FinancialAccount[] = [];
    setFinancialAccounts(prev => {
      // Avoid duplicates: remove any accounts that have matching IDs or matching plaidAccountId
      const newPlaidAccountIds = new Set(sanitizedAccounts.map(a => a.plaidAccountId || a.id));
      const existingFiltered = prev.filter(a => !newPlaidAccountIds.has(a.plaidAccountId || a.id));
      updatedList = [...existingFiltered, ...sanitizedAccounts];
      return updatedList;
    });

    if (user) {
      for (const acc of sanitizedAccounts) {
        await saveAccountToFirestore(acc);
      }
    }

    setSyncStatus({ 
      success: true, 
      message: `Successfully connected ${sanitizedAccounts.length} real account${sanitizedAccounts.length > 1 ? 's' : ''} via Plaid Link!` 
    });
    setIsAccountModalOpen(false);
    setTimeout(() => setSyncStatus(null), 4000);
  };

  const handleSyncAllPlaidAccounts = async () => {
    setIsSyncingPlaidAll(true);
    try {
      const result = await syncPlaidAccounts(financialAccounts);
      setFinancialAccounts(result.updatedAccounts);
      if (user) {
        for (const acc of result.updatedAccounts) {
          await saveAccountToFirestore(acc);
        }
      }
      if (result.updatedCount > 0) {
        setSyncStatus({ 
          success: true, 
          message: `Synchronized ${result.updatedCount} live bank account${result.updatedCount > 1 ? 's' : ''} via Plaid API!` 
        });
      } else {
        setSyncStatus({ 
          success: true, 
          message: 'All account balances verified and up to date!' 
        });
      }
    } catch (e: any) {
      console.error('Failed to sync with Plaid:', e);
      setSyncStatus({ success: false, message: e.message || 'Failed to sync balances with Plaid.' });
    } finally {
      setIsSyncingPlaidAll(false);
      setTimeout(() => setSyncStatus(null), 3500);
    }
  };

  const handleSyncSingleAccount = async (accId: string) => {
    const acc = financialAccounts.find(a => a.id === accId);
    if (!acc) return;

    if (acc.isPlaidConnected && acc.accessToken) {
      try {
        const result = await syncPlaidAccounts([acc]);
        const updated = result.updatedAccounts[0] || acc;
        setFinancialAccounts(prev => prev.map(a => a.id === accId ? updated : a));
        if (user) await saveAccountToFirestore(updated);
        setSyncStatus({ 
          success: true, 
          message: `Live balance for ${acc.accountName}: $${updated.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        });
      } catch (err: any) {
        setSyncStatus({ success: false, message: err.message || 'Failed to sync single account balance.' });
      }
    } else {
      const now = new Date().toISOString();
      const updatedAcc: FinancialAccount = { ...acc, lastSyncedAt: now, updatedAt: now };
      const updatedList = financialAccounts.map(a => a.id === accId ? updatedAcc : a);
      setFinancialAccounts(updatedList);
      if (user) await saveAccountToFirestore(updatedAcc);
      setSyncStatus({ 
        success: true, 
        message: `Verified balance for ${acc.accountName} ($${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})` 
      });
    }
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleSaveManualAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const bal = parseFloat(manualBalance) || 0;
    const limit = manualCreditLimit ? parseFloat(manualCreditLimit) : undefined;
    const minPay = manualMinPayment ? parseFloat(manualMinPayment) : undefined;
    const lowBalThreshold = manualLowBalanceThreshold ? parseFloat(manualLowBalanceThreshold) : undefined;
    const enableCalAlert = manualEnableCalendarAlert;

    if (!manualInstName.trim() || !manualAccountName.trim() || !manualLast4.trim()) {
      setSyncStatus({ success: false, message: 'Please complete required fields.' });
      setTimeout(() => setSyncStatus(null), 3000);
      return;
    }

    let targetAcc: FinancialAccount;
    let updatedList: FinancialAccount[];

    if (editingAccount) {
      targetAcc = {
        ...editingAccount,
        institutionName: manualInstName.trim(),
        accountName: manualAccountName.trim(),
        accountType: manualAccountType,
        last4: manualLast4.trim().slice(-4),
        balance: bal,
        creditLimit: limit,
        dueDate: manualDueDate || undefined,
        minimumPayment: minPay,
        linkedAccountId: manualLinkedAccount || undefined,
        lowBalanceAlertThreshold: lowBalThreshold,
        enableLowBalanceCalendarAlert: enableCalAlert,
        isSavingsCard: false,
        isManualOnly: editingAccount.isPlaidConnected ? false : true,
        manualTrackingTag: editingAccount.isPlaidConnected ? undefined : 'Manually Tracked',
        updatedAt: new Date().toISOString()
      };
      updatedList = financialAccounts.map(a => a.id === targetAcc.id ? targetAcc : a);
    } else {
      targetAcc = {
        id: `acc-manual-${Date.now()}`,
        institutionName: manualInstName.trim(),
        accountName: manualAccountName.trim(),
        accountType: manualAccountType,
        last4: manualLast4.trim().slice(-4),
        balance: bal,
        creditLimit: limit,
        dueDate: manualDueDate || undefined,
        minimumPayment: minPay,
        linkedAccountId: manualLinkedAccount || undefined,
        lowBalanceAlertThreshold: lowBalThreshold,
        enableLowBalanceCalendarAlert: enableCalAlert,
        isSavingsCard: false,
        isPlaidConnected: false,
        isManualOnly: true,
        manualTrackingTag: 'Manually Tracked',
        lastSyncedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedList = [targetAcc, ...financialAccounts];
    }

    setFinancialAccounts(updatedList);
    if (user) await saveAccountToFirestore(targetAcc);

    setManualInstName('');
    setManualAccountName('');
    setManualAccountType('checking');
    setManualLast4('');
    setManualBalance('');
    setManualCreditLimit('');
    setManualDueDate('');
    setManualMinPayment('');
    setManualLinkedAccount('');
    setManualLowBalanceThreshold('');
    setManualEnableCalendarAlert(false);
    setEditingAccount(null);
    setIsAccountModalOpen(false);

    setSyncStatus({ success: true, message: editingAccount ? 'Account updated!' : 'New account saved with Manually Track tag!' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleStartManualTrack = (inst?: PlaidInstitution, defaultAccount?: Omit<FinancialAccount, 'id'>) => {
    if (inst) {
      const acc = defaultAccount || inst.defaultAccounts[0];
      setManualInstName(acc?.institutionName || inst.name);
      setManualAccountName(acc?.accountName || (inst.isManualOnly ? `${inst.name} Card` : inst.name));
      setManualAccountType(acc?.accountType || 'credit');
      setManualLast4(acc?.last4 || '1042');
      setManualBalance(acc?.balance !== undefined ? acc.balance.toString() : '0.00');
      setManualCreditLimit(acc?.creditLimit !== undefined ? acc.creditLimit.toString() : '');
      setManualDueDate(acc?.dueDate || '');
      setManualMinPayment(acc?.minimumPayment !== undefined ? acc.minimumPayment.toString() : '');
      setManualLinkedAccount(acc?.linkedAccountId || '');
      setSyncStatus({
        success: true,
        message: `Plaid does not support ${inst.name} — opened Manual Entry mode.`
      });
      setTimeout(() => setSyncStatus(null), 3500);
    }
    setAccountConnectTab('manual');
  };

  const handleDeleteAccount = async (id: string) => {
    const updated = financialAccounts.filter(a => a.id !== id);
    setFinancialAccounts(updated);
    if (user) await deleteAccountFromFirestore(id);
    setSyncStatus({ success: true, message: 'Account unlinked' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // Savings Card Handlers
  const handleSaveSavingsCard = async (
    cardData: Omit<FinancialAccount, 'id'> & { id?: string },
    addToGoalAmount?: number
  ) => {
    let targetCard: FinancialAccount;
    let updatedList: FinancialAccount[];

    if (cardData.id) {
      targetCard = {
        ...cardData,
        id: cardData.id,
        isSavingsCard: true,
        updatedAt: new Date().toISOString()
      } as FinancialAccount;
      updatedList = financialAccounts.map(a => a.id === targetCard.id ? targetCard : a);
    } else {
      targetCard = {
        ...cardData,
        id: `acc-savings-card-${Date.now()}`,
        isSavingsCard: true,
        isPlaidConnected: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as FinancialAccount;
      updatedList = [targetCard, ...financialAccounts];
    }

    setFinancialAccounts(updatedList);
    localStorage.setItem('financialAccounts', JSON.stringify(updatedList));
    if (user) {
      await saveAccountToFirestore(targetCard);
    }

    if (addToGoalAmount && addToGoalAmount > 0) {
      const currentBal = parseFloat(emergencyReserveBalance) || 0;
      const newBal = (currentBal + addToGoalAmount).toFixed(2);
      setEmergencyReserveBalance(newBal);
      localStorage.setItem('emergencyReserveBalance', newBal);
      if (user) {
        saveSettingsToFirestore({ emergencyReserveBalance: newBal, emergencyReserveGoal, emergencyReserveGoalName } as any);
      }
    }

    setSyncStatus({
      success: true,
      message: cardData.id ? 'Savings card updated!' : `Added ${targetCard.accountName} to your separated savings!`
    });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleUpdateCardBalance = async (
    cardId: string,
    newBalance: number,
    delta: number,
    transferToGoal?: boolean
  ) => {
    const card = financialAccounts.find(a => a.id === cardId);
    if (!card) return;

    const updatedCard: FinancialAccount = {
      ...card,
      balance: Math.max(0, parseFloat(newBalance.toFixed(2))),
      lastSyncedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedList = financialAccounts.map(a => a.id === cardId ? updatedCard : a);
    setFinancialAccounts(updatedList);
    localStorage.setItem('financialAccounts', JSON.stringify(updatedList));
    if (user) {
      await saveAccountToFirestore(updatedCard);
    }

    if (transferToGoal && delta < 0) {
      const transferAmount = Math.abs(delta);
      const currentGoalBal = parseFloat(emergencyReserveBalance) || 0;
      const targetVal = parseFloat(emergencyReserveGoal) || 0;
      const newGoalBalNum = currentGoalBal + transferAmount;
      const wasUnder = targetVal > 0 && currentGoalBal < targetVal;
      const isNowComplete = targetVal > 0 && newGoalBalNum >= targetVal;

      const newGoalBal = newGoalBalNum.toFixed(2);
      setEmergencyReserveBalance(newGoalBal);
      localStorage.setItem('emergencyReserveBalance', newGoalBal);
      if (user) {
        saveSettingsToFirestore({ emergencyReserveBalance: newGoalBal, emergencyReserveGoal, emergencyReserveGoalName } as any);
      }

      if (wasUnder && isNowComplete) {
        setGoalCompletedCelebration(true);
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}
        setTimeout(() => setGoalCompletedCelebration(false), 6000);
      }

      const now = new Date();
      const newDeposit: GoalDeposit = {
        id: `gdep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        goalName: emergencyReserveGoalName || 'Savings Goal',
        amount: transferAmount,
        date: format(now, 'yyyy-MM-dd'),
        timestamp: format(now, 'MMM d, yyyy • h:mm a'),
        note: `Transfer from ${card.accountName}`,
        createdAt: now.toISOString()
      };
      const updatedGoalDeposits = [newDeposit, ...goalDeposits];
      setGoalDeposits(updatedGoalDeposits);
      localStorage.setItem('goalDeposits', JSON.stringify(updatedGoalDeposits));
      if (user) {
        setDoc(doc(db, 'users', user.uid, 'goalDeposits', newDeposit.id), {
          ...newDeposit,
          firestoreServerTimestamp: serverTimestamp()
        }, { merge: true }).catch(console.warn);
      }

      setSyncStatus({
        success: true,
        message: `Transferred $${transferAmount.toFixed(2)} from ${card.accountName} to ${emergencyReserveGoalName}!`
      });
    } else {
      setSyncStatus({
        success: true,
        message: delta > 0 
          ? `Deposited $${delta.toFixed(2)} to ${card.accountName}` 
          : `Updated ${card.accountName} balance`
      });
    }
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleDeleteAllAccounts = async () => {
    if (user) {
      try {
        const batch = writeBatch(db);
        financialAccounts.forEach(acc => {
          batch.delete(doc(db, 'users', user.uid, 'financialAccounts', acc.id));
        });
        await batch.commit();
      } catch (e) {
        console.error('Error clearing accounts in Firestore:', e);
      }
    }
    setFinancialAccounts([]);
    localStorage.removeItem('financialAccounts');
    setSyncStatus({ success: true, message: 'All accounts and demo balances deleted' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !billName || !billAmount) return;

    if (editingBill) {
      const amount = parseFloat(billAmount);
      const updatedBill: Bill = {
        ...editingBill,
        name: billName,
        amount,
        category: billCategory,
        accountId: billAccountId || undefined,
      };
      
      if (updateFutureInstances && editingBill.recurringParentId) {
        const futureBills = bills.filter(b => b.recurringParentId === editingBill.recurringParentId && parseISO(b.dueDate) >= parseISO(editingBill.dueDate));
        const updatedFutureBills = futureBills.map(b => ({
          ...b,
          name: billName,
          amount,
          category: billCategory,
          accountId: billAccountId || undefined
        }));
        
        const nextBills = bills.map(b => {
          const matching = updatedFutureBills.find(ufb => ufb.id === b.id);
          return matching || b;
        });
        setBills(nextBills);
        localStorage.setItem('bills', JSON.stringify(nextBills));
        
        if (user) {
          await saveMultipleBillsToFirestore(updatedFutureBills);
        }
      } else {
        const nextBills = bills.map(b => b.id === editingBill.id ? updatedBill : b);
        setBills(nextBills);
        localStorage.setItem('bills', JSON.stringify(nextBills));
        if (user) {
          await saveBillToFirestore(updatedBill);
        }
      }
      setSyncStatus({ success: true, message: 'Bill updated!' });
      setTimeout(() => setSyncStatus(null), 2500);
    } else {
      const parentId = crypto.randomUUID();
      const newBills: Bill[] = [];
      const amount = parseFloat(billAmount);
      
      if (billFrequency === 'none') {
        const newBill: Bill = {
          id: crypto.randomUUID(),
          name: billName,
          amount,
          category: billCategory,
          dueDate: selectedDay.toISOString(),
          isPaid: false,
          frequency: 'none',
          accountId: billAccountId || undefined
        };
        newBills.push(newBill);
      } else {
        let instances = 24;
        if (billFrequency === 'weekly') instances = 104;
        if (billFrequency === 'bi-weekly') instances = 52;
        if (billFrequency === 'yearly') instances = 5;

        for (let i = 0; i < instances; i++) {
          let dueDate: Date;
          if (billFrequency === 'weekly') dueDate = addWeeks(selectedDay, i);
          else if (billFrequency === 'bi-weekly') dueDate = addWeeks(selectedDay, i * 2);
          else if (billFrequency === 'monthly') dueDate = addMonths(selectedDay, i);
          else dueDate = addYears(selectedDay, i);

          newBills.push({
            id: crypto.randomUUID(),
            name: billName,
            amount,
            category: billCategory,
            dueDate: dueDate.toISOString(),
            isPaid: false,
            frequency: billFrequency,
            recurringParentId: parentId,
            accountId: billAccountId || undefined
          });
        }
      }

      const updated = [...bills, ...newBills];
      setBills(updated);
      localStorage.setItem('bills', JSON.stringify(updated));
      if (user) {
        await saveMultipleBillsToFirestore(newBills);
      }
      setSyncStatus({ success: true, message: 'Bill saved successfully!' });
      setTimeout(() => setSyncStatus(null), 3000);
    }

    closeModal();
  };

  const deleteBill = async (id: string, deleteMode: 'single' | 'future' | 'all' = 'single') => {
    const billToDelete = bills.find(b => b.id === id);
    if (!billToDelete) return;

    let updatedBills = bills;
    if (deleteMode === 'all' && billToDelete.recurringParentId) {
      updatedBills = bills.filter(b => b.recurringParentId !== billToDelete.recurringParentId);
    } else if (deleteMode === 'future' && billToDelete.recurringParentId) {
      const targetDate = parseISO(billToDelete.dueDate);
      updatedBills = bills.filter(b => !(b.recurringParentId === billToDelete.recurringParentId && parseISO(b.dueDate) >= targetDate));
    } else {
      updatedBills = bills.filter(b => b.id !== id);
    }

    setBills(updatedBills);
    localStorage.setItem('bills', JSON.stringify(updatedBills));
    if (user) {
      await deleteBillFromFirestore(id, deleteMode);
    }
    closeModal();
  };

  const resetAllData = async () => {
    if (user) {
      try {
        const batch = writeBatch(db);
        bills.forEach(bill => {
          batch.delete(doc(db, 'users', user.uid, 'bills', bill.id));
        });
        financialAccounts.forEach(acc => {
          batch.delete(doc(db, 'users', user.uid, 'financialAccounts', acc.id));
        });
        savingsDeposits.forEach(sd => {
          batch.delete(doc(db, 'users', user.uid, 'savingsDeposits', sd.id));
        });
        await batch.commit();
      } catch (e) {}
    }
    localStorage.clear();
    setBills([]);
    setFinancialAccounts([]);
    setSavingsDeposits([]);
    setCategories(DEFAULT_CATEGORIES);
    setStartingBalance('0');
    setEndingBalance('0');
    setEmergencyReserveGoal('0');
    setCurrentSavingsBalance('0');
    setMonthlyIncome('0');
    setPlaidClientId('');
    setPlaidSecretKey('');
    setPlaidEnv('sandbox');
    setPlaidSyncFrequency('startup');
    setIsPinEnabled(false);
    setAppPin('1234');
    setIsAppLocked(false);
    setPaydayFrequency('biweekly');
    setBaselinePaydayDate('2026-08-14');
    setLowBalanceThreshold('0');
    setIsResetConfirmOpen(false);
    setIsSettingsOpen(false);
    setSyncStatus({ success: true, message: 'All personal vault records cleared to zero!' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const openCalendarSyncModal = () => {
    setSelectedCalendarBillIds(bills.filter(b => b.name && b.dueDate).map(b => b.id));
    setIsCalendarConfirmOpen(true);
  };

  const handleGoogleConnect = async () => {
    try {
      setIsSyncing(true);
      setSyncStatus(null);
      const authResult = await requestGoogleCalendarAuth();
      if (authResult?.accessToken) {
        setIsGoogleConnected(true);
        openCalendarSyncModal();
        setSyncStatus({ success: true, message: 'Google Calendar authorized!' });
        setTimeout(() => setSyncStatus(null), 3500);
      }
    } catch (err: any) {
      console.warn('Google Calendar authorization failed or cancelled:', err);
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        setIsDomainErrorModalOpen(true);
        setSyncStatus({
          success: false,
          message: 'Firebase configuration required: Unauthorized domain.'
        });
      } else {
        setSyncStatus({ 
          success: false, 
          message: err?.message || 'Google Calendar connection was cancelled' 
        });
      }
      setTimeout(() => setSyncStatus(null), 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    try {
      clearCalendarAccessToken();
      localStorage.removeItem('google_tokens');
    } catch {}
    setIsGoogleConnected(false);
    setSyncStatus({ success: true, message: 'Google Calendar disconnected.' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleSyncToGoogle = async () => {
    const token = getCachedCalendarAccessToken();
    if (!token || !isGoogleConnected) {
      await handleGoogleConnect();
      return;
    }
    openCalendarSyncModal();
  };

  const executeCalendarSync = async () => {
    const billsToSync = bills.filter(b => selectedCalendarBillIds.includes(b.id) && b.name && b.dueDate);
    if (billsToSync.length === 0) {
      setSyncStatus({ success: false, message: 'Please select at least one bill to sync to Google Calendar.' });
      setTimeout(() => setSyncStatus(null), 3500);
      return;
    }

    let token = getCachedCalendarAccessToken();
    if (!token) {
      try {
        const authResult = await requestGoogleCalendarAuth();
        token = authResult.accessToken;
        setIsGoogleConnected(true);
      } catch (err: any) {
        setSyncStatus({ success: false, message: 'Google Calendar authorization required.' });
        setTimeout(() => setSyncStatus(null), 3500);
        return;
      }
    }

    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const result = await syncBillsToGoogleCalendar(billsToSync, token, financialAccounts);
      setIsCalendarConfirmOpen(false);
      setSyncStatus({
        success: result.success,
        message: result.message
      });
    } catch (err: any) {
      console.warn('Error during Google Calendar event sync:', err);
      setSyncStatus({
        success: false,
        message: err?.message || 'Failed to sync events to Google Calendar'
      });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  const togglePaid = async (id: string) => {
    const targetBill = bills.find(b => b.id === id);
    if (!targetBill) return;

    const nextIsPaid = !targetBill.isPaid;
    const updatedBills = bills.map(b => b.id === id ? { ...b, isPaid: nextIsPaid } : b);
    setBills(updatedBills);
    localStorage.setItem('bills', JSON.stringify(updatedBills));

    if (targetBill.accountId) {
      if (targetBill.accountId === 'personal-savings-vault') {
        const diff = nextIsPaid ? -targetBill.amount : targetBill.amount;
        const nextSavings = personalSavingsBalance + diff;
        setPersonalSavingsBalance(nextSavings);
        localStorage.setItem('personalSavingsBalance', nextSavings.toString());
      } else {
        const account = financialAccounts.find(a => a.id === targetBill.accountId);
        if (account) {
          const diff = nextIsPaid ? -targetBill.amount : targetBill.amount;
          const updatedAcc = {
            ...account,
            balance: account.balance + diff
          };
          const updatedAccounts = financialAccounts.map(a => a.id === account.id ? updatedAcc : a);
          setFinancialAccounts(updatedAccounts);
          localStorage.setItem('financialAccounts', JSON.stringify(updatedAccounts));
          if (user) {
            try {
              await setDoc(doc(db, 'users', user.uid, 'financialAccounts', account.id), updatedAcc, { merge: true });
            } catch (err) {
              console.error('Error updating financial account balance:', err);
            }
          }
        }
      }
    }

    if (user) {
      const bill = updatedBills.find(b => b.id === id);
      if (bill) await saveBillToFirestore(bill);
    }
  };

  const openModal = (day: Date, bill?: Bill) => {
    setSelectedDay(day);
    setUpdateFutureInstances(false);
    setIsAddingNew(false);
    if (bill) {
      setEditingBill(bill);
      setBillName(bill.name);
      setBillAmount(bill.amount.toString());
      setBillCategory(bill.category);
      setBillFrequency(bill.frequency);
      setBillAccountId(bill.accountId || '');
    } else {
      setEditingBill(null);
      setBillName('');
      setBillAmount('');
      setBillCategory('utilities');
      setBillFrequency('none');
      setBillAccountId('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBill(null);
    setIsAddingNew(false);
    setUpdateFutureInstances(false);
    setBillName('');
    setBillAmount('');
    setBillCategory('utilities');
    setBillFrequency('none');
    setBillAccountId('');
  };

  const getDayIcon = (category: BillCategory) => {
    const icons = {
      utilities: <Zap className="w-3 h-3" />,
      rent: <Home className="w-3 h-3" />,
      'credit card': <CreditCard className="w-3 h-3" />,
      insurance: <Shield className="w-3 h-3" />,
      subscription: <RefreshCw className="w-3 h-3" />,
      other: <MoreHorizontal className="w-3 h-3" />
    };
    return icons[category] || <MoreHorizontal className="w-3 h-3" />;
  };

  const exportBackupData = () => {
    const backupObj = {
      bills,
      categories,
      savingsDeposits,
      financialAccounts,
      startingBalance,
      endingBalance,
      emergencyReserveGoal,
      currentSavingsBalance,
      monthlyIncome,
      plaidClientId,
      plaidSecretKey,
      plaidEnv,
      plaidSyncFrequency,
      isPinEnabled,
      appPin,
      paydayFrequency,
      baselinePaydayDate,
      lowBalanceThreshold,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `capital_command_backup_${format(new Date(), 'yyyy-MM-dd')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackupData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = async (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed.bills)) {
            setBills(parsed.bills);
            localStorage.setItem('bills', JSON.stringify(parsed.bills));
            if (user) {
              const batch = writeBatch(db);
              parsed.bills.forEach((b: Bill) => {
                const ref = doc(db, 'users', user.uid, 'bills', b.id);
                batch.set(ref, b);
              });
              await batch.commit();
            }
          }
          if (parsed.categories) {
            setCategories(parsed.categories);
            localStorage.setItem('categories', JSON.stringify(parsed.categories));
          }
          if (Array.isArray(parsed.savingsDeposits)) {
            setSavingsDeposits(parsed.savingsDeposits);
            localStorage.setItem('savingsDeposits', JSON.stringify(parsed.savingsDeposits));
          }
          if (Array.isArray(parsed.financialAccounts)) {
            setFinancialAccounts(parsed.financialAccounts);
            localStorage.setItem('financialAccounts', JSON.stringify(parsed.financialAccounts));
            if (user) {
              const batch = writeBatch(db);
              parsed.financialAccounts.forEach((acc: FinancialAccount) => {
                const ref = doc(db, 'users', user.uid, 'accounts', acc.id);
                batch.set(ref, acc);
              });
              await batch.commit();
            }
          }
          if (parsed.startingBalance !== undefined) setStartingBalance(parsed.startingBalance);
          if (parsed.endingBalance !== undefined) setEndingBalance(parsed.endingBalance);
          if (parsed.emergencyReserveGoal !== undefined) setEmergencyReserveGoal(parsed.emergencyReserveGoal);
          if (parsed.currentSavingsBalance !== undefined) setCurrentSavingsBalance(parsed.currentSavingsBalance);
          if (parsed.monthlyIncome !== undefined) setMonthlyIncome(parsed.monthlyIncome);
          if (parsed.plaidClientId !== undefined) setPlaidClientId(parsed.plaidClientId);
          if (parsed.plaidSecretKey !== undefined) setPlaidSecretKey(parsed.plaidSecretKey);
          if (parsed.plaidEnv !== undefined) setPlaidEnv(parsed.plaidEnv);
          if (parsed.plaidSyncFrequency !== undefined) setPlaidSyncFrequency(parsed.plaidSyncFrequency);
          if (parsed.isPinEnabled !== undefined) setIsPinEnabled(parsed.isPinEnabled);
          if (parsed.appPin !== undefined) setAppPin(parsed.appPin);
          if (parsed.paydayFrequency !== undefined) setPaydayFrequency(parsed.paydayFrequency);
          if (parsed.baselinePaydayDate !== undefined) setBaselinePaydayDate(parsed.baselinePaydayDate);
          if (parsed.lowBalanceThreshold !== undefined) setLowBalanceThreshold(parsed.lowBalanceThreshold);

          if (user) {
            await setDoc(doc(db, 'users', user.uid, 'settings', 'current'), {
              startingBalance: parsed.startingBalance ?? startingBalance,
              endingBalance: parsed.endingBalance ?? endingBalance,
              emergencyReserveGoal: parsed.emergencyReserveGoal ?? emergencyReserveGoal,
              currentSavingsBalance: parsed.currentSavingsBalance ?? currentSavingsBalance,
              monthlyIncome: parsed.monthlyIncome ?? monthlyIncome,
              categories: parsed.categories ?? categories,
              paydayFrequency: parsed.paydayFrequency ?? paydayFrequency,
              baselinePaydayDate: parsed.baselinePaydayDate ?? baselinePaydayDate,
              lowBalanceThreshold: parsed.lowBalanceThreshold ?? lowBalanceThreshold,
              updatedAt: serverTimestamp()
            }, { merge: true });
          }

          setSyncStatus({ success: true, message: 'All ledger data, bills, and settings imported & synced to your cloud account!' });
          setTimeout(() => setSyncStatus(null), 4000);
        } catch (err) {
          setSyncStatus({ success: false, message: 'Invalid backup JSON file' });
          setTimeout(() => setSyncStatus(null), 3000);
        }
      };
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      if (authMode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setShowLoginPrompt(false);
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        setAuthError('Email/Password login is not enabled in Firebase Console yet.');
      } else {
        setAuthError(error.message);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetEmailError(null);
    setResetEmailStatus(null);
    if (!resetEmailInput || !resetEmailInput.includes('@')) {
      setResetEmailError('Please enter a valid email address.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmailInput);
      setResetEmailStatus('Password reset email sent! Check your inbox for the reset link.');
    } catch (error: any) {
      setResetEmailError(error.message || 'Failed to send password reset email.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError(null);
    setChangePasswordSuccess(null);
    if (!user || !user.email) {
      setChangePasswordError('You must be signed in to change your password.');
      return;
    }
    if (newPasswordInput.length < 6) {
      setChangePasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPasswordInput !== confirmNewPasswordInput) {
      setChangePasswordError('New passwords do not match.');
      return;
    }
    try {
      if (currentPasswordInput) {
        const credential = EmailAuthProvider.credential(user.email, currentPasswordInput);
        await reauthenticateWithCredential(user, credential);
      }
      await updatePassword(user, newPasswordInput);
      setChangePasswordSuccess('Password updated successfully!');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmNewPasswordInput('');
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setChangePasswordSuccess(null);
      }, 2000);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setChangePasswordError('Recent login required. Please enter your current password or sign out and sign back in.');
      } else {
        setChangePasswordError(error.message || 'Failed to update password.');
      }
    }
  };

  const renderCardSection = (cardKey: CardSectionKey) => {
    const isVisible = cardVisibility[cardKey];
    const labels: Record<CardSectionKey, string> = {
      fundsAvailable: 'Total Funds Available',
      income: 'Total Monthly Income',
      expenses: 'Total Monthly Expenses',
      upcomingBanner: 'Pay Period Upcoming Bills',
      autoPaySection: 'Active Auto-Pay & Subscriptions',
      accountsCenter: 'Bank Accounts & Credit Cards',
      debtEngine: 'Debt Payoff Calculator',
      taxReserve: 'Tax Reserve & Savings Calculator',
    };

    const activeMonthBills = bills.filter(b => {
      const date = parseISO(b.dueDate);
      const currentMonth = months[0]?.date || new Date();
      return date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear();
    });
    const currentPayPeriodBills = currentBiWeeklyBills;

    if (!isVisible) {
      return (
        <motion.div
          key={cardKey}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          layout
          className="p-4 rounded-2xl bg-black/40 border border-white/5 border-dashed flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <EyeOff className="w-4 h-4 text-amber-400" />
            <span>{labels[cardKey]} (Hidden)</span>
          </div>
          <button
            type="button"
            onClick={() => toggleCardVisibility(cardKey)}
            className="px-3 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all"
          >
            Show Card
          </button>
        </motion.div>
      );
    }

    switch (cardKey) {
      case 'upcomingBanner':
        return (
          <motion.div
            key="upcomingBanner"
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.99 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            layout
            className="relative group/upcoming"
          >
            <div className="absolute right-4 top-4 z-20">
              <button
                type="button"
                onClick={() => toggleCardVisibility('upcomingBanner')}
                className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-slate-400 hover:text-amber-300 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
                title="Hide Upcoming 7-Day Window"
              >
                <Eye className="w-3 h-3 text-amber-400" />
                <span>Hide Card</span>
              </button>
            </div>
            <Upcoming7DayBanner 
              bills={bills}
              activeBiWeeklyPeriod={activeBiWeeklyPeriod}
              onTogglePaid={togglePaid}
              onSelectBill={(bill) => {
                setEditingBill(bill);
                setIsModalOpen(true);
              }}
            />
          </motion.div>
        );
      case 'autoPaySection':
        return (
          <motion.div
            key="autoPaySection"
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.99 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            layout
            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-950/50 via-[#0a0f0d]/70 to-black/80 backdrop-blur-xl border border-emerald-500/20 shadow-2xl space-y-6 relative group"
          >
            <div className="absolute right-6 top-6 z-20">
              <button
                type="button"
                onClick={() => toggleCardVisibility('autoPaySection')}
                className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-slate-400 hover:text-amber-300 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
                title="Hide Active Auto-Pay & Subscriptions"
              >
                <Eye className="w-3 h-3 text-amber-400" />
                <span>Hide Card</span>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 pr-24">
              <div>
                <h3 className="text-xl font-serif font-bold text-white flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-brand-emerald" />
                  Active Auto-Pay & Subscriptions
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Informational reference tracker only — does not alter cash balances or expenses.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingAutoPay(null);
                  setAutoPayNameInput('');
                  setAutoPayAmountInput('');
                  setAutoPayCategoryInput('subscription');
                  setAutoPayDueDateInput(format(new Date(), 'yyyy-MM-dd'));
                  setAutoPayFrequencyInput('monthly');
                  setIsAutoPayModalOpen(true);
                }}
                className="px-5 py-2.5 bg-brand-emerald hover:bg-emerald-600 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Add Auto-Pay Entry
              </button>
            </div>

            {autoPayEntries.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-mono text-xs uppercase tracking-widest border border-dashed border-border-subtle rounded-2xl">
                No manual auto-pay entries found. Click Add Auto-Pay Entry to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {autoPayEntries.map(entry => {
                  const catInfo = categories[entry.category];
                  const styles = COLOR_OPTIONS.find(c => c.id === catInfo?.color);
                  return (
                    <div
                      key={entry.id}
                      className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 backdrop-blur-md border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-4 group shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", styles?.calBg, styles?.calBorder, styles?.text)}>
                            {getDayIcon(entry.category)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-brand-emerald transition-colors">{entry.name}</h4>
                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                              Frequency: <span className="text-slate-300 font-bold">{entry.frequency}</span>
                            </p>
                          </div>
                        </div>
                        <span className="text-base font-mono font-bold text-white">${entry.amount.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] font-mono">
                        <span className="text-slate-500">
                          Next: <span className="text-slate-300 font-bold">{format(parseISO(entry.dueDate), 'MMM d, yyyy')}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAutoPay(entry);
                              setAutoPayNameInput(entry.name);
                              setAutoPayAmountInput(entry.amount.toString());
                              setAutoPayCategoryInput(entry.category);
                              setAutoPayDueDateInput(entry.dueDate);
                              setAutoPayFrequencyInput(entry.frequency);
                              setIsAutoPayModalOpen(true);
                            }}
                            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg border border-border-subtle hover:border-white/20 transition-all"
                          >
                            Manage
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAutoPayEntry(entry.id)}
                            className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 hover:border-rose-500/40 transition-all font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        );
      case 'fundsAvailable':
        return (
          <div key="fundsAvailable" className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-950/50 via-[#0a0f0d]/70 to-black/80 backdrop-blur-xl border border-emerald-500/20 hover:border-amber-500/40 transition-all flex flex-col justify-between relative overflow-hidden group shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-300">Paycheck Balance</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setTempFundsAmount(totalFundsAvailable.toString());
                      setIsEditingFundsAmount(true);
                    }}
                    className="px-2 py-0.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                    title="Manually edit / override total funds available amount"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit Amount</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCardVisibility('fundsAvailable')}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                    title="Hide this card"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
              </div>
              {isEditingFundsAmount ? (
                <div className="space-y-2 mb-3 bg-black/80 p-3 rounded-xl border border-amber-500/40">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-mono font-bold text-amber-300 uppercase">Manual Funds Override ($)</label>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={tempFundsAmount}
                    onChange={(e) => setTempFundsAmount(e.target.value)}
                    className="w-full bg-black border border-amber-500/50 rounded-lg px-2 py-1 text-xs font-mono font-bold text-white focus:outline-none"
                    placeholder="1457.00"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingFundsAmount(false)}
                      className="flex-1 py-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded text-[9px] font-mono font-bold uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const parsed = parseFloat(tempFundsAmount);
                        if (!isNaN(parsed)) {
                          const baseFunds = (overviewToggle === 'monthly' ? monthlyIncomeVal : biweeklyIncomeVal) - (overviewToggle === 'monthly' ? currentMonthBills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0) : currentBiWeeklyBills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0)) - totalCustomDeductions;
                          const adj = parsed - baseFunds;
                          setManualFundsAdjustment(adj);
                          localStorage.setItem('manualFundsAdjustment', adj.toString());
                        }
                        setIsEditingFundsAmount(false);
                      }}
                      className="flex-1 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[9px] font-mono font-bold uppercase"
                    >
                      Save Amount
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-mono font-bold bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 bg-clip-text text-transparent tracking-tight">
                  ${totalFundsAvailable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-emerald-500/20 space-y-1.5 text-[10px] font-mono text-slate-400">


                <div className="flex justify-between">
                  <span>Paid Outflows:</span>
                  <span className="text-rose-400 font-bold">-${(overviewToggle === 'monthly' ? currentMonthBills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0) : currentBiWeeklyBills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {customDeductions.map(ded => (
                  <div key={ded.id} className="flex justify-between items-center group/ded pt-0.5">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="text-amber-200/90">{ded.name}:</span>
                      <button 
                        type="button" 
                        onClick={() => setCustomDeductions(customDeductions.filter(d => d.id !== ded.id))}
                        className="text-rose-400/60 hover:text-rose-400 opacity-0 group-hover/ded:opacity-100 transition-opacity text-[9px] font-bold"
                        title="Remove deduction"
                      >
                        [x]
                      </button>
                    </span>
                    <span className="text-rose-400 font-bold">-${Number(ded.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-1.5 border-t border-white/10 font-bold">
                  <span className="text-slate-200">Paycheck Balance:</span>
                  <span className={cn(netPeriodInflow >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {netPeriodInflow >= 0 ? '+' : '-'}${Math.abs(netPeriodInflow).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                {isAddingDeduction ? (
                  <div className="space-y-2 w-full pt-1">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Name (e.g. MoneyLion)" 
                        value={newDeductionName}
                        onChange={e => setNewDeductionName(e.target.value)}
                        className="w-1/2 px-2 py-1 rounded-lg bg-black/50 border border-white/20 text-white text-[10px] font-mono"
                      />
                      <input 
                        type="number" 
                        placeholder="Amount ($)" 
                        value={newDeductionAmount}
                        onChange={e => setNewDeductionAmount(e.target.value)}
                        className="w-1/2 px-2 py-1 rounded-lg bg-black/50 border border-white/20 text-white text-[10px] font-mono"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        type="button"
                        onClick={() => setIsAddingDeduction(false)}
                        className="px-2 py-0.5 bg-white/5 text-slate-400 hover:text-white rounded text-[10px]"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          if (newDeductionName.trim() && !isNaN(parseFloat(newDeductionAmount))) {
                            setCustomDeductions([
                              ...customDeductions,
                              { id: Date.now().toString(), name: newDeductionName.trim(), amount: parseFloat(newDeductionAmount) || 0 }
                            ]);
                            setNewDeductionName('');
                            setNewDeductionAmount('');
                            setIsAddingDeduction(false);
                          }
                        }}
                        className="px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setIsAddingDeduction(true)}
                    className="text-[10px] font-mono text-brand-emerald hover:text-emerald-300 transition-colors flex items-center gap-1"
                  >
                    <span>+ Add Custom Obligation / Deduction</span>
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-500/15 flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-400 uppercase tracking-wider">Projected Cash Pool</span>
              <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">LIVE POOL</span>
            </div>
          </div>
        );
      case 'income':
        return (
          <div key="income" className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-950/50 via-[#0a0f0d]/70 to-black/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex flex-col justify-between relative overflow-hidden group shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-300">
                  {overviewToggle === 'monthly' ? 'Total Monthly Income' : 'Total Bi-Weekly Income'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleCardVisibility('income')}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                    title="Hide this card"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTempIncomeInput(monthlyIncome);
                      setTempBiWeeklyInput(biWeeklyIncome);
                      setIncomeEditMode(overviewToggle);
                      setIsEditingIncome(true);
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Edit Income Baseline"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {isEditingIncome ? (
                <div className="space-y-3 mt-2 bg-black/80 p-3.5 rounded-2xl border border-blue-500/40">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Bi-Weekly Paycheck</label>
                      <span className="text-[9px] font-mono text-slate-500">× 26 = Annual</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={tempBiWeeklyInput}
                        onChange={(e) => handleBiWeeklyIncomeChange(e.target.value)}
                        className="w-full bg-black border border-border-subtle focus:border-blue-400 rounded-xl pl-6 pr-2 py-1 text-sm font-mono font-bold text-white focus:outline-none"
                        placeholder="2230.77"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Monthly Income</label>
                      <span className="text-[9px] font-mono text-slate-500">Annual ÷ 12</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={tempIncomeInput}
                        onChange={(e) => handleMonthlyIncomeChange(e.target.value)}
                        className="w-full bg-black border border-border-subtle focus:border-emerald-400 rounded-xl pl-6 pr-2 py-1 text-sm font-mono font-bold text-white focus:outline-none"
                        placeholder="4833.33"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1 border-t border-white/10">
                    <span>Annualized:</span>
                    <span className="text-emerald-400 font-bold">
                      ${((parseFloat(tempIncomeInput) || 0) * 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingIncome(false)}
                      className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-[10px] font-mono font-bold uppercase transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveIncomeChanges}
                      className="flex-1 py-1.5 bg-brand-emerald hover:bg-emerald-600 text-white rounded-lg text-[10px] font-mono font-bold uppercase transition-all"
                    >
                      Save Income
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-3xl font-mono font-bold text-white tracking-tight">
                    ${(overviewToggle === 'monthly' ? monthlyIncomeVal : biweeklyIncomeVal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              )}

            </div>
            <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Cycle Frequency</span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider">{overviewToggle === 'monthly' ? 'Monthly' : 'Bi-Weekly'}</span>
            </div>
          </div>
        );
      case 'expenses':
        return (
          <div key="expenses" className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-950/50 via-[#0a0f0d]/70 to-black/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex flex-col justify-between relative overflow-hidden group shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-300">
                  {overviewToggle === 'monthly' ? 'Total Monthly Expenses' : 'Total Bi-Weekly Expenses'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleCardVisibility('expenses')}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                    title="Hide this card"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="text-3xl font-mono font-bold text-white tracking-tight">
                ${(overviewToggle === 'monthly' ? totalMonthlyExpenses : totalBiWeeklyExpenses).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                {overviewToggle === 'monthly' ? `${activeMonthBills.length} scheduled bills this month` : `${currentPayPeriodBills.length} scheduled bills this pay period`}
              </p>
              <div className="mt-4 pt-4 border-t border-emerald-500/15 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {(overviewToggle === 'monthly' ? activeMonthBills : currentPayPeriodBills).map(b => (
                  <div key={b.id} className="flex justify-between items-center text-[11px] font-mono">
                    <span className={cn("truncate pr-2", b.isPaid ? "text-emerald-300 line-through opacity-70" : "text-slate-200")}>
                      {b.name} <span className="text-[9px] text-slate-500">({format(parseISO(b.dueDate), 'MMM d')})</span>
                    </span>
                    <span className={cn("font-bold shrink-0", b.isPaid ? "text-emerald-400" : "text-rose-400")}>
                      ${Number(b.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Paid / Unpaid Ratio</span>
              <span className="text-rose-400 font-bold">
                {overviewToggle === 'monthly' 
                  ? `${activeMonthBills.filter(b => b.isPaid).length}/${activeMonthBills.length} Settled`
                  : `${currentPayPeriodBills.filter(b => b.isPaid).length}/${currentPayPeriodBills.length} Settled`}
              </span>
            </div>
          </div>
        );
      case 'accountsCenter':
        return (
          <div key="accountsCenter" className="p-5 sm:p-7 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-emerald-950/50 via-[#0a0f0d]/70 to-black/80 backdrop-blur-xl border border-emerald-500/20 shadow-2xl space-y-6 relative group/acct overflow-hidden">
            <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto flex-1 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Liquid Accounts</span>
                  <span className="text-cyan-400 font-bold text-sm sm:text-base">${totalLiquidAccountBalances.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Period Inflow</span>
                  <span className="text-emerald-400 font-bold text-sm sm:text-base">+${(overviewToggle === 'monthly' ? monthlyIncomeVal : biweeklyIncomeVal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Paid Outflows</span>
                  <span className="text-rose-400 font-bold text-sm sm:text-base">-${(overviewToggle === 'monthly' ? currentMonthBills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0) : currentBiWeeklyBills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Paycheck Balance</span>
                  <span className={cn("font-bold text-sm sm:text-base", totalFundsAvailable >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    ${totalFundsAvailable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => toggleCardVisibility('accountsCenter')}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-slate-400 hover:text-amber-300 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                  title="Hide Accounts Center"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hide Card</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">
                  <Landmark className="w-3.5 h-3.5 shrink-0" />
                  <span>Bank Accounts & Cards Center</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-3">
                  Bank Accounts & Credit Cards
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlaidInstitutionId(null);
                    setAccountConnectTab('manual');
                    setManualAccountType('checking');
                    setIsAccountModalOpen(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all active:scale-95 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 stroke-[3] shrink-0" />
                  <span>Connect Account</span>
                </button>
              </div>
            </div>

            {financialAccounts.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-white/10 rounded-2xl bg-black/40 space-y-3">
                <Building className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-mono text-slate-400 font-bold">No accounts or cards linked yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {financialAccounts.map(acc => {
                  const brand = getBankBrandInfo(acc.institutionName);
                  return (
                  <div key={acc.id} className="p-6 rounded-2xl border border-white/10 bg-black/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs text-white shadow-md shrink-0", acc.logoBg || brand.bg)}>
                          <span>{brand.short}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{acc.institutionName}</h4>
                          <p className="text-xs text-slate-400 font-mono">{acc.accountName} {acc.last4 ? `(•••• ${acc.last4})` : ''}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {acc.accountType}
                      </span>
                    </div>
                    <div className="text-xl font-mono font-bold text-emerald-400">
                      ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAccount(acc);
                          setManualInstName(acc.institutionName);
                          setManualAccountName(acc.accountName);
                          setManualAccountType(acc.accountType);
                          setManualLast4(acc.last4 || '');
                          setManualBalance(acc.balance.toString());
                          setManualCreditLimit(acc.creditLimit ? acc.creditLimit.toString() : '');
                          setManualMinPayment(acc.minimumPayment ? acc.minimumPayment.toString() : '');
                          setIsAccountModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                        title="Edit account amount and details"
                      >
                        <Pencil className="w-3 h-3 text-amber-400" />
                        <span>Edit Amount</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAccount(acc.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                        title="Delete Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      case 'debtEngine':
        return (
          <div key="debtEngine">
            <DebtPayoffEngine 
              bills={bills}
              financialAccounts={financialAccounts}
              onAddDebtBill={() => {
                setSelectedDay(new Date());
                setIsModalOpen(true);
              }}
              onConnectCreditCard={() => {
                setAccountConnectTab('manual');
                setManualAccountType('credit');
                setIsAccountModalOpen(true);
              }}
              onToggleHide={() => toggleCardVisibility('debtEngine')}
            />
          </div>
        );

      case 'taxReserve':
        return (
          <div key="taxReserve">
            <TaxLiabilityReserve 
              totalMonthlyIncome={monthlyIncomeVal} 
              onToggleHide={() => toggleCardVisibility('taxReserve')}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="h-screen bg-bg-deep flex flex-col items-center justify-center gap-6 p-6 text-center">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-brand-emerald animate-spin stroke-[1.5]" />
          <div className="absolute inset-0 blur-xl bg-brand-emerald/20 animate-pulse rounded-full" />
        </div>
        <div className="space-y-3">
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">Vault Initializing</p>
          <button
            type="button"
            onClick={() => setIsAuthLoading(false)}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/50 transition-all cursor-pointer active:scale-95"
          >
            Open App Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-black font-sans overflow-hidden text-slate-200 relative">
      {/* Luxury Geometric Gold Lines & Vector Accents on Black Background */}
      <LuxuryGoldGeometricBackground />
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Header Section */}
      <header className="w-full max-w-none bg-[#0a0a0c] border-b border-white/10 px-3 md:px-6 py-2.5 md:py-3 sticky top-0 z-40 flex flex-col gap-2 md:gap-3">
        <div className="flex items-center justify-between w-full gap-2">
          {/* Left: Menu & Branding */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer shrink-0",
                isSidebarOpen 
                  ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white" 
                  : "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)] animate-pulse"
              )}
              title={isSidebarOpen ? "Close Left Sidebar" : "Open Left Sidebar"}
              aria-label={isSidebarOpen ? "Close Left Sidebar" : "Open Left Sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setAppNav('overview');
                setIsSidebarOpen(false);
                if (mainScrollRef.current) {
                  mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 text-left group/home focus:outline-none transition-transform active:scale-98 cursor-pointer min-w-0"
              title="Return to Home / Overview Dashboard"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500/20 via-emerald-600/30 to-teal-900/40 border border-emerald-500/50 rounded-2xl flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] relative group shrink-0">
                <Shield className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2] text-amber-400 fill-amber-400/20 group-hover:scale-110 group-hover/home:rotate-[-4deg] transition-all drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 animate-pulse border border-black shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
              </div>
              <div className="flex flex-col min-w-0 hidden xs:flex">
                <h1 className="text-xs sm:text-base font-serif font-extrabold text-emerald-400 tracking-tight truncate group-hover/home:text-emerald-300 transition-colors">Capital Command</h1>
                <span className="text-[5px] sm:text-[6px] font-bold text-amber-300 tracking-[0.05em] uppercase truncate">Personal Finance & Bill Planner</span>
              </div>
              <h2 className="text-xs sm:text-xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 animate-pulse tracking-tight truncate pl-1">
                {user?.displayName ? `${user.displayName.split(' ')[0]}'s` : 'My'} Finances
              </h2>
            </button>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="hidden sm:inline-flex flex-col items-center gap-0.5 px-2 py-0.5 rounded-lg bg-gradient-to-r from-emerald-500/20 via-amber-500/15 to-emerald-500/20 border border-emerald-500/40 text-[7px] font-mono font-bold uppercase tracking-widest text-emerald-300 hover:text-amber-300 transition-all cursor-pointer"
            >
              <span>PRO VAULT</span>
              <span className="text-[8px] text-emerald-400/90 font-normal">{isPinEnabled ? 'ACTIVE' : 'SET'}</span>
            </button>

            <button
              onClick={() => setIsFeatureSuggestionsModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-[9px] font-mono font-bold uppercase text-emerald-300 hover:text-emerald-200 transition-all cursor-pointer shadow-md shadow-emerald-950/40"
              title="View All App Feature Suggestions & Add-ons"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Suggestions</span>
            </button>

            <button
              onClick={() => setIsOnboardingGuideModalOpen(true)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-[9px] font-mono font-bold uppercase text-amber-300 hover:text-amber-200 transition-all cursor-pointer"
            >
              <Compass className="w-3 h-3 text-amber-400" />
              <span className="hidden xs:inline">Guide</span>
            </button>

            <button 
              onClick={() => setIsBetaPackageModalOpen(true)}
              className="p-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-amber-300 hover:text-amber-200 transition-all cursor-pointer"
              title="Package App for Beta Testers"
            >
              <Package className="w-4 h-4 text-amber-400" />
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 hover:text-amber-200 transition-all cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>

        {/* Bottom Row: View Toggles & Year Selector */}
        <div className="flex items-center justify-between w-full gap-2 pt-1 border-t border-white/5 overflow-x-auto no-scrollbar">
          <div className="flex items-center h-8 sm:h-9 bg-white/5 rounded-xl p-0.5 border border-white/10 shrink-0">
            <button 
              onClick={() => setAppNav('overview')}
              className={cn(
                "px-2 sm:px-3 h-full rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1",
                appNav === 'overview' ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md ring-1 ring-emerald-400/80" : "text-slate-400 hover:text-white"
              )}
            >
              <LayoutDashboard className="w-3 h-3 hidden sm:inline text-amber-300" />
              <span>Overview</span>
              <span className="font-mono font-bold text-amber-300">O</span>
            </button>
            <button 
              onClick={() => { setAppNav('monthly'); setViewMode('monthly'); }}
              className={cn(
                "px-2 sm:px-3 h-full rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1",
                appNav === 'monthly' ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md ring-1 ring-emerald-400/80" : "text-slate-400 hover:text-white"
              )}
            >
              <span>Monthly</span>
              <span className="font-mono font-bold text-amber-300">M</span>
            </button>
            <button 
              onClick={() => { setAppNav('biweekly'); setViewMode('biweekly'); }}
              className={cn(
                "px-2 sm:px-3 h-full rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1",
                appNav === 'biweekly' ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md ring-1 ring-emerald-400/80" : "text-slate-400 hover:text-white"
              )}
            >
              <span>Bi-Weekly</span>
              <span className="font-mono font-bold text-amber-300">BW</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center h-8 sm:h-9 bg-white/5 rounded-xl px-1 border border-amber-500/30">
              <button 
                onClick={() => setCurrentYear(currentYear - 1)}
                className="px-1 h-full hover:bg-amber-500/10 rounded text-amber-300 font-bold"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono font-extrabold text-amber-300 text-xs">
                {currentYear}
              </span>
              <button 
                onClick={() => setCurrentYear(currentYear + 1)}
                className="px-1 h-full hover:bg-amber-500/10 rounded text-amber-300 font-bold"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button 
              onClick={() => { setSelectedDay(new Date()); openModal(new Date()); }}
              className="hidden sm:flex px-3 h-8 sm:h-9 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white rounded-xl font-bold text-xs items-center gap-1.5 shadow-md shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              New Entry
            </button>
          </div>
        </div>
      </header>

      <div className="flex grow overflow-hidden relative">
        {/* Mobile Overlay Backdrop */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        {/* Sidebar Panel */}
        <aside className={cn(
          "fixed inset-y-0 left-0 bg-gradient-to-b from-emerald-950/40 via-[#0a0f0d]/80 to-black/90 backdrop-blur-2xl border-r border-emerald-500/20 p-6 sm:p-8 flex flex-col gap-8 shrink-0 custom-scrollbar overflow-y-auto z-50 transition-all duration-300 transform",
          isSidebarOpen 
            ? "translate-x-0 w-80 opacity-100 lg:relative lg:z-auto" 
            : "-translate-x-full w-0 p-0 border-r-0 opacity-0 pointer-events-none lg:w-0 lg:p-0 lg:border-r-0 lg:opacity-0 lg:pointer-events-none"
        )}>
          {/* Sidebar Top Header with Close (X) Button */}
          <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-serif font-bold text-white tracking-tight">Sidebar Controls</span>
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">Active Navigation</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all cursor-pointer group shrink-0"
              title="Close Sidebar"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* User Vault Section (Visible on both desktop and mobile sidebars) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono px-1">User Vault &amp; Account</h3>
            {isAuthLoading ? (
              <div className="p-4 flex items-center gap-3 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl text-emerald-500 backdrop-blur-md">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-bold uppercase tracking-widest">Verifying Identity</span>
              </div>
            ) : user ? (
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl flex flex-col gap-3 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-emerald rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shadow">
                    {user.email?.[0] || 'U'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold text-white truncate max-w-[180px]">{user.email}</span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Active Vault Session</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button 
                    type="button"
                    onClick={async () => {
                      await logout();
                      setShowLoginPrompt(true);
                      setIsSidebarOpen(false);
                    }}
                    className="flex-1 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Switch to a different account"
                  >
                    <span>Switch Account</span>
                  </button>
                  <button 
                    type="button"
                    onClick={logout}
                    className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Sign out of current vault"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setShowChangePasswordModal(true);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Change your account password"
                >
                  <span>Change Password</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    setShowLoginPrompt(true);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full p-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-900/20 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Sync Your Vault</span>
                </button>
                <div className="flex items-center justify-between px-1 pt-1">
                  <p className="text-[10px] text-slate-400 font-mono">
                    Sign in or switch accounts.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('syncedUserEmail');
                      localStorage.removeItem('userEmail');
                      logout();
                      setSyncStatus({ success: true, message: 'Cleared cached vault session. You can now sign in with a different account.' });
                      setTimeout(() => setSyncStatus(null), 3500);
                    }}
                    className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                    title="Clear cached account session to sign in with a different account"
                  >
                    Logout / Switch Account
                  </button>
                </div>
              </div>
            )}
            <div className="h-px bg-border-subtle w-full mt-2" />
          </div>

          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-3.5 h-3.5 text-emerald-400" />
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">Savings & Reserves</h3>
              </div>
              <button 
                onClick={() => setIsCalculatorOpen(true)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-emerald-400 transition-all flex items-center gap-1.5"
                title="Open Calculator"
              >
                <CalculatorIcon className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold">CALC</span>
              </button>
            </div>
            <div className="p-6 bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 backdrop-blur-md rounded-[2rem] border border-emerald-500/20 flex flex-col gap-5 shadow-xl">
              {/* Goal Name & Target Amount */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  {isEditingGoalName ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <input
                        type="text"
                        value={emergencyReserveGoalName}
                        onChange={(e) => setEmergencyReserveGoalName(e.target.value)}
                        onBlur={() => setIsEditingGoalName(false)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setIsEditingGoalName(false);
                        }}
                        autoFocus
                        className="bg-black/60 border border-emerald-500/50 rounded-lg px-2 py-0.5 text-[11px] font-mono font-bold text-white w-full focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingGoalName(false)}
                        className="p-1 text-emerald-400 hover:text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono truncate max-w-[160px]">
                        {emergencyReserveGoalName}
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsEditingGoalName(true)}
                        className="text-[9px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
                        title="Rename Goal"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Rename</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] text-slate-500 font-mono block">Target Goal Amount</span>
                    <button
                      type="button"
                      onClick={handleResetGoalTarget}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[9px] font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 group"
                      title={`Reset ${emergencyReserveGoalName} target to $0.00`}
                    >
                      <RotateCcw className="w-2.5 h-2.5 group-hover:-rotate-90 transition-transform" />
                      <span>Reset</span>
                    </button>
                  </div>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm group-focus-within:text-emerald-400 transition-colors">$</span>
                    <input 
                      type="number" 
                      value={emergencyReserveGoal}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEmergencyReserveGoal(val);
                        if (user) saveSettingsToFirestore({ emergencyReserveGoal: val, emergencyReserveGoalName } as any);
                      }}
                      className="w-full bg-transparent border-b border-border-subtle rounded-none py-2 pl-8 pr-3 text-xl font-mono font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Current Saved for Goal - Locked Display with Reset */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                    Current Balance Saved
                  </label>
                  <button
                    type="button"
                    onClick={handleResetGoal}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[9px] font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 group"
                    title={`Reset ${emergencyReserveGoalName} balance to $0.00`}
                  >
                    <RotateCcw className="w-2.5 h-2.5 group-hover:-rotate-90 transition-transform" />
                    <span>Reset</span>
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-black/60 border border-emerald-500/20 shadow-inner">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-mono text-emerald-500 font-bold">$</span>
                    <span className="text-xl font-mono font-bold text-emerald-400">
                      {goalSavedVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                    Locked
                  </span>
                </div>
              </div>

              {/* Real-time Progress Bar */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Goal Progress</span>
                    {reserveProgressPercent >= 100 && (
                      <span className="text-amber-300 bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 rounded font-bold uppercase animate-pulse">
                        🎉 100% Reached!
                      </span>
                    )}
                  </span>
                  <span className={cn(
                    "font-bold transition-colors",
                    reserveProgressPercent >= 100 ? "text-amber-300 font-extrabold" : "text-emerald-400"
                  )}>
                    ${goalSavedVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${goalTargetVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({reserveProgressPercent.toFixed(1)}%)
                  </span>
                </div>
                <div className={cn(
                  "w-full h-2.5 rounded-full overflow-hidden transition-all duration-500",
                  goalCompletedCelebration ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-black animate-bounce" : "bg-white/10"
                )}>
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      reserveProgressPercent >= 100
                        ? "bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.6)]"
                        : "bg-gradient-to-r from-emerald-500 to-teal-400"
                    )}
                    style={{ width: `${Math.min(100, reserveProgressPercent)}%` }}
                  />
                </div>
              </div>

              {/* Dedicated Add Money to Goal Button */}
              <button
                type="button"
                onClick={() => {
                  setGoalDepositAmount('');
                  setGoalDepositNote('');
                  setIsGoalDepositModalOpen(true);
                }}
                className="mt-1 w-full py-3 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add Money to {emergencyReserveGoalName.length > 15 ? 'Goal' : emergencyReserveGoalName}
              </button>

              {/* Dedicated Savings Cards (Cash App, Venmo, Zelle, Custom) */}
              <SavingsCardsSidebarWidget
                savingsCards={savingsCards}
                onOpenAddModal={(preset) => {
                  setEditingSavingsCard(null);
                  setSelectedSavingsCardPreset(preset || 'cashapp');
                  setIsSavingsCardModalOpen(true);
                }}
                onOpenEditModal={(card) => {
                  setEditingSavingsCard(card);
                  setSelectedSavingsCardPreset((card.cardProviderPreset as any) || 'custom');
                  setIsSavingsCardModalOpen(true);
                }}
                onOpenDepositModal={(card) => {
                  setActiveSavingsCardForDeposit(card);
                  setIsSavingsCardDepositModalOpen(true);
                }}
                onDeleteCard={(id) => handleDeleteAccount(id)}
              />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono">Calendar</h3>
              <div className="flex items-center gap-2">
                {isGoogleConnected ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Linked</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-full border border-border-subtle">
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-none">Standby</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 backdrop-blur-md rounded-[2rem] border border-emerald-500/20 space-y-4 shadow-xl">
              {!isGoogleConnected ? (
                <button 
                  onClick={handleGoogleConnect}
                  disabled={isSyncing}
                  className="relative w-full p-[1.5px] rounded-2xl bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] shadow-lg shadow-blue-500/20 active:scale-95 transition-all group overflow-hidden"
                >
                  <div className="w-full h-full bg-[#111116] group-hover:bg-[#181822] text-white rounded-[14px] px-4 py-3 flex items-center justify-center gap-2.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors">
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#4285F4]" />
                        <span>Authorizing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="text-white font-bold tracking-wider">Sync to Calendar</span>
                      </>
                    )}
                  </div>
                </button>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={handleSyncToGoogle}
                    disabled={isSyncing}
                    className={cn(
                      "relative w-full p-[1.5px] rounded-2xl bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] shadow-lg shadow-blue-500/20 active:scale-95 transition-all group overflow-hidden",
                      isSyncing && "opacity-50"
                    )}
                  >
                    <div className="w-full h-full bg-[#111116] group-hover:bg-[#181822] text-white rounded-[14px] px-4 py-3 flex items-center justify-center gap-2.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors">
                      {isSyncing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#4285F4]" />
                          <span>Syncing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          <span className="text-white font-bold tracking-wider">Sync to Calendar</span>
                        </>
                      )}
                    </div>
                  </button>
                  <button 
                    onClick={handleGoogleDisconnect}
                    className="w-full text-center text-[9px] font-bold text-rose-500/60 hover:text-rose-400 uppercase tracking-widest transition-colors py-1"
                  >
                    Disconnect Calendar
                  </button>
                </div>
              )}
              {syncStatus && (
                <p className={cn(
                  "text-[9px] text-center font-bold uppercase tracking-[0.1em] mt-1",
                  syncStatus.success ? "text-emerald-500" : "text-rose-500"
                )}>
                  {syncStatus.message}
                </p>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono">Yearly payoff amounts</h3>
            </div>
            <div className="space-y-1.5 px-1">
              {ALL_CATEGORY_KEYS.map((key) => {
                const cat = categories[key] || DEFAULT_CATEGORIES[key];
                const totalForCat = bills
                  .filter(b => b.category === key && parseISO(b.dueDate).getFullYear() === currentYear)
                  .reduce((sum, b) => sum + b.amount, 0);
                
                const styles = getCategoryStyles(key);
                
                return (
                  <div key={key} className="flex items-center justify-between p-3 rounded-2xl border border-emerald-500/10 bg-emerald-950/20 hover:border-emerald-500/30 transition-colors backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <span className={cn("w-2 h-2 rounded-full ring-4 ring-black shadow-sm", styles.dot)}></span>
                      <span className="text-[13px] font-medium text-slate-300">{cat.label}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-400 tracking-tighter">${totalForCat.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Phone Book Widget */}
          <div className="my-3 px-1">
            <button
              onClick={() => setIsPhoneBookModalOpen(true)}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-black/60 border border-emerald-500/25 hover:border-emerald-500/50 transition-all flex items-center justify-between group shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">Phone Book</p>
                  <p className="text-[9px] text-slate-400 font-mono">{contacts.length} Contact{contacts.length === 1 ? '' : 's'}</p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                Open →
              </span>
            </button>
          </div>

          {/* Sidebar To-Do List Widget */}
          <div className="my-3 px-1">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-black/80 to-black border border-emerald-500/25 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">To-Do List</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                  {todos.length}/8
                </span>
              </div>

              {/* Add Todo Input */}
              {todos.length < 8 ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newTodoInput}
                    onChange={(e) => setNewTodoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTodoInput.trim() && todos.length < 8) {
                        setTodos([...todos, { id: `todo-${Date.now()}`, text: newTodoInput.trim(), completed: false }]);
                        setNewTodoInput('');
                      }
                    }}
                    placeholder="Add task (max 8)..."
                    className="flex-1 bg-black/50 border border-border-subtle rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTodoInput.trim() && todos.length < 8) {
                        setTodos([...todos, { id: `todo-${Date.now()}`, text: newTodoInput.trim(), completed: false }]);
                        setNewTodoInput('');
                      }
                    }}
                    className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-mono font-bold transition-all"
                  >
                    +
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-amber-400/80 font-mono italic">Max 8 entries reached.</p>
              )}

              {/* Todo Items */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {todos.map(todo => (
                  <div key={todo.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                    <label className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => {
                          setTodos(todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
                        }}
                        className="rounded border-border-subtle bg-black/40 text-emerald-500 focus:ring-0 w-3.5 h-3.5 shrink-0"
                      />
                      <span className={cn("text-xs font-mono truncate transition-all", todo.completed ? "line-through text-slate-500" : "text-slate-200")}>
                        {todo.text}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setTodos(todos.filter(t => t.id !== todo.id));
                      }}
                      className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-xs font-mono"
                      title="Delete task"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {todos.length === 0 && (
                  <p className="text-[10px] text-slate-500 font-mono text-center py-1">No tasks added yet.</p>
                )}
              </div>
            </div>
          </div>





          <section className="mt-auto">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono">Priority</h3>
              <button 
                onClick={() => setShowNotifications(true)}
                className="text-[10px] font-bold text-white hover:text-brand-emerald transition-colors uppercase tracking-widest"
              >
                Notify Me
              </button>
            </div>
            {upcomingBills.length > 0 ? (
              <div className="p-4 bg-gradient-to-br from-emerald-950/40 via-[#0a0f0d]/60 to-black/70 backdrop-blur-md border border-brand-emerald/20 rounded-[1.5rem] shadow-xl">
                <p className="text-[11px] font-serif font-bold text-brand-emerald flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {upcomingBills[0].name}
                </p>
                <div className="flex justify-between items-center mt-1.5">
                  <p className="text-[9px] text-brand-emerald/60 uppercase font-bold tracking-widest">
                    Due {format(parseISO(upcomingBills[0].dueDate), 'MMM d')}
                  </p>
                  <p className="text-[11px] font-mono font-bold text-brand-emerald">${upcomingBills[0].amount}</p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-gradient-to-br from-emerald-950/30 via-[#0a0f0d]/50 to-black/60 backdrop-blur-md border border-dashed border-border-subtle rounded-[1.5rem] text-center">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">No Upcoming Bills</p>
              </div>
            )}
          </section>
        </aside>

        {/* Main Content Area: Executive Overview or Calendar Payoff Engine */}
        <main ref={mainScrollRef} className="grow p-4 md:p-10 overflow-y-auto bg-transparent custom-scrollbar relative z-10">

          {appNav === 'overview' ? (
            <div className="max-w-7xl mx-auto space-y-10 pb-20">
              {/* Quick Start Guided Onboarding Progress Banner (1. Connect Bank -> 2. Set Income -> 3. Add Bill) */}
              <QuickStartGuideBanner
                bills={bills}
                financialAccounts={financialAccounts}
                monthlyIncome={monthlyIncome}
                onOpenBankModal={() => {
                  setSelectedPlaidInstitutionId(null);
                  setAccountConnectTab('plaid');
                  setIsAccountModalOpen(true);
                }}
                onOpenIncomeEditor={() => {
                  setSettingsTab('preferences');
                  setIsSettingsOpen(true);
                }}
                onOpenAddBillModal={() => {
                  setSelectedDay(new Date());
                  setBillName('');
                  setBillAmount('');
                  setEditingBill(null);
                  setIsAddingNew(true);
                  setIsModalOpen(true);
                }}
                onOpenFullGuideModal={() => setIsOnboardingGuideModalOpen(true)}
              />

              {/* Executive Overview Header Banner & View Switcher */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 rounded-[2.5rem] bg-gradient-to-r from-emerald-950/50 via-[#0a0f0d]/70 to-black/80 backdrop-blur-xl border border-emerald-500/20 shadow-2xl relative overflow-hidden">
                <div className="space-y-2 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    YOUR FINANCIAL HUB
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">Personal Money Hub</h2>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Track your funds, manage bills, and view your calendar at a glance.
                  </p>
                </div>

                {/* Controls: Period Toggle & Card Section Visibility Manager */}
                <div className="z-10 flex flex-wrap items-center gap-3 bg-black/60 p-2.5 rounded-2xl border border-emerald-500/20 backdrop-blur-md shrink-0">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 px-2">
                    Period:
                  </span>
                  <div className="flex items-center p-1 bg-white/5 rounded-xl border border-border-subtle">
                    <button
                      onClick={() => setOverviewToggle('monthly')}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-2",
                        overviewToggle === 'monthly'
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-lg shadow-amber-500/20 font-extrabold"
                          : "text-slate-400 hover:text-white"
                      )}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setOverviewToggle('biweekly')}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-2",
                        overviewToggle === 'biweekly'
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-lg shadow-amber-500/20 font-extrabold"
                          : "text-slate-400 hover:text-white"
                      )}
                    >
                      Bi-Weekly
                    </button>
                  </div>
                </div>
              </div>

              {Object.values(cardVisibility).some(v => !v) && (
                <div className="flex items-center justify-between p-3 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-amber-400" />
                    <span>Some dashboard cards are currently hidden.</span>
                  </div>
                  <button
                    type="button"
                    onClick={resetAllCards}
                    className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all"
                  >
                    Show All Cards
                  </button>
                </div>
              )}

              {/* 3 Summary Cards Grid Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {renderCardSection('fundsAvailable')}
                {renderCardSection('income')}
                {renderCardSection('expenses')}
              </div>

              {/* Remaining Dashboard Cards Rendered in cardOrder Sequence */}
              <div className="space-y-6">
                {cardOrder
                  .filter(cardKey => cardKey !== 'fundsAvailable' && cardKey !== 'income' && cardKey !== 'expenses')
                  .map((cardKey) => renderCardSection(cardKey))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8 pb-20">
              {appNav === 'monthly' ? (
                months.map((month, idx) => (
                  <motion.section 
                    key={month.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="bg-gradient-to-br from-emerald-950/50 via-[#0a0f0d]/70 to-black/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 rounded-[2rem] flex flex-col p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-4 md:mb-6 px-1 relative z-10">
                      <div>
                        <h4 className="font-serif font-bold text-white text-base md:text-lg tracking-tight group-hover:text-brand-emerald transition-colors">{month.name}</h4>
                        <span className="text-[10px] md:text-[11px] font-mono font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                          {totalMonthlyBills[idx] > 0 ? `$${totalMonthlyBills[idx].toLocaleString()}` : <span className="opacity-0">—</span>}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const monthBills = bills.filter(b => {
                            const date = parseISO(b.dueDate);
                            return date.getMonth() === month.date.getMonth() && date.getFullYear() === month.date.getFullYear();
                          }).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
                          setOverviewModalData({
                            type: 'monthly',
                            title: month.name,
                            subtitle: `Monthly Bill Overview (${month.name} ${currentYear})`,
                            bills: monthBills
                          });
                        }}
                        className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider border border-emerald-500/35 transition-all flex items-center gap-1 shadow-xs shrink-0"
                        title="View monthly bill overview & print"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Overview</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-[9px] text-center font-bold text-amber-300 mb-4 border-b border-amber-500/20 pb-2 uppercase tracking-[0.2em] font-mono">
                      <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2 grow content-start relative z-10">
                      {Array.from({ length: month.days[0].getDay() }).map((_, i) => (
                        <div key={`spacer-${i}`} className="aspect-square" />
                      ))}
                      
                      {month.days.map((day) => {
                        const dayBills = bills.filter(b => isSameDay(parseISO(b.dueDate), day));
                        const isCurrentDay = isToday(day);
                        const hasPaid = dayBills.length > 0 && dayBills.some(b => b.isPaid);
                        const firstBill = dayBills[0];
                        const primaryStyles = firstBill ? getCategoryStyles(firstBill.category) : null;

                        return (
                          <button
                            key={day.toISOString()}
                            onClick={() => openModal(day)}
                            className={cn(
                              "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-500 text-sm font-serif border group/day",
                              isCurrentDay 
                                ? "bg-white border-white text-black font-bold shadow-xl shadow-white/10 scale-110 z-20" 
                                : dayBills.length > 0 
                                  ? cn(
                                      "border-border-subtle", 
                                      !hasPaid 
                                        ? cn(
                                            "bg-black/60 text-amber-300 border-amber-500/40 hover:bg-white/10 shadow-md",
                                            primaryStyles && (primaryStyles as any).calBorder
                                          )
                                        : "bg-gradient-to-br from-emerald-950/80 via-emerald-900/50 to-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                    )
                                  : "hover:bg-white/5 border-transparent text-amber-300/80 hover:text-amber-200"
                            )}
                          >
                            <span className={cn(
                              "relative z-10 font-mono",
                              isCurrentDay 
                                ? "font-bold text-black" 
                                : dayBills.length > 0 && hasPaid 
                                  ? "text-emerald-400 font-bold" 
                                  : "font-semibold text-amber-300 group-hover/day:text-amber-200"
                            )}>
                              {dayBills.length > 0 && hasPaid ? (
                                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                              ) : (
                                day.getDate()
                              )}
                            </span>
                            
                            {dayBills.length > 0 && (
                              <div className="absolute bottom-1.5 flex gap-0.5">
                                {dayBills.slice(0, 3).map((b) => {
                                  const styles = getCategoryStyles(b.category);
                                  return (
                                    <div 
                                      key={b.id} 
                                      className={cn(
                                        "w-1 h-1 rounded-full",
                                        isCurrentDay ? "bg-black" : styles.dot,
                                        b.isPaid && "opacity-40"
                                      )} 
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.section>
                ))
              ) : (
                biWeeklyPeriods.map((period, idx) => (
                  <motion.section 
                    key={period.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="bg-gradient-to-br from-emerald-950/50 via-[#0a0f0d]/70 to-black/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 rounded-[2.5rem] flex flex-col p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-4 md:mb-6 px-1 relative z-10">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-white text-base md:text-lg tracking-tight group-hover:text-brand-emerald transition-colors">{period.label}</h4>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerPeriodAlertForPeriod(period);
                            }}
                            className="p-1 bg-white/5 hover:bg-white/10 rounded-md text-amber-400 transition-all active:scale-95 border border-white/10"
                            title="Period alert"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] md:text-[11px] font-mono font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                          {totalPeriodBills[idx] > 0 ? `$${totalPeriodBills[idx].toLocaleString()}` : '—'}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const pBills = bills.filter(b => {
                            const date = parseISO(b.dueDate);
                            return date >= period.start && date < period.end;
                          }).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
                          setOverviewModalData({
                            type: 'biweekly',
                            title: period.label,
                            subtitle: `Bi-Weekly Pay Period Bill Overview (${period.label})`,
                            bills: pBills,
                            start: period.start,
                            end: period.end
                          });
                        }}
                        className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider border border-emerald-500/35 transition-all flex items-center gap-1 shadow-xs shrink-0"
                        title="View bi-weekly period bill overview & print"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Overview</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-[9px] text-center font-bold text-amber-300 mb-4 border-b border-amber-500/20 pb-2 uppercase tracking-[0.2em] font-mono">
                      <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 grow content-start relative z-10">
                      {Array.from({ length: period.days[0].getDay() }).map((_, i) => (
                        <div key={`spacer-${i}`} className="aspect-square" />
                      ))}
                      {period.days.map((day) => {
                        const dayBills = bills.filter(b => isSameDay(parseISO(b.dueDate), day));
                        const isCurrentDay = isToday(day);
                        const hasPaid = dayBills.length > 0 && dayBills.some(b => b.isPaid);
                        const firstBill = dayBills[0];
                        const primaryStyles = firstBill ? getCategoryStyles(firstBill.category) : null;

                        return (
                          <button
                            key={day.toISOString()}
                            onClick={() => openModal(day)}
                            className={cn(
                              "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-500 text-sm font-serif border group/day",
                              isCurrentDay 
                                ? "bg-white border-white text-black font-bold shadow-xl scale-110 z-20" 
                                : dayBills.length > 0 
                                  ? cn(
                                      "border-border-subtle", 
                                      !hasPaid 
                                        ? cn(
                                            "bg-black/60 text-amber-300 border-amber-500/40 hover:bg-white/10 shadow-md",
                                            primaryStyles && (primaryStyles as any).calBorder
                                          )
                                        : "bg-gradient-to-br from-emerald-950/80 via-emerald-900/50 to-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                    )
                                  : "hover:bg-white/5 border-transparent text-amber-300/80 hover:text-amber-200"
                            )}
                          >
                            <span className={cn(
                              "relative z-10 font-mono",
                              isCurrentDay 
                                ? "font-bold text-black" 
                                : dayBills.length > 0 && hasPaid 
                                  ? "text-emerald-400 font-bold" 
                                  : "font-semibold text-amber-300 group-hover/day:text-amber-200"
                            )}>
                              {dayBills.length > 0 && hasPaid ? (
                                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                              ) : (
                                day.getDate()
                              )}
                            </span>
                            
                            {dayBills.length > 0 && (
                              <div className="absolute bottom-1.5 flex gap-0.5">
                                {dayBills.slice(0, 3).map((b) => {
                                  const styles = getCategoryStyles(b.category);
                                  return (
                                    <div 
                                      key={b.id} 
                                      className={cn(
                                        "w-1 h-1 rounded-full",
                                        isCurrentDay ? "bg-black" : styles.dot,
                                        b.isPaid && "opacity-40"
                                      )} 
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.section>
                ))
              )}
            </div>
          )}

          {/* Bottom Non-Custodial Safeguard Disclaimer Banner */}
          <div className="max-w-7xl mx-auto mt-12 mb-4 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-950/30 via-[#141208]/50 to-black/70 border border-amber-500/25 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-md shadow-amber-950/20">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[10px] sm:text-xs font-mono text-amber-100/90 leading-tight">
                <strong className="text-amber-300 font-bold tracking-wide mr-1">NON-CUSTODIAL DISCLAIMER:</strong>
                We never touch, hold, deposit, or withdraw your money. Capital Command is strictly a visual ledger calculation tool.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLegalModalTab('terms');
                setIsLegalDisclaimerOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-[9px] font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 active:scale-95 flex items-center gap-1 shadow-xs"
              title="View full non-custodial terms & privacy policy"
            >
              <FileText className="w-3 h-3" />
              <span>Terms &amp; Disclaimers</span>
            </button>
          </div>
        </main>
      </div>

      {/* Mobile Floating Action Button (Elevated so it never overlaps the footer status bar) */}
      <div className="sm:hidden fixed bottom-14 right-4 z-30">
        <button 
          onClick={() => {
            setSelectedDay(new Date());
            openModal(new Date());
          }}
          className="w-13 h-13 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)] active:scale-90 transition-all border-3 border-black group"
          title="Add New Bill"
        >
          <Plus className="w-6 h-6 stroke-[3] group-active:rotate-90 transition-transform" />
        </button>
      </div>

      {/* Footer Status Bar with Full Category Legend & Right-Aligned Legal Controls */}
      <footer className="h-11 sm:h-12 bg-[#080b09]/95 backdrop-blur-xl border-t border-amber-500/20 px-2.5 sm:px-5 md:px-6 flex items-center justify-between shrink-0 z-40 gap-2 sm:gap-4 overflow-x-auto no-scrollbar shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        {/* Left to Mid-Right: All Category Titles & Colors Fully Displayed without Truncation or Overlap */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] md:text-[9.5px] text-slate-300 font-bold uppercase tracking-wider font-mono overflow-x-auto no-scrollbar scroll-smooth py-0.5 min-w-0 flex-1">
          <span className="text-amber-400 font-extrabold text-[7.5px] sm:text-[8.5px] tracking-widest uppercase shrink-0 mr-0.5 flex items-center gap-1">
            <span className="w-1 h-2.5 bg-amber-500 rounded-full inline-block" />
            LEGEND:
          </span>
          {ALL_CATEGORY_KEYS.map((key) => {
            const cat = categories[key] || DEFAULT_CATEGORIES[key];
            const styles = getCategoryStyles(key);
            return (
              <span 
                key={key} 
                className="inline-flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap bg-black/60 hover:bg-black/90 px-2 py-0.5 rounded-md border border-white/10 hover:border-amber-500/40 shrink-0 text-[7.5px] sm:text-[8.5px] md:text-[9px] shadow-sm"
                title={cat.label}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full ring-1 ring-black/80 shrink-0 shadow-sm", styles.dot)}></span>
                <span className="font-semibold tracking-tight text-slate-200">{cat.label.toUpperCase()}</span>
              </span>
            );
          })}
          <span className="inline-flex items-center gap-1.5 opacity-95 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/30 text-emerald-300 shrink-0 text-[7.5px] sm:text-[8.5px] md:text-[9px] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]"></span>
            <span className="font-semibold text-emerald-300">REAL-TIME</span>
          </span>
        </div>

        {/* Far Right: Sleek, Compact Legal & Compliance Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[8.5px] md:text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => {
              setLegalModalTab('terms');
              setIsLegalDisclaimerOpen(true);
            }}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer whitespace-nowrap text-[7.5px] sm:text-[8.5px]"
            title="View Terms of Service, Disclaimers & Non-Custodial Hold-Harmless Policy"
          >
            <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
            <span>TERMS</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLegalModalTab('privacy');
              setIsLegalDisclaimerOpen(true);
            }}
            className="px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-200 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer whitespace-nowrap text-[7.5px] sm:text-[8.5px]"
            title="View Privacy & Data Encryption Policy"
          >
            PRIVACY
          </button>
          <div className="hidden xl:flex items-center gap-1.5 text-slate-500 text-[7.5px] pl-1 border-l border-white/10">
            <span>AUDIT v2.4</span>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
          </div>
        </div>
      </footer>

      {/* Notifications Side Panel */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 bg-bg-deep/40 backdrop-blur-md z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-bg-card border-l border-border-subtle shadow-[0_0_100px_rgba(0,0,0,0.5)] z-50 overflow-y-auto no-scrollbar p-10 flex flex-col gap-10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white leading-tight">Bill Alerts</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-mono mt-1">Payment Reminders & Schedule Updates</p>
                </div>
                <button onClick={() => setShowNotifications(false)} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all border border-transparent hover:border-border-subtle">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-10">
                {/* Push Notification Setup */}
                {!isNotificationsEnabled ? (
                  <div className="p-8 bg-brand-emerald/5 border border-brand-emerald/20 rounded-[2rem] space-y-4">
                    <h4 className="text-sm font-bold text-brand-emerald uppercase tracking-widest leading-none">Push Notifications & Reminders</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Receive helpful payment reminders directly to your device before your bills are due.</p>
                    <button 
                      onClick={subscribeToNotifications}
                      className="premium-button w-full !py-3 !rounded-xl !bg-brand-emerald !text-white !text-[10px] uppercase tracking-widest shadow-lg shadow-brand-emerald/20 flex items-center justify-center gap-2"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      Enable Reminders
                    </button>
                  </div>
                ) : (
                  <div className="p-6 bg-white/5 border border-border-subtle rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reminders Active</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <button onClick={checkReminders} className="text-slate-400 hover:text-brand-emerald transition-colors" title="Check Due Dates">
                         <RefreshCw className="w-4 h-4" />
                       </button>
                       <button onClick={testNotification} className="text-slate-400 hover:text-white transition-colors" title="Send Test Notification">
                         <Bell className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                )}

                {periodAlert && (
                  <div className="p-8 bg-white/5 rounded-[2.5rem] border border-brand-emerald/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-emerald/10 blur-3xl -mr-16 -mt-16" />
                    
                    <div className="flex items-center gap-3 text-brand-emerald mb-4 relative z-10">
                      <AlertCircle className="w-6 h-6" />
                      <span className="text-sm font-bold uppercase tracking-[0.2em] font-mono">{periodAlert.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed relative z-10">
                      Bills due in period: <span className="text-white font-bold">{format(periodAlert.start, 'MMM d')} — {format(periodAlert.end, 'MMM d')}</span>.
                    </p>
                    <div className="space-y-3 mb-8 relative z-10">
                      {periodAlert.bills.map(b => {
                        const currentBill = bills.find(item => item.id === b.id) || b;
                        return (
                          <div key={b.id} className={cn(
                            "flex items-center justify-between bg-black/40 p-4 rounded-2xl border transition-all duration-300",
                            currentBill.isPaid
                              ? "border-emerald-500/40 bg-emerald-950/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                              : "border-white/5 hover:border-white/15"
                          )}>
                            <div className="min-w-0 flex-1 pr-3">
                              <span className={cn("text-[13px] font-medium block truncate", currentBill.isPaid ? "text-emerald-300 line-through opacity-70" : "text-slate-200")}>{currentBill.name}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[11px] font-mono font-bold text-brand-emerald">${currentBill.amount}</p>
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest">{format(parseISO(currentBill.dueDate), 'MMM d')}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => togglePaid(currentBill.id)}
                              className={cn(
                                "px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border shrink-0",
                                currentBill.isPaid
                                  ? "bg-brand-emerald/20 border-brand-emerald/40 text-brand-emerald shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-brand-emerald/20 hover:text-brand-emerald hover:border-brand-emerald/30"
                              )}
                            >
                              <CheckCircle2 className={cn("w-3.5 h-3.5 stroke-[2.5]", !currentBill.isPaid && "opacity-40")} />
                              <span>{currentBill.isPaid ? 'PAID' : 'MARK PAID'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <button 
                      onClick={() => setPeriodAlert(null)}
                      className="premium-button w-full !py-3 shadow-xl relative z-10"
                    >
                      Acknowledge
                    </button>
                  </div>
                )}

                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono px-1">Upcoming Due Dates</h4>
                  {upcomingBills.length === 0 ? (
                    <div className="text-center py-20 opacity-20 flex flex-col items-center">
                      <CheckCircle2 className="w-12 h-12 mb-4 stroke-[1]" />
                      <p className="text-xs font-mono uppercase tracking-widest">No upcoming bills</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBills.map(bill => {
                        const styles = getCategoryStyles(bill.category);
                        return (
                          <div key={bill.id} className={cn(
                            "p-6 rounded-3xl border flex items-start gap-5 transition-all duration-500 group/item relative overflow-hidden",
                            bill.isPaid
                              ? "bg-gradient-to-r from-emerald-950/70 via-emerald-900/40 to-emerald-950/70 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                              : "bg-white/5 border-border-subtle hover:bg-white/[0.07]"
                          )}>
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-transparent", styles.bg, styles.text)}>
                              {getDayIcon(bill.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-white truncate">{bill.name}</h4>
                              <div className="flex items-center gap-3 mt-1.5 font-mono">
                                <p className="text-xs font-bold text-brand-emerald">${bill.amount}</p>
                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                <p className="text-[10px] text-slate-500 uppercase">{format(parseISO(bill.dueDate), 'MMM d')}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => togglePaid(bill.id)}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-600 hover:text-brand-emerald hover:bg-brand-emerald/10 transition-all border border-transparent hover:border-brand-emerald/20 mt-1"
                            >
                              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bill Modal */}
      <AnimatePresence>
        {isModalOpen && selectedDay && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-bg-deep/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-gradient-to-br from-[#0c1611] via-[#090f0c] to-black border border-emerald-500/20 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]"
            >
              <div className="bg-gradient-to-br from-emerald-950/80 via-[#0d1612] to-black p-10 sm:p-12 text-white border-b border-emerald-500/20 shrink-0 relative overflow-hidden">
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">Bill Schedule & Due Date</h3>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">{format(selectedDay, 'EEEE, MMMM do')}</p>
                    </div>
                  </div>
                  <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="text-3xl font-serif font-bold tracking-tight text-white relative z-10 leading-none">
                  {editingBill ? 'Edit Bill' : (bills.filter(b => isSameDay(parseISO(b.dueDate), selectedDay)).length > 0 ? "Today's Bills" : 'Add New Bill')}
                </h2>
              </div>

              <div className="p-12 overflow-y-auto custom-scrollbar space-y-10">
                {viewMode === 'biweekly' && (
                  <button 
                    onClick={() => {
                      const p = biWeeklyPeriods.find(period => selectedDay >= period.start && selectedDay < period.end);
                      if (p) triggerPeriodAlertForPeriod(p);
                      closeModal();
                    }}
                    className="w-full py-4 px-6 bg-white/5 text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] font-mono rounded-2xl border border-border-subtle hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                  >
                    <AlertCircle className="w-4 h-4 text-emerald-400" />
                    2-Week Pay Period Breakdown
                  </button>
                )}
                
                {/* List Existing Bills for the day */}
                {bills.filter(b => isSameDay(parseISO(b.dueDate), selectedDay)).length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2 px-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono">Current Bills</p>
                      {!editingBill && !isAddingNew && (
                        <button 
                          onClick={() => {
                            setEditingBill(null);
                            setIsAddingNew(true);
                            setBillName('');
                            setBillAmount('');
                            setBillFrequency('none');
                            setBillCategory('utilities');
                          }}
                          className="text-[10px] font-bold text-brand-emerald uppercase tracking-widest hover:brightness-125 transition-all"
                        >
                          + Add Bill
                        </button>
                      )}
                      {isAddingNew && (
                        <button 
                          onClick={() => setIsAddingNew(false)}
                          className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {bills.filter(b => isSameDay(parseISO(b.dueDate), selectedDay)).map(bill => {
                        const catInfo = categories[bill.category];
                        const styles = COLOR_OPTIONS.find(c => c.id === catInfo?.color);
                        return (
                          <div key={bill.id} className={cn(
                            "flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group",
                            editingBill?.id === bill.id 
                              ? "bg-white/10 border-white/20 shadow-2xl" 
                              : bill.isPaid
                                ? "bg-gradient-to-r from-emerald-950/70 via-emerald-900/40 to-emerald-950/70 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                                : "bg-white/5 border-border-subtle hover:border-white/10"
                          )}>
                            <div className="flex items-center gap-5 relative z-10">
                              <button 
                                onClick={() => togglePaid(bill.id)}
                                className={cn(
                                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border",
                                  bill.isPaid 
                                    ? "bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald" 
                                    : "bg-black/20 border-white/5 text-slate-600 hover:text-brand-emerald hover:border-brand-emerald/20"
                                )}
                              >
                                <CheckCircle2 className={cn("w-6 h-6 stroke-[2.5]", !bill.isPaid && "opacity-40")} />
                              </button>
                              <div>
                                <p className={cn("text-lg font-bold text-white transition-all", bill.isPaid && "opacity-40 line-through")}>{bill.name}</p>
                                <div className="flex items-center gap-3 mt-1 underline decoration-border-subtle underline-offset-4">
                                  <p className="text-xs font-mono font-bold text-brand-emerald/80">${Number(bill.amount).toLocaleString()}</p>
                                  <span className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]", styles?.text)} />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 relative z-10">
                              <button 
                                onClick={() => openModal(selectedDay, bill)} 
                                className={cn(
                                  "w-9 h-9 flex items-center justify-center rounded-xl transition-all",
                                  editingBill?.id === bill.id ? "bg-white text-black" : "bg-white/5 text-slate-500 hover:text-white"
                                )}
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              {bill.recurringParentId ? (
                                <div className="flex items-center gap-1">
                                  <button 
                                    onClick={() => deleteBill(bill.id, 'single')}
                                    className="px-2 py-1 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg text-[9px] font-mono font-bold transition-all flex flex-col items-center leading-none gap-0.5"
                                    title="Remove this entry only"
                                  >
                                    <span className="text-[7px] text-slate-500 uppercase tracking-tighter">Remove</span>
                                    <span>This</span>
                                  </button>
                                  <button 
                                    onClick={() => deleteBill(bill.id, 'future')}
                                    className="px-2 py-1 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg text-[9px] font-mono font-bold transition-all flex flex-col items-center leading-none gap-0.5"
                                    title="Remove this and all further duplicate entries after that date"
                                  >
                                    <span className="text-[7px] text-slate-500 uppercase tracking-tighter">Remove</span>
                                    <span>Future</span>
                                  </button>
                                  <button 
                                    onClick={() => deleteBill(bill.id, 'all')}
                                    className="px-2 py-1 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg text-[9px] font-mono font-bold transition-all flex flex-col items-center leading-none gap-0.5"
                                    title="Remove all series"
                                  >
                                    <span className="text-[7px] text-slate-500 uppercase tracking-tighter">Remove</span>
                                    <span>All</span>
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => deleteBill(bill.id, 'single')}
                                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:text-rose-500 transition-all"
                                  title="Remove"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {(editingBill || isAddingNew || bills.filter(b => isSameDay(parseISO(b.dueDate), selectedDay)).length === 0) ? (
                  <form onSubmit={handleAddBill} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center px-1">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">
                        {editingBill ? 'Edit Bill Details' : 'New Bill Details'}
                      </h4>
                      {editingBill && (
                        <button 
                          type="button"
                          onClick={() => {
                            setEditingBill(null);
                            setBillName('');
                            setBillAmount('');
                          }}
                          className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono px-1">Bill Name / Payee</label>
                        <input 
                          type="text" 
                          required
                          value={billName}
                          onChange={(e) => setBillName(e.target.value)}
                          placeholder="e.g. Electric Bill, Rent, Netflix"
                          className="w-full bg-white/5 border border-border-subtle rounded-[1.5rem] px-8 py-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all font-serif text-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono px-1">Amount ($)</label>
                          <div className="relative">
                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input 
                              type="number" 
                              required
                              step="0.01"
                              value={billAmount}
                              onChange={(e) => setBillAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-white/5 border border-border-subtle rounded-[1.5rem] pl-14 pr-8 py-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all font-mono text-lg font-bold"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono px-1">Repeat Frequency</label>
                          <div className="relative group">
                            <Repeat className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-emerald transition-colors" />
                            <select 
                              value={billFrequency}
                              onChange={(e) => setBillFrequency(e.target.value as BillFrequency)}
                              disabled={!!editingBill}
                              className="w-full bg-[#0d0d12] border border-border-subtle rounded-[1.5rem] pl-14 pr-8 py-5 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all font-mono text-[11px] uppercase tracking-widest appearance-none disabled:opacity-30 cursor-pointer"
                            >
                              <option value="none" className="bg-[#0d0d12] text-slate-100 py-2">One-time Payment</option>
                              <option value="weekly" className="bg-[#0d0d12] text-slate-100 py-2">Weekly Cycle</option>
                              <option value="bi-weekly" className="bg-[#0d0d12] text-slate-100 py-2">Bi-weekly Cycle</option>
                              <option value="monthly" className="bg-[#0d0d12] text-slate-100 py-2">Monthly Cycle</option>
                              <option value="yearly" className="bg-[#0d0d12] text-slate-100 py-2">Annual Cycle</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                              <ChevronRight className="w-4 h-4 rotate-90" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono px-1">Payment Account / Card (Optional)</label>
                        <div className="relative group">
                          <Landmark className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-emerald transition-colors" />
                          <select 
                            value={billAccountId}
                            onChange={(e) => setBillAccountId(e.target.value)}
                            className="w-full bg-[#0d0d12] border border-border-subtle rounded-[1.5rem] pl-14 pr-8 py-5 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all font-mono text-[11px] uppercase tracking-widest appearance-none cursor-pointer"
                          >
                            <option value="" className="bg-[#0d0d12] text-slate-400 py-2">-- Select Bank Account or Credit Card --</option>
                             <option value="personal-savings-vault" className="bg-[#0d0d12] text-amber-300 py-2 font-bold">
                               Personal Savings Vault [Bal: ${personalSavingsBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}]
                             </option>
                            {financialAccounts.map(acc => (
                              <option key={acc.id} value={acc.id} className="bg-[#0d0d12] text-slate-100 py-2">
                                {acc.institutionName} - {acc.accountName} ({acc.accountType.toUpperCase()} ...{acc.last4}) [Bal: ${acc.balance.toLocaleString()}]
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <ChevronRight className="w-4 h-4 rotate-90" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono px-1">Category</label>
                        <div className="flex flex-wrap gap-2">
                          {(Object.entries(categories) as [BillCategory, CategoryInfo][]).map(([key, value]) => {
                            const isSelected = billCategory === key;
                            const styles = getCategoryStyles(key);
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setBillCategory(key)}
                                className={cn(
                                  "px-5 py-3 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                                  isSelected 
                                    ? cn(styles.bg, styles.text, "border-transparent scale-105 shadow-xl") 
                                    : "bg-white/5 border-border-subtle text-slate-500 hover:border-white/20 hover:text-white"
                                )}
                              >
                                {value.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {editingBill && editingBill.recurringParentId && (
                        <button 
                          type="button"
                          onClick={() => setUpdateFutureInstances(!updateFutureInstances)}
                          className={cn(
                            "w-full flex items-center gap-5 p-6 rounded-[1.5rem] border transition-all text-left group",
                            updateFutureInstances ? "bg-white/10 border-white/20" : "bg-white/5 border-border-subtle hover:border-white/10"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-xl border flex items-center justify-center transition-all",
                            updateFutureInstances ? "bg-white border-white text-black" : "border-slate-700 bg-black/20 group-hover:border-slate-500"
                          )}>
                            {updateFutureInstances && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">Propagate Modifications</span>
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">Apply changes to all downstream instances in this series</span>
                          </div>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-4 pt-4 relative z-10">
                      <button 
                        type="submit" 
                        className="w-full py-5 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-2xl font-bold font-mono text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                      >
                        <div className="flex items-center justify-center gap-3">
                          {editingBill ? 'Commit Changes' : 'Authorize Entry'}
                          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                        </div>
                      </button>
                      
                      {editingBill && (
                        <div className={cn("grid gap-3", editingBill.recurringParentId ? "grid-cols-3" : "grid-cols-1")}>
                          <button 
                            type="button" 
                            onClick={() => deleteBill(editingBill.id, 'single')}
                            className="bg-white/5 border border-border-subtle text-slate-500 hover:text-rose-500 hover:border-rose-500/20 hover:bg-rose-500/5 py-2.5 rounded-2xl text-[9px] uppercase font-bold tracking-wider transition-all flex flex-col items-center leading-none gap-1"
                          >
                            <span className="text-[7px] opacity-60">Remove</span>
                            <span>This</span>
                          </button>
                          {editingBill.recurringParentId && (
                            <>
                              <button 
                                type="button" 
                                onClick={() => deleteBill(editingBill.id, 'future')}
                                className="bg-white/5 border border-border-subtle text-slate-500 hover:text-rose-500 hover:border-rose-500/20 hover:bg-rose-500/5 py-2.5 rounded-2xl text-[9px] uppercase font-bold tracking-wider transition-all flex flex-col items-center leading-none gap-1"
                              >
                                <span className="text-[7px] opacity-60">Remove</span>
                                <span>This & Future</span>
                              </button>
                              <button 
                                type="button" 
                                onClick={() => deleteBill(editingBill.id, 'all')}
                                className="bg-white/5 border border-border-subtle text-slate-500 hover:text-rose-500 hover:border-rose-500/20 hover:bg-rose-500/5 py-2.5 rounded-2xl text-[9px] uppercase font-bold tracking-wider transition-all flex flex-col items-center leading-none gap-1"
                              >
                                <span className="text-[7px] opacity-60">Remove</span>
                                <span>All Series</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </form>
                ) : (
                  <button 
                    onClick={() => {
                      setEditingBill(null);
                      setIsAddingNew(true);
                      setBillName('');
                      setBillAmount('');
                      setBillFrequency('none');
                      setBillCategory('utilities');
                    }}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-border-subtle text-white rounded-[1.5rem] font-bold transition-all flex items-center justify-center gap-3 group shadow-lg"
                  >
                    <Plus className="w-4 h-4 text-brand-emerald group-hover:scale-125 transition-transform" />
                    <span className="text-xs uppercase tracking-widest">New Entry</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-bg-deep/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-gradient-to-br from-[#0c1611] via-[#090f0c] to-black border border-emerald-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-900 via-bg-card to-black p-6 md:p-8 border-b border-border-subtle shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                    <Settings className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">System Settings Vault</h2>
                    <p className="text-xs text-slate-400 font-mono">Account sync, security locks, payday schedules & defaults</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)} 
                  className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs Header */}
              <div className="flex items-center flex-wrap gap-2 p-3 bg-black/40 border-b border-border-subtle shrink-0">
                <button
                  onClick={() => {
                    setSettingsTab('plaid');
                    settingsScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap",
                    settingsTab === 'plaid'
                      ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow-lg shadow-amber-500/20"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Manual Accounts
                </button>

                <button
                  onClick={() => {
                    setSettingsTab('security');
                    settingsScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap",
                    settingsTab === 'security'
                      ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow-lg shadow-amber-500/20"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Data &amp; Security
                </button>

                <button
                  onClick={() => {
                    setSettingsTab('preferences');
                    settingsScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap",
                    settingsTab === 'preferences'
                      ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow-lg shadow-amber-500/20"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  App Preferences
                </button>

                <button
                  onClick={() => {
                    setSettingsTab('styling');
                    settingsScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap",
                    settingsTab === 'styling'
                      ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow-lg shadow-amber-500/20"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Palette className="w-3.5 h-3.5" />
                  Category Aesthetics
                </button>

                <button
                  onClick={() => {
                    setSettingsTab('beta');
                    settingsScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap",
                    settingsTab === 'beta'
                      ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow-lg shadow-amber-500/20"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Package className="w-3.5 h-3.5" />
                  Beta Package &amp; App
                </button>
              </div>
              {/* Tab Content Body with Ref to always scroll to top */}
              <div ref={settingsScrollRef} className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar grow">
                {/* TAB 1: MANUAL ACCOUNTS LEDGER */}
                {settingsTab === 'plaid' && (
                  <div className="space-y-6">
                    {/* Manual Ledger Connection Status */}
                    <div className="p-6 bg-gradient-to-br from-blue-950/40 via-black/40 to-black/60 rounded-3xl border border-blue-500/30 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-blue-400">
                          <Building2 className="w-5 h-5 text-blue-400" />
                          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">Manual Accounts &amp; Cards Ledger</h3>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-serif font-bold text-white mb-1">
                            {financialAccounts.length > 0
                              ? `You are tracking ${financialAccounts.length} manual account${financialAccounts.length > 1 ? 's' : ''}.`
                              : 'No accounts added yet.'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Maintain your financial ledger via manual entry with visual brand logos.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setIsSettingsOpen(false);
                              setIsAccountModalOpen(true);
                            }}
                            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-950/50 flex items-center justify-center gap-2"
                          >
                            + Add Account or Card
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Manual Accounts List */}
                    <div className="p-6 bg-white/5 rounded-3xl border border-border-subtle space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-amber-400">
                          <Tag className="w-4 h-4 text-amber-400" />
                          <div>
                            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">Active Manual Accounts</h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">All accounts and credit cards tracked in your local ledger.</p>
                          </div>
                        </div>
                      </div>

                      {financialAccounts.length === 0 ? (
                        <p className="text-xs text-slate-500 font-mono italic">No manual accounts added yet. Click "+ Add Account or Card" above.</p>
                      ) : (
                        <div className="space-y-2.5">
                          {financialAccounts.map((acc) => (
                            <div
                              key={acc.id}
                              className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0 flex items-center gap-3">
                                {(() => {
                                  const brand = getBankBrandInfo(acc.institutionName);
                                  return (
                                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md", acc.logoBg || brand.bg)}>
                                      <span>{brand.short}</span>
                                    </div>
                                  );
                                })()}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-white font-serif">{acc.institutionName}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">({acc.accountName})</span>
                                    <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                      Manual
                                    </span>
                                  </div>
                                  <p className="text-[10px] font-mono text-slate-400">
                                    Balance: <span className="text-emerald-400 font-bold">${acc.balance.toLocaleString()}</span>
                                    {acc.creditLimit ? ` • Limit: $${acc.creditLimit.toLocaleString()}` : ''}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setIsSettingsOpen(false);
                                  setEditingAccount(acc);
                                  setIsAccountModalOpen(true);
                                }}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-all"
                              >
                                Edit
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Privacy & Safeguards Notice */}
                    <div className="p-6 rounded-3xl bg-blue-950/20 border border-blue-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-blue-400">
                        <Shield className="w-4 h-4" />
                        <h3 className="text-xs font-mono font-bold uppercase tracking-widest">End-to-End Financial Privacy</h3>
                      </div>
                      
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Capital Command is a strictly local-first, offline financial ledger. All data (accounts, bills, logs) is stored exclusively on your device. We do not maintain, hold, or process your bank credentials or financial information on external servers. Privacy is guaranteed by the browser sandbox.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-center">
                          <span className="text-emerald-400 font-mono text-[10px] font-bold uppercase block">Offline</span>
                          <span className="text-[10px] text-slate-400">Data never leaves device</span>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-center">
                          <span className="text-emerald-400 font-mono text-[10px] font-bold uppercase block">Non-Custodial</span>
                          <span className="text-[10px] text-slate-400">No passwords stored</span>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-center">
                          <span className="text-emerald-400 font-mono text-[10px] font-bold uppercase block">Local-Only</span>
                          <span className="text-[10px] text-slate-400">100% private ledger</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: DATA SECURITY & LOCAL CONTROLS */}
                {settingsTab === 'security' && (
                  <div className="space-y-6">
                    {/* Legal Safeguards & Zero Liability Policy */}
                    <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/30 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3 text-amber-400">
                          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                            <ShieldCheck className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">Legal Safeguards &amp; Zero-Liability Terms</h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">Offline-first architecture, non-custodial terms, and liability exemptions.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setLegalModalTab('terms');
                              setIsLegalDisclaimerOpen(true);
                            }}
                            className="py-2.5 px-3.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                          >
                            <FileText className="w-4 h-4 text-black" />
                            Terms &amp; Audit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLegalModalTab('privacy');
                              setIsLegalDisclaimerOpen(true);
                            }}
                            className="py-2.5 px-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                          >
                            <Lock className="w-4 h-4 text-emerald-300" />
                            Privacy Policy
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Backup & Restore */}
                    <div className="p-6 bg-white/5 rounded-3xl border border-border-subtle space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Database className="w-4 h-4" />
                        <div>
                          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">Data Vault Backup & Restoration</h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">Export full local ledger JSON backup or restore saved state.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={exportBackupData}
                          className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
                        >
                          <Download className="w-4 h-4" />
                          Export Data (.json)
                        </button>
                        <label className="py-3.5 px-4 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-center border border-border-subtle">
                          <Upload className="w-4 h-4" />
                          Import Data (.json)
                          <input type="file" accept=".json" onChange={importBackupData} className="hidden" />
                        </label>
                      </div>

                      {/* Email Account Transfer & Backup Instructions */}
                      <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-3 font-sans text-xs text-slate-300">
                        <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold uppercase tracking-wider text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>How to Transfer All Data to a New Email</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          You can easily transfer all of your bills, calendar configurations, savings data, and financial accounts to your new email using the built-in Data Backup & Restore feature.
                        </p>
                        <div className="space-y-2 text-[11px] text-slate-300 font-mono">
                          <p><strong className="text-emerald-400">Step 1: Export your current app data</strong><br />
                          Click &quot;Export Data (.json)&quot; to download your backup file.</p>
                          <p><strong className="text-emerald-400">Step 2: Log out of your current account</strong><br />
                          In the settings menu or profile section, click &quot;Logout / Switch Account&quot; to sign out of your current session.</p>
                          <p><strong className="text-emerald-400">Step 3: Sign in with your new email</strong><br />
                          Log in (or register) using your other email address where you want to receive your calendar alerts.</p>
                          <p><strong className="text-emerald-400">Step 4: Import your data into the new account</strong><br />
                          Once logged into your new account, open Settings (⚙️), locate Data Vault Backup & Restoration, and click &quot;Import Data (.json)&quot; to upload your backup file. All bills, accounts, and system settings will instantly populate and securely sync to your new cloud account!</p>
                        </div>
                      </div>
                    </div>

                    {/* Master PIN Lock */}
                    <div className="p-6 bg-white/5 rounded-3xl border border-border-subtle space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <ShieldAlert className="w-4 h-4" />
                          <div>
                            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">Master Security PIN Lock</h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">Require a 4-digit PIN screen-lock to view financial ledger.</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const next = !isPinEnabled;
                            setIsPinEnabled(next);
                            if (next) setIsAppLocked(true);
                          }}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                            isPinEnabled ? "bg-emerald-500" : "bg-slate-700"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                              isPinEnabled ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                      </div>

                      {isPinEnabled && (
                        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                              Configure 4-Digit Master PIN
                            </label>
                            <input
                              type="password"
                              maxLength={4}
                              value={appPin}
                              onChange={(e) => setAppPin(e.target.value.replace(/\D/g, ''))}
                              className="input-field font-mono text-center text-lg font-bold tracking-widest w-36"
                              placeholder="1234"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setIsAppLocked(true);
                              setIsSettingsOpen(false);
                            }}
                            className="py-3 px-5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                          >
                            <LockKeyhole className="w-4 h-4 text-amber-400" />
                            Lock App Screen Now
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Complete Data Reset */}
                    <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-4">
                      <div className="flex items-center gap-2 text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                        <div>
                          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-rose-300">Complete Local Data Wipe</h3>
                          <p className="text-[10px] text-rose-200/70 mt-0.5">Permanently clear all bills, savings deposits, and settings.</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsResetConfirmOpen(true)}
                        className="py-3.5 px-6 bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Reset All Application Data
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: APPLICATION PREFERENCES */}
                {settingsTab === 'preferences' && (
                  <div className="space-y-6">
                    {/* Dashboard Card Stack Order Reordering */}
                    <div className="p-6 bg-white/5 rounded-3xl border border-border-subtle space-y-4">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Sliders className="w-4 h-4" />
                        <div>
                          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">Dashboard Card Stack Order</h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">Reorder the vertical stack sequence of main dashboard cards (e.g. move Tax Liability above Debt Engine).</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {cardOrder.map((cardKey, idx) => {
                          const labels: Record<CardSectionKey, string> = {
                            fundsAvailable: 'Paycheck Balance',
                            income: 'Total Monthly Income',
                            expenses: 'Total Monthly Expenses',
                            upcomingBanner: 'Pay Period Upcoming Bills',
                            autoPaySection: 'Active Auto-Pay & Subscriptions',
                            accountsCenter: 'Bank Accounts & Credit Cards',
                            debtEngine: 'Debt Payoff Calculator',
                            taxReserve: 'Tax Reserve & Savings Calculator',
                          };
                          return (
                            <div key={cardKey} className="p-3 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[10px] text-slate-400 font-bold">
                                  {idx + 1}
                                </span>
                                <span className="text-xs font-serif font-bold text-white">{labels[cardKey]}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => moveCardOrder(idx, 'up')}
                                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white rounded-lg text-[10px] font-mono font-bold uppercase transition-all"
                                  title="Move Up"
                                >
                                  ↑ Up
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === cardOrder.length - 1}
                                  onClick={() => moveCardOrder(idx, 'down')}
                                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white rounded-lg text-[10px] font-mono font-bold uppercase transition-all"
                                  title="Move Down"
                                >
                                  ↓ Down
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>


                    {/* Payday Schedule Engine */}
                    <div className="p-6 bg-white/5 rounded-3xl border border-border-subtle space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CalendarIcon className="w-4 h-4" />
                        <div>
                          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">Payday Schedule Engine</h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">Align paycheck cycle projections with period income matching.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                            Primary Paycheck Frequency
                          </label>
                          <select
                            value={paydayFrequency}
                            onChange={(e) => setPaydayFrequency(e.target.value as any)}
                            className="input-field text-xs font-mono"
                          >
                            <option value="biweekly" className="bg-slate-900 text-white">Bi-Weekly (Every 14 Days)</option>
                            <option value="semimonthly" className="bg-slate-900 text-white">Semi-Monthly (Twice a Month)</option>
                            <option value="monthly" className="bg-slate-900 text-white">Monthly (Once a Month)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                            Baseline Payday Anchor Date
                          </label>
                          <input
                            type="date"
                            value={baselinePaydayDate}
                            onChange={(e) => setBaselinePaydayDate(e.target.value)}
                            className="input-field text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Period Inflow Calculation Math
                        </label>
                        <select
                          value={incomeCalculationMode}
                          onChange={(e) => setIncomeCalculationMode(e.target.value as any)}
                          className="input-field text-xs font-mono"
                        >
                          <option value="half_month" className="bg-slate-900 text-white">
                            Half-Month Division: Monthly Inflow ÷ 2
                          </option>
                          <option value="annual_26" className="bg-slate-900 text-white">
                            Annualized Bi-Weekly (26 Periods): (Monthly Inflow × 12) ÷ 26
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Non-Configurable Application Defaults Info Card */}
                    <div className="p-6 rounded-3xl bg-black/60 border border-emerald-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <ShieldCheck className="w-5 h-5" />
                        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">Enforced Application Standards</h3>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        To maintain strict consistency across all financial calculation engines, ledger tables, and calendar views, the following application defaults are strictly enforced:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-400 uppercase">Currency Standard:</span>
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                            USD ($) [Enforced Default]
                          </span>
                        </div>

                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-400 uppercase">Date Format Standard:</span>
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                            MM/DD/YYYY [Enforced Default]
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: CATEGORY AESTHETICS */}
                {settingsTab === 'styling' && (
                  <div className="space-y-4">
                    {(Object.entries(categories) as [BillCategory, CategoryInfo][]).map(([key, cat]) => (
                      <div key={key} className="space-y-3 p-5 bg-white/5 rounded-3xl border border-border-subtle">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white font-serif">{cat.label}</span>
                          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-xs", getCategoryStyles(key as BillCategory).bg, getCategoryStyles(key as BillCategory).text)}>
                            {getDayIcon(key as BillCategory)}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {COLOR_OPTIONS.map((color) => (
                            <button
                              key={color.id}
                              onClick={() => {
                                const newCats = {
                                  ...categories,
                                  [key]: { ...cat, color: color.id }
                                } as CategoryConfig;
                                setCategories(newCats);
                                if (user) saveSettingsToFirestore({ categories: newCats });
                              }}
                              title={color.name}
                              className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center transition-all border-2 overflow-hidden",
                                categories[key as BillCategory].color === color.id 
                                  ? "border-white scale-110 shadow-md ring-2 ring-emerald-400/60" 
                                  : "border-transparent hover:scale-110 opacity-50 hover:opacity-100"
                              )}
                            >
                              <div className={cn("w-full h-full rounded-full", color.dot)} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 5: BETA PACKAGE & APP DISTRIBUTION */}
                {settingsTab === 'beta' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-emerald-950/40 via-black/40 to-black/60 rounded-3xl border border-emerald-500/30 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-amber-400">
                          <Package className="w-5 h-5 text-amber-400" />
                          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">App Distribution &amp; Beta Testing Hub</h3>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold uppercase flex items-center gap-1.5 shadow-sm">
                          PWA &amp; Standalone Ready
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        Distribute Capital Command to your beta testers as an installable standalone application (Desktop/Mobile) or package it as a native desktop program.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                          <h4 className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                            <Smartphone className="w-4 h-4" /> 1-Click PWA App
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Users can install directly from the browser as a borderless windowed application.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsSettingsOpen(false);
                              setIsBetaPackageModalOpen(true);
                            }}
                            className="mt-2 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Open Packaging Suite
                          </button>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                          <h4 className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                            <WifiOff className="w-4 h-4" /> Sync Preference
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Currently set to: <strong className={appConnectionMode === 'online' ? 'text-emerald-400' : 'text-amber-400'}>{appConnectionMode === 'online' ? 'AUTOMATED' : 'MANUAL'} MODE</strong>
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsSettingsOpen(false);
                              setIsConnectionModeModalOpen(true);
                            }}
                            className="mt-2 w-full py-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            Switch Sync Mode
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-black/40 border-t border-border-subtle shrink-0">
                <button 
                  onClick={() => {
                    setIsSettingsOpen(false);
                    window.location.reload();
                  }}
                  className="w-full py-4 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-2xl font-bold font-mono text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  Save Settings & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Master PIN Lock Screen Fullscreen Overlay */}
      {isAppLocked && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-[#0e1612] to-black border border-emerald-500/30 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_0_80px_rgba(16,185,129,0.15)] flex flex-col items-center text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/10 border border-emerald-500/40 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-emerald-950/40">
              <LockKeyhole className="w-7 h-7 text-amber-400" />
            </div>

            <h2 className="text-xl font-serif font-bold text-white mb-0.5">Capital Command</h2>
            <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-5 font-semibold">
              {lockScreenMode === 'verify_email'
                ? 'Email Identity Verification'
                : (!appPin || lockScreenMode === 'create')
                ? 'Create 4-Digit Security PIN'
                : 'Master PIN Security Lock'}
            </p>

            {lockScreenMode === 'verify_email' ? (
              /* Verify Email Mode for PIN Reset */
              <div className="w-full space-y-4 text-left">
                <p className="text-xs text-slate-300 text-center leading-relaxed">
                  Enter the email address you synced or logged in with to authorize resetting your security PIN.
                </p>

                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Account Email Address
                  </label>
                  <input
                    type="email"
                    value={lockResetEmail}
                    onChange={(e) => {
                      setLockResetEmailError(null);
                      setLockResetEmail(e.target.value);
                    }}
                    placeholder="name@example.com"
                    className="w-full bg-black/70 border border-border-subtle rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {lockResetEmailError && (
                  <p className="text-xs font-mono text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 text-center">
                    {lockResetEmailError}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLockScreenMode('unlock');
                      setLockResetEmail('');
                      setLockResetEmailError(null);
                      setPinError(null);
                    }}
                    className="w-1/3 py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const inputEmail = lockResetEmail.trim().toLowerCase();
                      if (!inputEmail || !inputEmail.includes('@')) {
                        setLockResetEmailError('Please enter a valid email address.');
                        return;
                      }

                      const expectedEmail = (user?.email || localStorage.getItem('syncedUserEmail') || localStorage.getItem('userEmail') || email || '').trim().toLowerCase();

                      if (expectedEmail) {
                        if (inputEmail !== expectedEmail) {
                          setLockResetEmailError('Email does not match the account synced to this vault.');
                          return;
                        }
                      } else {
                        // Remember this email for future resets
                        localStorage.setItem('syncedUserEmail', inputEmail);
                      }

                      // Email verified -> advance to create new PIN
                      setLockResetEmailError(null);
                      setLockResetEmail('');
                      setLockScreenMode('create');
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/50"
                  >
                    Verify Email
                  </button>
                </div>
              </div>
            ) : (!appPin || lockScreenMode === 'create') ? (
              /* Create New PIN Mode */
              <div className="w-full space-y-4 text-left">
                <p className="text-xs text-slate-300 text-center leading-relaxed">
                  Choose your custom 4-digit PIN to secure your financial vault.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      New 4-Digit PIN
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={lockNewPin}
                      onChange={(e) => {
                        setPinError(null);
                        setLockNewPin(e.target.value.replace(/\D/g, ''));
                      }}
                      placeholder="••••"
                      className="w-full bg-black/70 border border-border-subtle rounded-xl px-4 py-2.5 text-center text-xl font-mono font-bold text-amber-300 tracking-[0.5em] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Confirm 4-Digit PIN
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={lockConfirmPin}
                      onChange={(e) => {
                        setPinError(null);
                        setLockConfirmPin(e.target.value.replace(/\D/g, ''));
                      }}
                      placeholder="••••"
                      className="w-full bg-black/70 border border-border-subtle rounded-xl px-4 py-2.5 text-center text-xl font-mono font-bold text-amber-300 tracking-[0.5em] focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {pinError && (
                  <p className="text-xs font-mono text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 text-center">
                    {pinError}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  {appPin && (
                    <button
                      type="button"
                      onClick={() => {
                        setLockScreenMode('unlock');
                        setPinError(null);
                        setLockNewPin('');
                        setLockConfirmPin('');
                      }}
                      className="w-1/3 py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border border-white/10"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (lockNewPin.length !== 4) {
                        setPinError('PIN must be exactly 4 digits.');
                        return;
                      }
                      if (lockNewPin !== lockConfirmPin) {
                        setPinError('PINs do not match. Please re-enter.');
                        return;
                      }
                      setAppPin(lockNewPin);
                      setIsPinEnabled(true);
                      localStorage.setItem('appPin', lockNewPin);
                      localStorage.setItem('isPinEnabled', 'true');
                      if (user) {
                        saveSettingsToFirestore({ appPin: lockNewPin, isPinEnabled: true } as any);
                      }
                      setIsAppLocked(false);
                      setLockNewPin('');
                      setLockConfirmPin('');
                      setPinError(null);
                      setLockScreenMode('unlock');
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/50"
                  >
                    Save &amp; Unlock
                  </button>
                </div>
              </div>
            ) : (
              /* Unlock Screen Mode */
              <>
                {/* PIN Dots */}
                <div className="flex items-center gap-3 mb-5">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "w-4 h-4 rounded-full border-2 transition-all duration-200",
                        pinInput.length > idx
                          ? "bg-emerald-400 border-emerald-400 scale-110 shadow-md shadow-emerald-400/50"
                          : "border-slate-600 bg-white/5"
                      )}
                    />
                  ))}
                </div>

                {pinError && (
                  <p className="text-xs font-mono text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 mb-3 animate-shake">
                    {pinError}
                  </p>
                )}

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2.5 w-full mb-4">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => {
                        setPinError(null);
                        if (btn === 'C') {
                          setPinInput('');
                        } else if (btn === '⌫') {
                          setPinInput(prev => prev.slice(0, -1));
                        } else if (pinInput.length < 4) {
                          const next = pinInput + btn;
                          setPinInput(next);
                          if (next.length === 4) {
                            if (next === appPin) {
                              setIsAppLocked(false);
                              setPinInput('');
                            } else {
                              setPinError('Incorrect PIN. Try again or reset below.');
                              setPinInput('');
                            }
                          }
                        }
                      }}
                      className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-emerald-500/20 border border-white/10 text-white font-mono font-bold text-base flex items-center justify-center transition-all active:scale-95"
                    >
                      {btn}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (pinInput === appPin) {
                      setIsAppLocked(false);
                      setPinInput('');
                    } else {
                      setPinError('Incorrect PIN. Try again or reset below.');
                      setPinInput('');
                    }
                  }}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/50 mb-3"
                >
                  Unlock Vault
                </button>

                {/* Reset PIN with Email Verification Option */}
                <div className="flex items-center justify-center w-full pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400">
                  <button
                    type="button"
                    onClick={() => {
                      setPinError(null);
                      setLockResetEmail('');
                      setLockResetEmailError(null);
                      setLockScreenMode('verify_email');
                    }}
                    className="hover:text-amber-300 transition-colors underline decoration-dotted"
                  >
                    Reset / Change PIN (Verify Email)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {/* Login / Cloud Sync Optional Modal */}
        {showLoginPrompt && !user && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[70]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginPrompt(false)}
              className="absolute inset-0 bg-bg-deep/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-bg-card border border-border-subtle rounded-[2.5rem] p-8 md:p-10 z-10 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setShowLoginPrompt(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-brand-emerald rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-emerald/20 mt-2">
                  <DollarSign className="w-8 h-8 stroke-[1.5]" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Cloud Sync & Backup</h2>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-[280px] mx-auto">
                    {authMode === 'login' ? 'Sign in to access your synchronized vault across all devices.' : 'Create your free account to sync bills across devices.'}
                  </p>
                </div>

                <div className="w-full space-y-4 pt-2">
                  <form onSubmit={handleEmailAuth} className="space-y-3">
                    {authMode === 'register' && (
                      <input
                        type="text"
                        placeholder="Full name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="input-field !py-3 text-sm"
                        required
                      />
                    )}
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field !py-3 text-sm"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field !py-3 text-sm"
                      required
                    />
                    
                    {authError && (
                      <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center">{authError}</p>
                    )}

                    <button 
                      type="submit"
                      disabled={isAuthenticating}
                      className="premium-button w-full flex items-center justify-center gap-3 mt-3 !py-3 text-xs"
                    >
                      {isAuthenticating ? <Loader2 className="w-4 h-4 animate-spin" /> : (authMode === 'login' ? 'Sign In & Sync' : 'Create Account')}
                    </button>
                  </form>



                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex items-center justify-between">
                      <button 
                        type="button"
                        onClick={() => {
                          setShowLoginPrompt(false);
                          setResetEmailInput(email);
                          setShowPasswordResetModal(true);
                        }}
                        className="text-amber-400 hover:text-amber-300 text-[10px] uppercase font-bold tracking-widest transition-colors"
                      >
                        Forgot Password?
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                        className="text-slate-400 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
                      >
                        {authMode === 'login' ? "Need an account? Register" : "Have an account? Sign in"}
                      </button>
                    </div>
                    <button 
                      onClick={() => setShowLoginPrompt(false)}
                      className="text-brand-emerald text-[10px] uppercase font-bold tracking-widest hover:brightness-125 transition-colors pt-1"
                    >
                      Continue Offline / Use Local Storage
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Password Reset Modal */}
        {showPasswordResetModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[75]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordResetModal(false)}
              className="absolute inset-0 bg-bg-deep/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-bg-card border border-border-subtle rounded-[2.5rem] p-8 md:p-10 z-10 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setShowPasswordResetModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-500/30 shadow-xl mt-2">
                  <LockKeyhole className="w-8 h-8 stroke-[1.5]" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Reset Password</h2>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-[280px] mx-auto">
                    Enter your account email address and we will send you a secure password reset link.
                  </p>
                </div>

                <form onSubmit={handlePasswordReset} className="w-full space-y-4 pt-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={resetEmailInput}
                    onChange={(e) => setResetEmailInput(e.target.value)}
                    className="input-field !py-3 text-sm"
                    required
                  />

                  {resetEmailError && (
                    <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center">{resetEmailError}</p>
                  )}

                  {resetEmailStatus && (
                    <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider text-center bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">{resetEmailStatus}</p>
                  )}

                  <button 
                    type="submit"
                    className="premium-button w-full flex items-center justify-center gap-3 mt-3 !py-3 text-xs"
                  >
                    Send Reset Link
                  </button>
                </form>

                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowPasswordResetModal(false);
                      setShowLoginPrompt(true);
                    }}
                    className="text-slate-400 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[75]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChangePasswordModal(false)}
              className="absolute inset-0 bg-bg-deep/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-bg-card border border-border-subtle rounded-[2.5rem] p-8 md:p-10 z-10 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setShowChangePasswordModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-brand-emerald rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-emerald/20 mt-2">
                  <LockKeyhole className="w-8 h-8 stroke-[1.5]" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Change Password</h2>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-[280px] mx-auto">
                    Update your vault sign-in password securely.
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="w-full space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 text-left">
                      Current Password (Optional if recently signed in)
                    </label>
                    <input
                      type="password"
                      placeholder="Current password"
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                      className="input-field !py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 text-left">
                      New Password (min 6 characters)
                    </label>
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="input-field !py-3 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 text-left">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmNewPasswordInput}
                      onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                      className="input-field !py-3 text-sm"
                      required
                    />
                  </div>

                  {changePasswordError && (
                    <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center">{changePasswordError}</p>
                  )}

                  {changePasswordSuccess && (
                    <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider text-center bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">{changePasswordSuccess}</p>
                  )}

                  <button 
                    type="submit"
                    className="premium-button w-full flex items-center justify-center gap-3 mt-3 !py-3 text-xs"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {isResetConfirmOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[60]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsResetConfirmOpen(false);
                setResetPinInput('');
                setResetPinError(null);
                setResetIsConfirmed(false);
                setResetConfirmStage('form');
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#0e1117] border border-rose-500/40 rounded-[2.5rem] overflow-hidden shadow-[0_0_60px_rgba(244,63,94,0.25)] p-6 sm:p-8 text-center"
            >
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-500/30 text-rose-400 shadow-lg shadow-rose-950/50">
                <AlertTriangle className="w-8 h-8 text-rose-400 animate-pulse" />
              </div>

              {resetConfirmStage === 'form' ? (
                <>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1">Erase Application Data</h2>
                  <p className="text-rose-300 font-mono text-[10px] uppercase tracking-widest font-bold mb-3">
                    Permanent Application Data Wipe
                  </p>
                  
                  <p className="text-slate-300 text-xs mb-6 leading-relaxed">
                    This will permanently delete all upcoming bills, synced accounts, savings logs, and custom configurations.
                  </p>

                  {/* 4-Digit PIN Security Requirement */}
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left space-y-3 mb-5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <LockKeyhole className="w-3.5 h-3.5 text-amber-400" />
                      <span>{appPin ? 'Enter 4-Digit Security PIN to Authorize:' : 'Set 4-Digit PIN to Authorize Reset:'}</span>
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={resetPinInput}
                      onChange={(e) => {
                        setResetPinError(null);
                        setResetPinInput(e.target.value.replace(/\D/g, ''));
                      }}
                      placeholder="••••"
                      className="w-full bg-black/80 border border-border-subtle rounded-xl px-4 py-2.5 text-center text-xl font-mono font-bold text-amber-300 tracking-[0.5em] focus:outline-none focus:border-rose-500"
                    />

                    {resetPinError && (
                      <p className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 text-center">
                        {resetPinError}
                      </p>
                    )}

                    {/* Explicit Confirmation Checkbox */}
                    <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={resetIsConfirmed}
                        onChange={(e) => setResetIsConfirmed(e.target.checked)}
                        className="mt-0.5 rounded border-white/20 text-rose-600 focus:ring-rose-500 bg-black/60"
                      />
                      <span className="text-[10px] text-slate-300 leading-tight">
                        I confirm I want to wipe all records back to clean zero.
                      </span>
                    </label>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      type="button"
                      onClick={() => {
                        if (resetPinInput.length !== 4) {
                          setResetPinError('Please enter a valid 4-digit PIN.');
                          return;
                        }
                        if (appPin && resetPinInput !== appPin) {
                          setResetPinError('Incorrect 4-digit PIN. Verification failed.');
                          return;
                        }
                        if (!resetIsConfirmed) {
                          setResetPinError('Please check the confirmation box to proceed.');
                          return;
                        }

                        // PIN verified, now ask if the user is sure
                        setResetConfirmStage('final_confirm');
                      }}
                      className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Authorize and Delete all Data
                    </button>

                    <button 
                      type="button"
                      onClick={() => {
                        setIsResetConfirmOpen(false);
                        setResetPinInput('');
                        setResetPinError(null);
                        setResetIsConfirmed(false);
                        setResetConfirmStage('form');
                      }}
                      className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all active:scale-95 border border-white/10"
                    >
                      Cancel / Keep My Vault
                    </button>
                  </div>
                </>
              ) : (
                /* Step 2: Are You Sure? Final Confirmation */
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1">Are you sure?</h2>
                  <p className="text-amber-400 font-mono text-[10px] uppercase tracking-widest font-bold">
                    Immediate Irreversible Action
                  </p>
                  <p className="text-slate-200 text-xs leading-relaxed bg-rose-950/30 border border-rose-500/30 rounded-2xl p-4">
                    Are you absolutely sure you want to delete all data? All bills, bank connections, and savings balances will be permanently removed.
                  </p>

                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        // If user didn't have a PIN saved, save this one
                        if (!appPin && resetPinInput) {
                          setAppPin(resetPinInput);
                          setIsPinEnabled(true);
                          localStorage.setItem('appPin', resetPinInput);
                          localStorage.setItem('isPinEnabled', 'true');
                        }

                        resetAllData();
                        setIsResetConfirmOpen(false);
                        setResetPinInput('');
                        setResetPinError(null);
                        setResetIsConfirmed(false);
                        setResetConfirmStage('form');
                      }}
                      className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Yes, Permanently Delete Everything
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setResetConfirmStage('form');
                      }}
                      className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all border border-white/10"
                    >
                      No, Go Back
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {isCalculatorOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[60]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCalculatorOpen(false)}
              className="absolute inset-0 bg-bg-deep/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[340px] bg-bg-card border border-border-subtle rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]"
            >
              <div className="p-8 pb-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-border-subtle">
                    <CalculatorIcon className="w-4 h-4 text-brand-gold" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono">Quick Calculator</span>
                </div>
                <button 
                  onClick={() => setIsCalculatorOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 text-right">
                <div className="h-6 text-sm text-slate-600 font-mono font-medium mb-2 overflow-hidden truncate">
                  {calcFormula || <span className="opacity-0">—</span>}
                </div>
                <div className="text-5xl font-serif font-bold text-white overflow-hidden whitespace-nowrap tracking-tight">
                  {calcDisplay}
                </div>
              </div>

              {/* Keypad */}
              <div className="p-6 grid grid-cols-4 gap-3 bg-slate-950/50">
                <button onClick={clearCalc} className="h-14 rounded-2xl bg-white/5 text-brand-gold font-bold hover:bg-white/10 transition-all text-xs tracking-widest font-mono">AC</button>
                <button onClick={() => setCalcDisplay(String(Number(calcDisplay) * -1))} className="h-14 rounded-2xl bg-white/5 text-brand-gold font-bold hover:bg-white/10 transition-all font-mono">+/-</button>
                <button onClick={() => setCalcDisplay(String(Number(calcDisplay) / 100))} className="h-14 rounded-2xl bg-white/5 text-brand-gold font-bold hover:bg-white/10 transition-all font-mono">%</button>
                <button onClick={() => handleCalcOperator('÷')} className="h-14 rounded-2xl bg-white text-black font-bold hover:bg-opacity-90 transition-all flex items-center justify-center shadow-lg"><Divide className="w-5 h-5 stroke-[2.5]" /></button>
                
                {[7, 8, 9].map(n => (
                  <button key={n} onClick={() => handleCalcNumber(String(n))} className="h-14 rounded-2xl bg-white/5 text-white font-serif font-bold text-xl hover:bg-white/10 transition-all">{n}</button>
                ))}
                <button onClick={() => handleCalcOperator('×')} className="h-14 rounded-2xl bg-white text-black font-bold hover:bg-opacity-90 transition-all flex items-center justify-center shadow-lg transform"><X className="w-5 h-5 stroke-[2.5]" /></button>

                {[4, 5, 6].map(n => (
                  <button key={n} onClick={() => handleCalcNumber(String(n))} className="h-14 rounded-2xl bg-white/5 text-white font-serif font-bold text-xl hover:bg-white/10 transition-all">{n}</button>
                ))}
                <button onClick={() => handleCalcOperator('-')} className="h-14 rounded-2xl bg-white text-black font-bold hover:bg-opacity-90 transition-all flex items-center justify-center shadow-lg"><MinusIcon className="w-5 h-5 stroke-[2.5]" /></button>

                {[1, 2, 3].map(n => (
                  <button key={n} onClick={() => handleCalcNumber(String(n))} className="h-14 rounded-2xl bg-white/5 text-white font-serif font-bold text-xl hover:bg-white/10 transition-all">{n}</button>
                ))}
                <button onClick={() => handleCalcOperator('+')} className="h-14 rounded-2xl bg-white text-black font-bold hover:bg-opacity-90 transition-all flex items-center justify-center shadow-lg"><PlusIcon className="w-5 h-5 stroke-[2.5]" /></button>

                <button onClick={() => handleCalcNumber('0')} className="h-14 rounded-2xl bg-white/5 text-white font-serif font-bold text-xl hover:bg-white/10 transition-all col-span-2 text-left px-8">0</button>
                <button onClick={() => !calcDisplay.includes('.') && handleCalcNumber('.')} className="h-14 rounded-2xl bg-white/5 text-white font-serif font-bold text-xl hover:bg-white/10 transition-all">.</button>
                <button onClick={calculateResult} className="h-14 rounded-2xl bg-brand-emerald text-white font-bold hover:bg-opacity-90 transition-all flex items-center justify-center shadow-lg shadow-brand-emerald/20"><Equal className="w-6 h-6 stroke-[3]" /></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Revoke Confirmation Modal */}
      <AnimatePresence>
        {revokeBill && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRevokeBill(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-bg-card border border-rose-500/30 rounded-[2.5rem] p-8 shadow-2xl space-y-6 z-10"
            >
              <div className="flex items-center gap-4 text-rose-500">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Revoke Auto-Pay Debit?</h3>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Recurring Authorization Cancellation</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Are you sure you want to revoke <span className="text-white font-bold">{revokeBill.name}</span> (${revokeBill.amount})? This action will permanently eliminate future recurring debits in this series.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setRevokeBill(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-border-subtle"
                >
                  Keep Active
                </button>
                <button
                  onClick={() => handleRevokeAutoPay(revokeBill)}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-rose-900/30 font-mono"
                >
                  Confirm Revoke
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Savings Deposit Logging Modal */}
      <AnimatePresence>
        {isSavingsModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSavingsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-gradient-to-br from-[#0c1611] via-[#090f0c] to-black border border-emerald-500/30 rounded-[2.5rem] p-8 shadow-2xl space-y-6 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                    <PiggyBank className="w-3.5 h-3.5" />
                    Savings Log
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {editingDeposit ? 'Edit Savings Deposit' : 'Log Savings Deposit'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Record a transfer or contribution to track your period savings retention rate.
                  </p>
                </div>
                <button
                  onClick={() => setIsSavingsModalOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSavingsDeposit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                    Deposit Name
                  </label>
                  <input
                    type="text"
                    required
                    value={savingsName}
                    onChange={(e) => setSavingsName(e.target.value)}
                    placeholder="e.g. Emergency Fund Contribution, HYSA Transfer"
                    className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                      Amount ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-slate-400 font-mono">$</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={savingsAmount}
                        onChange={(e) => setSavingsAmount(e.target.value)}
                        placeholder="500.00"
                        className="w-full bg-black/60 border border-border-subtle rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={savingsDate}
                      onChange={(e) => setSavingsDate(e.target.value)}
                      className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                    Target Account
                  </label>
                  <select
                    value={savingsAccount}
                    onChange={(e) => setSavingsAccount(e.target.value)}
                    className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all font-mono"
                  >
                    {SAVINGS_ACCOUNT_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>
                    ))}
                    <option value="Custom Account" className="bg-slate-900 text-white">+ Custom Account...</option>
                  </select>
                </div>

                {savingsAccount === 'Custom Account' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                      Custom Target Account Name
                    </label>
                    <input
                      type="text"
                      value={customAccount}
                      onChange={(e) => setCustomAccount(e.target.value)}
                      placeholder="e.g. Vacation Vault, CD Account"
                      className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSavingsModalOpen(false);
                      setEditingDeposit(null);
                    }}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-border-subtle font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-emerald hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-brand-emerald/30 font-mono"
                  >
                    {editingDeposit ? 'Update Deposit' : 'Log Deposit'}
                  </button>
                </div>
              </form>

              {/* Logged Deposits Table inside modal */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Recent Savings Deposits
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    ${savingsDeposits.reduce((s, d) => s + d.amount, 0).toLocaleString()} Total Saved
                  </span>
                </div>

                {savingsDeposits.length === 0 ? (
                  <p className="text-xs text-slate-500 font-mono text-center py-4">No deposits logged yet.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {savingsDeposits.map(d => (
                      <div
                        key={d.id}
                        className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between gap-3 text-xs font-mono group hover:border-white/20 transition-all"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-white flex items-center gap-2 flex-wrap">
                            <span>{d.name}</span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] border border-emerald-500/20 font-normal">
                              {d.targetAccount}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {d.date}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-emerald-400">${d.amount.toLocaleString()}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingDeposit(d);
                                setSavingsName(d.name);
                                setSavingsAmount(d.amount.toString());
                                setSavingsDate(d.date);
                                if (SAVINGS_ACCOUNT_OPTIONS.includes(d.targetAccount)) {
                                  setSavingsAccount(d.targetAccount);
                                  setCustomAccount('');
                                } else {
                                  setSavingsAccount('Custom Account');
                                  setCustomAccount(d.targetAccount);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded"
                              title="Edit Deposit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSavingsDeposit(d.id)}
                              className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded"
                              title="Delete Deposit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Dedicated Goal Deposit Logging Modal */}
        {isGoalDepositModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGoalDepositModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-gradient-to-br from-[#0c1611] via-[#090f0c] to-black border border-emerald-500/30 rounded-[2.5rem] p-8 shadow-2xl space-y-6 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                    <PiggyBank className="w-3.5 h-3.5" />
                    Savings Goal Deposit
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Add Money to {emergencyReserveGoalName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add funds directly to your savings goal to build your emergency cushion.
                  </p>
                </div>
                <button
                  onClick={() => setIsGoalDepositModalOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Goal Balance Status Card */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Goal Target:</span>
                  <span className="text-white font-bold">${goalTargetVal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Current Saved:</span>
                  <span className="text-emerald-400 font-bold">${goalSavedVal.toFixed(2)}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${reserveProgressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Progress: {reserveProgressPercent.toFixed(1)}%</span>
                  <span>Remaining: ${Math.max(0, goalTargetVal - goalSavedVal).toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleSaveGoalDeposit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                    Amount to Add ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400 font-mono">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      autoFocus
                      value={goalDepositAmount}
                      onChange={(e) => setGoalDepositAmount(e.target.value)}
                      placeholder="20.00"
                      className="w-full bg-black/60 border border-border-subtle rounded-xl pl-8 pr-4 py-3 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-mono font-bold"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['10', '20', '50', '100', '200'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setGoalDepositAmount(preset)}
                        className="px-3 py-1 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-mono font-bold transition-all active:scale-95"
                      >
                        +${preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                    Deposit Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={goalDepositNote}
                    onChange={(e) => setGoalDepositNote(e.target.value)}
                    placeholder="e.g. Weekly transfer, Extra stash"
                    className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsGoalDepositModalOpen(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-border-subtle font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-emerald hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-brand-emerald/30 font-mono flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    Add Money to Goal
                  </button>
                </div>
              </form>

              {/* Deposit History Scrollable List (Last 5 Goal-Specific Deposits) */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                    <History className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Deposit History (Last 5)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {recentGoalDeposits.length} recorded
                  </span>
                </div>

                {/* Scrollable list container */}
                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                  {recentGoalDeposits.length > 0 ? (
                    recentGoalDeposits.map((dep) => (
                      <div
                        key={dep.id}
                        className="p-3 bg-black/50 border border-white/10 hover:border-emerald-500/30 rounded-xl flex items-center justify-between gap-3 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-white">
                                +${dep.amount.toFixed(2)}
                              </span>
                              {dep.note && (
                                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px] sm:max-w-[160px] bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                  {dep.note}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                              <span>{dep.timestamp || dep.date}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteGoalDeposit(dep.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all shrink-0"
                          title="Remove deposit record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 px-3 bg-black/40 border border-dashed border-white/10 rounded-xl text-center">
                      <Clock className="w-5 h-5 text-slate-600 mx-auto mb-1.5" />
                      <p className="text-[11px] font-mono text-slate-400 font-bold">No goal deposits logged yet</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Your last 5 deposits with formatted timestamps will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Cards & Accounts Management Center Modal */}
        {isAccountModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[70]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAccountModalOpen(false);
                setEditingAccount(null);
              }}
              className="absolute inset-0 bg-bg-deep/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-2xl bg-gradient-to-br from-[#0c1611] via-[#090f0c] to-black border border-emerald-500/30 rounded-[2.5rem] p-6 md:p-8 z-10 shadow-2xl overflow-hidden space-y-6 max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-start shrink-0">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                    <Landmark className="w-3.5 h-3.5" />
                    Management Center
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    {editingAccount ? 'Edit Account' : 'Add Account or Card'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Enter your account or card details manually.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAccountModalOpen(false);
                    setEditingAccount(null);
                  }}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Manual Entry Form */}
              <form onSubmit={handleSaveManualAccount} className="space-y-4 overflow-y-auto custom-scrollbar pr-1 grow">
                  {/* Quick preset chips for major banks and credit cards with visual logos */}
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Tag className="w-3 h-3 text-blue-400" /> Quick-Select Banks &amp; Cards (Visual Logo Helpers)
                      </span>
                      <span className="text-[9px] font-mono text-blue-400/80 font-bold">100% Manual Entry</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: 'Chase Total Checking', type: 'checking', inst: 'Chase', limit: '', minPay: '', bal: '2450.00', logo: 'CH', color: 'bg-blue-600/30 text-blue-200 border-blue-400/50' },
                        { name: 'Chase Freedom Unlimited', type: 'credit', inst: 'Chase', limit: '10000', minPay: '40', bal: '520.00', logo: 'CF', color: 'bg-blue-600/30 text-blue-200 border-blue-400/50' },
                        { name: 'Bank of America Advantage', type: 'checking', inst: 'Bank of America', limit: '', minPay: '', bal: '1820.00', logo: 'BOA', color: 'bg-red-600/30 text-red-200 border-red-400/50' },
                        { name: 'Wells Fargo Active Cash', type: 'credit', inst: 'Wells Fargo', limit: '8000', minPay: '30', bal: '410.00', logo: 'WF', color: 'bg-amber-600/30 text-amber-200 border-amber-400/50' },
                        { name: 'Citi Custom Cash', type: 'credit', inst: 'Citi', limit: '6500', minPay: '25', bal: '290.00', logo: 'CITI', color: 'bg-sky-600/30 text-sky-200 border-sky-400/50' },
                        { name: 'Amex Gold Card', type: 'credit', inst: 'American Express', limit: '15000', minPay: '150', bal: '1150.00', logo: 'AMEX', color: 'bg-yellow-600/30 text-yellow-200 border-yellow-400/50' },
                        { name: 'Capital One Venture', type: 'credit', inst: 'Capital One', limit: '12000', minPay: '45', bal: '640.00', logo: 'CO', color: 'bg-orange-600/30 text-orange-200 border-orange-400/50' },
                        { name: 'Discover it Cash Back', type: 'credit', inst: 'Discover', limit: '7000', minPay: '25', bal: '310.00', logo: 'DISC', color: 'bg-orange-500/30 text-orange-200 border-orange-400/50' },
                        { name: 'Apple Card (Titanium)', type: 'credit', inst: 'Apple Card', limit: '7500', minPay: '25', bal: '320.00', logo: '', color: 'bg-slate-700/50 text-white border-slate-500/60' },
                        { name: 'Cash App (Cash Card)', type: 'debit', inst: 'Cash App', limit: '', minPay: '', bal: '450.00', logo: '$', color: 'bg-emerald-600/30 text-emerald-200 border-emerald-400/50' },
                        { name: 'MoneyLion RoarMoney', type: 'checking', inst: 'MoneyLion', limit: '500', minPay: '20', bal: '350.00', logo: 'ML', color: 'bg-emerald-700/30 text-emerald-200 border-emerald-500/50' },
                        { name: 'Custom Bank Account', type: 'checking', inst: 'Custom Bank', limit: '', minPay: '', bal: '1000.00', logo: 'CB', color: 'bg-purple-600/30 text-purple-200 border-purple-400/50' },
                        { name: 'Custom Credit Card', type: 'credit', inst: 'Custom Card Issuer', limit: '5000', minPay: '35', bal: '250.00', logo: 'CC', color: 'bg-indigo-600/30 text-indigo-200 border-indigo-400/50' }
                      ].map(preset => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setManualInstName(preset.inst);
                            setManualAccountName(preset.name);
                            setManualAccountType(preset.type as AccountType);
                            setManualLast4('4092');
                            setManualBalance(preset.bal);
                            setManualCreditLimit(preset.limit);
                            setManualMinPayment(preset.minPay);
                            setManualDueDate(preset.type === 'credit' ? '28th of month' : '');
                          }}
                          className={cn(
                            "px-2.5 py-1.5 rounded-xl border text-[10px] font-mono font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5",
                            preset.color
                          )}
                        >
                          <span className="w-5 h-5 rounded-md bg-black/60 border border-white/20 flex items-center justify-center text-[9px] font-extrabold shrink-0 shadow-sm">
                            {preset.logo}
                          </span>
                          <span>+ {preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Account Type Option Badges */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                      Account Type Options
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {(['checking', 'savings', 'debit', 'credit', 'investment'] as AccountType[]).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setManualAccountType(type)}
                          className={cn(
                            "py-2 px-3 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition-all",
                            manualAccountType === type
                              ? "bg-blue-600 text-white border-blue-400 shadow-md"
                              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                        Institution Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={manualInstName}
                        onChange={(e) => setManualInstName(e.target.value)}
                        placeholder="e.g. Chase, Bank of America, Fidelity"
                        className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                        Account Name / Product *
                      </label>
                      <input
                        type="text"
                        required
                        value={manualAccountName}
                        onChange={(e) => setManualAccountName(e.target.value)}
                        placeholder="e.g. Total Checking, Freedom Unlimited"
                        className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                        Last 4 Digits *
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        required
                        value={manualLast4}
                        onChange={(e) => setManualLast4(e.target.value)}
                        placeholder="4321"
                        className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                        {manualAccountType === 'credit' ? 'Current Statement Balance ($) *' : 'Available Liquid Balance ($) *'}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={manualBalance}
                        onChange={(e) => setManualBalance(e.target.value)}
                        placeholder="2500.00"
                        className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Credit Card Specific Fields */}
                  {manualAccountType === 'credit' && (
                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl space-y-4">
                      <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
                        Credit Card Specifications
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-300 uppercase font-bold">Total Credit Limit ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={manualCreditLimit}
                            onChange={(e) => setManualCreditLimit(e.target.value)}
                            placeholder="10000"
                            className="w-full bg-black/80 border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-300 uppercase font-bold">Payment Due Date</label>
                          <input
                            type="text"
                            value={manualDueDate}
                            onChange={(e) => setManualDueDate(e.target.value)}
                            placeholder="15th of month"
                            className="w-full bg-black/80 border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-300 uppercase font-bold">Minimum Payment ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={manualMinPayment}
                            onChange={(e) => setManualMinPayment(e.target.value)}
                            placeholder="35.00"
                            className="w-full bg-black/80 border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Debit Card Specific Fields */}
                  {manualAccountType === 'debit' && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl space-y-2">
                      <label className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider block">
                        Linked Checking or Savings Account
                      </label>
                      <select
                        value={manualLinkedAccount}
                        onChange={(e) => setManualLinkedAccount(e.target.value)}
                        className="w-full bg-[#0d0d12] border border-blue-500/40 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      >
                        <option value="" className="bg-[#0d0d12] text-slate-100">Select Account...</option>
                        {financialAccounts
                          .filter(a => a.accountType === 'checking' || a.accountType === 'savings')
                          .map(a => (
                            <option key={a.id} value={`${a.institutionName} ${a.accountName} (•••• ${a.last4})`} className="bg-[#0d0d12] text-slate-100">
                              {a.institutionName} {a.accountName} (•••• {a.last4}) - ${a.balance.toLocaleString()}
                            </option>
                          ))}
                        <option value="Primary Checking" className="bg-[#0d0d12] text-slate-100">Primary Checking</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountModalOpen(false);
                        setEditingAccount(null);
                      }}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-border-subtle font-mono"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg font-mono"
                    >
                      {editingAccount ? 'Update Account' : 'Save & Link Account'}
                    </button>
                  </div>
                </form>
            </motion.div>
          </div>
        )}

        {/* Manual Auto-Pay & Subscription Modal */}
        {isAutoPayModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[70]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAutoPayModalOpen(false);
                setEditingAutoPay(null);
              }}
              className="absolute inset-0 bg-bg-deep/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-gradient-to-br from-[#0c1611] via-[#090f0c] to-black border border-emerald-500/30 rounded-[2.5rem] p-6 md:p-8 z-10 shadow-2xl overflow-hidden space-y-6 max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-start shrink-0">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Auto-Pay Manager
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    {editingAutoPay ? 'Edit Auto-Pay / Subscription' : 'Add Manual Auto-Pay'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Enter recurring subscription or auto-pay details manually.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAutoPayModalOpen(false);
                    setEditingAutoPay(null);
                  }}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAutoPayEntry} className="space-y-4 overflow-y-auto custom-scrollbar pr-1 grow">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">Service / Subscription Name</label>
                  <input
                    type="text"
                    required
                    value={autoPayNameInput}
                    onChange={(e) => setAutoPayNameInput(e.target.value)}
                    placeholder="e.g. Netflix, Spotify, Gym Membership"
                    className="w-full px-4 py-3 bg-black/60 border border-border-subtle rounded-xl text-white font-mono text-sm focus:border-brand-emerald focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={autoPayAmountInput}
                      onChange={(e) => setAutoPayAmountInput(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-black/60 border border-border-subtle rounded-xl text-white font-mono text-sm focus:border-brand-emerald focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      value={autoPayCategoryInput}
                      onChange={(e) => setAutoPayCategoryInput(e.target.value as BillCategory)}
                      className="w-full px-4 py-3 bg-black/60 border border-border-subtle rounded-xl text-white font-mono text-sm focus:border-brand-emerald focus:outline-none"
                    >
                      {(Object.entries(categories) as [BillCategory, CategoryInfo][]).map(([key, cat]) => (
                        <option key={key} value={key} className="bg-black text-white">{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">Next Due Date</label>
                    <input
                      type="date"
                      required
                      value={autoPayDueDateInput}
                      onChange={(e) => setAutoPayDueDateInput(e.target.value)}
                      className="w-full px-4 py-3 bg-black/60 border border-border-subtle rounded-xl text-white font-mono text-sm focus:border-brand-emerald focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">Frequency</label>
                    <select
                      value={autoPayFrequencyInput}
                      onChange={(e) => setAutoPayFrequencyInput(e.target.value as BillFrequency)}
                      className="w-full px-4 py-3 bg-black/60 border border-border-subtle rounded-xl text-white font-mono text-sm focus:border-brand-emerald focus:outline-none"
                    >
                      <option value="monthly" className="bg-black text-white">Monthly</option>
                      <option value="weekly" className="bg-black text-white">Weekly</option>
                      <option value="bi-weekly" className="bg-black text-white">Bi-Weekly</option>
                      <option value="yearly" className="bg-black text-white">Yearly</option>
                      <option value="none" className="bg-black text-white">One-time</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoPayModalOpen(false);
                      setEditingAutoPay(null);
                    }}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-emerald hover:bg-emerald-600 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider shadow-lg transition-all"
                  >
                    {editingAutoPay ? 'Save Changes' : 'Add Auto-Pay'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Google Calendar Sync Confirmation Modal */}
        {isCalendarConfirmOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e0e14] border border-emerald-500/30 rounded-[2rem] p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Sync to Google Calendar</h3>
                    <p className="text-xs text-slate-400 font-mono">Select exactly which bills to push to your Google Calendar</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCalendarConfirmOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Summary Stats */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Selected for Calendar Sync:</span>
                  <span className="text-emerald-400 font-bold">
                    {selectedCalendarBillIds.length} of {bills.filter(b => b.dueDate && b.name).length} bills
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono pt-1.5 text-slate-400 border-t border-emerald-500/20">
                  <span>Selected Total Amount:</span>
                  <span className="text-emerald-400 font-bold">
                    ${bills
                      .filter(b => selectedCalendarBillIds.includes(b.id))
                      .reduce((acc, b) => acc + (b.amount || 0), 0)
                      .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Quick Selection Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const allIds = bills.filter(b => b.dueDate && b.name).map(b => b.id);
                    setSelectedCalendarBillIds(allIds);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-mono font-bold border border-emerald-500/30 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Select All ({bills.filter(b => b.dueDate && b.name).length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCalendarBillIds([])}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-[11px] font-mono border border-white/10 transition-all"
                >
                  Deselect All
                </button>
              </div>

              {/* Interactive Bills List with Checkboxes */}
              <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  <span>Liabilities ({bills.filter(b => b.dueDate && b.name).length}):</span>
                  <span>Click checkbox to include / exclude</span>
                </div>
                <div className="overflow-y-auto max-h-56 space-y-1.5 custom-scrollbar pr-1">
                  {bills.filter(b => b.dueDate && b.name).length === 0 ? (
                    <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5 text-xs text-slate-400 font-mono">
                      No bills scheduled. Click "+ Add Bill" on any calendar date to schedule a bill.
                    </div>
                  ) : (
                    bills.filter(b => b.dueDate && b.name).map((bill) => {
                      const isSelected = selectedCalendarBillIds.includes(bill.id);
                      return (
                        <div 
                          key={bill.id} 
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCalendarBillIds(prev => prev.filter(id => id !== bill.id));
                            } else {
                              setSelectedCalendarBillIds(prev => [...prev, bill.id]);
                            }
                          }}
                          className={cn(
                            "p-3 rounded-xl border flex items-center justify-between text-xs font-mono cursor-pointer transition-all",
                            isSelected 
                              ? "bg-emerald-950/20 border-emerald-500/40 text-white" 
                              : "bg-white/[0.02] border-white/5 text-slate-400 opacity-60 hover:opacity-100"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // Handled by parent div onClick
                              className="w-4 h-4 rounded border-slate-700 bg-black/40 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                            />
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className={cn("font-bold", isSelected ? "text-white" : "text-slate-300")}>
                                  {bill.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                Due: {bill.dueDate ? bill.dueDate.split('T')[0] : 'N/A'} • {bill.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">${Number(bill.amount).toFixed(2)}</span>
                            <span className={cn(
                              "text-[9px] px-1.5 py-0.5 rounded uppercase font-bold",
                              bill.isPaid ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                            )}>
                              {bill.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCalendarConfirmOpen(false)}
                  disabled={isSyncing}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-border-subtle font-mono"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeCalendarSync}
                  disabled={isSyncing || selectedCalendarBillIds.length === 0}
                  className={cn(
                    "flex-1 py-3 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg font-mono flex items-center justify-center gap-2",
                    selectedCalendarBillIds.length === 0 || isSyncing
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30 cursor-pointer"
                  )}
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Syncing {selectedCalendarBillIds.length} Bills...
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="w-4 h-4" />
                      Sync {selectedCalendarBillIds.length} {selectedCalendarBillIds.length === 1 ? 'Bill' : 'Bills'} to Google
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Firebase Authorized Domain Helper Modal */}
        {isDomainErrorModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e0e14] border border-amber-500/40 rounded-[2rem] p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Firebase Authorized Domain</h3>
                    <p className="text-xs text-amber-400 font-mono">1-Time Setup in Firebase Console</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDomainErrorModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 text-xs text-slate-300">
                <p>
                  Firebase Authentication requires your current hosting domain to be whitelisted under <span className="text-amber-300 font-bold">Authorized domains</span> before Google popup sign-in and OAuth permissions can complete.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Your Current App Domain:
                </span>
                <div className="flex items-center gap-2 p-2.5 bg-black/40 border border-white/10 rounded-xl">
                  <span className="text-xs font-mono text-emerald-400 flex-1 truncate select-all">
                    {typeof window !== 'undefined' ? window.location.hostname : 'run.app'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(window.location.hostname);
                        setHasCopiedDomain(true);
                        setTimeout(() => setHasCopiedDomain(false), 3000);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition-all border border-emerald-500/30"
                  >
                    {hasCopiedDomain ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Domain</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-400 font-mono">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Steps:</span>
                <ol className="space-y-1.5 list-decimal list-inside text-[11px] leading-relaxed text-slate-300">
                  <li>Open your project in the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-amber-400 underline hover:text-amber-300 inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="w-2.5 h-2.5" /></a>.</li>
                  <li>Click <span className="text-white font-bold">Build &gt; Authentication &gt; Settings</span>.</li>
                  <li>Under <span className="text-white font-bold">Authorized domains</span>, click <span className="text-white font-bold">Add domain</span>.</li>
                  <li>Paste <span className="text-emerald-400 font-bold">{typeof window !== 'undefined' ? window.location.hostname : 'domain'}</span> and save.</li>
                </ol>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDomainErrorModalOpen(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-border-subtle font-mono"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDomainErrorModalOpen(false);
                    handleGoogleConnect();
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-amber-600/30 font-mono flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Sync Again
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pro Vault 4-Digit Security PIN Modal */}
      <PinVaultModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        isPinEnabled={isPinEnabled}
        setIsPinEnabled={setIsPinEnabled}
        appPin={appPin}
        setAppPin={setAppPin}
        onLockNow={() => setIsAppLocked(true)}
      />

      {/* Legal Protections, Zero-Liability & Cybersecurity Modal with Permanent Audit Log */}
      <LegalSafeguardsModal
        isOpen={isLegalDisclaimerOpen}
        onClose={() => setIsLegalDisclaimerOpen(false)}
        user={user}
        initialTab={legalModalTab}
        forceConsent={!hasLegalConsent}
        onConsentGranted={() => {
          setHasLegalConsent(true);
          setIsLegalDisclaimerOpen(false);
        }}
      />

      {/* Dedicated Savings Cards / Ring-Fenced Vaults Modal */}
      <SavingsCardModal
        isOpen={isSavingsCardModalOpen}
        onClose={() => {
          setIsSavingsCardModalOpen(false);
          setEditingSavingsCard(null);
        }}
        onSaveCard={handleSaveSavingsCard}
        editingCard={editingSavingsCard}
        initialPreset={selectedSavingsCardPreset}
      />

      {/* Quick Deposit / Withdraw / Goal Transfer for Savings Cards Modal */}
      <SavingsCardDepositModal
        isOpen={isSavingsCardDepositModalOpen}
        onClose={() => {
          setIsSavingsCardDepositModalOpen(false);
          setActiveSavingsCardForDeposit(null);
        }}
        card={activeSavingsCardForDeposit}
        onUpdateCardBalance={handleUpdateCardBalance}
      />

      {/* Online / Offline Connection Mode Selector Modal */}
      <ConnectionModeModal
        isOpen={isConnectionModeModalOpen}
        onClose={() => setIsConnectionModeModalOpen(false)}
        appConnectionMode={appConnectionMode}
        onSelectMode={(mode) => {
          toggleAppConnectionMode(mode);
          setIsConnectionModeModalOpen(false);
        }}
        onOpenBetaModal={() => setIsBetaPackageModalOpen(true)}
      />

      {/* Beta Tester Distribution & Standalone Program Packaging Modal */}
      <BetaPackageModal
        isOpen={isBetaPackageModalOpen}
        onClose={() => setIsBetaPackageModalOpen(false)}
        appConnectionMode={appConnectionMode}
        onToggleConnectionMode={toggleAppConnectionMode}
        deferredPrompt={deferredInstallPrompt}
        onInstallPwa={handleInstallPwa}
        isPwaInstalled={isPwaInstalled}
      />

      {/* Feature Suggestions & Add-ons Discovery Modal */}
      <FeatureSuggestionsModal
        isOpen={isFeatureSuggestionsModalOpen}
        onClose={() => setIsFeatureSuggestionsModalOpen(false)}
        onEnableFeature={handleEnableFeature}
        activeFeatures={{
          savings_vault: savingsCards.length > 0,
          phone_book: contacts.length > 0,
          pwa_install: isPwaInstalled,
          google_calendar: isGoogleConnected,
          web_notifications: isNotificationsEnabled,
          tax_reserve: true,
          debt_payoff: true
        }}
      />

      {/* Guided 3-Step Onboarding Modal (1. Connect Bank -> 2. Set Income -> 3. Add Bill) */}
      <OnboardingGuideModal
        isOpen={isOnboardingGuideModalOpen}
        onClose={() => setIsOnboardingGuideModalOpen(false)}
        bills={bills}
        financialAccounts={financialAccounts}
        monthlyIncome={monthlyIncome}
        onOpenBankModal={() => {
          setSelectedPlaidInstitutionId(null);
          setAccountConnectTab('plaid');
          setIsAccountModalOpen(true);
        }}
        onOpenIncomeEditor={() => {
          setSettingsTab('preferences');
          setIsSettingsOpen(true);
        }}
        onOpenAddBillModal={() => {
          setSelectedDay(new Date());
          setBillName('');
          setBillAmount('');
          setEditingBill(null);
          setIsAddingNew(true);
          setIsModalOpen(true);
        }}
      />

      {/* Financial & Utility Phone Book Modal */}
      <PhoneBookModal
        isOpen={isPhoneBookModalOpen}
        onClose={() => setIsPhoneBookModalOpen(false)}
        contacts={contacts}
        onSaveContact={handleSaveContact}
        onDeleteContact={handleDeleteContact}
      />

      {/* Monthly & Bi-Weekly Period Bill Overview & Print Modal */}
      <AnimatePresence>
        {overviewModalData && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOverviewModalData(null)}
              className="absolute inset-0 bg-bg-deep/70 backdrop-blur-md print-hidden"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-gradient-to-br from-[#0c1611] via-[#090f0c] to-black border border-emerald-500/30 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.7)] flex flex-col max-h-[90vh] modal-print-container"
            >
              <div className="bg-gradient-to-br from-emerald-950/90 via-[#0d1612] to-black p-8 sm:p-10 text-white border-b border-emerald-500/20 shrink-0 relative flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                      {overviewModalData.type === 'monthly' ? 'Monthly Overview' : 'Bi-Weekly Pay Period Overview'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{overviewModalData.bills.length} Bills Scheduled</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">{overviewModalData.title}</h3>
                  <p className="text-xs text-slate-300 font-mono mt-1">{overviewModalData.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 print-hidden">
                  <button
                    onClick={handlePrintOverview}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Overview</span>
                  </button>
                  <button onClick={() => setOverviewModalData(null)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar space-y-6">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/10 pb-3 px-2">
                  <span>Total Period Amount:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    ${overviewModalData.bills.reduce((sum, b) => sum + b.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {overviewModalData.bills.length === 0 ? (
                  <div className="text-center py-16 opacity-40 font-mono text-sm">
                    No bills scheduled in order for this {overviewModalData.type === 'monthly' ? 'month' : 'pay period'}.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-4 pb-2">
                      <div className="col-span-5">Bill Name / Payee</div>
                      <div className="col-span-3 text-center">Due Date</div>
                      <div className="col-span-2 text-center">Status</div>
                      <div className="col-span-2 text-right">Amount</div>
                    </div>
                    {overviewModalData.bills.map((bill) => {
                      const catInfo = categories[bill.category];
                      const styles = COLOR_OPTIONS.find(c => c.id === catInfo?.color);
                      return (
                        <div key={bill.id} className="grid grid-cols-12 items-center bg-white/5 border border-border-subtle hover:border-white/15 p-4 rounded-2xl transition-all">
                          <div className="col-span-5 flex items-center gap-3 truncate pr-2">
                            <span className={cn("w-2 h-2 rounded-full shrink-0", styles?.dot || "bg-emerald-400")} />
                            <span className="text-sm font-bold text-white truncate">{bill.name}</span>
                          </div>
                          <div className="col-span-3 text-center font-mono text-xs text-slate-300">
                            {format(parseISO(bill.dueDate), 'EEE, MMM d, yyyy')}
                          </div>
                          <div className="col-span-2 text-center">
                            <span className={cn(
                              "text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border inline-block",
                              bill.isPaid 
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                                : "bg-amber-500/20 border-amber-500/40 text-amber-300"
                            )}>
                              {bill.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </div>
                          <div className="col-span-2 text-right font-mono font-bold text-brand-emerald text-sm">
                            ${Number(bill.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-6 bg-black/60 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 shrink-0 print-hidden">
                <span>Capital Command Financial Ledger</span>
                <button
                  onClick={handleSaveGoogleDoc}
                  className="px-5 py-2 bg-brand-emerald hover:bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Save Google Doc
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>





    </div>
  );
}

