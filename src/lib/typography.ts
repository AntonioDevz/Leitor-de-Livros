import type { TypographyPreset, ReaderSettings } from '@/types';

export const typographyPresets: TypographyPreset[] = [
  {
    name: 'classic',
    label: 'Clássico',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 400,
    lineHeight: 1.8,
    letterSpacing: 0.01,
  },
  {
    name: 'modern',
    label: 'Moderno',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 400,
    lineHeight: 1.7,
    letterSpacing: 0,
  },
  {
    name: 'editorial',
    label: 'Editorial',
    fontFamily: '"Merriweather", Georgia, serif',
    fontWeight: 400,
    lineHeight: 1.9,
    letterSpacing: 0.02,
  },
  {
    name: 'serif',
    label: 'Serifado',
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: 400,
    lineHeight: 1.8,
    letterSpacing: 0.01,
  },
  {
    name: 'sans',
    label: 'Sans-serif',
    fontFamily: '"Source Sans Pro", "Helvetica Neue", sans-serif',
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: 0.02,
  },
];

export const defaultReaderSettings: ReaderSettings = {
  theme: 'light',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: 18,
  fontWeight: 400,
  lineHeight: 1.7,
  letterSpacing: 0,
  paragraphSpacing: 1,
  contentWidth: 680,
  pageMode: 'single',
  pageAnimation: 'flip',
  clickToTurn: true,
  swipeToTurn: true,
  autoSaveProgress: true,
  reduceAnimations: false,
};

export const fontOptions = [
  { label: 'Inter', value: '"Inter", -apple-system, sans-serif' },
  { label: 'Georgia', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Merriweather', value: '"Merriweather", Georgia, serif' },
  { label: 'Playfair Display', value: '"Playfair Display", Georgia, serif' },
  { label: 'Source Sans', value: '"Source Sans Pro", sans-serif' },
  { label: 'System', value: 'system-ui, -apple-system, sans-serif' },
  { label: 'Times', value: '"Times New Roman", Times, serif' },
];
