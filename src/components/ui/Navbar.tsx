'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/library', label: 'Biblioteca' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-[#221d17] shadow-md transition-transform group-hover:scale-105">
            <svg className="w-4.5 h-4.5 text-[#d9a441]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#bb7a1c]" />
          </div>
          <div className="leading-tight">
            <span className="font-serif font-semibold text-lg text-[#221d17] tracking-tight">
              Bookflow
            </span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-[#8b8174]">
              edições digitais
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-[#221d17]'
                  : 'text-[#8b8174] hover:text-[#221d17]'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-[#bb7a1c]" />
              )}
            </Link>
          ))}
          <Link
            href="/upload"
            className="ml-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#221d17] text-[#e9dfcd] text-sm font-medium hover:bg-[#3a322a] transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
            </svg>
            Novo livro
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-[#221d17]/5 transition-colors"
          aria-label="Menu"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#e6ddd0] bg-[#faf7f1] px-5 py-4 animate-slide-down">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-[#f1eadf] text-[#221d17]'
                    : 'text-[#8b8174] hover:bg-[#faf7f1]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/upload"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 mt-2 rounded-lg bg-[#221d17] text-[#e9dfcd] text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
              </svg>
              Novo livro
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}