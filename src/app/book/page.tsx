'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Book } from '@/types';
import { getBook, deleteBook } from '@/lib/db';
import Navbar from '@/components/ui/Navbar';
import SiteFooter from '@/components/ui/SiteFooter';
import { TypographicCover } from '@/components/library/BookCard';
import { formatFileSize, formatDate, cn } from '@/lib/utils';
import { ArrowLeft, BookOpen, Play, RotateCcw, Clock, Calendar, Trash2, ListTree, FolderOpen, Heart, FileText } from 'lucide-react';

function BookContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [lastPage, setLastPage] = useState(0);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getBook(id).then((b) => {
      setBook(b || null);
      setLoading(false);
    });
    const saved = localStorage.getItem(`bf-progress-${id}`);
    if (saved) {
      try {
        const p = JSON.parse(saved) as { percentage?: number; currentPage?: number };
        setProgress(p.percentage || 0);
        setLastPage(p.currentPage || 1);
      } catch { /* ignore */ }
    }
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (confirm('Tem certeza que deseja excluir este livro?')) {
      await deleteBook(id);
      router.push('/library/');
    }
  };

  const LoadingShell = ({ children }: { children: React.ReactNode }) => (
    <main className="min-h-screen bg-[#faf7f1] flex flex-col">
      <Navbar />
      {children}
      <div className="mt-auto">
        <SiteFooter />
      </div>
    </main>
  );

  if (!id) {
    return (
      <LoadingShell>
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-12 text-center">
          <FolderOpen className="w-10 h-10 text-[#d8ccb9] mx-auto mb-4" />
          <h2 className="font-serif text-xl font-semibold text-[#221d17] mb-4">Nenhum livro selecionado</h2>
          <button
            onClick={() => router.push('/library/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#221d17] text-[#e9dfcd] rounded-full text-sm font-medium hover:bg-[#3a322a] transition-colors"
          >
            Voltar à biblioteca
          </button>
        </div>
      </LoadingShell>
    );
  }

  if (loading) {
    return (
      <LoadingShell>
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-28 pb-12">
          <div className="animate-pulse flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-60 aspect-[2/3] bg-[#f1eadf] rounded-2xl border border-[#e6ddd0]" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-[#f1eadf] rounded w-3/4" />
              <div className="h-4 bg-[#f1eadf] rounded w-1/2" />
              <div className="h-24 bg-[#f1eadf] rounded-2xl w-full" />
            </div>
          </div>
        </div>
      </LoadingShell>
    );
  }

  if (!book) {
    return (
      <LoadingShell>
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-12 text-center">
          <BookOpen className="w-10 h-10 text-[#d8ccb9] mx-auto mb-4" />
          <h2 className="font-serif text-xl font-semibold text-[#221d17] mb-4">Livro não encontrado</h2>
          <button
            onClick={() => router.push('/library/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#221d17] text-[#e9dfcd] rounded-full text-sm font-medium hover:bg-[#3a322a] transition-colors"
          >
            Voltar à biblioteca
          </button>
        </div>
      </LoadingShell>
    );
  }

  const stats = [
    { label: 'Páginas', value: String(book.pageCount), icon: FileText },
    { label: 'Capítulos', value: String(book.chapters.length), icon: ListTree },
    { label: 'Progresso', value: `${Math.round(progress)}%`, icon: BookOpen, accent: true },
    { label: 'Tamanho', value: formatFileSize(book.originalPdfSize), icon: FileText },
  ];

  return (
    <main className="min-h-screen bg-[#faf7f1]">
      <Navbar />
      <div className="pt-24 pb-16 relative">
        {/* Editorial backdrop */}
        <div className="absolute inset-x-0 top-0 h-[340px] bg-gradient-to-b from-[#f1eadf] to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 md:px-8">
          <button
            onClick={() => router.push('/library/')}
            className="inline-flex items-center gap-2 text-sm text-[#8b8174] hover:text-[#221d17] mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Biblioteca
          </button>

          <div className="flex flex-col md:flex-row gap-10 animate-fade-in">
            {/* Cover */}
            <div className="relative w-52 md:w-60 mx-auto md:mx-0 flex-shrink-0">
              <div className="absolute -inset-3 rounded-3xl bg-[#bb7a1c]/5 blur-2xl" />
              <div className="relative aspect-[2/3] rounded-r-[12px] rounded-l-[6px] overflow-hidden shadow-[0_8px_20px_rgba(34,29,23,0.18),0_24px_60px_rgba(34,29,23,0.22)]">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <TypographicCover book={book} className="w-full h-full" />
                )}
              </div>
              {progress > 0 && (
                <div className="absolute -right-3 top-6 w-14 h-14 rounded-full bg-[#221d17] shadow-lg flex flex-col items-center justify-center text-white">
                  <span className="text-base font-semibold leading-none">{Math.round(progress)}%</span>
                  <span className="text-[8px] uppercase tracking-wider opacity-70 mt-0.5">lido</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#bb7a1c] mb-2.5">
                {book.status === 'converting' ? 'Convertendo...' : book.conversionMode === 'reflow' ? 'Edição responsiva' : 'Edição preservada'}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#221d17] mb-2.5 tracking-tight">
                {book.title}
              </h1>
              <p className="text-lg text-[#8b8174] mb-6">{book.author || 'Autor desconhecido'}</p>

              {book.description && (
                <p className="text-[15px] text-[#4b4238] mb-7 leading-relaxed max-w-2xl">
                  {book.description}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
                {stats.map(({ label, value, icon: Icon, accent }) => (
                  <div
                    key={label}
                    className={cn(
                      'bg-white rounded-2xl p-4 border shadow-sm',
                      accent ? 'border-[#bb7a1c]/30' : 'border-[#e6ddd0]'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 mb-2', accent ? 'text-[#bb7a1c]' : 'text-[#8b8174]')} strokeWidth={1.8} />
                    <p className={cn('font-serif text-xl font-semibold', accent ? 'text-[#bb7a1c]' : 'text-[#221d17]')}>
                      {value}
                    </p>
                    <p className="text-[11px] text-[#8b8174] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mb-7">
                <button
                  onClick={() => router.push(`/read/?id=${id}`)}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#221d17] text-[#e9dfcd] rounded-full font-medium shadow-lg hover:bg-[#3a322a] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Play className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" />
                  {progress > 0 ? 'Continuar lendo' : 'Começar a ler'}
                </button>
                {progress > 0 && (
                  <button
                    onClick={() => {
                      localStorage.removeItem(`bf-progress-${id}`);
                      setProgress(0);
                      setLastPage(0);
                      router.push(`/read/?id=${id}`);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#4b4238] rounded-full font-medium border border-[#e6ddd0] hover:border-[#d8ccb9] hover:bg-[#faf7f1] transition-all duration-200"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Começar do início
                  </button>
                )}
                {book.isFavorite && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fdf0f0] text-[#e07070] text-xs font-medium border border-[#f3d7d7] self-center">
                    <Heart className="w-3.5 h-3.5" fill="currentColor" /> Favorito
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#8b8174] mb-8">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Adicionado em {formatDate(book.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {book.originalPdfName}
                </span>
                {progress > 0 && lastPage > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-[#bb7a1c]">
                    <BookOpen className="w-3.5 h-3.5" /> Você parou na página {lastPage}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* TOC */}
          {book.chapters.length > 0 && (
            <div className="mt-12 animate-slide-up">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-[#f6e8cf] flex items-center justify-center">
                  <ListTree className="w-4 h-4 text-[#bb7a1c]" strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#221d17]">Sumário</h2>
                  <p className="text-xs text-[#8b8174] mt-0.5">{book.chapters.length} capítulos</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {book.chapters.map((ch, i) => (
                  <button
                    key={ch.id}
                    onClick={() => router.push(`/read/?id=${id}&page=${ch.pageNumber}`)}
                    className="group flex items-center gap-3.5 w-full px-4 py-3 bg-white rounded-2xl border border-[#e6ddd0] hover:border-[#bb7a1c]/40 hover:shadow-sm transition-all text-left"
                  >
                    <span className="font-serif text-sm text-[#bb7a1c] tabular-nums w-7">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-[#221d17] font-medium group-hover:text-[#bb7a1c] transition-colors truncate">
                      {ch.title}
                    </span>
                    <span className="text-xs text-[#8b8174] ml-auto font-mono shrink-0">
                      p. {ch.pageNumber}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Danger zone */}
          <div className="mt-12 flex items-center justify-between pt-6 border-t border-[#e6ddd0]">
            <span className="text-xs text-[#8b8174]/70 max-w-xs">
              Remover este livro do seu dispositivo. A operação não pode ser desfeita.
            </span>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 text-sm text-[#c24040] hover:text-[#a33434] px-4 py-2 rounded-full hover:bg-[#fdf0f0] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Excluir livro
            </button>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#faf7f1] flex items-center justify-center">
        <div className="w-9 h-9 border-[2.5px] border-[#d8ccb9] border-t-[#bb7a1c] rounded-full animate-spin" />
      </main>
    }>
      <BookContent />
    </Suspense>
  );
}