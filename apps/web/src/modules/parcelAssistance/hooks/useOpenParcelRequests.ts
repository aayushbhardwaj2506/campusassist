import { useCallback, useEffect, useRef, useState } from 'react';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import { useAuth } from '@core/auth';
import { PARCEL_REQUESTS_PAGE_SIZE } from '../constants';
import {
  fetchMoreOpenRequests,
  mapDataToRequest,
  subscribeToOpenRequests,
} from '../services/parcelAssistanceService';
import type { ParcelAssistanceRequest } from '../types';

export interface UseOpenParcelRequestsResult {
  requests: ParcelAssistanceRequest[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
}

/**
 * Real-time subscription to the first page of open requests, with a
 * manual "load more" for subsequent pages (one-off fetches, not
 * real-time — a standard, documented trade-off for infinite-scroll UIs
 * on top of Firestore). The signed-in user's own requests are filtered
 * out client-side; see the comment on subscribeToOpenRequests for why.
 */
export function useOpenParcelRequests(): UseOpenParcelRequestsResult {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ParcelAssistanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cursorRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToOpenRequests(
      (docs) => {
        cursorRef.current = docs.length > 0 ? docs[docs.length - 1] : null;
        setHasMore(docs.length === PARCEL_REQUESTS_PAGE_SIZE);
        setRequests(docs.map((docSnap) => mapDataToRequest(docSnap.id, docSnap.data())));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const loadMore = useCallback(async () => {
    if (!cursorRef.current || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const docs = await fetchMoreOpenRequests(cursorRef.current);
      setRequests((prev) => [
        ...prev,
        ...docs.map((docSnap) => mapDataToRequest(docSnap.id, docSnap.data())),
      ]);
      cursorRef.current = docs.length > 0 ? docs[docs.length - 1] : cursorRef.current;
      setHasMore(docs.length === PARCEL_REQUESTS_PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more requests.');
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore]);

  const visibleRequests = user
    ? requests.filter((request) => request.requesterId !== user.uid)
    : requests;

  return { requests: visibleRequests, loading, loadingMore, hasMore, error, loadMore };
}
