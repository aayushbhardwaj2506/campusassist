import type { Timestamp } from 'firebase/firestore';

export interface Rating {
  id: string;
  requestId: string;
  serviceType: string;
  raterId: string;
  rateeId: string;
  value: number;
  comment?: string;
  createdAt: Timestamp | null;
}
