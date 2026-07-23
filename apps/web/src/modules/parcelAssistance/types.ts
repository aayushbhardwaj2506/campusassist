import type { Timestamp } from 'firebase/firestore';

/**
 * Open → Accepted → Completed. Deletion (only while `open`) removes the
 * document entirely rather than adding a fourth "cancelled" state — kept
 * intentionally simple for this phase.
 */
export type ParcelAssistanceStatus = 'open' | 'accepted' | 'completed';

/**
 * Service-specific payload, nested inside the generic `requests` document
 * under `metadata` — matches the "avoid parcel-specific collections"
 * principle from the approved Firestore design: the collection itself
 * stays generic, only this inner shape is Parcel Assistance-specific.
 */
export interface ParcelAssistanceMetadata {
  title: string;
  description: string;
  pickupLocation: string;
  courier?: string;
}

export interface ParcelAssistanceRequest {
  id: string;
  campusId: string;
  serviceType: 'parcelAssistance';
  requesterId: string;
  requesterNameSnapshot: string;
  helperId: string | null;
  helperNameSnapshot: string | null;
  status: ParcelAssistanceStatus;
  metadata: ParcelAssistanceMetadata;
  /** Whether the requester has submitted a rating for the helper yet (only meaningful once completed). */
  rated: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  acceptedAt: Timestamp | null;
  completedAt: Timestamp | null;
}
