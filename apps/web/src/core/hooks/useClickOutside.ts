import { useEffect, type RefObject } from 'react';

/**
 * Calls `onOutsideClick` when a mousedown/touchstart occurs outside the
 * element referenced by `ref`. Used by any dropdown/menu (NotificationBell,
 * UserProfileMenu, and future ones) to close on outside click — written
 * once here instead of duplicated per component.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  onOutsideClick: () => void,
  isActive: boolean = true,
): void {
  useEffect(() => {
    if (!isActive) return undefined;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [ref, onOutsideClick, isActive]);
}
