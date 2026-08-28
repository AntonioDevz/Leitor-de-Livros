'use client';

import { useState } from 'react';
import type { Book, Bookmark, SearchResult, ThemeConfig } from '@/types';
import { Search, ListTree, Ribbon, X } from 'lucide-react';

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

const tabsList = [
  { key: 'toc' as const, label: 'Sumário', icon: ListTree },
  { key: 'bookmarks' as const, label: 'Marcadores', icon: Ribbon },
  { key: 'search' as const, label: 'Pesquisar', icon: Search },
];

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
      className="absolute left-3 md:left-5 top-14 w-[21rem] max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-6rem)] overflow-hidden rounded-2xl border shadow-2xl z-30 animate-slide-left flex flex-col"
      style={{
        background: theme.background,
        borderColor: theme.border,
        boxShadow: `0 12px 40px color-mix(in srgb, ${theme.accent} 18%, rgba(0,0,0,0.4))`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex border-b" style={{ borderColor: theme.border }}>
        {tabsList.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <div
              key={key}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-opacity ${active ? '' : 'opacity-50'}`}
              style={{ color: theme.foreground, borderBottom: active ? `2px solid ${theme.accent}` : '2px solid transparent' }}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={1.8} style={{ color: active ? theme.accent : 'inherit' }} />
              {label}
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {tab === 'toc' && (
          <div className="p-3 space-y-1">
            {book.chapters.length === 0 ? (
              <p className="text-sm p-4 text-center opacity-60">Nenhum capítulo detectado</p>
            ) : (
              book.chapters.map((ch, i) => {
                const isCurrent = ch.pageNumber <= currentPage;
                return (
                  <button
                    key={ch.id}
                    onClick={() => goToPage(ch.pageNumber)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
                    style={
                      isCurrent
                        ? { background: `color-mix(in srgb, ${theme.accent} 14%, transparent)`, color: theme.accent }
                        : { background: 'transparent', color: theme.foreground }
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs font-mono tabular-nums w-5 ${isCurrent ? '' : 'opacity-40'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="truncate font-medium">{ch.title}</span>
                      {currentPage === ch.pageNumber && (
                        <span className="text-[9px] uppercase tracking-wider ml-auto opacity-70 hidden md:inline">{'· você está aqui'}</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        {tab === 'bookmarks' && (
          <div className="p-3 space-y-1">
            {bookmarks.length === 0 ? (
              <div className="text-center py-10 px-6">
                <Ribbon className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm opacity-60">Nenhum marcador ainda</p>
                <p className="text-xs opacity-40 mt-1">Toque no ícone de marcador para salvar esta página.</p>
              </div>
            ) : (
              bookmarks
                .sort((a, b) => a.pageNumber - b.pageNumber)
                .map((bm) => (
                  <div
                    key={bm.id}
                    className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-150"
                    style={{ borderColor: theme.border, background: 'color-mix(in srgb, currentColor 3%, transparent)' }}
                  >
                    <span className="w-1.5 h-8 rounded-full shrink-0" style={{ background: bm.color || theme.accent, opacity: 0.7 }} />
                    <button onClick={() => goToPage(bm.pageNumber)} className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: theme.foreground }}>{bm.title}</p>
                      <p className="text-xs opacity-50 mt-0.5">Página {bm.pageNumber}</p>
                    </button>
                    <button
                      onClick={() => removeBookmark(bm.id)}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10"
                      style={{ color: theme.foreground }}
                      aria-label="Remover marcador"
                    >
                      <X className="w-3.5 h-3.5" style={{ color: '#e87070' }} />
                    </button>
                  </div>
                ))
            )}
          </div>
        )}

        {tab === 'search' && (
          <div className="flex flex-col h-full">
            <div className="p-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Pesquisar no livro..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm focus:outline-none"
                  style={{ borderColor: theme.border, background: theme.background, color: theme.foreground }}
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-1">
              {searchResults.length > 0 && (
                <p className="text-xs opacity-50 px-2 pb-1.5">{searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}</p>
              )}
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(result.pageNumber)}
                  className="w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 border border-transparent hover:border-current"
                  style={{ color: theme.foreground }}
                >
                  <p className="text-sm leading-relaxed line-clamp-3">{result.context}</p>
                  <p className="text-xs mt-1.5 flex items-center gap-1.5" style={{ color: theme.accent }}>
                    <span className="w-1 h-1 rounded-full" style={{ background: theme.accent }} />
                    Página {result.pageNumber}
                  </p>
                </button>
              ))}
              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-10 px-6">
                  <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm opacity-60">Nenhum resultado para "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}