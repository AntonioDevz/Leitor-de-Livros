'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FileText, ArrowRight, BookOpen } from 'lucide-react';

const PALETTES = [
  ['#3d2e1d', '#bb7a1c'],
  ['#223443', '#6b9db8'],
  ['#4a2540', '#c77ba8'],
  ['#2d3a2f', '#7ea08b'],
  ['#8b3a2f', '#d99a7a'],
];

function PdfMini({ color }: { color: string }) {
  return (
    <div
      className="relative w-[118px] shrink-0 aspect-[2/3] rounded-lg overflow-hidden shadow-[0_6px_18px_rgba(34,29,23,0.22)]"
      style={{ background: color }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/12 to-transparent p-3.5 border border-white/10 flex flex-col">
        <div className="w-7 h-1.5 rounded-full bg-white/25 mb-3" />
        <div className="space-y-1.5 flex-1">
          {[90, 68, 82, 56, 72].map((w, i) => (
            <div key={i} className="h-1 rounded-full" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.16)' }} />
          ))}
        </div>
        <div className="h-px bg-white/20 mt-3 mb-2" />
        <div className="w-9 h-1.5 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

function BookMini({ from, to }: { from: string; to: string }) {
  return (
    <div
      className="relative w-[118px] shrink-0 aspect-[2/3] rounded-r-[8px] rounded-l-[4px] overflow-hidden shadow-[0_6px_18px_rgba(34,29,23,0.22)]"
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
    >
      <div className="absolute inset-y-0 left-0 w-[6px] book-spine" style={{ background: 'rgba(0,0,0,0.22)' }} />
      <div className="absolute inset-0 p-3.5 flex flex-col">
        <div className="w-6 h-6 rounded-md bg-white/15 flex items-center justify-center mb-auto">
          <BookOpen className="w-3.5 h-3.5 text-white/80" strokeWidth={1.8} />
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 rounded-full bg-white/40 w-full" />
          <div className="h-1.5 rounded-full bg-white/30 w-4/5" />
        </div>
        <div className="mt-2 h-px bg-white/20" />
        <div className="h-1.5 rounded-full bg-white/25 w-1/2 mt-1.5" />
      </div>
    </div>
  );
}

export default function Hero() {
  const [palette, setPalette] = useState(PALETTES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPalette((prev) => PALETTES[(PALETTES.indexOf(prev) + 1) % PALETTES.length]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#faf7f1]">
      {/* Ambient glows */}
      <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #bb7a1c 0%, transparent 65%)', animation: 'bgShift 18s ease-in-out infinite' }} />
      <div className="absolute -bottom-48 -left-40 w-[560px] h-[560px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6b9db8 0%, transparent 65%)', animation: 'bgShift 22s ease-in-out infinite' }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 md:px-8 py-24 grid lg:grid-cols-[1.12fr_1fr] gap-14 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f6e8cf] text-[#96600f] text-xs font-medium tracking-wide mb-7 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bb7a1c]" />
            Plataforma de livros digitais
          </div>

          <h1 className="font-serif text-[2.6rem] leading-[1.06] sm:text-5xl lg:text-[3.6rem] text-[#221d17] font-semibold tracking-tight mb-6">
            Transforme seus{' '}
            <span className="italic text-[#bb7a1c]">PDFs</span> em livros{' '}
            <span className="relative inline-block">
              digitais
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden>
                <path d="M2 6C60 2 140 2 198 5" stroke="#bb7a1c" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#8b8174] max-w-lg leading-relaxed mb-9 font-light">
            Converta documentos, apostilas e materiais em uma experiência de leitura
            moderna, responsiva e interativa — com o acabamento das grandes editoras.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 mb-8">
            <Link
              href="/upload"
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#221d17] text-[#e9dfcd] font-medium text-[15px] shadow-lg shadow-[#221d17]/15 hover:bg-[#3a322a] hover:-translate-y-0.5 transition-all duration-200"
            >
              Transformar meu PDF
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#4b4238] font-medium text-[15px] border border-[#e6ddd0] hover:border-[#d8ccb9] hover:bg-[#faf7f1] transition-all duration-200"
            >
              Ver biblioteca
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[#8b8174]">
            <div>
              <p className="font-serif text-2xl text-[#221d17] font-semibold">100%</p>
              <p className="text-xs tracking-wide mt-0.5">offline-first</p>
            </div>
            <div className="w-px h-8 bg-[#e6ddd0]" />
            <div>
              <p className="font-serif text-2xl text-[#221d17] font-semibold">5</p>
              <p className="text-xs tracking-wide mt-0.5">temas de leitura</p>
            </div>
            <div className="w-px h-8 bg-[#e6ddd0]" />
            <div>
              <p className="font-serif text-2xl text-[#221d17] font-semibold">∞</p>
              <p className="text-xs tracking-wide mt-0.5">páginas</p>
            </div>
          </div>

          {/* Compact transformation strip (mobile/tablet) */}
          <div className="lg:hidden mt-8 animate-slide-up">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-[#e6ddd0] bg-white p-3 shadow-sm">
              <div className="w-11 h-14 rounded-lg flex items-center justify-center shadow-md" style={{ background: palette[0] }}>
                <FileText className="w-5 h-5 text-white/90" strokeWidth={1.8} />
              </div>
              <div className="flex items-center gap-1.5 px-2">
                <div className="h-px flex-1 bg-[#d8ccb9]" />
                <ArrowRight className="w-4 h-4 text-[#bb7a1c]" />
                <div className="h-px flex-1 bg-[#d8ccb9]" />
              </div>
              <div className="w-11 h-14 rounded-lg flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${palette[1]} 0%, ${palette[0]} 100%)` }}>
                <BookOpen className="w-5 h-5 text-white/90" strokeWidth={1.8} />
              </div>
            </div>
            <p className="text-center text-xs text-[#8b8174] mt-2.5">
              Seu PDF vira um livro digital imediatamente — sem servidores.
            </p>
          </div>
        </div>

        {/* Conversion panel (desktop) */}
        <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '120ms' }}>
          <div className="relative mx-auto w-full max-w-[400px]">
            <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-[#f6e8cf] via-transparent to-[#e3e9ea]/70 blur-2xl opacity-80 pointer-events-none" aria-hidden />
            <div className="relative rounded-[1.6rem] bg-white border border-[#e6ddd0] shadow-[0_30px_90px_rgba(34,29,23,0.16)] overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#f1eadf]">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#f6e8cf] flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-[#bb7a1c]" strokeWidth={2} />
                  </span>
                  <span className="text-sm font-medium text-[#221d17]">Conversão instantânea</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#96600f] bg-[#f6e8cf] px-2.5 py-1 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-[#bb7a1c]" />
                  100% local
                </span>
              </div>

              <div className="p-6 pt-5">
                <div className="flex items-center gap-4">
                  <PdfMini color={palette[0]} />
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#221d17] text-[#d9a441] flex items-center justify-center shadow-md" style={{ transition: 'background 0.4s ease' }}>
                      <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                    </span>
                    <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-[#f1eadf]">
                      <div className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-[#bb7a1c] to-[#d9a441]" style={{ animation: 'conversionFill 2.6s ease-in-out infinite' }} />
                    </div>
                    <span className="text-[10px] text-[#8b8174] tracking-wide">processando local</span>
                  </div>
                  <BookMini from={palette[1]} to={palette[0]} />
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#8b8174] shrink-0">Capítulos</span>
                  <div className="flex-1 flex gap-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i < 3 ? '#bb7a1c' : '#f1eadf', opacity: i < 3 ? 1 : 0.55 }} />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#bb7a1c] font-medium shrink-0">pronto para ler</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-6 py-3.5 bg-[#faf7f1] border-t border-[#f1eadf] text-[11px] text-[#8b8174]">
                <span className="inline-flex items-center gap-1.5"><OkIcon /> Estrutura detectada</span>
                <span className="inline-flex items-center gap-1.5"><OkIcon /> Texto extraído</span>
                <span className="inline-flex items-center gap-1.5"><OkIcon /> Salvo offline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OkIcon() {
  return (
    <svg className="w-3 h-3 text-[#bb7a1c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}