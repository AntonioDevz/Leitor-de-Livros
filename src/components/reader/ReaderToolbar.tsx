'use client';

import type { Book, ThemeConfig } from '@/types';
import { ArrowLeft, ListTree, Search, Bookmark, Settings2, Ribbon, Maximize2, Minimize2 } from 'lucide-react';

interface ReaderToolbarProps {
  book: Book;
  currentPage: number;
  totalPages: number;
  progress: number;
  currentChapter?: string;
  onBack: () => void;
  onSettings: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
  onToggleSidebar: (tab: 'toc' | 'bookmarks' | 'search') => void;
  sidebarTab: 'toc' | 'bookmarks' | 'search' | null;
  theme: ThemeConfig;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
}

function activeStyle(active: boolean, theme: ThemeConfig) {
  return {
    background: active ? `color-mix(in srgb, ${theme.accent} 26%, transparent)` : 'transparent',
    color: active ? theme.accent : 'inherit',
  };
}

export default function ReaderToolbar({
  book,
  currentPage,
  totalPages,
  progress,
  currentChapter,
  onBack,
  onSettings,
  onBookmark,
  isBookmarked,
  onToggleSidebar,
  sidebarTab,
  theme,
  isFullscreen,
  onFullscreenToggle,
}: ReaderToolbarProps) {
  return (
    <div
      className="flex items-center justify-between px-2.5 md:px-5 py-2 border-b animate-slide-down safe-top"
      style={{
        borderColor: theme.border,
        color: theme.foreground,
        background: `color-mix(in srgb, ${theme.background} 92%, ${theme.accent} 8%)`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <button
          onClick={onBack}
          className="p-2 rounded-full transition-colors flex-shrink-0"
          style={{ color: theme.foreground, background: 'color-mix(in srgb, currentColor 6%, transparent)' }}
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 hidden sm:block ml-1">
          <p className="text-sm font-semibold truncate leading-tight">{book.title}</p>
          {currentChapter && (
            <p className="text-[11px] truncate mt-0.5" style={{ color: theme.muted }}>
              {currentChapter}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tabular-nums mr-2"
          style={{
            color: theme.muted,
            background: `color-mix(in srgb, ${theme.accent} 12%, transparent)`,
          }}
        >
          <span style={{ color: theme.accent }}>{Math.round(progress)}%</span>
          <span className="opacity-50">·</span>
          {currentPage}/{totalPages}
        </span>

        <button
          onClick={() => onToggleSidebar('toc')}
          className="p-2 rounded-full transition-all"
          style={activeStyle(sidebarTab === 'toc', theme)}
          aria-label="Sumário"
          title="Sumário"
        >
          <ListTree className="w-5 h-5" strokeWidth={1.8} />
        </button>

        <button
          onClick={() => onToggleSidebar('search')}
          className="p-2 rounded-full transition-all"
          style={activeStyle(sidebarTab === 'search', theme)}
          aria-label="Pesquisar"
          title="Pesquisar"
        >
          <Search className="w-5 h-5" strokeWidth={1.8} />
        </button>

        <button
          onClick={onBookmark}
          className="p-2 rounded-full transition-all"
          style={{
            color: isBookmarked ? theme.accent : 'inherit',
            background: isBookmarked ? `color-mix(in srgb, ${theme.accent} 20%, transparent)` : 'transparent',
          }}
          aria-label="Marcar página"
          title="Marcar página"
        >
          <Ribbon className="w-5 h-5" strokeWidth={1.8} fill={isBookmarked ? theme.accent : 'none'} />
        </button>

        <button
          onClick={() => onToggleSidebar('bookmarks')}
          className="p-2 rounded-full transition-all hidden sm:block"
          style={activeStyle(sidebarTab === 'bookmarks', theme)}
          aria-label="Marcadores"
          title="Marcadores"
        >
          <Bookmark className="w-5 h-5" strokeWidth={1.8} />
        </button>

        <button
          onClick={onSettings}
          className="p-2 rounded-full transition-all"
          style={{ color: 'inherit', background: 'color-mix(in srgb, currentColor 6%, transparent)' }}
          aria-label="Configurações"
          title="Configurações"
        >
          <Settings2 className="w-5 h-5" strokeWidth={1.8} />
        </button>

        <button
          onClick={onFullscreenToggle}
          className="p-2 rounded-full transition-all hidden sm:flex"
          style={{ color: 'inherit', background: 'color-mix(in srgb, currentColor 6%, transparent)' }}
          aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" strokeWidth={1.8} /> : <Maximize2 className="w-5 h-5" strokeWidth={1.8} />}
        </button>
      </div>
    </div>
  );
}