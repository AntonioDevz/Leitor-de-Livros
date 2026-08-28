'use client';

import type { BookPage, ReaderSettings, ThemeConfig } from '@/types';
import PageContent from './PageContent';

interface PageFlipSheetProps {
  front: BookPage;
  back: BookPage | null;
  direction: 'next' | 'prev';
  progress: number; // 0..1 (1 = fully turned)
  lift?: number; // vertical offset following the finger while dragging
  settings: ReaderSettings;
  theme: ThemeConfig;
}

/**
 * A realistic 3D page-foil that follows a finger-drag.
 * - forward (next):  pivot on the LEFT spine, rotateY 0 -> -180deg
 * - backward (prev): pivot on the RIGHT edge, rotateY 0 -> +180deg
 * While being dragged the sheet also rises to follow the finger (lift),
 * bulges gently at mid-turn and gains curl + moving light on the fold.
 */
export default function PageFlipSheet({
  front,
  back,
  direction,
  progress = 0,
  lift = 0,
  settings,
  theme,
}: PageFlipSheetProps) {
  const clamp01 = Math.max(0, Math.min(1, progress));
  const forward = direction === 'next';
  const angle = forward ? -180 * clamp01 : 180 * clamp01;

  const t = Math.sin(clamp01 * Math.PI); // 0 -> 1 -> 0 across the turn (mid-turn glow/cast)
  const rise = (1 - Math.cos(clamp01 * Math.PI)) * 14; // sheet humps up in the middle
  const translateY = lift - rise;

  // Mid-turn bulge along the free edge
  const bulge = 1 + 0.014 * t;

  const transform =
    `translateY(${translateY.toFixed(2)}px) ` +
    `scale(${bulge.toFixed(3)}) ` +
    `rotateY(${angle.toFixed(2)}deg)`;

  // Lighting components
  const hingeShadow = 0.34 * t;
  const edgeGlint = 0.6 * t; // light catching the folded edge
  const curl = 0.3 + 0.45 * t; // corner fold deepening
  const sheenOpacity = 0.4 * Math.sin((clamp01 * Math.PI) / 2);
  const sheenCenter = forward ? clamp01 * 100 : 100 - clamp01 * 100;
  const castShadow = 0.14 + 0.16 * t;

  const hingeGradient = forward
    ? `linear-gradient(to right, rgba(0,0,0,${hingeShadow.toFixed(3)}) 0%, transparent 20%)`
    : `linear-gradient(to left, rgba(0,0,0,${hingeShadow.toFixed(3)}) 0%, transparent 20%)`;

  const edgeGradient = forward
    ? `linear-gradient(to left, rgba(255,255,255,${edgeGlint.toFixed(3)}) 0%, transparent 16%)`
    : `linear-gradient(to right, rgba(255,255,255,${edgeGlint.toFixed(3)}) 0%, transparent 16%)`;

  const curlGradient = forward
    ? `radial-gradient(150% 150% at 100% 100%, rgba(0,0,0,${curl.toFixed(3)}) 0%, transparent 44%)`
    : `radial-gradient(150% 150% at 0% 100%, rgba(0,0,0,${curl.toFixed(3)}) 0%, transparent 44%)`;

  const paperGrain = forward
    ? 'radial-gradient(120% 90% at 18% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 46%), radial-gradient(130% 120% at 85% 100%, rgba(0,0,0,0.06) 0%, transparent 46%)'
    : 'radial-gradient(120% 90% at 82% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 46%), radial-gradient(130% 120% at 15% 100%, rgba(0,0,0,0.06) 0%, transparent 46%)';

  return (
    <div
      className={`flip-sheet rounded-[inherit] ${forward ? '' : 'flip-sheet--origin-right'}`}
      style={{
        transform,
        zIndex: 30,
        willChange: 'transform',
        boxShadow: forward
          ? `${(-9 * t).toFixed(1)}px ${(6 * t).toFixed(1)}px ${(18 + 30 * t).toFixed(0)}px rgba(0,0,0,${castShadow.toFixed(3)})`
          : `${(9 * t).toFixed(1)}px ${(6 * t).toFixed(1)}px ${(18 + 30 * t).toFixed(0)}px rgba(0,0,0,${castShadow.toFixed(3)})`,
      }}
      data-reader="true"
    >
      {/* Front face (the page leaving the reader's view) */}
      <div className="flip-face" style={{ borderRadius: 'inherit', background: theme.background }}>
        <PageContent page={front} settings={settings} theme={theme} />

        {/* paper grain / light on the sheet */}
        <div className="flip-shade" style={{ background: paperGrain }} />

        {/* darkening toward the hinge as the page lifts */}
        <div className="flip-shade" style={{ background: hingeGradient }} />

        {/* light catching the moving fold edge */}
        <div className="flip-shade" style={{ background: edgeGradient }} />

        {/* folded corner curl */}
        <div className="flip-shade" style={{ background: curlGradient }} />

        {/* moving sheen sweeping over the open face */}
        <div
          className="flip-shade"
          style={{
            background: `linear-gradient(${forward ? '115deg' : '65deg'}, transparent ${sheenCenter - 10}%, rgba(255,255,255,${sheenOpacity.toFixed(3)}) ${sheenCenter}%, transparent ${sheenCenter + 10}%)`,
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

          <div className="flip-shade" style={{ background: paperGrain }} />

          <div
            className="flip-shade"
            style={{
              background: forward
                ? `linear-gradient(to left, rgba(0,0,0,${(0.3 * t).toFixed(3)}) 0%, transparent 30%)`
                : `linear-gradient(to right, rgba(0,0,0,${(0.3 * t).toFixed(3)}) 0%, transparent 30%)`,
            }}
          />

          <div className="flip-shade" style={{ background: curlGradient }} />
        </div>
      )}
    </div>
  );
}