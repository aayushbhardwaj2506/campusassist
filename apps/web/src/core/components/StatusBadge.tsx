/**
 * Generic status pill used app-wide. Deliberately decoupled from any one
 * module's status enum (e.g. ParcelAssistanceStatus) — callers map their
 * own status values to a `tone` + `label` pair, so this component stays
 * reusable by every future module without modification.
 */
export type StatusTone = 'pending' | 'ready' | 'collected' | 'exception';

interface StatusBadgeProps {
  label: string;
  tone: StatusTone;
}

const TONE_CLASSES: Record<StatusTone, string> = {
  pending: 'bg-status-pending/15 text-status-pending',
  ready: 'bg-status-ready/15 text-status-ready',
  collected: 'bg-status-collected/15 text-status-collected',
  exception: 'bg-status-exception/15 text-status-exception',
};

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {label}
    </span>
  );
}
