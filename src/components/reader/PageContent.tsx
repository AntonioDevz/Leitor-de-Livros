'use client';

import type { BookPage, ReaderSettings, ThemeConfig } from '@/types';

interface PageContentProps {
  page: BookPage;
  settings: ReaderSettings;
  theme: ThemeConfig;
}

export default function PageContent({ page, settings, theme }: PageContentProps) {
  return (
    <div
      className="page-content overflow-y-auto hide-scrollbar"
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
      }}
    >
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
      <div
        className="mt-6 pt-3 text-center flex items-center justify-center gap-2.5"
        style={{ borderTop: `1px solid ${theme.border}`, color: theme.muted }}
      >
        <span className="w-6 h-px" style={{ background: theme.border }} />
        <span className="text-xs opacity-60 tabular-nums">{page.pageNumber}</span>
        <span className="w-6 h-px" style={{ background: theme.border }} />
      </div>
    </div>
  );
}