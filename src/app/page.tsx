import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Navbar from '@/components/ui/Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Comece agora
          </h2>
          <p className="text-lg text-slate-500 mb-10">
            Faça upload de um PDF e veja a mágica acontecer.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-medium text-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/20"
          >
            Começar gratuitamente
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
      <footer className="py-8 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-slate-400">
          <span>BookFlow</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </main>
  );
}
