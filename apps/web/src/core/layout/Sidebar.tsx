import { NavLink } from 'react-router-dom';

import { NAV_ITEMS } from './navItems';

/**
 * Persistent left sidebar, visible from the `md` breakpoint up. Below that,
 * <MobileTabBar> takes over navigation instead — see AppShell for how the
 * two are swapped via responsive utility classes only (no JS breakpoint
 * detection needed).
 */
export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-surface-border bg-surface-raised md:flex">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-card bg-accent text-sm font-semibold text-white">
          C
        </div>
        <span className="text-base font-semibold text-text-primary">CampusAssist</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-card px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-muted text-accent'
                  : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
