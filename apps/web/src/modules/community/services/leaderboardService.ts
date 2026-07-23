import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';

import { db } from '@core/firebase';
import type { LeaderboardEntry } from '../types';

const USERS_COLLECTION = 'users';
const LEADERBOARD_LIMIT = 10;

function mapDataToEntry(uid: string, data: DocumentData): LeaderboardEntry {
  return {
    uid,
    name: data.name ?? 'Student',
    credits: data.credits ?? 0,
    ratingSum: data.ratingSum ?? 0,
    ratingCount: data.ratingCount ?? 0,
  };
}

export function subscribeToLeaderboard(
  onData: (entries: LeaderboardEntry[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(collection(db, USERS_COLLECTION), orderBy('credits', 'desc'), limit(LEADERBOARD_LIMIT));
  return onSnapshot(
    q,
    (snapshot) => onData(snapshot.docs.map((docSnap) => mapDataToEntry(docSnap.id, docSnap.data()))),
    onError,
  );
}
