import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@core/auth';
import { LoadingSpinner } from '@core/components';
import { ROUTES } from './routePaths';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Renders `children` only if a user is signed in. While the initial auth
 * state is still resolving (`loading === true`), it shows a spinner instead
 * of redirecting — redirecting during `loading` would incorrectly bounce a
 * genuinely signed-in user to /login for a flash on every page refresh.
 *
 * On redirect, the attempted location is passed in router state so a login
 * flow could send the user back where they came from (not wired up yet —
 * left as a documented hook for a later phase).
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <LoadingSpinner label="Checking your session…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
