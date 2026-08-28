import type { ThemeConfig, ReaderTheme } from '@/types';

export const themes: Record<ReaderTheme, ThemeConfig> = {
  light: {
    name: 'light',
    background: '#ffffff',
    foreground: '#221d17',
    accent: '#bb7a1c',
    muted: '#8b8174',
    border: '#e6ddd0',
  },
  sepia: {
    name: 'sepia',
    background: '#f4ecd8',
    foreground: '#5c4b37',
    accent: '#a06a1e',
    muted: '#9c8b78',
    border: '#d4c5a9',
  },
  dark: {
    name: 'dark',
    background: '#1c1a17',
    foreground: '#e4dfd4',
    accent: '#d9a441',
    muted: '#8b8174',
    border: '#3a322a',
  },
  black: {
    name: 'black',
    background: '#000000',
    foreground: '#d6d3cb',
    accent: '#d9a441',
    muted: '#71706a',
    border: '#2a2825',
  },
  custom: {
    name: 'custom',
    background: '#ffffff',
    foreground: '#221d17',
    accent: '#bb7a1c',
    muted: '#8b8174',
    border: '#e6ddd0',
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
