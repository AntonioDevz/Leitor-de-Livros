'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Book, ReaderSettings, Bookmark, Highlight, BookNote, SearchResult } from '@/types';
import { defaultReaderSettings } from '@/lib/typography';
import * as db from '@/lib/db';
import { generateId } from '@/lib/utils';

export function useReader(book: Book | null) {
  const [currentPage, setCurrentPage] = useState(1);
  const [settings, setSettings] = useState<ReaderSettings>(defaultReaderSettings);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<BookNote[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPages = book?.pageCount || 0;

  useEffect(() => {
    if (!book) return;
    const saved = localStorage.getItem(`bf-settings`);
    if (saved) {
      try { setSettings(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, [book]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('bf-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!book) return;
    db.getProgress(book.id).then((p) => {
      if (p) setCurrentPage(p.currentPage);
    });
    db.getBookmarks(book.id).then(setBookmarks);
    db.getHighlights(book.id).then(setHighlights);
    db.getNotes(book.id).then(setNotes);
  }, [book]);

  const saveProgress = useCallback(
    (page: number) => {
      if (!book || !settings.autoSaveProgress) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const percentage = totalPages > 0 ? Math.round((page / totalPages) * 100) : 0;
        const currentChapter = book.chapters.reduce((prev, ch) => {
          return ch.pageNumber <= page ? ch : prev;
        }, book.chapters[0]);

        db.saveProgress({
          bookId: book.id,
          currentPage: page,
          totalPages,
          percentage,
          lastReadAt: new Date().toISOString(),
          chapterId: currentChapter?.id,
        });
      }, 1000);
    },
    [book, totalPages, settings.autoSaveProgress]
  );

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(clamped);
      saveProgress(clamped);
    },
    [totalPages, saveProgress]
  );

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);
  const firstPage = useCallback(() => goToPage(1), [goToPage]);
  const lastPage = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);

  const addBookmark = useCallback(
    async (title?: string) => {
      if (!book) return;
      const bm: Bookmark = {
        id: generateId(),
        bookId: book.id,
        pageNumber: currentPage,
        title: title || `Página ${currentPage}`,
        createdAt: new Date().toISOString(),
      };
      await db.saveBookmark(bm);
      setBookmarks((prev) => [...prev, bm]);
    },
    [book, currentPage]
  );

  const removeBookmark = useCallback(async (id: string) => {
    await db.deleteBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const addHighlight = useCallback(
    async (text: string, color: string) => {
      if (!book) return;
      const hl: Highlight = {
        id: generateId(),
        bookId: book.id,
        pageNumber: currentPage,
        text,
        color,
        createdAt: new Date().toISOString(),
      };
      await db.saveHighlight(hl);
      setHighlights((prev) => [...prev, hl]);
    },
    [book, currentPage]
  );

  const removeHighlight = useCallback(async (id: string) => {
    await db.deleteHighlight(id);
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const addNote = useCallback(
    async (text: string) => {
      if (!book) return;
      const note: BookNote = {
        id: generateId(),
        bookId: book.id,
        pageNumber: currentPage,
        text: `Nota na página ${currentPage}`,
        content: text,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.saveNote(note);
      setNotes((prev) => [...prev, note]);
    },
    [book, currentPage]
  );

  const removeNote = useCallback(async (id: string) => {
    await db.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const searchInBook = useCallback(
    (query: string): SearchResult[] => {
      if (!book || !query.trim()) {
        setSearchResults([]);
        return [];
      }
      const q = query.toLowerCase();
      const results: SearchResult[] = [];

      for (const page of book.pages) {
        const text = page.html.replace(/<[^>]+>/g, '').toLowerCase();
        let index = 0;
        while ((index = text.indexOf(q, index)) !== -1) {
          const start = Math.max(0, index - 40);
          const end = Math.min(text.length, index + q.length + 40);
          results.push({
            pageNumber: page.pageNumber,
            text: text.slice(index, index + q.length),
            context: text.slice(start, end),
            index,
          });
          index += q.length;
        }
      }

      setSearchResults(results);
      return results;
    },
    [book]
  );

  const progress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return {
    currentPage,
    totalPages,
    settings,
    setSettings,
    bookmarks,
    highlights,
    notes,
    searchResults,
    isSearching,
    showControls,
    setShowControls,
    progress,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    addBookmark,
    removeBookmark,
    addHighlight,
    removeHighlight,
    addNote,
    removeNote,
    searchInBook,
    setIsSearching,
  };
}
