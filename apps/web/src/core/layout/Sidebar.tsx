import { NavLink } from 'react-router-dom';

import { NAV_ITEMS } from './navItems';

/**
 * Persistent left sidebar, visible from the `md` breakpoint up. Below that,
 * <MobileTabBar> takes over navigation instead.
 */
export function Sidebar() {
  return (
    <aside
      className="hidden w-60 shrink-0 flex-col bg-slate-900/20 backdrop-blur-2xl border-r border-white/15 shadow-2xl md:flex"
    >
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-card bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-semibold text-white shadow-lg">
          C
        </div>

        <span className="text-base font-semibold text-white">
          CampusAssist
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-3 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-slate-900/20 border border-cyan-400/30 text-cyan-300 backdrop-blur-md'
                  : 'text-white/80 hover:bg-slate-900/20 hover:text-white'
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