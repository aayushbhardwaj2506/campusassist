import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';

import { subscribeToAuthChanges } from '@core/firebase/authService';
import { ensureUserProfile } from '@core/users/userProfileService';
import { AuthContext, type AuthContextValue } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app and keeps `user`/`loading` in sync with Firebase Auth's
 * real-time state. This is the single subscription to `onAuthStateChanged`
 * for the whole app — components consume the result via `useAuth()`
 * instead of subscribing individually.
 *
 * Also ensures a Firestore `users/{uid}` profile doc exists for the
 * signed-in user (created on first sign-in, refreshed on later ones) —
 * this is what backs the credits/ratings/leaderboard features. A profile
 * sync failure is logged but never blocks sign-in itself.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (nextUser) {
        ensureUserProfile(nextUser).catch((error) => {
          console.error('[AuthProvider] Failed to sync user profile:', error);
        });
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
