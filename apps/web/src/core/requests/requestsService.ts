import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { db } from '@core/firebase';

const REQUESTS_COLLECTION = 'requests';

/**
 * Flips the `rated` flag once the requester submits a rating for the
 * helper on a completed request. Generic and collection-level (not
 * module-specific) because rating applies to a completed request
 * regardless of which service module created it.
 */
export async function markRequestRated(requestId: string): Promise<void> {
  await updateDoc(doc(db, REQUESTS_COLLECTION, requestId), {
    rated: true,
    updatedAt: serverTimestamp(),
  });
}
