'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Book } from '@/types';
import { getBook, deleteBook } from '@/lib/db';
import Navbar from '@/components/ui/Navbar';
import { formatFileSize, formatDate } from '@/lib/utils';

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
        const p = JSON.parse(saved);
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

  if (!id) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 text-center">
          <h2 className="text-xl font-medium text-slate-900 mb-4">Nenhum livro selecionado</h2>
          <button onClick={() => router.push('/library/')} className="text-blue-600 hover:underline">
            Voltar à biblioteca
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
          <div className="animate-pulse flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 aspect-[2/3] bg-slate-200 rounded-2xl" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 text-center">
          <h2 className="text-xl font-medium text-slate-900 mb-4">Livro não encontrado</h2>
          <button onClick={() => router.push('/library/')} className="text-blue-600 hover:underline">
            Voltar à biblioteca
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <button
          onClick={() => router.push('/library/')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Biblioteca
        </button>

        <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-slate-100 book-card-shadow">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                  <svg className="w-16 h-16 text-slate-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  <span className="text-sm text-slate-400 text-center">{book.title}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{book.title}</h1>
            <p className="text-lg text-slate-500 mb-6">{book.author}</p>

            {book.description && (
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">{book.description}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                <p className="text-2xl font-bold text-slate-900">{book.pageCount}</p>
                <p className="text-xs text-slate-500">Páginas</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                <p className="text-2xl font-bold text-slate-900">{book.chapters.length}</p>
                <p className="text-xs text-slate-500">Capítulos</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                <p className="text-2xl font-bold text-blue-600">{progress}%</p>
                <p className="text-xs text-slate-500">Progresso</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                <p className="text-sm font-medium text-slate-900">{formatFileSize(book.originalPdfSize)}</p>
                <p className="text-xs text-slate-500">Tamanho</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => router.push(`/read/?id=${id}`)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-xl font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Começar do início
                </button>
              )}
            </div>

            <div className="space-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Adicionado em {formatDate(book.createdAt)}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {book.originalPdfName}
              </div>
            </div>

            {book.chapters.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="font-medium text-slate-900 mb-3">Sumário</h3>
                <div className="space-y-1.5">
                  {book.chapters.map((ch, i) => (
                    <button
                      key={ch.id}
                      onClick={() => router.push(`/read/?id=${id}&page=${ch.pageNumber}`)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white transition-colors text-left group"
                    >
                      <span className="text-xs text-slate-400 font-mono w-6">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">{ch.title}</span>
                      <span className="text-xs text-slate-400 ml-auto">p. {ch.pageNumber}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={handleDelete}
                className="text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                Excluir livro
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </main>
    }>
      <BookContent />
    </Suspense>
  );
}
