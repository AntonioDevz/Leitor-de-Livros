'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Book } from '@/types';
import { cn, formatRelativeDate } from '@/lib/utils';
import { Heart } from 'lucide-react';

const PALETTES = [
  ['#3d2e1d', '#bb7a1c'],
  ['#223443', '#6b9db8'],
  ['#4a2540', '#c77ba8'],
  ['#2d3a2f', '#7ea08b'],
  ['#8b3a2f', '#d99a7a'],
  ['#1e3a2d', '#5a8f6f'],
  ['#5b2c26', '#c88a76'],
  ['#2c2f4a', '#7b86c9'],
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getPaletteFor(input: string): [string, string] {
  const p = PALETTES[hashString(input || 'x') % PALETTES.length] as [string, string];
  return p;
}

export function TypographicCover({ book, className }: { book: Book; className?: string }) {
  const [dark, light] = getPaletteFor(book.title + book.author);
  const initials = (book.title || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ background: `linear-gradient(150deg, ${light} 0%, ${dark} 100%)` }}
    >
      <div className="absolute inset-y-0 left-0 w-[8px] book-spine" style={{ background: 'rgba(0,0,0,0.22)' }} />
      <div className="cover-texture absolute inset-0" />
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%)' }}
      />
      <div className="relative h-full flex flex-col">
        <div className="pt-5 px-4">
          <div className="w-7 h-7 rounded-md bg-white/15 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 min-h-0">
          <span className="font-serif text-[min(2.6cqw,20px)] leading-tight text-white text-center line-clamp-4 font-medium tracking-tight [font-size:clamp(13px,2.1vmin,18px)] px-1">
            {book.title}
          </span>
          {book.author && (
            <span className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/55 text-center line-clamp-1 px-3">
              {book.author}
            </span>
          )}
        </div>
        <div className="px-4 pb-3 flex items-center justify-between">
          {initials ? (
            <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-[9px] font-semibold text-white/80">
              {initials}
            </span>
          ) : (
            <span />
          )}
          <span className="text-[9px] text-white/40">{book.pageCount} págs</span>
        </div>
      </div>
    </div>
  );
}

export default function BookCard({ book, index = 0 }: { book: Book; index?: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(`bf-progress-${book.id}`);
    if (saved) {
      try {
        const p = JSON.parse(saved) as { percentage?: number };
        setProgress(p.percentage || 0);
      } catch { /* ignore */ }
    }
  }, [book.id]);

  const [dark, light] = getPaletteFor(book.title + book.author);
  const progressColor = progress > 75 ? '#4caf50' : light;

  return (
    <Link
      href={`/book/?id=${book.id}`}
      className="group block animate-slide-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(34,29,23,0.1),0_4px_10px_rgba(34,29,23,0.12),0_14px_30px_rgba(34,29,23,0.12)] book-card-hover group-hover:scale-[1.03]">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <TypographicCover book={book} className="w-full h-full" />
        )}

        {book.isFavorite && (
          <div className="absolute top-2 right-2 z-10">
            <div className="w-7 h-7 rounded-full bg-white/90 shadow-sm backdrop-blur flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-[#e05d5d]" fill="currentColor" />
            </div>
          </div>
        )}

        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent px-2.5 pt-10 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-[3px] bg-white/25 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: progressColor }}
                />
              </div>
              <span className="text-[10px] font-medium text-white/90 tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}

        {progress === 0 && book.status === 'converting' && (
          <div className="absolute inset-0 z-10 bg-[#221d17]/55 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-[#d9a441] border-t-transparent animate-spin" />
            <span className="text-[11px] text-white/80 font-medium">Convertendo…</span>
          </div>
        )}
      </div>

      <div className="mt-2.5 px-0.5">
        <h3 className="font-medium text-[#221d17] text-sm leading-snug line-clamp-1 group-hover:text-[#bb7a1c] transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-[#8b8174] mt-0.5 truncate">{book.author}</p>
        <p className="text-[10px] text-[#8b8174]/70 mt-0.5">{formatRelativeDate(book.updatedAt)}</p>
      </div>
    </Link>
  );
}