import Link from 'next/link';

const footerNav = [
  { label: 'Início', href: '/' },
  { label: 'Biblioteca', href: '/library' },
  { label: 'Novo livro', href: '/upload' },
];

const footerResources = [
  'Leitor com page flip realista',
  'Temas claro, sépia, escuro e AMOLED',
  'Marcadores, notas e buscas',
  'Todo conteúdo salvo offline',
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#1a1612] text-[#8b8174] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-[#221d17] border border-white/10">
                <svg className="w-4.5 h-4.5 text-[#d9a441]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="font-serif font-semibold text-lg text-[#e9dfcd] tracking-tight block">Bookflow</span>
                <span className="text-[10px] uppercase tracking-[0.18em]">edições digitais</span>
              </div>
            </Link>
            <p className="text-[13px] leading-relaxed mt-4">
              Transforme seus PDFs em livros digitais com acabamento de editora,
              inteiramente no seu navegador.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e9dfcd] mb-4">Navegar</p>
            <ul className="space-y-2.5 text-sm">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#d9a441] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e9dfcd] mb-4">Recursos</p>
            <ul className="space-y-2.5 text-sm">
              {footerResources.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-3 h-3 text-[#bb7a1c] mt-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6d6355]">
          <span>&copy; {new Date().getFullYear()} Bookflow — edições digitais com carinho.</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bb7a1c]" />
            Feito para ler em qualquer tela
          </span>
        </div>
      </div>
    </footer>
  );
}