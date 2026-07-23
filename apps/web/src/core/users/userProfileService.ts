/**
 * Backs the community features (credits, ratings, leaderboard) with a
 * `users/{uid}` Firestore profile doc, kept in sync with Firebase Auth.
 * Any module can award credits or fold in a rating via the functions
 * here — this is core infrastructure, not owned by any one service.
 */
import type { User } from 'firebase/auth';
import {
  doc,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';

import { db } from '@core/firebase';
import type { UserProfile } from './types';

const USERS_COLLECTION = 'users';

function userDocRef(uid: string) {
  return doc(db, USERS_COLLECTION, uid);
}

function mapDataToProfile(uid: string, data: DocumentData): UserProfile {
  return {
    uid,
    name: data.name ?? 'Student',
    email: data.email ?? '',
    credits: data.credits ?? 0,
    ratingSum: data.ratingSum ?? 0,
    ratingCount: data.ratingCount ?? 0,
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

/**
 * Creates the Firestore profile doc on first sign-in, or refreshes the
 * denormalized name/email on subsequent sign-ins. Safe to call every time
 * AuthProvider observes a signed-in user — it's a no-op on the aggregate
 * fields either way (never resets credits/ratings on repeat calls).
 */
export async function ensureUserProfile(user: User): Promise<void> {
  const ref = userDocRef(user.uid);
  const snapshot = await getDoc(ref);
  const name = user.displayName || user.email || 'Student';
  const email = user.email ?? '';

  if (!snapshot.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      name,
      email,
      credits: 0,
      ratingSum: 0,
      ratingCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  await setDoc(ref, { name, email, updatedAt: serverTimestamp() }, { merge: true });
}

export function subscribeToUserProfile(
  uid: string,
  onData: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    userDocRef(uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null);
        return;
      }
      onData(mapDataToProfile(snapshot.id, snapshot.data()));
    },
    onError,
  );
}

/**
 * Atomically increments a user's credit balance using Firestore's
 * `increment()` sentinel — safe under concurrent writes without a
 * transaction, since increments commute regardless of write order.
 *
 * Known limitation: this can be called by a user other than `uid` (e.g.
 * the requester's client awards credits to the helper when marking a
 * request complete). Without a Cloud Function, there's no server-side
 * identity to perform this write "as the system," so security rules
 * narrowly allow any signed-in user to adjust only the aggregate
 * credit/rating fields on someone else's profile — see firestore.rules.
 * The correct long-term fix is a Cloud Function triggered on request
 * completion, performing this write with Admin SDK privileges instead.
 */
export async function awardCredits(uid: string, amount: number): Promise<void> {
  await updateDoc(userDocRef(uid), {
    credits: increment(amount),
    updatedAt: serverTimestamp(),
  });
}

/** Same commutative-increment approach as awardCredits — see its docstring. */
export async function applyRatingToProfile(uid: string, value: number): Promise<void> {
  await updateDoc(userDocRef(uid), {
    ratingSum: increment(value),
    ratingCount: increment(1),
    updatedAt: serverTimestamp(),
  });
}
