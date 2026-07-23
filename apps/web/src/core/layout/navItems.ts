import type { ComponentType, SVGProps } from 'react';
import { History, LayoutDashboard, Package, Trophy } from 'lucide-react';

import { ROUTES } from '@core/router/routePaths';

export interface NavItem {
  label: string;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

/**
 * Single source of truth for primary navigation, consumed by both
 * <Sidebar> (desktop) and <MobileTabBar> (mobile). Per the Module
 * Registry pattern from the architecture doc, each feature module
 * registers its own entry here once built. Leaderboard and History are
 * cross-cutting "community" features (modules/community) that work
 * across every service module, not just Parcel Assistance.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Parcel Assistance', path: ROUTES.parcelAssistance, icon: Package },
  { label: 'Leaderboard', path: ROUTES.leaderboard, icon: Trophy },
  { label: 'History', path: ROUTES.history, icon: History },
];
