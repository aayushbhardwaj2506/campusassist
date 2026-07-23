import { useEffect, useState } from 'react';

import { useAuth } from '@core/auth';
import { subscribeToUserProfile } from './userProfileService';
import type { UserProfile } from './types';

export interface UseUserProfileResult {
  profile: UserProfile | null;
  loading: boolean;
}

export function useUserProfile(): UseUserProfileResult {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const unsubscribe = subscribeToUserProfile(user.uid, (next) => {
      setProfile(next);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  return { profile, loading };
}
