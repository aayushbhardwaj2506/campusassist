/**
 * Thin wrapper around the Firebase Auth SDK.
 *
 * No feature code should call `signInWithEmailAndPassword`, `signOut`, etc.
 * directly — always go through here. This keeps persistence configuration,
 * profile updates on signup, and any future provider (Google SSO, etc.)
 * centralized in one place, matching the pattern established for the
 * Firestore/Storage clients in Phase 1.
 */
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Unsubscribe,
  type User,
} from 'firebase/auth';

import { auth } from './firebaseClient';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Ensures session persistence is set to `local` (survives browser restarts,
 * not just tab refreshes) before any sign-in attempt. Firebase defaults to
 * local persistence on web already, but we set it explicitly so this
 * behavior is documented and controlled by our own code, not an implicit
 * SDK default that could change.
 */
let persistenceReady: Promise<void> | null = null;

function ensurePersistence(): Promise<void> {
  if (!persistenceReady) {
    persistenceReady = setPersistence(auth, browserLocalPersistence);
  }
  return persistenceReady;
}

export async function registerWithEmail({
  name,
  email,
  password,
}: RegisterInput): Promise<User> {
  await ensurePersistence();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  return credential.user;
}

export async function loginWithEmail({ email, password }: LoginInput): Promise<User> {
  await ensurePersistence();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribes to Firebase Auth state changes. Returns the unsubscribe
 * function directly so callers (namely AuthProvider) can return it from a
 * `useEffect` cleanup with no extra wrapping.
 */
export function subscribeToAuthChanges(
  callback: (user: User | null) => void,
): Unsubscribe {
  return firebaseOnAuthStateChanged(auth, callback);
}
