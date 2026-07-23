import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@core/auth';
import { LoadingSpinner } from '@core/components';
import { ROUTES } from './routePaths';

interface PublicOnlyRouteProps {
  children: ReactNode;
}

/**
 * Inverse of ProtectedRoute: redirects an already-authenticated user away
 * from public-only screens (login, register) to the dashboard, so they
 * can't navigate back to the login form while signed in.
 */
export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <LoadingSpinner label="Loading…" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <>{children}</>;
}
