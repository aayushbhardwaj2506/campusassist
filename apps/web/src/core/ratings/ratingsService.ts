/**
 * Ratings apply to a completed request regardless of which service module
 * created it (`serviceType` is stored for context/future filtering, but
 * this file has no dependency on any specific module).
 */
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { db } from '@core/firebase';
import { applyRatingToProfile } from '@core/users';

const RATINGS_COLLECTION = 'ratings';

export interface SubmitRatingInput {
  requestId: string;
  serviceType: string;
  raterId: string;
  rateeId: string;
  value: number;
  comment?: string;
}

/**
 * Writes the rating as a durable, immutable audit record, then folds it
 * into the ratee's aggregate (ratingSum/ratingCount) via a commutative
 * increment. These are two separate writes rather than one transaction —
 * if the aggregate update fails after the rating doc succeeds, the rating
 * itself is still safely recorded; a background reconciliation job would
 * be the production-grade fix for that edge case, out of scope here.
 */
export async function submitRating(input: SubmitRatingInput): Promise<void> {
  if (!Number.isInteger(input.value) || input.value < 1 || input.value > 5) {
    throw new Error('Rating must be a whole number between 1 and 5.');
  }

  await addDoc(collection(db, RATINGS_COLLECTION), {
    requestId: input.requestId,
    serviceType: input.serviceType,
    raterId: input.raterId,
    rateeId: input.rateeId,
    value: input.value,
    comment: input.comment ?? null,
    createdAt: serverTimestamp(),
  });

  await applyRatingToProfile(input.rateeId, input.value);
}
