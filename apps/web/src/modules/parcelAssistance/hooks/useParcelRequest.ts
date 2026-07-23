import { useEffect, useState } from 'react';

import { subscribeToParcelRequest } from '../services/parcelAssistanceService';
import type { ParcelAssistanceRequest } from '../types';

export interface UseParcelRequestResult {
  request: ParcelAssistanceRequest | null;
  loading: boolean;
  error: string | null;
}

/**
 * Real-time subscription to a single request. Used on both the Details
 * and Edit pages, so status changes (e.g. someone else accepting while
 * you're looking at the page) are reflected live without a refresh.
 */
export function useParcelRequest(requestId: string | undefined): UseParcelRequestResult {
  const [request, setRequest] = useState<ParcelAssistanceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) {
      setRequest(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const unsubscribe = subscribeToParcelRequest(
      requestId,
      (next) => {
        setRequest(next);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [requestId]);

  return { request, loading, error };
}
