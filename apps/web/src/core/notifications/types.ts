import type { Timestamp } from 'firebase/firestore';

export type NotificationType =
  | 'requestAccepted'
  | 'requestCompleted'
  | 'creditsEarned'
  | 'ratingReceived';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  relatedRequestId?: string;
  read: boolean;
  createdAt: Timestamp | null;
}
