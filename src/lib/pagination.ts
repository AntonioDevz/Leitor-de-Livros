import type { PageContent } from '@/types';

/**
 * Screen pagination.
 *
 * Instead of squeezing a long PDF page into one reading screen (which made the
 * text tiny), the whole book is re-flowed into reading pages that each carry
 * roughly the same amount of text — the ideal amount to cover one screen with
 * the user's font settings. The geometry mirrors the real Reader block (same
 * paddings, fonts, line-heights and footer reserve), so the estimate matches
 * the rendered output and the auto-fit scale stays near 1.
 */

export interface PaginationOptions {
  viewportW: number;
  viewportH: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  paragraphSpacing: number;
  contentWidth: number;
  serif: boolean;
}

export interface PaginationResult {
  pages: { content: PageContent[]; pageNumber: number }[];
  /** PDF page number -> first reading-page number that contains that PDF page */
  sourceFirstPage: Map<number, number>;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

interface Piece {
  kind: 'flow' | 'group';
  source: number;
  type: 'text' | 'heading' | 'quote';
  level?: number;
  /** per-line slices with their rendered heights (px) */
  lines: { text: string; h: number }[];
  /** vertical space AFTER the whole piece (paragraph margin / heading margins) */
  gap: number;
}

function sliceText(text: string, charsPerLine: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let line = '';
  let len = 0;
  for (let w of words) {
    while (w.length > charsPerLine) {
      if (len > 0) {
        out.push(line);
        line = '';
        len = 0;
      }
      out.push(w.slice(0, charsPerLine));
      w = w.slice(charsPerLine);
    }
    if (!w) continue;
    if (len > 0 && len + 1 + w.length > charsPerLine) {
      out.push(line);
      line = '';
      len = 0;
    }
    if (len > 0) {
      line += ' ' + w;
      len += 1 + w.length;
    } else {
      line = w;
      len = w.length;
    }
  }
  if (line) out.push(line);
  return out.length ? out : [text];
}

export function paginateBook(
  sources: { pageNumber: number; content: PageContent[] }[],
  opts: PaginationOptions
): PaginationResult {
  // ---- geometry mirroring the Reader
  const blockW = Math.max(180, Math.min(opts.contentWidth, opts.viewportW - 40)); // calc(100% - 2.5rem)
  const padV = clamp(opts.viewportW * 0.04, 20, 52); // clamp(1.25rem, 4vw, 3.25rem)
  const padH = clamp(opts.viewportW * 0.04, 16, 44); // clamp(1rem, 4vw, 2.75rem)
  const innerW = blockW - 2 * padH;
  const innerH = opts.viewportH - 2 * padV;
  const fontPx = Math.min(opts.fontSize, opts.viewportW * 0.045 + 9.6); // min(fontSize, 4.5vw + 0.6rem)
  const lineH = fontPx * opts.lineHeight;
  const charW = ((opts.serif ? 0.51 : 0.46) + opts.letterSpacing) * fontPx;
  const charsPerLine = Math.max(10, Math.floor(innerW / charW));
  const footerReserve = 54; // footer bar + breathing space
  const usable = Math.max(220, innerH - footerReserve);
  const target = usable * 0.99;
  const paraGap = opts.paragraphSpacing * fontPx;

  // ---- convert blocks into line pieces
  const pieces: Piece[] = [];
  for (const src of sources) {
    for (const block of src.content) {
      switch (block.type) {
        case 'heading': {
          const em = block.level === 1 ? 1.45 : block.level === 2 ? 1.25 : 1.1;
          const hFont = fontPx * em;
          const hLine = hFont * 1.3; // CSS line-height: 1.3
          const hcpl = Math.max(3, Math.floor(charsPerLine * (fontPx / hFont)));
          const lines = sliceText(block.text || '', hcpl).map((text) => ({ text, h: hLine }));
          pieces.push({
            kind: 'group',
            source: src.pageNumber,
            type: 'heading',
            level: block.level,
            lines,
            gap: (1.5 + 0.5) * hFont, // heading margins 1.5em / 0.5em
          });
          break;
        }
        case 'quote': {
          const h = lineH * 1.05;
          const lines = sliceText(block.text || '', charsPerLine).map((text) => ({ text, h }));
          pieces.push({
            kind: 'flow',
            source: src.pageNumber,
            type: 'quote',
            lines,
            gap: (1.5 + 1.5) * fontPx + 1.2 * fontPx, // margins 1.5em + padding 0.6em
          });
          break;
        }
        case 'list': {
          const h = lineH;
          const cpl = Math.max(6, charsPerLine - 3);
          const lines = sliceText((block.items || []).join('  '), cpl).map((text) => ({ text, h }));
          pieces.push({
            kind: 'flow',
            source: src.pageNumber,
            type: 'text',
            lines,
            gap: paraGap + 2 * fontPx,
          });
          break;
        }
        case 'text':
        default: {
          const lines = sliceText(block.text || '', charsPerLine).map((text) => ({ text, h: lineH }));
          pieces.push({ kind: 'flow', source: src.pageNumber, type: 'text', lines, gap: paraGap });
          break;
        }
      }
    }
  }

  // ---- greedy packing into screen pages
  const pages: PageContent[][] = [];
  const sourceFirstPage = new Map<number, number>();
  let cur: PageContent[] = [];
  let used = 0;
  let pageHasContent = false;
  let curText = '';
  let curType: 'text' | 'quote' = 'text';

  const noteSource = (source: number) => {
    if (!sourceFirstPage.has(source)) sourceFirstPage.set(source, pages.length + 1);
  };

  const flushFrag = () => {
    const t = curText.trim();
    if (t) {
      cur.push(curType === 'quote' ? { type: 'quote', text: t } : { type: 'text', text: t });
    }
    curText = '';
  };

  const closePage = () => {
    flushFrag();
    if (cur.length) pages.push(cur);
    cur = [];
    used = 0;
    pageHasContent = false;
  };

  for (const piece of pieces) {
    if (piece.kind === 'flow') {
      for (let i = 0; i < piece.lines.length; i++) {
        const li = piece.lines[i];
        if (pageHasContent && used + li.h > target) closePage();
        noteSource(piece.source);
        pageHasContent = true;
        curText = curText ? curText + ' ' + li.text : li.text;
        used += li.h;
      }
      used += piece.gap;
      curType = piece.type === 'quote' ? 'quote' : 'text';
      flushFrag();
      curType = 'text';
    } else {
      const total = piece.lines.reduce((s, l) => s + l.h, 0) + piece.gap;
      if (pageHasContent && used + total > target) closePage();
      noteSource(piece.source);
      pageHasContent = true;
      flushFrag();
      cur.push({
        type: 'heading',
        level: piece.level,
        text: piece.lines.map((l) => l.text).join(' '),
      });
      used += total;
    }
  }
  flushFrag();
  if (cur.length) pages.push(cur);

  return {
    pages: pages.map((content, i) => ({ content, pageNumber: i + 1 })),
    sourceFirstPage,
  };
}