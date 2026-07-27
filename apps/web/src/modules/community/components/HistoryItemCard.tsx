import { Link } from 'react-router-dom';

import { StatusBadge } from '@core/components';
import { getStatusPresentation } from '@core/requests';
import { buildParcelAssistanceDetailPath } from '@core/router/routePaths';
import { formatRelativeTime } from '@core/utils';
import type { RequestHistoryItem } from '../types';

interface HistoryItemCardProps {
  item: RequestHistoryItem;
}

// TODO: once a second service module exists, generalize this to a
// serviceType → detail-route registry instead of a direct conditional.
function getDetailPath(item: RequestHistoryItem): string | null {
  if (item.serviceType === 'parcelAssistance') {
    return buildParcelAssistanceDetailPath(item.id);
  }
  return null;
}

export function HistoryItemCard({ item }: HistoryItemCardProps) {
  const { label, tone } = getStatusPresentation(item.status);
  const detailPath = getDetailPath(item);

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-text-primary">{item.title}</h3>
        <StatusBadge label={label} tone={tone} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-orange-300">
        <span className="truncate">
          {item.myRole === 'requester' ? 'You requested' : 'You helped'}
          {item.myRole === 'requester' && item.helperNameSnapshot
            ? ` · ${item.helperNameSnapshot} helped`
            : ''}
        </span>
        <span className="shrink-0">{formatRelativeTime(item.createdAt)}</span>
      </div>
    </>
  );

  const className =
    'block rounded-card border border-surface-border bg-white/10 backdrop-blur-xl border border-white/20 p-4 transition-colors hover:border-accent/50';

  return detailPath ? (
    <Link to={detailPath} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
