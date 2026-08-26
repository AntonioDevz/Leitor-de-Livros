'use client';

import type { Book, ThemeConfig } from '@/types';

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
}

export default function ReaderToolbar({
  book,
  currentPage,
  progress,
  currentChapter,
  onBack,
  onSettings,
  onBookmark,
  isBookmarked,
  onToggleSidebar,
  sidebarTab,
  theme,
}: ReaderToolbarProps) {
  return (
    <div
      className="flex items-center justify-between px-4 md:px-6 py-3 border-b transition-colors animate-slide-down"
      style={{ borderColor: theme.border, color: theme.foreground, background: theme.background }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="min-w-0 hidden sm:block">
          <p className="text-sm font-medium truncate">{book.title}</p>
          {currentChapter && (
            <p className="text-xs opacity-60 truncate">{currentChapter}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onToggleSidebar('toc')}
          className={cn('p-2 rounded-lg transition-colors', sidebarTab === 'toc' ? 'bg-black/10' : 'hover:bg-black/5')}
          title="Sumário"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>

        <button
          onClick={() => onToggleSidebar('search')}
          className={cn('p-2 rounded-lg transition-colors', sidebarTab === 'search' ? 'bg-black/10' : 'hover:bg-black/5')}
          title="Pesquisar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <button
          onClick={onBookmark}
          className={cn('p-2 rounded-lg transition-colors', isBookmarked ? 'text-yellow-500' : 'hover:bg-black/5')}
          title="Marcar página"
        >
          <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        <button
          onClick={() => onToggleSidebar('bookmarks')}
          className={cn('p-2 rounded-lg transition-colors hidden sm:flex', sidebarTab === 'bookmarks' ? 'bg-black/10' : 'hover:bg-black/5')}
          title="Marcadores"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        <button
          onClick={onSettings}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          title="Configurações"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
