'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLibrary } from '@/hooks/useLibrary';
import Navbar from '@/components/ui/Navbar';
import BookCard, { getPaletteFor } from '@/components/library/BookCard';
import { cn, formatRelativeDate } from '@/lib/utils';
import type { Book } from '@/types';
import { Search, LayoutGrid, List, Plus, BookOpen, Library as LibraryIcon } from 'lucide-react';

function PlaceholderMini({ book }: { book: Book }) {
  const [dark, light] = getPaletteFor(book.title + book.author);
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(150deg, ${light} 0%, ${dark} 100%)` }}
    >
      <span className="text-[8px] text-white/85 text-center px-1 line-clamp-3 font-serif font-medium leading-tight">
        {book.title}
      </span>
    </div>
  );
}

const statusTabs = [
  { key: 'all' as const, label: 'Todos' },
  { key: 'reading' as const, label: 'Lendo' },
  { key: 'favorite' as const, label: 'Favoritos' },
];

export default function LibraryPage() {
  const { books, loading, filter, setFilter } = useLibrary();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const isEmpty = !loading && books.length === 0;

  return (
    <main className="min-h-screen bg-[#faf7f1]">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8 mb-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#bb7a1c] mb-2">
                Sua coleção
              </p>
              <h1 className="font-serif text-4xl font-semibold text-[#221d17] tracking-tight">
                Biblioteca
              </h1>
              <p className="text-sm text-[#8b8174] mt-2">
                {books.length} {books.length === 1 ? 'livro' : 'livros'} · salvos offline no seu navegador
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#221d17] text-[#e9dfcd] rounded-full text-sm font-medium hover:bg-[#3a322a] hover:-translate-y-0.5 transition-all duration-200 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Novo Livro
            </Link>
          </div>
        </div>

        {!isEmpty && (
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10">
              <div className="flex gap-1 bg-white rounded-full p-1 border border-[#e6ddd0] shadow-sm">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter({ ...filter, status: tab.key })}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                      filter.status === tab.key
                        ? 'bg-[#221d17] text-[#e9dfcd]'
                        : 'text-[#8b8174] hover:text-[#221d17]'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 w-full sm:max-w-sm relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8174]" />
                <input
                  type="text"
                  placeholder="Pesquisar livros..."
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e6ddd0] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#bb7a1c]/20 focus:border-[#bb7a1c]/40 transition-all shadow-sm placeholder:text-[#8b8174]/70"
                />
              </div>

              <div className="flex gap-1 bg-white rounded-full p-1 border border-[#e6ddd0] shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Grade"
                  className={cn('p-2 rounded-full transition-colors', viewMode === 'grid' ? 'bg-[#f1eadf] text-[#221d17]' : 'text-[#8b8174] hover:text-[#221d17]')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label="Lista"
                  className={cn('p-2 rounded-full transition-colors', viewMode === 'list' ? 'bg-[#f1eadf] text-[#221d17]' : 'text-[#8b8174] hover:text-[#221d17]')}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-5 md:px-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] rounded-lg bg-[#f1eadf] border border-[#e6ddd0]" />
                  <div className="h-3.5 bg-[#f1eadf] rounded w-3/4 mt-3" />
                  <div className="h-3 bg-[#f1eadf] rounded w-1/2 mt-1.5" />
                </div>
              ))}
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-32 rounded-r-[10px] rounded-l-[5px] bg-gradient-to-br from-[#bb7a1c] to-[#3d2e1d] shadow-2xl rotate-[-4deg] flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-[#d9a441]" />
                </div>
                <div className="absolute -right-6 top-3 w-20 h-[104px] rounded-r-[8px] rounded-l-[4px] bg-gradient-to-br from-[#6b9db8] to-[#223443] shadow-xl rotate-[6deg]" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#221d17] mb-2">
                Sua biblioteca está vazia
              </h3>
              <p className="text-[#8b8174] mb-8 max-w-sm">
                Transforme seu primeiro PDF em um livro digital — leva menos de um minuto.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#221d17] text-[#e9dfcd] rounded-full text-sm font-medium hover:bg-[#3a322a] hover:-translate-y-0.5 transition-all duration-200 shadow-md"
              >
                <Plus className="w-4 h-4" />
                Adicionar livro
              </Link>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8">
              {books.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {books.map((book) => (
                <Link
                  key={book.id}
                  href={`/book/?id=${book.id}`}
                  className="group flex items-center gap-4 p-3.5 bg-white rounded-2xl border border-[#e6ddd0] hover:border-[#d8ccb9] hover:shadow-md transition-all"
                >
                  <div className="w-11 h-[74px] rounded-[4px] rounded-r-[7px] overflow-hidden flex-shrink-0 shadow-sm book-card-hover group-hover:scale-[1.04]">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <PlaceholderMini book={book} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#221d17] text-sm truncate group-hover:text-[#bb7a1c] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#8b8174] mt-0.5 truncate">{book.author}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-[#8b8174]/80">
                        <LibraryIcon className="w-3 h-3 inline mr-1 -mt-0.5" />
                        {book.pageCount} págs
                      </span>
                      <span className="text-[10px] text-[#8b8174]/80">
                        {formatRelativeDate(book.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-[#e6ddd0] flex items-center justify-center group-hover:border-[#bb7a1c] group-hover:bg-[#bb7a1c] transition-all">
                    <svg className="w-3 h-3 text-[#bb7a1c] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}