/**
 * Central registry of route paths. Every <Link>, <Navigate>, and <Route>
 * in the app should reference these constants rather than hardcoding
 * strings, so a path can be changed in exactly one place.
 */
export const ROUTES = {
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  parcelAssistance: '/parcel-assistance',
  parcelAssistanceNew: '/parcel-assistance/new',
  // Raw patterns for <Route path="..."> — use the builder functions below
  // to construct real links/navigations to a specific request.
  parcelAssistanceDetail: '/parcel-assistance/:requestId',
  parcelAssistanceEdit: '/parcel-assistance/:requestId/edit',
  leaderboard: '/leaderboard',
  history: '/history',
} as const;

export function buildParcelAssistanceDetailPath(requestId: string): string {
  return `/parcel-assistance/${requestId}`;
}

export function buildParcelAssistanceEditPath(requestId: string): string {
  return `/parcel-assistance/${requestId}/edit`;
}
