import { Link } from 'react-router-dom';

import { StatusBadge } from '@core/components';
import { getStatusPresentation } from '@core/requests';
import { buildParcelAssistanceDetailPath } from '@core/router/routePaths';
import { formatRelativeTime } from '@core/utils';
import type { ParcelAssistanceRequest } from '../types';

interface ParcelRequestCardProps {
  request: ParcelAssistanceRequest;
}

export function ParcelRequestCard({ request }: ParcelRequestCardProps) {
  const { label, tone } = getStatusPresentation(request.status);

  return (
    <Link
      to={buildParcelAssistanceDetailPath(request.id)}
      className="flex flex-col gap-2 rounded-card border border-surface-border bg-surface-raised p-4 transition-colors hover:border-accent/50"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-text-primary">{request.metadata.title}</h3>
        <StatusBadge label={label} tone={tone} />
      </div>

      <p className="line-clamp-2 text-sm text-text-secondary">{request.metadata.description}</p>

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span className="truncate">{request.metadata.pickupLocation}</span>
        <span className="shrink-0">{formatRelativeTime(request.createdAt)}</span>
      </div>
    </Link>
  );
}
