'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const PALETTES = [
  ['#3d2e1d', '#bb7a1c'],
  ['#223443', '#6b9db8'],
  ['#4a2540', '#c77ba8'],
  ['#2d3a2f', '#7ea08b'],
  ['#8b3a2f', '#d99a7a'],
];

export default function Hero() {
  const [palette, setPalette] = useState(PALETTES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPalette((prev) => PALETTES[(PALETTES.indexOf(prev) + 1) % PALETTES.length]);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#faf7f1]">
      {/* Ambient glows */}
      <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #bb7a1c 0%, transparent 65%)', animation: 'bgShift 18s ease-in-out infinite' }} />
      <div className="absolute -bottom-48 -left-40 w-[560px] h-[560px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #6b9db8 0%, transparent 65%)', animation: 'bgShift 22s ease-in-out infinite' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 py-24 grid lg:grid-cols-[1.15fr_1fr] gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f6e8cf] text-[#96600f] text-xs font-medium tracking-wide mb-7 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bb7a1c]" />
            Plataforma de livros digitais
          </div>

          <h1 className="font-serif text-[2.75rem] leading-[1.08] md:text-6xl text-[#221d17] font-semibold tracking-tight mb-6">
            Transforme seus{' '}
            <span className="italic text-[#bb7a1c]">PDFs</span> em livros{' '}
            <span className="relative inline-block">
              digitais
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M2 6C60 2 140 2 198 5" stroke="#bb7a1c" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#8b8174] max-w-lg leading-relaxed mb-9 font-light">
            Converta documentos, apostilas e materiais em uma experiência de leitura
            moderna, responsiva e interativa — com o acabamento das grandes editoras.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 mb-12">
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

          <div className="flex items-center gap-8 text-[#8b8174]">
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
        </div>

        {/* Book transformation showcase */}
        <div className="relative hidden lg:block" aria-hidden>
          <div className="relative mx-auto w-[320px] h-[360px]">
            {/* PDF document */}
            <div className="absolute top-6 left-6 w-[210px] h-[280px] rounded-[8px] shadow-2xl"
              style={{ background: palette[0] }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent rounded-[8px] p-6 border border-white/10">
                <div className="w-14 h-2 rounded-full bg-white/25 mb-3" />
                <div className="space-y-1.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-1.5 rounded-full" style={{ width: `${[80, 65, 90, 55, 70][i]}%`, background: 'rgba(255,255,255,0.16)' }} />
                  ))}
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="h-px bg-white/20 mb-2" />
                  <div className="w-9 h-2 rounded-full bg-white/20 mb-1.5" />
                  <div className="w-16 h-2 rounded-full bg-white/15" />
                </div>
              </div>
              <span className="absolute -bottom-3 right-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium"
                style={{ background: palette[1], color: '#fff' }}>
                PDF
              </span>
            </div>

            {/* Transformation particles */}
            <div className="absolute top-24 right-8 left-8 bottom-6 flex items-center justify-center">
              <div className="w-px h-full bg-gradient-to-b from-transparent via-[#bb7a1c]/30 to-transparent" />
            </div>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-[#bb7a1c]/50"
                style={{
                  top: `${30 + i * 14}%`,
                  right: `${26 + (i % 3) * 8}%`,
                  animation: 'float 3.5s ease-in-out infinite',
                  animationDelay: `${i * 0.4}s`,
                }} />
            ))}

            {/* Book result */}
            <div className="absolute bottom-0 right-0 w-[190px] h-[260px] animate-float" style={{ animationDelay: '0.6s' }}>
              <div className="relative w-full h-full rounded-r-[10px] rounded-l-[4px] shadow-2xl overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${palette[1]} 0%, ${palette[0]} 100%)` }}>
                <div className="absolute inset-y-0 left-0 w-[7px] book-spine" style={{ background: 'rgba(0,0,0,0.2)' }} />
                <div className="absolute inset-0 p-5 flex flex-col">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center mb-auto">
                    <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                  <div className="mt-auto space-y-1.5">
                    <div className="h-1.5 rounded-full bg-white/40 w-full" />
                    <div className="h-1.5 rounded-full bg-white/30 w-4/5" />
                    <div className="h-1.5 rounded-full bg-white/20 w-3/5" />
                  </div>
                  <div className="mt-3 h-px bg-white/20" />
                  <div className="h-1.5 rounded-full bg-white/25 w-1/3 mt-2" />
                </div>
              </div>
              <span className="absolute -bottom-3 left-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#221d17] text-[#d9a441]">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                Livro digital
              </span>
            </div>

            {/* Small floating chips */}
            <div className="absolute top-0 right-16 px-3 py-1.5 rounded-full bg-white text-[11px] font-medium text-[#4b4238] shadow-md animate-float border border-[#e6ddd0]" style={{ animationDelay: '1.2s' }}>
              ✓ Extração de texto
            </div>
            <div className="absolute bottom-40 left-0 px-3 py-1.5 rounded-full bg-white text-[11px] font-medium text-[#4b4238] shadow-md animate-float border border-[#e6ddd0]" style={{ animationDelay: '2s' }}>
              📖 Capítulos
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}