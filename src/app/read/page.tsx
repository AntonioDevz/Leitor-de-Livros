'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Book } from '@/types';
import { getBook } from '@/lib/db';
import { useReader } from '@/hooks/useReader';
import { getTheme } from '@/lib/themes';
import ReaderToolbar from '@/components/reader/ReaderToolbar';
import ReaderSettingsPanel from '@/components/reader/ReaderSettingsPanel';
import PageContent from '@/components/reader/PageContent';
import PageFlipSheet from '@/components/reader/PageFlipSheet';
import SidebarPanel from '@/components/reader/SidebarPanel';
import { Menu } from 'lucide-react';

const EASE_OUT_CUBIC = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

type FlipDir = 'next' | 'prev';
interface FlipState {
  dir: FlipDir | null;
  progress: number;
  phase: 'idle' | 'drag' | 'commit';
  lift: number;
}

type FitScales = Record<string, number>;

function ReaderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = searchParams.get('id');
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'toc' | 'bookmarks' | 'search' | null>(null);
  const [animating, setAnimating] = useState<FlipDir | null>(null);
  const [flip, setFlip] = useState<FlipState>({ dir: null, progress: 0, phase: 'idle', lift: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<{ pointerId: number | null; startX: number; startY: number; moved: boolean; width: number; lastX: number; lastT: number }>({
    pointerId: null, startX: 0, startY: 0, moved: false, width: 0, lastX: 0, lastT: 0,
  });
  const animFrameRef = useRef<number | null>(null);
  const flipStateRef = useRef(flip);
  flipStateRef.current = flip;
  const [fitScales, setFitScales] = useState<FitScales>({});
  const fitScalesRef = useRef<FitScales>({});
  const fullscreenRequestedRef = useRef(false);

  const setPageFit = useCallback((pageId: string, scale: number) => {
    const prev = fitScalesRef.current;
    if (Math.abs((prev[pageId] ?? 1) - scale) < 0.001) return;
    const next = { ...prev, [pageId]: scale };
    fitScalesRef.current = next;
    setFitScales(next);
  }, []);

  const reader = useReader(book);

  const stopFlipAnim = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const commitFlip = useCallback(
    (dir: FlipDir) => {
      if (dir === 'next') reader.nextPage();
      else reader.prevPage();
      setFlip({ dir: null, progress: 0, phase: 'idle', lift: 0 });
    },
    [reader]
  );

  const animateFlip = useCallback(
    (dir: FlipDir, from: number, to: number, duration: number, onDone: () => void) => {
      stopFlipAnim();
      const start = performance.now();
      const step = (now: number) => {
        const raw = clamp01((now - start) / duration);
        const eased = EASE_OUT_CUBIC(raw);
        const value = from + (to - from) * eased;
        setFlip((f) => ({ ...f, dir, progress: value, phase: 'commit', lift: 0 }));
        if (raw < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          animFrameRef.current = null;
          onDone();
        }
      };
      animFrameRef.current = requestAnimationFrame(step);
    },
    [stopFlipAnim]
  );

  const triggerFlip = useCallback(
    (dir: FlipDir) => {
      if (flipStateRef.current.phase !== 'idle') return;
      if (reader.settings.reduceAnimations || reader.settings.pageAnimation === 'none') {
        commitFlip(dir);
        return;
      }
      if (reader.settings.pageMode === 'single') {
        if (dir === 'next' && reader.currentPage >= reader.totalPages) return;
        if (dir === 'prev' && reader.currentPage <= 1) return;
        animateFlip(dir, 0, 1, 260, () => commitFlip(dir));
        return;
      }
      // double mode -> animate the spread
      if (dir === 'next' && reader.currentPage >= reader.totalPages) return;
      if (dir === 'prev' && reader.currentPage <= 1) return;
      setAnimating(dir);
      setTimeout(() => {
        commitFlip(dir);
        setAnimating(null);
      }, 240);
    },
    [reader, animateFlip, commitFlip]
  );

  useEffect(() => {
    if (!bookId) {
      setLoading(false);
      return;
    }
    getBook(bookId).then((b) => {
      setBook(b || null);
      setLoading(false);
    });
  }, [bookId]);

  useEffect(() => {
    if (!book) return;
    const page = searchParams.get('page');
    if (page) {
      reader.goToPage(parseInt(page));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book]);

  const toggleControls = useCallback(() => {
    reader.setShowControls(!reader.showControls);
  }, [reader]);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
  }, []);

  // First reading gesture enters fullscreen automatically so the browser
  // search/address bar disappears and the book fills the whole screen.
  const maybeRequestFullscreen = useCallback(() => {
    if (fullscreenRequestedRef.current || typeof document === 'undefined') return;
    if (!document.fullscreenEnabled || document.fullscreenElement) return;
    const touch = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
    const narrow = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!touch && !narrow) return;
    fullscreenRequestedRef.current = true;
    window.setTimeout(() => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      }
    }, 120);
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Auto-hide controls for an immersive book feel
  useEffect(() => {
    if (!reader.showControls || showSettings || sidebarTab || flip.phase !== 'idle') return;
    const t = setTimeout(() => reader.setShowControls(false), 4200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reader.showControls, showSettings, sidebarTab, flip.phase]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSettings || sidebarTab) return;
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          maybeRequestFullscreen();
          triggerFlip('next');
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          maybeRequestFullscreen();
          triggerFlip('prev');
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
  }, [triggerFlip, reader, showSettings, sidebarTab, maybeRequestFullscreen]);

  // ---------- Pointer gesture engine (drag-to-turn like a real book) ----------

  const isInteractiveTarget = (el: EventTarget | null) => {
    const node = el as HTMLElement | null;
    if (!node || !node.closest) return true;
    return !!node.closest('button, select, input, a, [data-panel]');
  };

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (reader.settings.pageMode === 'scroll') return;
      if (isInteractiveTarget(e.target)) return;
      maybeRequestFullscreen();
      stopFlipAnim();
      const stage = stageRef.current;
      const width = stage?.getBoundingClientRect().width || 0;
      gestureRef.current = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, moved: false, width, lastX: e.clientX, lastT: performance.now() };
      try {
        stage?.setPointerCapture(e.pointerId);
      } catch { /* ignore */ }
    },
    [reader.settings.pageMode, stopFlipAnim]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const g = gestureRef.current;
      if (g.pointerId !== e.pointerId) return;
      const dx = g.startX - e.clientX;
      const dy = g.startY - e.clientY;
      if (!g.moved) {
        if (Math.hypot(dx, dy) < 6) return;
        g.moved = true;
      }
      const now = performance.now();
      g.lastX = e.clientX;
      g.lastT = now;
      if (reader.settings.pageMode !== 'single' || reader.settings.reduceAnimations) {
        return; // treat as swipe; decide on release
      }
      const dir: FlipDir = dx > 0 ? 'next' : 'prev';
      if (dir === 'next' && reader.currentPage >= reader.totalPages) return;
      if (dir === 'prev' && reader.currentPage <= 1) return;

      // finger leads, page follows: half the stage width turns the full page
      const raw = Math.min(1, Math.abs(dx) / (g.width * 0.5));
      const eased = clamp01(raw * 1.15);
      // the sheet rides up and down with the finger while dragging
      const liftPx = clamp(-dy * 0.4, -80, 46);
      setFlip((f) =>
        f.dir !== dir
          ? { dir, progress: 0.04, phase: 'drag', lift: liftPx }
          : { dir, progress: eased, phase: 'drag', lift: liftPx }
      );
    },
    [reader.settings.pageMode, reader.settings.reduceAnimations, reader.currentPage, reader.totalPages]
  );

  const handlePointerEnd = useCallback(
    (e: React.PointerEvent) => {
      const g = gestureRef.current;
      if (g.pointerId !== e.pointerId) return;
      g.pointerId = null;
      const wasMoved = g.moved;

      if (!wasMoved) {
        // ---- TAP behaviour ----
        const stage = stageRef.current;
        if (!stage) return;
        const rect = stage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const w = rect.width || 1;
        if (x < w * 0.33) {
          triggerFlip('prev');
          return;
        }
        if (x > w * 0.66) {
          triggerFlip('next');
          return;
        }
        toggleControls();
        return;
      }

      // ---- DRAG ended: commit or snap back ----
      const state = flipStateRef.current;
      if (state.phase === 'idle' || !state.dir) {
        // swipe on non-flip modes / double mode
        const dx = g.startX - e.clientX;
        if (Math.abs(dx) > 35) {
          triggerFlip(dx > 0 ? 'next' : 'prev');
        }
        return;
      }
      const flipped = state.progress > 0.22;
      const dt = Math.max(1, performance.now() - g.lastT);
      const movedPx = Math.abs(g.startX - e.clientX);
      const vx = movedPx / dt; // px per ms
      // a fast intentional flick turns the page even if the drag was short (but not a nudge)
      const isFlick = movedPx > Math.max(48, g.width * 0.08) && vx > 0.35;
      // Mark the phase synchronously in the ref: browsers fire pointerleave right
      // after pointerup on touch, and React's state update is async, so without
      // this the leave handler would read a stale 'drag' and snap the flip back.
      flipStateRef.current = { ...state, phase: 'commit' };
      if (flipped || isFlick) {
        animateFlip(state.dir, state.progress, 1, (1 - state.progress) * 240 + 80, () =>
          commitFlip(state.dir!)
        );
      } else {
        animateFlip(state.dir, state.progress, 0, state.progress * 220 + 70, () =>
          setFlip({ dir: null, progress: 0, phase: 'idle', lift: 0 })
        );
      }
    },
    [triggerFlip, toggleControls, animateFlip, commitFlip, maybeRequestFullscreen]
  );

  const handlePointerCancel = useCallback(() => {
    const state = flipStateRef.current;
    if (state.phase === 'drag' && state.dir) {
      animateFlip(state.dir, state.progress, 0, 120, () => setFlip({ dir: null, progress: 0, phase: 'idle', lift: 0 }));
    }
    gestureRef.current.pointerId = null;
  }, [animateFlip]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 border-[2.5px] border-[#d8ccb9] border-t-[#bb7a1c] rounded-full animate-spin" />
          <p className="text-xs text-[#8b8174] tracking-wide">Abrindo seu livro…</p>
        </div>
      </div>
    );
  }

  if (!book || !bookId) {
    return (
      <div className="min-h-screen bg-[#faf7f1] flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-lg text-[#221d17] mb-4">Livro não encontrado</p>
          <button
            onClick={() => router.push('/library/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#221d17] text-[#e9dfcd] rounded-full text-sm font-medium hover:bg-[#3a322a] transition-colors"
          >
            Voltar à biblioteca
          </button>
        </div>
      </div>
    );
  }

  const theme = getTheme(reader.settings.theme, reader.settings.customTheme);
  const themeClass = reader.settings.theme === 'dark' || reader.settings.theme === 'black' ? 'theme-dark' : 'theme-light';
  const currentChapter = book.chapters.reduce((prev, ch) => {
    return ch.pageNumber <= reader.currentPage ? ch : prev;
  }, book.chapters[0]);

  const pageMode = reader.settings.pageMode;
  const flipActive = flip.phase !== 'idle' && flip.dir !== null;
  const isForward = flip.dir === 'next';
  const singleBlockWidth = `min(${reader.settings.contentWidth}px, calc(100% - 2.5rem))`;
  const radius = '14px';

  // Page picks for the physical single-page flip
  const singleCurrent = book.pages[reader.currentPage - 1];
  const singleBase = flipActive
    ? isForward
      ? book.pages[reader.currentPage]
      : book.pages[reader.currentPage - 2]
    : singleCurrent;

  return (
    <div
      className={`h-dvh relative overflow-hidden flex flex-col transition-colors duration-300 ${themeClass} ${reader.showControls ? 'controls-visible' : ''}`}
      style={{ background: theme.background, color: theme.foreground, overscrollBehavior: 'none' }}
    >
      {reader.showControls && (
        <div className="absolute inset-x-0 top-0 z-20 animate-slide-down">
          <ReaderToolbar
            book={book}
            currentPage={reader.currentPage}
            totalPages={reader.totalPages}
            progress={reader.progress}
            currentChapter={currentChapter?.title}
            onBack={() => router.push(`/book/?id=${bookId}`)}
            onSettings={() => setShowSettings(!showSettings)}
            onBookmark={() => reader.addBookmark()}
            isBookmarked={reader.bookmarks.some((b) => b.pageNumber === reader.currentPage)}
            onToggleSidebar={(tab) => setSidebarTab(sidebarTab === tab ? null : tab)}
            sidebarTab={sidebarTab}
            theme={theme}
            isFullscreen={isFullscreen}
            onFullscreenToggle={toggleFullscreen}
          />
        </div>
      )}

      <div
        ref={stageRef}
        className={`reader-stage ${pageMode === 'scroll' ? 'reader-stage--scroll' : ''}`}
        style={{ touchAction: pageMode === 'scroll' ? 'pan-y' : 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerCancel}
      >
        <div className="stage-ambient" />

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

        {book.pages.length > 0 && pageMode === 'single' && (
          <div className="flip-scene relative w-full h-full flex items-center justify-center" data-reader="true">
            <div
              className="book-block relative overflow-hidden"
              style={{ width: singleBlockWidth, height: '100%', maxHeight: '100%', borderRadius: radius, color: theme.foreground }}
            >
              {/* Static current page (the portion that is not peeled yet) */}
              <div className="absolute inset-0" style={{ borderRadius: radius, background: theme.background, boxShadow: '0 2px 6px rgba(0,0,0,0.1), 0 22px 48px rgba(0,0,0,0.22)' }}>
                {singleCurrent && (
                  <PageContent
                    page={singleCurrent}
                    settings={reader.settings}
                    theme={theme}
                    fitMode="auto"
                    onFit={(s) => setPageFit(singleCurrent.id, s)}
                  />
                )}
              </div>

              {/* Revealed target page beneath the peeled band (creep follows the finger) */}
              {flipActive && singleBase && (
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: radius,
                    background: theme.background,
                    clipPath: isForward
                      ? `inset(0px 0px 0px ${(1 - flip.progress) * 100}%)` // reveal the right slice of the next page
                      : `inset(0px ${(1 - flip.progress) * 100}% 0px 0px)`, // reveal the left slice of the previous page
                  }}
                >
                  <PageContent
                    page={singleBase}
                    settings={reader.settings}
                    theme={theme}
                    fitMode="auto"
                    onFit={(s) => setPageFit(singleBase.id, s)}
                  />
                  <div
                    className="under-shade"
                    style={{
                      background: isForward
                        ? `linear-gradient(to right, transparent 40%, rgba(0,0,0,${0.16 * flip.progress}) 100%)`
                        : `linear-gradient(to left, transparent 40%, rgba(0,0,0,${0.16 * flip.progress}) 100%)`,
                      zIndex: 2,
                    }}
                  />
                </div>
              )}

              {/* Turning sheet: a band peeled off the current page, fold crease under the finger */}
              {flipActive && singleCurrent && (
                <PageFlipSheet
                  front={singleCurrent}
                  direction={flip.dir as FlipDir}
                  progress={flip.progress}
                  lift={flip.lift}
                  settings={reader.settings}
                  theme={theme}
                  fitScale={fitScales[singleCurrent?.id] ?? 1}
                />
              )}
            </div>
          </div>
        )}

        {book.pages.length > 0 && pageMode === 'double' && (
          <div className={`flip-scene relative w-full h-full flex items-center justify-center ${animating ? 'page-flip-exit' : ''}`} data-reader="true">
            <div className="relative h-full flex items-stretch justify-center" style={{ gap: 0 }}>
              {reader.currentPage > 1 && (
                <div
                  className="book-spread__page book-spread__page--left page-block-edge"
                  style={{ width: `min(${reader.settings.contentWidth / 2}px, 46vw)`, borderRadius: '12px 4px 4px 12px', color: theme.foreground }}
                >
                  {book.pages[reader.currentPage - 2] && (
                    <PageContent
                      page={book.pages[reader.currentPage - 2]}
                      settings={reader.settings}
                      theme={theme}
                      fitMode="auto"
                      onFit={(s) => setPageFit(book.pages[reader.currentPage - 2]!.id, s)}
                    />
                  )}
                </div>
              )}
              <div
                className="book-spread__page book-spread__page--right page-block-edge"
                style={{ width: `min(${reader.settings.contentWidth / 2}px, 46vw)`, borderRadius: '4px 12px 12px 4px', color: theme.foreground }}
              >
                {book.pages[reader.currentPage - 1] && (
                  <PageContent
                    page={book.pages[reader.currentPage - 1]}
                    settings={reader.settings}
                    theme={theme}
                    fitMode="auto"
                    onFit={(s) => setPageFit(book.pages[reader.currentPage - 1]!.id, s)}
                  />
                )}
              </div>
              {reader.currentPage > 1 && <div className="book-spread__gutter" />}
            </div>
          </div>
        )}

        {book.pages.length > 0 && pageMode === 'scroll' && (
          <div
            className="w-full h-full mx-auto overflow-y-auto hide-scrollbar px-5"
            style={{
              maxWidth: `min(${reader.settings.contentWidth}px, 100%)`,
              height: '100%',
            }}
          >
            {book.pages.map((page) => (
              <div
                key={page.id}
                className="page-block-edge relative mb-6"
                style={{ borderRadius: radius, background: theme.background, color: theme.foreground }}
              >
                <PageContent page={page} settings={reader.settings} theme={theme} />
              </div>
            ))}
            <div className="pb-[env(safe-area-inset-bottom,1rem)]" />
          </div>
        )}

        {/* Corner curl hint while dragging */}
        {flip.phase === 'drag' && flip.dir && (
          <div
            className="curl-hint"
            style={{
              bottom: 6,
              opacity: clamp01(flip.progress * 2),
              ...(flip.dir === 'next' ? { right: 6 } : { left: 6 }),
            } as React.CSSProperties}
          />
        )}

        {/* Invisible book-like tap zones */}
        {reader.showControls && pageMode !== 'scroll' && (
          <>
            <div className="tap-zone-hint tap-zone-hint--left" />
            <div className="tap-zone-hint tap-zone-hint--right" />
          </>
        )}

        {/* Minimal floating button to reopen the menu when controls are hidden */}
        {!reader.showControls && !showSettings && !sidebarTab && pageMode !== 'scroll' && (
          <button
            onClick={toggleControls}
            className="absolute bottom-4 right-4 z-30 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 animate-fade-in"
            style={{
              color: theme.foreground,
              background: `color-mix(in srgb, ${theme.foreground} 7%, transparent)`,
              border: `1px solid color-mix(in srgb, ${theme.foreground} 14%, transparent)`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            aria-label="Abrir menu do leitor"
            title="Menu"
          >
            <Menu className="w-5 h-5" strokeWidth={1.8} />
          </button>
        )}
      </div>

      {reader.showControls && (
        <div
          className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-4 py-2 transition-colors safe-bottom animate-slide-up"
          style={{
            color: theme.muted,
            background: `color-mix(in srgb, ${theme.background} 88%, transparent)`,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: `1px solid color-mix(in srgb, ${theme.foreground} 8%, transparent)`,
          }}
        >
          <div className="flex items-center gap-2.5 px-2 text-[11px] tabular-nums">
            <span className="font-medium" style={{ color: theme.foreground }}>{reader.currentPage}</span>
            <span className="opacity-50">—</span>
            <span>{reader.totalPages}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            {currentChapter && (
              <span className="text-[11px] opacity-80 max-w-[40vw] truncate">{currentChapter.title}</span>
            )}
          </div>
          <div className="flex items-center gap-2 px-2">
            <div className="w-16 h-[3px] rounded-full overflow-hidden" style={{ background: `color-mix(in srgb, ${theme.foreground} 15%, transparent)` }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${reader.progress}%`, background: theme.accent }}
              />
            </div>
            <span className="text-[11px] tabular-nums font-medium" style={{ color: theme.foreground }}>
              {reader.progress}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf7f1] flex items-center justify-center">
        <div className="w-9 h-9 border-[2.5px] border-[#d8ccb9] border-t-[#bb7a1c] rounded-full animate-spin" />
      </div>
    }>
      <ReaderContent />
    </Suspense>
  );
}