import { useEffect, useState } from 'react';

import { useAuth } from '@core/auth';
import { MY_REQUESTS_LIMIT } from '../constants';
import { subscribeToMyRequests } from '../services/parcelAssistanceService';
import type { ParcelAssistanceRequest } from '../types';

export interface UseMyParcelRequestsResult {
  requests: ParcelAssistanceRequest[];
  loading: boolean;
  error: string | null;
}

export function useMyParcelRequests(): UseMyParcelRequestsResult {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ParcelAssistanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setRequests([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const unsubscribe = subscribeToMyRequests(
      user.uid,
      (next) => {
        setRequests(next);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      MY_REQUESTS_LIMIT,
    );
    return unsubscribe;
  }, [user]);

  return { requests, loading, error };
}
