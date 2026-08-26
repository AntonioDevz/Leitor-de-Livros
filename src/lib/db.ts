import { openDB, type IDBPDatabase } from 'idb';
import type { Book, ReadingProgress, Bookmark, Highlight, BookNote } from '@/types';

const DB_NAME = 'bookflow-db';
const DB_VERSION = 1;

interface BookFlowDB {
  books: { key: string; value: Book };
  progress: { key: string; value: ReadingProgress };
  bookmarks: { key: string; value: Bookmark };
  highlights: { key: string; value: Highlight };
  notes: { key: string; value: BookNote };
}

let dbPromise: Promise<IDBPDatabase<BookFlowDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<BookFlowDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('books')) {
          db.createObjectStore('books', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'bookId' });
        }
        if (!db.objectStoreNames.contains('bookmarks')) {
          const bmStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
          bmStore.createIndex('byBook', 'bookId');
        }
        if (!db.objectStoreNames.contains('highlights')) {
          const hlStore = db.createObjectStore('highlights', { keyPath: 'id' });
          hlStore.createIndex('byBook', 'bookId');
        }
        if (!db.objectStoreNames.contains('notes')) {
          const nStore = db.createObjectStore('notes', { keyPath: 'id' });
          nStore.createIndex('byBook', 'bookId');
        }
      },
    });
  }
  return dbPromise;
}

export async function saveBook(book: Book): Promise<void> {
  const db = await getDB();
  await db.put('books', book);
}

export async function getBook(id: string): Promise<Book | undefined> {
  const db = await getDB();
  return db.get('books', id);
}

export async function getAllBooks(): Promise<Book[]> {
  const db = await getDB();
  return db.getAll('books');
}

export async function deleteBook(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('books', id);
  const tx = db.transaction(['progress', 'bookmarks', 'highlights', 'notes'], 'readwrite');
  const progressStore = tx.objectStore('progress');
  const bookmarkStore = tx.objectStore('bookmarks');
  const highlightStore = tx.objectStore('highlights');
  const noteStore = tx.objectStore('notes');

  await progressStore.delete(id);
  const bmIndex = bookmarkStore.index('byBook');
  const bmCursor = await bmIndex.openCursor(IDBKeyRange.only(id));
  if (bmCursor) {
    let c: typeof bmCursor | null = bmCursor;
    while (c) {
      await c.delete();
      c = await c.continue();
    }
  }
  const hlIndex = highlightStore.index('byBook');
  const hlCursor = await hlIndex.openCursor(IDBKeyRange.only(id));
  if (hlCursor) {
    let c: typeof hlCursor | null = hlCursor;
    while (c) {
      await c.delete();
      c = await c.continue();
    }
  }
  const nIndex = noteStore.index('byBook');
  const nCursor = await nIndex.openCursor(IDBKeyRange.only(id));
  if (nCursor) {
    let c: typeof nCursor | null = nCursor;
    while (c) {
      await c.delete();
      c = await c.continue();
    }
  }
}

export async function saveProgress(progress: ReadingProgress): Promise<void> {
  const db = await getDB();
  await db.put('progress', progress);
}

export async function getProgress(bookId: string): Promise<ReadingProgress | undefined> {
  const db = await getDB();
  return db.get('progress', bookId);
}

export async function saveBookmark(bookmark: Bookmark): Promise<void> {
  const db = await getDB();
  await db.put('bookmarks', bookmark);
}

export async function getBookmarks(bookId: string): Promise<Bookmark[]> {
  const db = await getDB();
  return db.getAllFromIndex('bookmarks', 'byBook', bookId);
}

export async function deleteBookmark(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('bookmarks', id);
}

export async function saveHighlight(highlight: Highlight): Promise<void> {
  const db = await getDB();
  await db.put('highlights', highlight);
}

export async function getHighlights(bookId: string): Promise<Highlight[]> {
  const db = await getDB();
  return db.getAllFromIndex('highlights', 'byBook', bookId);
}

export async function deleteHighlight(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('highlights', id);
}

export async function saveNote(note: BookNote): Promise<void> {
  const db = await getDB();
  await db.put('notes', note);
}

export async function getNotes(bookId: string): Promise<BookNote[]> {
  const db = await getDB();
  return db.getAllFromIndex('notes', 'byBook', bookId);
}

export async function deleteNote(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('notes', id);
}
