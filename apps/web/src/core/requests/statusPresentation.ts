import type { StatusTone } from '@core/components';

/**
 * Every module built on the generic `requests` collection shares the same
 * three-state lifecycle (open → accepted → completed) — see the approved
 * Firestore design. This mapping lives in core, not in any one module, so
 * it's never duplicated as new service modules are added.
 */
export function getStatusPresentation(status: string): { label: string; tone: StatusTone } {
  switch (status) {
    case 'open':
      return { label: 'Open', tone: 'ready' };
    case 'accepted':
      return { label: 'Accepted', tone: 'pending' };
    case 'completed':
      return { label: 'Completed', tone: 'collected' };
    default:
      return { label: status, tone: 'pending' };
  }
}
