import { useRef, useState } from 'react';
import { Bell } from 'lucide-react';

import { useClickOutside } from '@core/hooks';
import { markAllNotificationsRead, useNotifications } from '@core/notifications';
import { formatRelativeTime } from '@core/utils';

/**
 * Backed by the real, real-time `notifications` collection (see
 * core/notifications) — Phase 3's dummy data has been fully replaced.
 */
export function NotificationBell() {
  const { notifications, loading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const unreadIds = notifications.filter((notification) => !notification.read).map((n) => n.id);
  const unreadCount = unreadIds.length;

  async function handleMarkAllRead() {
    if (unreadIds.length === 0) return;
    setIsMarkingRead(true);
    try {
      await markAllNotificationsRead(unreadIds);
    } finally {
      setIsMarkingRead(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        className="relative rounded-card p-2 text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-exception text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

{isOpen && (
  <div
    className="fixed left-4 right-4 top-16 z-50 rounded-card border border-white/20 bg-white/10 backdrop-blur-xl shadow-elevated sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-2 sm:w-80"
  >
          <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
            <span className="text-sm font-medium text-text-primary">Notifications</span>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || isMarkingRead}
              className="text-xs font-medium text-accent hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark all read
            </button>
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {loading ? (
              <li className="px-4 py-6 text-center text-sm text-text-muted">Loading…</li>
            ) : notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-text-muted">
                You&apos;re all caught up.
              </li>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex flex-col gap-0.5 border-b border-surface-border px-4 py-3 last:border-b-0 ${
                    notification.read ? '' : 'bg-accent-muted/20'
                  }`}
                >
                  <span className="text-sm text-text-primary">{notification.title}</span>
                  {notification.body && (
                    <span className="text-xs text-text-secondary">{notification.body}</span>
                  )}
                  <span className="text-xs text-text-muted">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
