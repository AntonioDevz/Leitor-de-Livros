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
        width: settings.pageMode === 'double' ? `${settings.contentWidth / 2}px` : `${settings.contentWidth}px`,
        maxWidth: '90vw',
        height: settings.pageMode === 'scroll' ? 'auto' : '80vh',
        padding: '3rem 2.5rem',
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
        className="mt-8 pt-4 border-t text-center text-xs opacity-40"
        style={{ borderColor: theme.border }}
      >
        {page.pageNumber}
      </div>
    </div>
  );
}
