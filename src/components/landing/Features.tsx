'use client';

import { FileText, BookOpen, Palette, Layers, Smartphone, Bookmark } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Extração Inteligente',
    description:
      'Analisa o PDF e extrai textos, imagens, capítulos e a estrutura completa do documento automaticamente.',
  },
  {
    icon: BookOpen,
    title: 'Leitor Premium',
    description:
      'Experiência de leitura inspirada nos melhores apps de livros digitais, com foco total no conteúdo.',
  },
  {
    icon: Palette,
    title: 'Temas e Tipografia',
    description:
      'Claro, sépia, escuro, AMOLED e personalizado — com tamanhos, fontes e espaçamentos sob medida.',
  },
  {
    icon: Layers,
    title: 'Page Flip Realista',
    description:
      'Animação suave de virar página com perspectiva e física que imitam um livro de verdade.',
  },
  {
    icon: Smartphone,
    title: '100% Responsivo',
    description:
      'Desenhado para desktop, tablet e smartphone — com o mobile como prioridade desde o início.',
  },
  {
    icon: Bookmark,
    title: 'Marcadores e Notas',
    description:
      'Destaque trechos, salve marcadores, escreva notas e retome exatamente onde parou.',
  },
];

const steps = [
  { n: '01', title: 'Envie seu PDF', desc: 'Arraste o arquivo ou importe direto do seu dispositivo.' },
  { n: '02', title: 'Processamos', desc: 'Texto, fontes, imagens e capa são extraídos localmente.' },
  { n: '03', title: 'Leia onde quiser', desc: 'Um livro digital completo, salvo offline na sua biblioteca.' },
];

export default function Features() {
  return (
    <>
      {/* How it works */}
      <section className="py-20 lg:py-24 bg-[#f1eadf]">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#bb7a1c] mb-14">
            Como funciona
          </p>
          <div className="relative">
            <div className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-[#d8ccb9] to-transparent" aria-hidden />
            <div className="grid md:grid-cols-3 gap-12 md:gap-8">
              {steps.map((step) => (
                <div key={step.n} className="relative flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#e6ddd0] shadow-sm flex items-center justify-center font-serif text-lg font-semibold text-[#bb7a1c]">
                    {step.n}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#221d17] mt-5 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#8b8174] text-[15px] leading-relaxed max-w-[16rem]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-24 bg-[#faf7f1]">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#bb7a1c] mb-4">
              Recursos
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#221d17] tracking-tight mb-5">
              Tudo que você precisa
            </h2>
            <p className="text-lg text-[#8b8174] max-w-xl mx-auto font-light">
              Do upload ao leitor, uma experiência completa e profissional — sem perder nada do seu PDF.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="group relative p-7 rounded-2xl bg-white border border-[#e6ddd0] hover:border-[#d8ccb9] hover:shadow-[0_12px_32px_rgba(34,29,23,0.08)] transition-all duration-300 animate-slide-up h-full flex flex-col"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute inset-x-7 top-0 h-[2px] rounded-full bg-[#bb7a1c] opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300 origin-center" />
                <div className="w-11 h-11 rounded-xl bg-[#f6e8cf] flex items-center justify-center mb-5 transition-colors group-hover:bg-[#bb7a1c] group-hover:text-white">
                  <Icon className="w-5 h-5 text-[#bb7a1c] transition-colors group-hover:text-white" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#221d17] mb-2">{title}</h3>
                <p className="text-[#8b8174] text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}