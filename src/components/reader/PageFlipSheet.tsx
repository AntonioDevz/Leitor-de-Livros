'use client';

import type { BookPage, ReaderSettings, ThemeConfig } from '@/types';
import PageContent from './PageContent';

interface PageFlipSheetProps {
  front: BookPage;
  direction: 'next' | 'prev';
  progress: number; // 0..1 (1 = fully turned)
  lift?: number; // vertical offset following the finger while dragging
  settings: ReaderSettings;
  theme: ThemeConfig;
  /** Shared auto-fit scale for `front` so the sheet matches the static layer. */
  fitScale?: number;
}

/**
 * A realistic page peel whose fold CREASE follows the finger (Apple Books style).
 * - forward (next):  the right side of the current page peels off and folds left;
 *   the crease sweeps from the right edge to the spine as the finger drags left.
 * - backward (prev): the left side peels and folds right; the crease sweeps
 *   from the left edge to the spine as the finger drags right.
 *
 * The sheet only covers the peeled band: its left (or right) edge IS the moving
 * crease, positioned exactly where the finger is dragging.
 */
export default function PageFlipSheet({
  front,
  direction,
  progress = 0,
  lift = 0,
  settings,
  theme,
  fitScale,
}: PageFlipSheetProps) {
  const clamp01 = Math.max(0, Math.min(1, progress));
  const forward = direction === 'next';

  // crease fraction inside the page block: 0 (free edge) -> 1 (spine/fully turned)
  const crease = forward ? 1 - clamp01 : clamp01;

  // peeled band geometry (percent of the page block)
  const leftPct = forward ? crease * 100 : 0;
  const widthPct = clamp01 * 100;

  const angle = (forward ? -180 : 180) * clamp01;

  const t = Math.sin(clamp01 * Math.PI); // 0 -> 1 -> 0 across the turn (mid-turn glow/cast)
  const rise = (1 - Math.cos(clamp01 * Math.PI)) * 14; // sheet humps up in the middle
  const translateY = lift - rise;

  const transform = `translateY(${translateY.toFixed(2)}px) rotateY(${angle.toFixed(2)}deg)`;

  // Lighting components
  const hingeShadow = 0.34 * t; // darkening at the moving fold
  const edgeGlint = 0.5 * t; // light catching the free/fold edge
  const curl = 0.3 + 0.45 * t; // corner fold deepening
  const sheenOpacity = 0.4 * Math.sin((clamp01 * Math.PI) / 2);
  const sheenCenter = clamp01 * 100;
  const castShadow = 0.14 + 0.16 * t;

  const hingeGradient = forward
    ? `linear-gradient(to left, rgba(0,0,0,${hingeShadow.toFixed(3)}) 0%, transparent 24%)`
    : `linear-gradient(to right, rgba(0,0,0,${hingeShadow.toFixed(3)}) 0%, transparent 24%)`;

  const edgeGradient = forward
    ? `linear-gradient(to right, rgba(255,255,255,${edgeGlint.toFixed(3)}) 0%, transparent 20%)`
    : `linear-gradient(to left, rgba(255,255,255,${edgeGlint.toFixed(3)}) 0%, transparent 20%)`;

  const curlGradient = forward
    ? `radial-gradient(150% 150% at 100% 100%, rgba(0,0,0,${curl.toFixed(3)}) 0%, transparent 44%)`
    : `radial-gradient(150% 150% at 0% 100%, rgba(0,0,0,${curl.toFixed(3)}) 0%, transparent 44%)`;

  const paperGrain = 'radial-gradient(120% 90% at 18% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 46%), radial-gradient(130% 120% at 85% 100%, rgba(0,0,0,0.06) 0%, transparent 46%)';

  return (
    <div
      className="flip-sheet absolute top-0 bottom-0"
      style={{
        left: `${leftPct.toFixed(2)}%`,
        width: `${widthPct.toFixed(2)}%`,
        height: '100%',
        transformOrigin: forward ? 'left center' : 'right center',
        transform,
        transformStyle: 'preserve-3d',
        WebkitTransformStyle: 'preserve-3d',
        willChange: 'transform, left, width',
        zIndex: 30,
        boxShadow: forward
          ? `${(-9 * t).toFixed(1)}px ${(6 * t).toFixed(1)}px ${(18 + 30 * t).toFixed(0)}px rgba(0,0,0,${castShadow.toFixed(3)})`
          : `${(9 * t).toFixed(1)}px ${(6 * t).toFixed(1)}px ${(18 + 30 * t).toFixed(0)}px rgba(0,0,0,${castShadow.toFixed(3)})`,
      }}
      data-reader="true"
    >
      {/* Front face: the peeling side of the current page */}
      <div
        className="flip-face"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderRadius: 'inherit',
          background: theme.background,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <div className="absolute inset-y-0 right-0" style={{ width: `${(1 / Math.max(0.001, clamp01)) * 100}%`, maxWidth: 'none' }}>
          <PageContent page={front} settings={settings} theme={theme} fitScale={fitScale} />
        </div>

        {/* paper grain / light on the sheet */}
        <div className="flip-shade" style={{ background: paperGrain }} />

        {/* darkening toward the moving fold */}
        <div className="flip-shade" style={{ background: hingeGradient }} />

        {/* light catching the fold edge */}
        <div className="flip-shade" style={{ background: edgeGradient }} />

        {/* folded corner curl */}
        <div className="flip-shade" style={{ background: curlGradient }} />

        {/* moving sheen sweeping over the open face */}
        <div
          className="flip-shade"
          style={{
            background: `linear-gradient(to ${forward ? 'right' : 'left'}, transparent ${sheenCenter - 10}%, rgba(255,255,255,${sheenOpacity.toFixed(3)}) ${sheenCenter}%, transparent ${sheenCenter + 10}%)`,
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* Back face: reverse side of the peeled sheet (same paper, darker ink) */}
      <div
        className="flip-face flip-face--back"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderRadius: 'inherit',
          background: theme.background,
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <div className="absolute inset-y-0 right-0" style={{ width: `${(1 / Math.max(0.001, clamp01)) * 100}%`, maxWidth: 'none' }}>
          <PageContent page={front} settings={settings} theme={theme} fitScale={fitScale} />
        </div>

        <div
          className="flip-shade"
          style={{ background: `linear-gradient(to ${forward ? 'right' : 'left'}, rgba(0,0,0,${(0.3 * t).toFixed(3)}) 0%, transparent 30%)` }}
        />

        <div className="flip-shade" style={{ background: curlGradient }} />
      </div>
    </div>
  );
}