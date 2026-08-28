import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Navbar from '@/components/ui/Navbar';
import SiteFooter from '@/components/ui/SiteFooter';
import Link from 'next/link';

const ctaPoints = ['100% local', 'Sem cadastro', 'Até 200MB por livro', 'Funciona offline'];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <section className="relative py-28 overflow-hidden bg-[#221d17]">
        <div className="absolute -top-32 left-1/4 w-[420px] h-[420px] rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #bb7a1c 0%, transparent 65%)' }} />
        <div className="absolute -bottom-40 right-1/5 w-[360px] h-[360px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6b9db8 0%, transparent 65%)' }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#d9a441] text-xs font-medium tracking-wide mb-8">
            Gratuito · Sem limites
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#e9dfcd] tracking-tight mb-5">
            Pronto para criar sua biblioteca?
          </h2>
          <p className="text-lg text-[#9a9083] mb-10 font-light">
            Faça upload de um PDF e veja a mágica acontecer. Seus livros ficam salvos,
            offline, direto no seu navegador.
          </p>
          <Link
            href="/upload"
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#bb7a1c] text-[#221d17] rounded-full font-semibold text-lg hover:bg-[#d9a441] transition-all duration-200 hover:shadow-2xl hover:shadow-[#bb7a1c]/30 hover:-translate-y-0.5"
          >
            Transformar meu PDF
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2.5 text-[13px] text-[#8b8174]">
            {ctaPoints.map((point) => (
              <span key={point} className="inline-flex items-center gap-2">
                <svg className="w-3 h-3 text-[#bb7a1c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {point}
              </span>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}