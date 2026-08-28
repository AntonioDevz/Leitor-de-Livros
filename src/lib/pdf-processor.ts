/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

export interface ExtractedPage {
  pageNumber: number;
  text: string;
  items: TextItem[];
  hasImages: boolean;
  width: number;
  height: number;
}

export interface ProcessedPdf {
  document: any;
  pageCount: number;
  title: string;
  pages: ExtractedPage[];
  hasNativeText: boolean;
  coverImageBlob: Blob | null;
}

let pdfjsLib: any = null;

async function getPdfjsLib() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    }
  }
  return pdfjsLib;
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Uppercase and strip accents so /i matching is reliable across CAPITULO/CAPÍTULO etc. */
function normalize(text: string): string {
  return text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function detectChapter(text: string): { isChapter: boolean; title: string; level: number } | null {
  const plain = normalize(text);
  const patterns = [
    { regex: /^(CAPITULO|CHAPTER|PARTE|PART)\s+[\dIVXLCDM]+/, level: 1 },
    { regex: /^(CAP\.\s*\d+|CAPITULO\s+\d+)/, level: 1 },
    { regex: /^(\d+\.\s+[A-ZÀ-Ú])/m, level: 2 },
    { regex: /^([IVXLCDM]+[\.\)–—-]\s+[A-ZÀ-Ú])/m, level: 1 },
    { regex: /^(SUMARIO|INDICE|TABLE OF CONTENTS|CONTENTS)/, level: 0 },
  ];

  for (const { regex, level } of patterns) {
    const match = plain.match(regex);
    if (match) {
      const start = match.index ?? 0;
      return {
        isChapter: true,
        title: text.substr(start, match[0].length).trim() || match[0].trim(),
        level,
      };
    }
  }
  return null;
}

async function extractPageText(page: any): Promise<ExtractedPage> {
  const textContent = await page.getTextContent();
  const items: TextItem[] = textContent.items.filter((item: any) => 'str' in item);
  const text = cleanText(items.map((item: any) => item.str).join(' '));
  const viewport = page.getViewport({ scale: 1.0 });

  let hasImages = false;
  try {
    const lib = await getPdfjsLib();
    const operatorList = await page.getOperatorList();
    hasImages = operatorList.fnArray.some((fn: number) => fn === lib.OPS.paintImageXObject);
  } catch {
    // ignore
  }

  return {
    pageNumber: page.pageNumber,
    text,
    items,
    hasImages,
    width: viewport.width,
    height: viewport.height,
  };
}

async function extractPageAsImage(page: any, scale: number = 2): Promise<Blob> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d')!;

  await page.render({ canvasContext: ctx, viewport }).promise;

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.85);
  });
}

export async function processPdf(
  file: File,
  onProgress?: (step: string, progress: number) => void
): Promise<ProcessedPdf> {
  const pdfjsLib = await getPdfjsLib();
  const arrayBuffer = await file.arrayBuffer();
  onProgress?.('Lendo PDF', 10);

  const document = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageCount = document.numPages;
  const meta = await document.getMetadata();
  const title = (meta.info as Record<string, unknown>)?.Title as string || file.name.replace('.pdf', '');

  onProgress?.('Extraindo texto', 20);

  const pages: ExtractedPage[] = [];
  let totalTextLength = 0;

  for (let i = 1; i <= pageCount; i++) {
    const page = await document.getPage(i);
    const extracted = await extractPageText(page);
    pages.push(extracted);
    totalTextLength += extracted.text.length;
    onProgress?.('Extraindo texto', 20 + Math.floor((i / pageCount) * 40));
  }

  const hasNativeText = totalTextLength / pageCount > 50;

  onProgress?.('Identificando estrutura', 70);

  let coverImageBlob: Blob | null = null;
  try {
    const coverPage = await document.getPage(1);
    coverImageBlob = await extractPageAsImage(coverPage, 2);
  } catch {
    // ignore
  }

  onProgress?.('Preparando conteúdo', 90);

  return {
    document,
    pageCount,
    title,
    pages,
    hasNativeText,
    coverImageBlob,
  };
}

export { detectChapter };
