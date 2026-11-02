import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export { GoogleAuthProvider, signInWithPopup };

const firebaseConfig = {
  apiKey: "AIzaSyDLa_NNniKA2QoGOV-aPJzC_7cOr7LPv-U",
  authDomain: "capital-command-172ed.firebaseapp.com",
  projectId: "capital-command-172ed",
  storageBucket: "capital-command-172ed.firebasestorage.app",
  messagingSenderId: "131959246156",
  appId: "1:131959246156:web:5d8b2821e5e5b8e0be13e9",
  measurementId: "G-P8ZSQ5NKVL"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export enum OperationType {
  GET = 'GET',
  LIST = 'LIST',
  WRITE = 'WRITE',
  DELETE = 'DELETE'
}

export function handleFirestoreError(error: any, operation: OperationType, path: string) {
  console.warn(`[Firestore ${operation}] ${path}:`, error);
}

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive.file'
];

let cachedGoogleAccessToken: string | null = null;

export async function requestGoogleAuth(): Promise<{ accessToken: string; user: any }> {
  const provider = new GoogleAuthProvider();
  GOOGLE_SCOPES.forEach(scope => provider.addScope(scope));
  provider.setCustomParameters({ prompt: 'consent' });

  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    if (!token) {
      throw new Error('Could not retrieve access token from Google.');
    }
    cachedGoogleAccessToken = token;
    return { accessToken: token, user: result.user };
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      throw new Error('Google authorization cancelled by user.');
    }
    throw error;
  }
}

// Backward compatibility aliases
export const requestGoogleCalendarAuth = requestGoogleAuth;

export function getCachedGoogleAccessToken(): string | null {
  return cachedGoogleAccessToken;
}

export function getCachedCalendarAccessToken(): string | null {
  return cachedGoogleAccessToken;
}

export function clearGoogleAccessToken() {
  cachedGoogleAccessToken = null;
}

export function clearCalendarAccessToken() {
  cachedGoogleAccessToken = null;
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    GOOGLE_SCOPES.forEach(scope => provider.addScope(scope));
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedGoogleAccessToken = credential.accessToken;
    }
    return result;
  } catch (error) {
    console.warn('Firebase popup signin unavailable, continuing in local mode:', error);
  }
}

export async function logout() {
  try {
    await signOut(auth);
    clearGoogleAccessToken();
  } catch (error) {
    console.warn('Signout error:', error);
  }
}
