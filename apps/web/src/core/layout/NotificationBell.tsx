import { useRef, useState } from 'react';
import { Bell } from 'lucide-react';

import { useClickOutside } from '@core/hooks';
import { markAllNotificationsRead, useNotifications } from '@core/notifications';
import { formatRelativeTime } from '@core/utils';

export function NotificationBell() {
  const { notifications, loading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const unreadIds = notifications
    .filter((notification) => !notification.read)
    .map((n) => n.id);

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
        className="relative rounded-card p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="
            fixed inset-x-3 top-16 z-[9999]
            max-h-[70vh]
            overflow-hidden
            rounded-2xl
            border border-blue-400/20
            bg-blue-950/80
            backdrop-blur-2xl
            shadow-2xl

            sm:absolute
            sm:top-full
            sm:right-0
            sm:left-auto
            sm:mt-2
            sm:w-80
            sm:inset-x-auto
          "
        >
          <div className="flex items-center justify-between border-b border-blue-800/40 px-4 py-3">
            <span className="text-sm font-semibold text-blue-100">
              Notifications
            </span>

            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || isMarkingRead}
              className="text-xs font-medium text-blue-300 hover:text-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark all read
            </button>
          </div>

          <ul className="max-h-[55vh] overflow-y-auto">
            {loading ? (
              <li className="px-4 py-6 text-center text-sm text-blue-300">
                Loading...
              </li>
            ) : notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-blue-300">
                You're all caught up.
              </li>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex flex-col gap-1 border-b border-blue-900/40 px-4 py-3 last:border-b-0 ${
                    notification.read
                      ? ""
                      : "bg-blue-900/40"
                  }`}
                >
                  <span className="text-sm font-medium text-blue-100">
                    {notification.title}
                  </span>

                  {notification.body && (
                    <span className="text-xs text-blue-200">
                      {notification.body}
                    </span>
                  )}

                  <span className="mt-1 text-xs text-blue-400">
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
