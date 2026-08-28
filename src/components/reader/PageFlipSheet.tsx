'use client';

import type { BookPage, ReaderSettings, ThemeConfig } from '@/types';
import PageContent from './PageContent';

interface PageFlipSheetProps {
  front: BookPage;
  back: BookPage | null;
  direction: 'next' | 'prev';
  progress: number; // 0..1 (1 = fully turned)
  animated: boolean;
  settings: ReaderSettings;
  theme: ThemeConfig;
}

/**
 * A realistic 3D page-foil that follows a finger-drag.
 * - forward (next):  pivot on the LEFT spine, rotateY 0 -> -180deg
 * - backward (prev): pivot on the RIGHT edge, rotateY 0 -> +180deg
 * Lighting gradients are driven by progress to mimic paper folding.
 */
export default function PageFlipSheet({
  front,
  back,
  direction,
  progress = 0,
  animated = false,
  settings,
  theme,
}: PageFlipSheetProps) {
  const clamp01 = Math.max(0, Math.min(1, progress));
  const forward = direction === 'next';
  const angle = forward ? -180 * clamp01 : 180 * clamp01;
  const originRight = !forward;
  const sin = Math.sin((clamp01 * Math.PI) / 2);

  // Reflective sheen that sweeps across the turning page
  const sheenCenter = forward ? clamp01 * 100 : 100 - clamp01 * 100;
  // Fold shadow near the hinge, strongest at mid-turn
  const hingeOpacity = Math.sin(clamp01 * Math.PI) * 0.5;

  return (
    <div
      className={`flip-sheet rounded-[inherit] ${originRight ? 'flip-sheet--origin-right' : ''} ${animated ? 'flip-sheet--animated' : ''}`}
      style={{
        transform: `rotateY(${angle}deg)`,
        zIndex: 30,
        borderRadius: 'inherit',
      }}
      data-reader="true"
    >
      {/* Front face (the page leaving the reader's view) */}
      <div className="flip-face" style={{ borderRadius: 'inherit', background: theme.background }}>
        <PageContent page={front} settings={settings} theme={theme} />
        {/* darkening toward the hinge as the page lifts */}
        <div
          className="flip-shade"
          style={{
            background: forward
              ? `linear-gradient(to right, rgba(0,0,0,${0.34 * hingeOpacity}) 0%, transparent 22%)`
              : `linear-gradient(to left, rgba(0,0,0,${0.34 * hingeOpacity}) 0%, transparent 22%)`,
          }}
        />
        {/* moving sheen on the open face */}
        <div
          className="flip-shade"
          style={{
            background: `linear-gradient(${forward ? '115deg' : '65deg'}, transparent ${sheenCenter - 9}%, rgba(255,255,255,${0.42 * sin}) ${sheenCenter}%, transparent ${sheenCenter + 9}%)`,
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* Back face (reverse side of the sheet / target page) */}
      {back && (
        <div
          className="flip-face flip-face--back"
          style={{ borderRadius: 'inherit', background: theme.background }}
        >
          <PageContent page={back} settings={settings} theme={theme} />
          <div
            className="flip-shade"
            style={{
              background: forward
                ? `linear-gradient(to left, rgba(0,0,0,${0.3 * hingeOpacity}) 0%, transparent 30%)`
                : `linear-gradient(to right, rgba(0,0,0,${0.3 * hingeOpacity}) 0%, transparent 30%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}