import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@core/auth';
import {
  Button,
  ConfirmDialog,
  FormErrorMessage,
  LoadingSpinner,
  StatusBadge,
} from '@core/components';
import { getStatusPresentation, markRequestRated } from '@core/requests';
import { ROUTES, buildParcelAssistanceEditPath } from '@core/router/routePaths';
import { formatRelativeTime } from '@core/utils';
import { submitRating } from '@core/ratings';
import { RatingForm } from '@modules/community/components/RatingForm';
import { RequestStatusFlow } from '../components/RequestStatusFlow';
import { useParcelRequest } from '../hooks/useParcelRequest';
import {
  acceptParcelRequest,
  completeParcelRequest,
  deleteParcelRequest,
} from '../services/parcelAssistanceService';

export function ParcelRequestDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { request, loading, error: loadError } = useParcelRequest(requestId);

  const [actionError, setActionError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner label="Loading request…" />
      </div>
    );
  }

  if (loadError || !request) {
    return (
      <p className="text-sm text-white/80">
        This request could not be found. It may have been deleted.
      </p>
    );
  }

  const isRequester = user?.uid === request.requesterId;
  const isHelper = user?.uid === request.helperId;
  const { label, tone } = getStatusPresentation(request.status);

  async function handleAccept() {
    if (!user || !requestId) return;
    setActionError(null);
    setIsAccepting(true);
    try {
      await acceptParcelRequest(requestId, {
        uid: user.uid,
        name: user.displayName || user.email || 'A student',
      });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not accept this request.');
    } finally {
      setIsAccepting(false);
    }
  }

  async function handleComplete() {
    if (!requestId) return;
    setActionError(null);
    setIsCompleting(true);
    try {
      await completeParcelRequest(requestId);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Could not mark this request complete.',
      );
    } finally {
      setIsCompleting(false);
    }
  }

  async function handleDelete() {
    if (!requestId) return;
    setActionError(null);
    setIsDeleting(true);
    try {
      await deleteParcelRequest(requestId);
      navigate(ROUTES.parcelAssistance);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete this request.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  async function handleSubmitRating(value: number, comment?: string) {
    if (!user || !requestId || !request?.helperId) return;
    await submitRating({
      requestId,
      serviceType: request.serviceType,
      raterId: user.uid,
      rateeId: request.helperId,
      value,
      comment,
    });
    await markRequestRated(requestId);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">{request.metadata.title}</h1>
          <p className="mt-1 text-sm text-white/80">
            Posted by {request.requesterNameSnapshot} · {formatRelativeTime(request.createdAt)}
          </p>
        </div>
        <StatusBadge label={label} tone={tone} />
      </div>

      <div className="rounded-card border border-surface-border bg-white/10 backdrop-blur-xl border border-white/20 p-5">
        <RequestStatusFlow status={request.status} />
      </div>

      <div className="rounded-card border border-surface-border bg-white/10 backdrop-blur-xl border border-white/20 p-5">
        <h2 className="text-sm font-semibold text-text-primary">Details</h2>
        <dl className="mt-3 flex flex-col gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 text-white/80">Description</dt>
            <dd className="text-right text-text-primary">{request.metadata.description}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 text-white/80">Pickup location</dt>
            <dd className="text-right text-text-primary">{request.metadata.pickupLocation}</dd>
          </div>
          {request.metadata.courier && (
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-white/80">Courier</dt>
              <dd className="text-right text-text-primary">{request.metadata.courier}</dd>
            </div>
          )}
          {request.helperNameSnapshot && (
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-white/80">Helper</dt>
              <dd className="text-right text-text-primary">{request.helperNameSnapshot}</dd>
            </div>
          )}
        </dl>
      </div>

      {isRequester && request.status === 'completed' && !request.rated && (
        <RatingForm onSubmit={handleSubmitRating} />
      )}

      {isRequester && request.status === 'completed' && request.rated && (
        <p className="text-sm text-white/80">
          You&apos;ve rated this helper — thank you for the feedback!
        </p>
      )}

      <FormErrorMessage message={actionError} />

      <div className="flex flex-wrap gap-3">
        {!isRequester && request.status === 'open' && (
          <Button fullWidth={false} onClick={handleAccept} isLoading={isAccepting}>
            Accept Request
          </Button>
        )}

        {(isRequester || isHelper) && request.status === 'accepted' && (
          <Button fullWidth={false} onClick={handleComplete} isLoading={isCompleting}>
            Mark as Completed
          </Button>
        )}

        {isRequester && request.status === 'open' && (
          <>
            <Button
              variant="secondary"
              fullWidth={false}
              onClick={() => navigate(buildParcelAssistanceEditPath(request.id))}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              fullWidth={false}
              onClick={() => setShowDeleteConfirm(true)}
              className="text-status-exception hover:bg-status-exception/10"
            >
              Delete
            </Button>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete this request?"
        description="This can't be undone. The request will be permanently removed."
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
