'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import type { Book, ReaderSettings, Bookmark } from '@/types';
import { getBook } from '@/lib/db';
import { useReader } from '@/hooks/useReader';
import { getTheme } from '@/lib/themes';
import { cn } from '@/lib/utils';
import ReaderToolbar from '@/components/reader/ReaderToolbar';
import ReaderSettingsPanel from '@/components/reader/ReaderSettingsPanel';
import PageContent from '@/components/reader/PageContent';
import SidebarPanel from '@/components/reader/SidebarPanel';

export default function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'toc' | 'bookmarks' | 'search' | null>(null);
  const [animating, setAnimating] = useState<'next' | 'prev' | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const reader = useReader(book);

  useEffect(() => {
    getBook(id).then((b) => {
      setBook(b || null);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!book) return;
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    if (page) {
      reader.goToPage(parseInt(page));
    }
  }, [book]);

  const turnPage = useCallback((direction: 'next' | 'prev') => {
    if (reader.settings.pageAnimation === 'none') {
      if (direction === 'next') reader.nextPage();
      else reader.prevPage();
      return;
    }
    setAnimating(direction);
    setTimeout(() => {
      if (direction === 'next') reader.nextPage();
      else reader.prevPage();
      setAnimating(null);
    }, 300);
  }, [reader]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSettings || sidebarTab) return;
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          turnPage('next');
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          turnPage('prev');
          break;
        case 'Home':
          e.preventDefault();
          reader.firstPage();
          break;
        case 'End':
          e.preventDefault();
          reader.lastPage();
          break;
        case 'Escape':
          reader.setShowControls(false);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [turnPage, reader, showSettings, sidebarTab]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || !reader.settings.swipeToTurn) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      turnPage(diff > 0 ? 'next' : 'prev');
    }
    setTouchStart(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-lg mb-4">Livro não encontrado</p>
          <button onClick={() => router.push('/library')} className="text-blue-400 hover:underline">
            Voltar à biblioteca
          </button>
        </div>
      </div>
    );
  }

  const theme = getTheme(reader.settings.theme, reader.settings.customTheme);
  const currentChapter = book.chapters.reduce((prev, ch) => {
    return ch.pageNumber <= reader.currentPage ? ch : prev;
  }, book.chapters[0]);

  const animationClass =
    animating === 'next' ? 'page-flip-exit' :
    animating === 'prev' ? 'page-flip-enter' : '';

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ background: theme.background, color: theme.foreground }}
      onClick={(e) => {
        if (e.target === containerRef.current || (e.target as HTMLElement).dataset.reader === 'true') {
          reader.setShowControls(!reader.showControls);
          setSidebarTab(null);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {reader.showControls && (
        <ReaderToolbar
          book={book}
          currentPage={reader.currentPage}
          totalPages={reader.totalPages}
          progress={reader.progress}
          currentChapter={currentChapter?.title}
          onBack={() => router.push(`/book/${id}`)}
          onSettings={() => setShowSettings(!showSettings)}
          onBookmark={() => reader.addBookmark()}
          isBookmarked={reader.bookmarks.some((b) => b.pageNumber === reader.currentPage)}
          onToggleSidebar={(tab) => setSidebarTab(sidebarTab === tab ? null : tab)}
          sidebarTab={sidebarTab}
          theme={theme}
        />
      )}

      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {showSettings && reader.showControls && (
          <ReaderSettingsPanel
            settings={reader.settings}
            onChangeSettings={reader.setSettings}
            onClose={() => setShowSettings(false)}
            theme={theme}
          />
        )}

        {sidebarTab && reader.showControls && (
          <SidebarPanel
            tab={sidebarTab}
            book={book}
            currentPage={reader.currentPage}
            goToPage={(page) => {
              reader.goToPage(page);
              setSidebarTab(null);
            }}
            bookmarks={reader.bookmarks}
            removeBookmark={reader.removeBookmark}
            searchResults={reader.searchResults}
            searchInBook={reader.searchInBook}
            theme={theme}
          />
        )}

        {book.pages.length > 0 && (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center',
              animationClass
            )}
            data-reader="true"
          >
            {reader.settings.pageMode === 'scroll' ? (
              <div
                className="w-full max-w-3xl mx-auto px-6 py-12 overflow-y-auto hide-scrollbar"
                style={{
                  maxHeight: '100vh',
                  '--reader-font': reader.settings.fontFamily,
                  '--reader-font-size': `${reader.settings.fontSize}px`,
                  '--reader-font-weight': reader.settings.fontWeight,
                  '--reader-line-height': reader.settings.lineHeight,
                  '--reader-letter-spacing': `${reader.settings.letterSpacing}em`,
                  '--reader-paragraph-spacing': reader.settings.paragraphSpacing,
                  '--reader-fg': theme.foreground,
                } as React.CSSProperties}
              >
                {book.pages.map((page) => (
                  <div key={page.id} className="page-content mb-8 pb-8 border-b border-current/10" data-reader="true">
                    <div dangerouslySetInnerHTML={{ __html: page.html }} />
                  </div>
                ))}
              </div>
            ) : reader.settings.pageMode === 'double' ? (
              <div className="flex gap-1 items-center justify-center" data-reader="true">
                {reader.currentPage > 1 && (
                  <div
                    className="reader-shadow rounded-l-lg overflow-hidden"
                    style={{ background: theme.background }}
                  >
                    <PageContent
                      page={book.pages[reader.currentPage - 2]}
                      settings={reader.settings}
                      theme={theme}
                    />
                  </div>
                )}
                <div
                  className="shadow-xl rounded-r-lg overflow-hidden"
                  style={{ background: theme.background }}
                >
                  <PageContent
                    page={book.pages[reader.currentPage - 1]}
                    settings={reader.settings}
                    theme={theme}
                  />
                </div>
              </div>
            ) : (
              <div
                className="reader-shadow rounded-lg overflow-hidden"
                style={{ background: theme.background }}
                data-reader="true"
              >
                <PageContent
                  page={book.pages[reader.currentPage - 1]}
                  settings={reader.settings}
                  theme={theme}
                />
              </div>
            )}
          </div>
        )}

        {reader.showControls && (
          <>
            {reader.settings.clickToTurn && reader.settings.pageMode !== 'scroll' && (
              <>
                {reader.currentPage > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); turnPage('prev'); }}
                    className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:bg-black/5 opacity-0 hover:opacity-100"
                    style={{ color: theme.foreground }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {reader.currentPage < reader.totalPages && (
                  <button
                    onClick={(e) => { e.stopPropagation(); turnPage('next'); }}
                    className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:bg-black/5 opacity-0 hover:opacity-100"
                    style={{ color: theme.foreground }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>

      {reader.showControls && (
        <div
          className="flex items-center justify-between px-6 py-3 text-xs transition-colors"
          style={{ color: theme.muted }}
        >
          <span>{reader.currentPage} de {reader.totalPages}</span>
          <span>{reader.progress}%</span>
        </div>
      )}
    </div>
  );
}
