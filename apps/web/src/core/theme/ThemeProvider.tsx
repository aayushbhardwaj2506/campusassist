import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { ThemeContext, type Theme, type ThemeContextValue } from './ThemeContext';

const STORAGE_KEY = 'campusassist-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'light' ? 'light' : 'dark';
}

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Dark is the default and requires no class on <html> (matches the design
 * system's dark-mode-first direction — see tailwind.config.ts / index.css).
 * Only the `light` class is ever toggled. A no-flash inline script in
 * index.html applies the stored preference before React even mounts, so
 * there's no flicker from dark → light on page load for light-mode users.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('light', theme === 'light');
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
