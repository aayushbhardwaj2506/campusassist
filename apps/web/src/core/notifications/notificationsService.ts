/**
 * Shared notification pipeline (matches the `notifications` collection in
 * the approved Firestore design). Any module can call `createNotification`
 * as a side effect of its own actions — this file has no knowledge of
 * Parcel Assistance or any other specific service.
 */
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';

import { db } from '@core/firebase';
import type { AppNotification, NotificationType } from './types';

const NOTIFICATIONS_COLLECTION = 'notifications';
const NOTIFICATIONS_LIMIT = 30;

function notificationsRef() {
  return collection(db, NOTIFICATIONS_COLLECTION);
}

function mapDataToNotification(id: string, data: DocumentData): AppNotification {
  return {
    id,
    userId: data.userId,
    type: data.type,
    title: data.title,
    body: data.body ?? undefined,
    relatedRequestId: data.relatedRequestId ?? undefined,
    read: Boolean(data.read),
    createdAt: data.createdAt ?? null,
  };
}

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  relatedRequestId?: string;
}

/**
 * Fire-and-forget by design: always called as a side effect of a primary
 * action (accepting/completing a request), so a failure here is logged
 * but never blocks or rolls back the action that triggered it.
 */
export async function createNotification(input: CreateNotificationInput): Promise<void> {
  try {
    await addDoc(notificationsRef(), {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      relatedRequestId: input.relatedRequestId ?? null,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('[notificationsService] Failed to create notification:', error);
  }
}

export function subscribeToNotifications(
  userId: string,
  onData: (notifications: AppNotification[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(
    notificationsRef(),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(NOTIFICATIONS_LIMIT),
  );
  return onSnapshot(
    q,
    (snapshot) => onData(snapshot.docs.map((docSnap) => mapDataToNotification(docSnap.id, docSnap.data()))),
    onError,
  );
}

export async function markAllNotificationsRead(notificationIds: string[]): Promise<void> {
  if (notificationIds.length === 0) return;
  const batch = writeBatch(db);
  notificationIds.forEach((id) => {
    batch.update(doc(db, NOTIFICATIONS_COLLECTION, id), { read: true });
  });
  await batch.commit();
}
