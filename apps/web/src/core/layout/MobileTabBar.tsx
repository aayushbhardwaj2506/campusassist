import { NavLink } from 'react-router-dom';

import { NAV_ITEMS } from './navItems';

/**
 * Bottom tab bar, visible only below the `md` breakpoint (Discord/mobile-app
 * pattern rather than a hamburger menu, per the approved UI/UX spec).
 * Shares NAV_ITEMS with <Sidebar> so the two never drift out of sync.
 */
export function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-surface-border bg-surface-raised md:hidden">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium ${
              isActive ? 'text-accent' : 'text-text-muted'
            }`
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
