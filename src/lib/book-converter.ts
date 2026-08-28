import type { Book, BookPage, Chapter, BookMetadata, PageContent } from '@/types';
import { generateId } from './utils';
import type { ProcessedPdf } from './pdf-processor';
import { detectChapter } from './pdf-processor';

function textToContent(text: string): PageContent[] {
  const content: PageContent[] = [];
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;

    const chapterInfo = detectChapter(trimmed);
    if (chapterInfo?.isChapter) {
      content.push({
        type: 'heading',
        level: chapterInfo.level,
        text: trimmed,
      });
      continue;
    }

    if (/^[•\-–—*]\s/.test(trimmed)) {
      const items = trimmed.split(/\n/).map((item) => item.replace(/^[•\-–—*]\s/, '').trim());
      content.push({ type: 'list', items });
      continue;
    }

    if (/^["""「]/.test(trimmed) || /^>\s/.test(trimmed)) {
      content.push({
        type: 'quote',
        text: trimmed.replace(/^>\s/, '').replace(/^["""「]|["""」]$/g, ''),
      });
      continue;
    }

    content.push({ type: 'text', text: trimmed });
  }

  return content;
}

function extractChapters(pages: { pageNumber: number; text: string }[]): Chapter[] {
  const chapters: Chapter[] = [];
  let tocFound = false;

  for (const page of pages) {
    if (tocFound && chapters.length > 0) break;

    const lines = page.text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^(SUMÁRIO|ÍNDICE|TABLE OF CONTENTS)/i.test(trimmed)) {
        tocFound = true;
        continue;
      }

      if (tocFound) {
        const match = trimmed.match(/^[\dIVXLCDM]+[\.\)–—-]\s*(.+)/i);
        if (match) {
          chapters.push({
            id: generateId(),
            title: match[1].trim(),
            pageNumber: page.pageNumber,
            level: 1,
          });
        }
      }
    }

    if (!tocFound) {
      const chapterInfo = detectChapter(page.text);
      if (chapterInfo?.isChapter) {
        chapters.push({
          id: generateId(),
          title: chapterInfo.title,
          pageNumber: page.pageNumber,
          level: chapterInfo.level,
        });
      }
    }
  }

  if (chapters.length === 0) {
    const interval = Math.max(5, Math.floor(pages.length / 10));
    for (let i = 0; i < pages.length; i += interval) {
      chapters.push({
        id: generateId(),
        title: `Seção ${chapters.length + 1}`,
        pageNumber: pages[i].pageNumber,
        level: 1,
      });
    }
  }

  return chapters;
}

function buildPageHtml(content: PageContent[]): string {
  return content
    .map((item) => {
      switch (item.type) {
        case 'heading':
          const tag = item.level === 1 ? 'h2' : item.level === 2 ? 'h3' : 'h4';
          return `<${tag} class="book-heading book-heading-${item.level}">${item.text}</${tag}>`;
        case 'text':
          return `<p class="book-paragraph">${item.text}</p>`;
        case 'quote':
          return `<blockquote class="book-quote">${item.text}</blockquote>`;
        case 'list':
          return `<ul class="book-list">${(item.items || []).map((i) => `<li>${i}</li>`).join('')}</ul>`;
        case 'image':
          return `<figure class="book-figure"><img src="${item.src}" alt="${item.alt || ''}" /></figure>`;
        default:
          return `<p>${item.text || ''}</p>`;
      }
    })
    .join('\n');
}

function isHeadingOnly(content: PageContent[]): boolean {
  return content.length > 0 && content.every((c) => c.type === 'heading');
}

function buildBookPages(processed: ProcessedPdf): { pages: BookPage[]; origToNew: Map<number, number> } {
  const pages: BookPage[] = [];
  const origToNew = new Map<number, number>();
  const pendingHeadings: PageContent[] = [];
  const pendingOrigins: number[] = [];

  const emit = (origins: number[], content: PageContent[]) => {
    const pageNumber = pages.length + 1;
    for (const o of origins) origToNew.set(o, pageNumber);
    pages.push({
      id: generateId(),
      pageNumber,
      content,
      html: buildPageHtml(content),
      hasImages: false,
    });
  };

  for (const page of processed.pages) {
    const content = textToContent(page.text);
    if (isHeadingOnly(content)) {
      // "CAPÍTULO 1 · Título" alone on a PDF page: fold it into the body page
      pendingHeadings.push(...content);
      pendingOrigins.push(page.pageNumber);
      continue;
    }

    const origins = pendingOrigins.length ? pendingOrigins : [page.pageNumber];
    const combined = pendingHeadings.length ? [...pendingHeadings, ...content] : content;
    emit(origins, combined);
    pendingHeadings.length = 0;
    pendingOrigins.length = 0;
  }

  // trailing opener page(s): keep them as their own page(s)
  if (pendingHeadings.length) {
    emit(pendingOrigins, pendingHeadings);
  }

  return { pages, origToNew };
}

export async function convertToBook(
  processed: ProcessedPdf,
  originalFileName: string,
  originalFileSize: number,
  conversionMode: 'reflow' | 'preservation' = 'reflow',
  onProgress?: (step: string) => void
): Promise<Book> {
  onProgress?.('Identificando capítulos');
  const chapters = extractChapters(processed.pages);

  onProgress?.('Criando páginas');
  const { pages, origToNew } = buildBookPages(processed);

  // remap chapter pointers: opener pages that were folded into the body page
  for (const ch of chapters) {
    const remapped = origToNew.get(ch.pageNumber);
    if (remapped) ch.pageNumber = remapped;
  }

  onProgress?.('Otimizando conteúdo');

  let coverImage: string | null = null;
  if (processed.coverImageBlob) {
    coverImage = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(processed.coverImageBlob!);
    });
  }

  const metadata: BookMetadata = {
    originalPages: processed.pageCount,
    extractedImages: processed.pages.filter((p) => p.hasImages).length,
    hasOcr: !processed.hasNativeText,
    detectedChapters: chapters.length,
    conversionMode,
    fileSize: originalFileSize,
    processingTime: 0,
  };

  onProgress?.('Preparando livro digital');

  const book: Book = {
    id: generateId(),
    title: processed.title || originalFileName.replace('.pdf', ''),
    author: 'Autor desconhecido',
    description: '',
    coverImage,
    pageCount: pages.length,
    chapters,
    pages,
    metadata,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'ready',
    conversionMode,
    originalPdfName: originalFileName,
    originalPdfSize: originalFileSize,
    isFavorite: false,
    tags: [],
  };

  return book;
}
