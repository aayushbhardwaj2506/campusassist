import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  credits: number;
  ratingSum: number;
  ratingCount: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}
