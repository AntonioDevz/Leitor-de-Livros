'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Book, LibraryFilter } from '@/types';
import * as db from '@/lib/db';

export function useLibrary() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LibraryFilter>({
    search: '',
    sort: 'recent',
    order: 'desc',
    status: 'all',
  });

  const loadBooks = useCallback(async () => {
    setLoading(true);
    const allBooks = await db.getAllBooks();
    setBooks(allBooks);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const addBook = useCallback(async (book: Book) => {
    await db.saveBook(book);
    setBooks((prev) => [book, ...prev]);
  }, []);

  const removeBook = useCallback(async (id: string) => {
    await db.deleteBook(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const updateBook = useCallback(async (book: Book) => {
    const updated = { ...book, updatedAt: new Date().toISOString() };
    await db.saveBook(updated);
    setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    const book = books.find((b) => b.id === id);
    if (book) {
      const updated = { ...book, isFavorite: !book.isFavorite, updatedAt: new Date().toISOString() };
      await db.saveBook(updated);
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
    }
  }, [books]);

  const filteredBooks = books
    .filter((book) => {
      if (filter.search) {
        const q = filter.search.toLowerCase();
        if (!book.title.toLowerCase().includes(q) && !book.author.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filter.status === 'favorite') return book.isFavorite;
      return true;
    })
    .sort((a, b) => {
      const mult = filter.order === 'asc' ? 1 : -1;
      switch (filter.sort) {
        case 'title': return mult * a.title.localeCompare(b.title);
        case 'author': return mult * a.author.localeCompare(b.author);
        case 'pages': return mult * (a.pageCount - b.pageCount);
        default: return mult * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      }
    });

  return {
    books: filteredBooks,
    allBooks: books,
    loading,
    filter,
    setFilter,
    addBook,
    removeBook,
    updateBook,
    toggleFavorite,
    refresh: loadBooks,
  };
}
