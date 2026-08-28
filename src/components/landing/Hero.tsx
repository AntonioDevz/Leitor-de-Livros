import Link from 'next/link';

const COVERS: Array<[string, string, string]> = [
  ['#43321f', '#c8923a', 'Noite'],
  ['#223443', '#6f9eb7', 'Maré'],
  ['#4a2540', '#c77ba8', 'Jardim'],
  ['#2d3a2f', '#7ea08b', 'Horizonte'],
];

function BookCover({ from, to, title }: { from: string; to: string; title: string }) {
  return (
    <div
      className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-[0_4px_14px_rgba(28,24,18,0.18)]"
      style={{ background: `linear-gradient(150deg, ${to} 0%, ${from} 100%)` }}
    >
      <div className="absolute inset-y-0 left-0 w-[3px] bg-black/20" />
      <div className="absolute inset-0 p-2.5 flex flex-col">
        <span className="font-serif text-[10px] leading-[1.15] text-white/90 font-medium">{title}</span>
        <div className="mt-auto space-y-1">
          <div className="h-[3px] rounded-full bg-white/20" />
          <div className="h-[3px] rounded-full bg-white/15 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fbf9f4] border-b border-[#ece6da]">
      {/* Soft top light */}
      <div
        className="absolute inset-x-0 top-0 h-72 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 100% at 50% -20%, rgba(201,146,58,0.12) 0%, transparent 60%)' }}
        aria-hidden
      />

      <div className="relative w-full max-w-6xl mx-auto px-5 md:px-8 pt-28 lg:pt-32 pb-14 lg:pb-20 grid lg:grid-cols-2 gap-14 lg:gap-12 items-center">
        {/* Copy */}
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2e8d3] border border-[#e6d7b3] text-[#8a5a0e] text-xs font-medium mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bb7a1c]" />
            Transforme PDFs em livros
          </span>

          <h1 className="font-serif text-[2.7rem] leading-[1.06] sm:text-[3.4rem] lg:text-[3.7rem] text-[#211d18] font-semibold tracking-tight mb-6">
            Do PDF ao{' '}
            <span className="relative inline-block text-[#b97a1c]">
              livro digital
              <svg className="absolute -bottom-1.5 left-0 w-full" height="7" viewBox="0 0 200 7" preserveAspectRatio="none" aria-hidden>
                <path d="M2 5C60 1 140 1 198 4" stroke="#bb7a1c" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.55" />
              </svg>
            </span>
            <br className="hidden sm:block" />
            em segundos.
          </h1>

          <p className="text-lg lg:text-xl text-[#6f675c] max-w-md leading-relaxed mb-9">
            Uma experiência de leitura moderna, responsiva e interativa — com o
            acabamento de uma editora. Tudo no seu navegador.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 mb-8">
            <Link
              href="/upload"
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#211d18] text-[#f3e8cf] font-medium text-[15px] shadow-[0_12px_28px_rgba(33,29,24,0.24)] hover:bg-[#3a322a] hover:-translate-y-0.5 transition-all duration-200"
            >
              Transformar meu PDF
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#4b4238] font-medium text-[15px] border border-[#e8e1d4] shadow-sm hover:border-[#d6cdbb] hover:bg-[#fbf9f4] transition-all duration-200"
            >
              Ver biblioteca
            </Link>
          </div>

          <p className="text-[13px] text-[#8a8176] flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>100% no navegador</span>
            <span className="w-1 h-1 rounded-full bg-[#d6cdbb]" />
            <span>Grátis</span>
            <span className="w-1 h-1 rounded-full bg-[#d6cdbb]" />
            <span>Sem cadastro</span>
            <span className="w-1 h-1 rounded-full bg-[#d6cdbb]" />
            <span>Funciona offline</span>
          </p>
        </div>

        {/* Product mockup */}
        <div className="relative animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="rounded-2xl border border-[#e8e1d4] bg-white shadow-[0_36px_90px_rgba(28,24,18,0.16)] overflow-hidden">
              {/* Window bar */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-[#f7f4ed] border-b border-[#eee8dc]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e3bb8b]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#e6d5a8]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#c9d2c0]" />
                <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-[#8a8176] font-medium bg-white border border-[#eee8dc] rounded-full px-2.5 py-1">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#8a8176" strokeWidth={2}>
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  bookflow · local
                </span>
              </div>

              {/* App content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#211d18] flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#d9a441]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <span className="font-serif font-semibold text-sm text-[#211d18]">Minha biblioteca</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-6 rounded-full bg-[#f3eee4] border border-[#ece5d7] w-24" aria-hidden />
                    <span className="h-6 w-6 rounded-full bg-[#211d18] flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#d9a441]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {COVERS.map(([a, b, t]) => (
                    <BookCover key={t} from={a} to={b} title={t} />
                  ))}
                </div>

                {/* Now reading */}
                <div className="mt-4 rounded-xl border border-[#eee8dc] bg-[#fbf9f4] p-3 flex items-center gap-3">
                  <div className="w-9 h-12 rounded-md overflow-hidden shrink-0 shadow-md" style={{ background: 'linear-gradient(150deg, #6f9eb7 0%, #223443 100%)' }}>
                    <div className="h-full w-[3px] bg-black/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#211d18] truncate">Maré — cap. 4</p>
                    <div className="mt-2 flex gap-1">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i < 4 ? '#bb7a1c' : '#e8e1d4' }} />
                      ))}
                    </div>
                  </div>
                  <span className="w-7 h-7 rounded-full bg-[#bb7a1c] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white translate-x-px" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4.5v15l13-7.5-13-7.5z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Floating resume badge */}
            <div className="absolute -bottom-5 -left-4 sm:-left-6 rounded-xl bg-[#211d18] text-[#f3e8cf] pl-4 pr-5 py-3 shadow-[0_16px_40px_rgba(33,29,24,0.35)] flex items-center gap-2.5 text-[13px] font-medium">
              <svg className="w-4 h-4 text-[#d9a441]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Leitura retomada · pág. 142
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}