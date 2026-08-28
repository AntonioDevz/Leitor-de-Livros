import type { Book, BookPage, Chapter } from '@/types';
import { generateId } from './utils';
import * as db from './db';
import { paginateBook } from './pagination';
import { buildPageHtml, getPaginationOptions } from './book-converter';

const MIGRATION_KEY = 'bf-migrate-repagination-v1';

function rebuildFromLegacyBook(book: Book): Book | null {
  if (book.status !== 'ready' || !book.pages || book.pages.length === 0) return null;

  const sources = book.pages.map((p) => ({ pageNumber: p.pageNumber, content: p.content }));
  const { pages: next, sourceFirstPage } = paginateBook(sources, getPaginationOptions());
  if (next.length === 0) return null;

  const pages: BookPage[] = next.map((p, i) => ({
    id: generateId(),
    pageNumber: i + 1,
    content: p.content,
    html: buildPageHtml(p.content),
    hasImages: p.content.some((c) => c.type === 'image'),
  }));

  const chapters: Chapter[] = book.chapters.map((ch) => ({
    ...ch,
    pageNumber: Math.min(Math.max(1, sourceFirstPage.get(ch.pageNumber) ?? 1), pages.length),
  }));

  return {
    ...book,
    chapters,
    pages,
    pageCount: pages.length,
    metadata: {
      ...(book.metadata || {}),
      paginationVersion: 1,
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * One-time migration: re-flows books saved before screen pagination
 * (metadata.paginationVersion != 1) into screen-sized reading pages.
 * Runs once per browser, on app boot.
 */
export async function runPaginationMigration(): Promise<number> {
  if (typeof window === 'undefined') return 0;
  try {
    if (localStorage.getItem(MIGRATION_KEY)) return 0;
  } catch {
    return 0;
  }

  let migrated = 0;
  try {
    const all = await db.getAllBooks();
    for (const book of all) {
      if ((book.metadata && book.metadata.paginationVersion) === 1) continue;
      try {
        const rebuilt = rebuildFromLegacyBook(book);
        if (rebuilt) {
          await db.saveBook(rebuilt);
          migrated++;
        }
      } catch (e) {
        console.error('Falha ao migrar livro', book.id, e);
      }
    }
  } catch (e) {
    console.error('Falha na migração de livros', e);
    return migrated;
  }

  try {
    localStorage.setItem(MIGRATION_KEY, String(Date.now()));
  } catch {
    // ignore
  }
  return migrated;
}