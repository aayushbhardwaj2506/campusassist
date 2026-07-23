import { useEffect, useState } from 'react';

import { useAuth } from '@core/auth';
import { subscribeToRequestsAsHelper, subscribeToRequestsAsRequester } from '../services/requestHistoryService';
import type { RequestHistoryItem } from '../types';

export interface UseRequestHistoryResult {
  items: RequestHistoryItem[];
  loading: boolean;
  error: string | null;
}

function sortByCreatedAtDesc(items: RequestHistoryItem[]): RequestHistoryItem[] {
  return [...items].sort((a, b) => {
    const aMillis = a.createdAt?.toMillis() ?? 0;
    const bMillis = b.createdAt?.toMillis() ?? 0;
    return bMillis - aMillis;
  });
}

/**
 * Two independent real-time subscriptions (as requester, as helper) are
 * merged and re-sorted client-side. A user can never appear as both on
 * the same document (security rules block accepting your own request),
 * so no de-duplication is needed beyond the merge itself.
 */
export function useRequestHistory(): UseRequestHistoryResult {
  const { user } = useAuth();
  const [asRequester, setAsRequester] = useState<RequestHistoryItem[]>([]);
  const [asHelper, setAsHelper] = useState<RequestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setAsRequester([]);
      setAsHelper([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    let requesterLoaded = false;
    let helperLoaded = false;
    const maybeFinishLoading = () => {
      if (requesterLoaded && helperLoaded) setLoading(false);
    };

    const unsubscribeRequester = subscribeToRequestsAsRequester(
      user.uid,
      (items) => {
        setAsRequester(items);
        requesterLoaded = true;
        maybeFinishLoading();
      },
      (err) => setError(err.message),
    );

    const unsubscribeHelper = subscribeToRequestsAsHelper(
      user.uid,
      (items) => {
        setAsHelper(items);
        helperLoaded = true;
        maybeFinishLoading();
      },
      (err) => setError(err.message),
    );

    return () => {
      unsubscribeRequester();
      unsubscribeHelper();
    };
  }, [user]);

  return { items: sortByCreatedAtDesc([...asRequester, ...asHelper]), loading, error };
}
