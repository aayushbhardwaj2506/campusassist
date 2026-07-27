import ParcelChatPage from "../../ParcelChatPage";
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@core/layout';
import { LoginPage } from '@modules/auth/pages/LoginPage';
import { RegisterPage } from '@modules/auth/pages/RegisterPage';
import { LeaderboardPage } from '@modules/community/pages/LeaderboardPage';
import { RequestHistoryPage } from '@modules/community/pages/RequestHistoryPage';
import { DashboardHomePage } from '@modules/dashboard/pages/DashboardHomePage';
import { EditParcelRequestPage } from '@modules/parcelAssistance/pages/EditParcelRequestPage';
import { NewParcelRequestPage } from '@modules/parcelAssistance/pages/NewParcelRequestPage';
import { ParcelAssistancePage } from '@modules/parcelAssistance/pages/ParcelAssistancePage';
import { ParcelRequestDetailPage } from '@modules/parcelAssistance/pages/ParcelRequestDetailPage';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { ROUTES } from './routePaths';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} />
      <Route path="/chat/:requestId" element={<ParcelChatPage />} />

      <Route
        path={ROUTES.login}
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path={ROUTES.register}
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path={ROUTES.dashboard}
        element={
          <ProtectedRoute>
            <AppShell title="Dashboard">
              <DashboardHomePage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.parcelAssistance}
        element={
          <ProtectedRoute>
            <AppShell title="Parcel Assistance">
              <ParcelAssistancePage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.parcelAssistanceNew}
        element={
          <ProtectedRoute>
            <AppShell title="New Request">
              <NewParcelRequestPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.parcelAssistanceDetail}
        element={
          <ProtectedRoute>
            <AppShell title="Request Details">
              <ParcelRequestDetailPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.parcelAssistanceEdit}
        element={
          <ProtectedRoute>
            <AppShell title="Edit Request">
              <EditParcelRequestPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.leaderboard}
        element={
          <ProtectedRoute>
            <AppShell title="Leaderboard">
              <LeaderboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.history}
        element={
          <ProtectedRoute>
            <AppShell title="Request History">
              <RequestHistoryPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Unknown paths fall back to the dashboard, which itself redirects
          to /login if the user isn't authenticated. */}
      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Routes>
  );
}
