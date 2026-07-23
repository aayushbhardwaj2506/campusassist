/**
 * Queries the shared `requests` collection directly rather than going
 * through any one module's service — History is meant to show activity
 * across every service (Parcel Assistance today, others later), so it
 * deliberately doesn't import from modules/parcelAssistance.
 */
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';

import { db } from '@core/firebase';
import type { RequestHistoryItem } from '../types';

const REQUESTS_COLLECTION = 'requests';
const HISTORY_LIMIT = 50;

function mapDataToHistoryItem(
  id: string,
  data: DocumentData,
  myRole: 'requester' | 'helper',
): RequestHistoryItem {
  return {
    id,
    serviceType: data.serviceType,
    title: data.metadata?.title ?? 'Untitled request',
    status: data.status,
    requesterNameSnapshot: data.requesterNameSnapshot,
    helperNameSnapshot: data.helperNameSnapshot ?? null,
    createdAt: data.createdAt ?? null,
    completedAt: data.completedAt ?? null,
    myRole,
  };
}

export function subscribeToRequestsAsRequester(
  userId: string,
  onData: (items: RequestHistoryItem[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, REQUESTS_COLLECTION),
    where('requesterId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(HISTORY_LIMIT),
  );
  return onSnapshot(
    q,
    (snapshot) =>
      onData(snapshot.docs.map((docSnap) => mapDataToHistoryItem(docSnap.id, docSnap.data(), 'requester'))),
    onError,
  );
}

export function subscribeToRequestsAsHelper(
  userId: string,
  onData: (items: RequestHistoryItem[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, REQUESTS_COLLECTION),
    where('helperId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(HISTORY_LIMIT),
  );
  return onSnapshot(
    q,
    (snapshot) =>
      onData(snapshot.docs.map((docSnap) => mapDataToHistoryItem(docSnap.id, docSnap.data(), 'helper'))),
    onError,
  );
}
