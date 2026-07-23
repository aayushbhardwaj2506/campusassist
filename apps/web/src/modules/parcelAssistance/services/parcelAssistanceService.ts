/**
 * All Firestore access for the Parcel Assistance module lives here.
 * Components never call Firestore SDK functions directly — they go
 * through this service (via the hooks in ../hooks), matching the
 * service-layer pattern established across the app.
 *
 * Documents live in the generic top-level `requests` collection
 * (discriminated by `serviceType`), per the approved Firestore design —
 * no parcel-specific collection is created here.
 *
 * `acceptParcelRequest` and `completeParcelRequest` also trigger
 * cross-cutting side effects (notifications, credits) via the generic
 * core/notifications and core/users services. Those side effects run
 * AFTER the core status-transition transaction succeeds — they're
 * deliberately not part of the transaction itself (notifications are
 * fire-and-forget; credits use a commutative increment that doesn't need
 * transactional isolation), so a hiccup in a side effect never blocks or
 * rolls back the primary accept/complete action.
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';

import { db } from '@core/firebase';
import { DEFAULT_CAMPUS_ID } from '@core/config/constants';
import { createNotification } from '@core/notifications';
import { awardCredits } from '@core/users';
import {
  CREDITS_PER_COMPLETED_REQUEST,
  PARCEL_ASSISTANCE_SERVICE_TYPE,
  PARCEL_REQUESTS_PAGE_SIZE,
} from '../constants';
import type { ParcelAssistanceMetadata, ParcelAssistanceRequest } from '../types';

const REQUESTS_COLLECTION = 'requests';

function requestsRef() {
  return collection(db, REQUESTS_COLLECTION);
}

function requestDocRef(requestId: string) {
  return doc(db, REQUESTS_COLLECTION, requestId);
}

/** Shared mapper so list queries and single-doc reads stay in sync. */
export function mapDataToRequest(id: string, data: DocumentData): ParcelAssistanceRequest {
  return {
    id,
    campusId: data.campusId,
    serviceType: data.serviceType,
    requesterId: data.requesterId,
    requesterNameSnapshot: data.requesterNameSnapshot,
    helperId: data.helperId ?? null,
    helperNameSnapshot: data.helperNameSnapshot ?? null,
    status: data.status,
    metadata: data.metadata,
    rated: Boolean(data.rated),
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
    acceptedAt: data.acceptedAt ?? null,
    completedAt: data.completedAt ?? null,
  };
}

// ---------------------------------------------------------------------------
// Create / Update / Delete
// ---------------------------------------------------------------------------

export interface CreateParcelRequestInput {
  requesterId: string;
  requesterNameSnapshot: string;
  metadata: ParcelAssistanceMetadata;
}

export async function createParcelRequest(input: CreateParcelRequestInput): Promise<string> {
  const docRef = await addDoc(requestsRef(), {
    campusId: DEFAULT_CAMPUS_ID,
    serviceType: PARCEL_ASSISTANCE_SERVICE_TYPE,
    requesterId: input.requesterId,
    requesterNameSnapshot: input.requesterNameSnapshot,
    helperId: null,
    helperNameSnapshot: null,
    status: 'open',
    metadata: input.metadata,
    rated: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    acceptedAt: null,
    completedAt: null,
  });
  return docRef.id;
}

export async function updateParcelRequestMetadata(
  requestId: string,
  metadata: ParcelAssistanceMetadata,
): Promise<void> {
  await updateDoc(requestDocRef(requestId), {
    metadata,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteParcelRequest(requestId: string): Promise<void> {
  await deleteDoc(requestDocRef(requestId));
}

// ---------------------------------------------------------------------------
// Status transitions — wrapped in transactions to close race conditions
// (e.g. two students tapping "Accept" on the same request within
// milliseconds of each other).
// ---------------------------------------------------------------------------

export async function acceptParcelRequest(
  requestId: string,
  helper: { uid: string; name: string },
): Promise<void> {
  let requesterId = '';
  let title = '';

  await runTransaction(db, async (transaction) => {
    const ref = requestDocRef(requestId);
    const snapshot = await transaction.get(ref);

    if (!snapshot.exists()) {
      throw new Error('This request no longer exists.');
    }
    const data = snapshot.data();
    if (data.requesterId === helper.uid) {
      throw new Error("You can't accept your own request.");
    }
    if (data.status !== 'open') {
      throw new Error('This request has already been accepted by someone else.');
    }

    requesterId = data.requesterId;
    title = data.metadata?.title ?? 'your request';

    transaction.update(ref, {
      status: 'accepted',
      helperId: helper.uid,
      helperNameSnapshot: helper.name,
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  // Side effect, not part of the transaction — see module docstring.
  await createNotification({
    userId: requesterId,
    type: 'requestAccepted',
    title: `${helper.name} accepted "${title}"`,
    body: "They'll be in touch to coordinate pickup.",
    relatedRequestId: requestId,
  });
}

export async function completeParcelRequest(requestId: string): Promise<void> {
  let requesterId = '';
  let helperId = '';
  let helperName = '';
  let title = '';

  await runTransaction(db, async (transaction) => {
    const ref = requestDocRef(requestId);
    const snapshot = await transaction.get(ref);

    if (!snapshot.exists()) {
      throw new Error('This request no longer exists.');
    }
    const data = snapshot.data();
    if (data.status !== 'accepted') {
      throw new Error('Only an accepted request can be marked complete.');
    }

    requesterId = data.requesterId;
    helperId = data.helperId;
    helperName = data.helperNameSnapshot ?? 'Your helper';
    title = data.metadata?.title ?? 'your request';

    transaction.update(ref, {
      status: 'completed',
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  // Side effects outside the transaction: credits use a commutative
  // increment (safe without a transaction) and notifications are
  // fire-and-forget by design — see module docstring and
  // core/users/userProfileService.ts for the full reasoning.
  await Promise.all([
    awardCredits(helperId, CREDITS_PER_COMPLETED_REQUEST),
    createNotification({
      userId: requesterId,
      type: 'requestCompleted',
      title: `"${title}" marked completed`,
      body: `${helperName} helped with this request — you can rate them now.`,
      relatedRequestId: requestId,
    }),
    createNotification({
      userId: helperId,
      type: 'creditsEarned',
      title: `You earned ${CREDITS_PER_COMPLETED_REQUEST} credits`,
      body: `Thanks for helping with "${title}"!`,
      relatedRequestId: requestId,
    }),
  ]);
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Real-time first page of open requests, newest first. Deliberately does
 * NOT filter out the current user's own requests server-side: Firestore
 * requires an inequality filter's field to lead the orderBy, which would
 * force ordering by requesterId instead of createdAt. Filtering the
 * requester out client-side (see useOpenParcelRequests) is the documented
 * trade-off for a clean createdAt-desc feed at this scale; a dedicated
 * "exclude requester" index or a Cloud Function-backed feed is the
 * scalable follow-up if/when this becomes a bottleneck.
 */
export function subscribeToOpenRequests(
  onData: (snapshotDocs: QueryDocumentSnapshot<DocumentData>[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(
    requestsRef(),
    where('serviceType', '==', PARCEL_ASSISTANCE_SERVICE_TYPE),
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc'),
    limit(PARCEL_REQUESTS_PAGE_SIZE),
  );
  return onSnapshot(q, (snapshot) => onData(snapshot.docs), onError);
}

/** One-off fetch for "Load more" — paginates via a cursor, not real-time. */
export async function fetchMoreOpenRequests(
  cursor: QueryDocumentSnapshot<DocumentData>,
): Promise<QueryDocumentSnapshot<DocumentData>[]> {
  const q = query(
    requestsRef(),
    where('serviceType', '==', PARCEL_ASSISTANCE_SERVICE_TYPE),
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc'),
    startAfter(cursor),
    limit(PARCEL_REQUESTS_PAGE_SIZE),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs;
}

export function subscribeToMyRequests(
  userId: string,
  onData: (requests: ParcelAssistanceRequest[]) => void,
  onError?: (error: Error) => void,
  requestLimit = 50,
): Unsubscribe {
  const q = query(
    requestsRef(),
    where('serviceType', '==', PARCEL_ASSISTANCE_SERVICE_TYPE),
    where('requesterId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(requestLimit),
  );
  return onSnapshot(
    q,
    (snapshot) => onData(snapshot.docs.map((docSnap) => mapDataToRequest(docSnap.id, docSnap.data()))),
    onError,
  );
}

export function subscribeToParcelRequest(
  requestId: string,
  onData: (request: ParcelAssistanceRequest | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    requestDocRef(requestId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null);
        return;
      }
      onData(mapDataToRequest(snapshot.id, snapshot.data()));
    },
    onError,
  );
}
