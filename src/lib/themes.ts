import type { ThemeConfig, ReaderTheme } from '@/types';

export const themes: Record<ReaderTheme, ThemeConfig> = {
  light: {
    name: 'light',
    background: '#ffffff',
    foreground: '#1a1a2e',
    accent: '#2563eb',
    muted: '#6b7280',
    border: '#e5e7eb',
  },
  sepia: {
    name: 'sepia',
    background: '#f4ecd8',
    foreground: '#5c4b37',
    accent: '#8b5e3c',
    muted: '#9c8b78',
    border: '#d4c5a9',
  },
  dark: {
    name: 'dark',
    background: '#1a1a2e',
    foreground: '#e2e8f0',
    accent: '#60a5fa',
    muted: '#94a3b8',
    border: '#334155',
  },
  black: {
    name: 'black',
    background: '#000000',
    foreground: '#d4d4d8',
    accent: '#3b82f6',
    muted: '#71717a',
    border: '#27272a',
  },
  custom: {
    name: 'custom',
    background: '#ffffff',
    foreground: '#1a1a2e',
    accent: '#2563eb',
    muted: '#6b7280',
    border: '#e5e7eb',
  },
};

export function getTheme(name: ReaderTheme, custom?: { background: string; foreground: string; accent: string }): ThemeConfig {
  if (name === 'custom' && custom) {
    return {
      name: 'custom',
      background: custom.background,
      foreground: custom.foreground,
      accent: custom.accent,
      muted: adjustAlpha(custom.foreground, 0.6),
      border: adjustAlpha(custom.foreground, 0.15),
    };
  }
  return themes[name] || themes.light;
}

function adjustAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
