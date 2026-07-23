import type { Timestamp } from 'firebase/firestore';

/**
 * `timestamp` is null momentarily for a freshly-created doc: Firestore's
 * local cache reflects the write optimistically before `serverTimestamp()`
 * resolves, so a field can briefly be null in that window — handled
 * gracefully here rather than throwing.
 */
export function formatRelativeTime(timestamp: Timestamp | null): string {
  if (!timestamp) return 'just now';

  const diffMs = Date.now() - timestamp.toDate().getTime();
  const diffMinutes = Math.round(diffMs / 60_000);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}
