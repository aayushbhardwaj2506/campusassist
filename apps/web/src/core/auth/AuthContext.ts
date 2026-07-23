import { createContext } from 'react';
import type { User } from 'firebase/auth';

export interface AuthContextValue {
  /** The currently signed-in Firebase user, or null if signed out. */
  user: User | null;
  /**
   * True until the initial Firebase Auth state has resolved. Consumers
   * (ProtectedRoute in particular) must treat `loading === true` as
   * "unknown", not "signed out" — otherwise a logged-in user gets
   * incorrectly redirected to /login for a split second on every refresh.
   */
  loading: boolean;
}

// `undefined` default (rather than a fake value) lets `useAuth` detect and
// throw a clear error if it's ever called outside an <AuthProvider>.
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
