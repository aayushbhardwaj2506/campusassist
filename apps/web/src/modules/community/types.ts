import type { Timestamp } from 'firebase/firestore';

export interface RequestHistoryItem {
  id: string;
  serviceType: string;
  title: string;
  status: string;
  requesterNameSnapshot: string;
  helperNameSnapshot: string | null;
  createdAt: Timestamp | null;
  completedAt: Timestamp | null;
  myRole: 'requester' | 'helper';
}

export interface LeaderboardEntry {
  uid: string;
  name: string;
  credits: number;
  ratingSum: number;
  ratingCount: number;
}
