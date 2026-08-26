'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const steps = [
  { label: 'PDF', icon: '📄' },
  { label: 'Análise', icon: '🔍' },
  { label: 'Conversão', icon: '⚡' },
  { label: 'Livro Digital', icon: '📖' },
];

export default function Hero() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-slate-50">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Plataforma de livros digitais
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 animate-slide-up" style={{ fontFamily: 'var(--font-geist-sans), system-ui' }}>
          Transforme seus
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            PDFs em livros
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Converta documentos, apostilas e materiais em uma experiência de leitura
          moderna, responsiva e interativa.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link
            href="/upload"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-medium text-lg hover:bg-slate-800 transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5"
          >
            Transformar meu PDF
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/library"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-xl font-medium text-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
          >
            Ver Biblioteca
          </Link>
        </div>

        <div className="relative max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">
            <div className="flex items-center justify-between gap-4 md:gap-8">
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-4 md:gap-8">
                  <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${
                    i <= activeStep ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                  }`}>
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 ${
                      i === activeStep
                        ? 'bg-blue-600 shadow-lg shadow-blue-600/30 scale-110'
                        : i < activeStep
                        ? 'bg-green-500'
                        : 'bg-slate-100'
                    }`}>
                      {i < activeStep ? (
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span>{step.icon}</span>
                      )}
                    </div>
                    <span className={`text-xs md:text-sm font-medium transition-colors ${
                      i <= activeStep ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 w-8 md:w-16 rounded transition-colors duration-500 ${
                      i < activeStep ? 'bg-green-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
