import type { Config } from 'tailwindcss';

/**
 * Tailwind configuration for CampusAssist.
 *
 * Design direction (approved in UI/UX spec): dark-mode-first, Linear/Notion/Discord
 * inspired — high contrast, generous spacing, one accent color, subtle elevation
 * instead of heavy borders. `darkMode: 'class'` lets core/theme toggle a class on
 * <html>; dark is the default applied at bootstrap.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral surface scale — values come from CSS custom properties
        // (defined in index.css) so the same class names automatically
        // repaint for light mode; no dark:/light: variant classes needed
        // anywhere in the app. The <alpha-value> placeholder preserves
        // support for opacity modifiers like `bg-surface/50`.
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          raised: 'rgb(var(--color-surface-raised) / <alpha-value>)',
          overlay: 'rgb(var(--color-surface-overlay) / <alpha-value>)',
          border: 'rgb(var(--color-surface-border) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
        // Brand accent and status colors stay constant across themes
        // (standard SaaS practice — Linear/Notion do the same).
        accent: {
          DEFAULT: '#6E56CF',
          hover: '#7C66DB',
          muted: '#3A2E63',
        },
        status: {
          pending: '#E5A93A', // amber
          ready: '#3A8DE5', // blue
          collected: '#3AE58A', // green
          exception: '#E5453A', // red
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '20px',
        xl: '24px',
        '2xl': '32px',
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        elevated: '0 4px 24px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
