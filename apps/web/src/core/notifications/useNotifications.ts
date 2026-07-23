import { useEffect, useState } from 'react';

import { useAuth } from '@core/auth';
import { subscribeToNotifications } from './notificationsService';
import type { AppNotification } from './types';

export interface UseNotificationsResult {
  notifications: AppNotification[];
  loading: boolean;
}

export function useNotifications(): UseNotificationsResult {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const unsubscribe = subscribeToNotifications(user.uid, (next) => {
      setNotifications(next);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  return { notifications, loading };
}
