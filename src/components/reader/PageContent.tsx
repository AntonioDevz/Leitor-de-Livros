'use client';

import { useEffect, useRef } from 'react';
import type { BookPage, ReaderSettings, ThemeConfig } from '@/types';

interface PageContentProps {
  page: BookPage;
  settings: ReaderSettings;
  theme: ThemeConfig;
  /** Explicit scale to apply (0..1). When provided the component does NOT measure. */
  fitScale?: number;
  /** 'auto' = measure once and report via onFit; 'none' = render at natural size. */
  fitMode?: 'none' | 'auto';
  onFit?: (scale: number) => void;
}

const MIN_FIT = 0.45;

/**
 * Renders a book page and AUTO-FITS it inside its box: if the text is taller
 * than the available area the content is scaled down so no part of the page is
 * ever clipped ("parts stuck above/below the screen"). The scale is computed
 * from the real block geometry (width x height) and shared through `fitScale`,
 * so every instance that shows the same page — static layer, revealed base and
 * the turning sheet — uses the exact same geometry and the text stays
 * continuous across flips.
 */
export default function PageContent({
  page,
  settings,
  theme,
  fitScale,
  fitMode = 'none',
  onFit,
}: PageContentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const lastReportedRef = useRef<number | null>(null);

  const hasExplicitScale = fitScale !== undefined;

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    const fit = fitRef.current;
    const footer = footerRef.current;
    if (!root || !inner || !fit) return;

    let raf = 0;

    const apply = (scale: number) => {
      // reset to natural layout first so re-runs are idempotent
      fit.style.transform = 'none';
      fit.style.height = 'auto';
      if (scale < 1) {
        const natH = fit.scrollHeight || 1;
        fit.style.transformOrigin = 'top left';
        fit.style.transform = `scale(${scale})`;
        fit.style.height = `${natH * scale}px`;
      }
    };

    if (hasExplicitScale) {
      apply(fitScale ?? 1);
      return;
    }

    if (fitMode !== 'auto') return;

    const measure = () => {
      // natural height of the content (before scaling)
      fit.style.transform = 'none';
      fit.style.height = 'auto';
      const natH = fit.scrollHeight || 1;

      const availH = inner.clientHeight;
      const footerReserve = footer ? footer.offsetHeight + 24 : 0; // mt-6 (24px)
      const usable = Math.max(1, availH - footerReserve);

      const scale = Math.max(MIN_FIT, Math.min(1, usable / natH));
      apply(scale);

      const reported = lastReportedRef.current;
      if (reported === null || Math.abs(reported - scale) >= 0.005) {
        lastReportedRef.current = scale;
        onFit?.(scale);
      }
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    measure();
    const ro = new ResizeObserver(schedule);
    ro.observe(inner);

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) {
      fonts.ready.then(() => schedule()).catch(() => {});
    }
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [page.id, settings.fontSize, settings.lineHeight, settings.letterSpacing, settings.fontWeight, settings.paragraphSpacing, settings.fontFamily, settings.contentWidth, fitScale, fitMode, onFit]);

  return (
    <div
      ref={rootRef}
      className="page-content"
      style={{
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        padding: 'clamp(1.25rem, 4vw, 3.25rem) clamp(1rem, 4vw, 2.75rem)',
        fontFamily: settings.fontFamily,
        fontSize: `${settings.fontSize}px`,
        fontWeight: settings.fontWeight,
        lineHeight: settings.lineHeight,
        letterSpacing: `${settings.letterSpacing}em`,
        color: theme.foreground,
        background: theme.background,
        overflow: 'hidden',
      }}
    >
      <div
        ref={innerRef}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div ref={fitRef} style={{ width: '100%', minWidth: 0 }}>
          <div
            dangerouslySetInnerHTML={{ __html: page.html }}
            style={{
              '--reader-font': settings.fontFamily,
              '--reader-font-size': `${settings.fontSize}px`,
              '--reader-font-weight': settings.fontWeight,
              '--reader-line-height': settings.lineHeight,
              '--reader-letter-spacing': `${settings.letterSpacing}em`,
              '--reader-paragraph-spacing': settings.paragraphSpacing,
              '--reader-fg': theme.foreground,
            } as React.CSSProperties}
          />
        </div>
        <div
          ref={footerRef}
          className="mt-6 pt-3 text-center flex items-center justify-center gap-2.5"
          style={{ borderTop: `1px solid ${theme.border}`, color: theme.muted, flexShrink: 0 }}
        >
          <span className="w-6 h-px" style={{ background: theme.border }} />
          <span className="text-xs opacity-60 tabular-nums">{page.pageNumber}</span>
          <span className="w-6 h-px" style={{ background: theme.border }} />
        </div>
      </div>
    </div>
  );
}