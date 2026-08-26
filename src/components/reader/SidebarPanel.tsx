'use client';

import { useState } from 'react';
import type { Book, Bookmark, SearchResult, ThemeConfig } from '@/types';

interface SidebarPanelProps {
  tab: 'toc' | 'bookmarks' | 'search';
  book: Book;
  currentPage: number;
  goToPage: (page: number) => void;
  bookmarks: Bookmark[];
  removeBookmark: (id: string) => void;
  searchResults: SearchResult[];
  searchInBook: (query: string) => SearchResult[];
  theme: ThemeConfig;
}

export default function SidebarPanel({
  tab,
  book,
  currentPage,
  goToPage,
  bookmarks,
  removeBookmark,
  searchResults,
  searchInBook,
  theme,
}: SidebarPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    searchInBook(q);
  };

  return (
    <div
      className="absolute left-4 top-16 w-80 max-h-[80vh] overflow-hidden rounded-2xl border shadow-xl z-30 animate-slide-down flex flex-col"
      style={{ background: theme.background, borderColor: theme.border }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex border-b" style={{ borderColor: theme.border }}>
        {[
          { key: 'toc' as const, label: 'Sumário' },
          { key: 'bookmarks' as const, label: 'Marcadores' },
          { key: 'search' as const, label: 'Pesquisar' },
        ].map((t) => (
          <button
            key={t.key}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${
              tab === t.key ? 'border-b-2 border-blue-500' : 'opacity-60 hover:opacity-100'
            }`}
            style={{ color: theme.foreground }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {tab === 'toc' && (
          <div className="p-3 space-y-1">
            {book.chapters.length === 0 ? (
              <p className="text-sm p-4 text-center opacity-60">Nenhum capítulo detectado</p>
            ) : (
              book.chapters.map((ch, i) => (
                <button
                  key={ch.id}
                  onClick={() => goToPage(ch.pageNumber)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    ch.pageNumber <= currentPage
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'hover:bg-black/5'
                  }`}
                  style={ch.pageNumber > currentPage ? { color: theme.foreground } : {}}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs opacity-50 font-mono w-5">{String(i + 1).padStart(2, '0')}</span>
                    <span className="truncate">{ch.title}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {tab === 'bookmarks' && (
          <div className="p-3 space-y-1">
            {bookmarks.length === 0 ? (
              <p className="text-sm p-4 text-center opacity-60">Nenhum marcador ainda</p>
            ) : (
              bookmarks
                .sort((a, b) => a.pageNumber - b.pageNumber)
                .map((bm) => (
                  <div
                    key={bm.id}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-black/5 transition-colors group"
                  >
                    <button
                      onClick={() => goToPage(bm.pageNumber)}
                      className="flex-1 text-left"
                    >
                      <p className="text-sm font-medium" style={{ color: theme.foreground }}>{bm.title}</p>
                      <p className="text-xs opacity-50">Página {bm.pageNumber}</p>
                    </button>
                    <button
                      onClick={() => removeBookmark(bm.id)}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
            )}
          </div>
        )}

        {tab === 'search' && (
          <div className="flex flex-col h-full">
            <div className="p-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Pesquisar no livro..."
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: theme.border, background: theme.background, color: theme.foreground }}
                autoFocus
              />
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-1">
              {searchResults.length > 0 && (
                <p className="text-xs opacity-50 px-2 mb-2">{searchResults.length} resultados</p>
              )}
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(result.pageNumber)}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-black/5 transition-colors"
                >
                  <p className="text-sm line-clamp-2" style={{ color: theme.foreground }}>
                    {result.context}
                  </p>
                  <p className="text-xs opacity-50 mt-1">Página {result.pageNumber}</p>
                </button>
              ))}
              {searchQuery && searchResults.length === 0 && (
                <p className="text-sm p-4 text-center opacity-60">Nenhum resultado encontrado</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
