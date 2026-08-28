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
      <section className="py-20 bg-[#f1eadf]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#bb7a1c] mb-12">
            Como funciona
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.n} className="relative text-center md:text-left group">
                <div className="font-serif text-5xl font-semibold text-[#bb7a1c]/25 transition-colors group-hover:text-[#bb7a1c]/40">
                  {step.n}
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#221d17] mt-2 mb-2">
                  {step.title}
                </h3>
                <p className="text-[#8b8174] text-[15px] leading-relaxed max-w-xs md:mx-0 mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#faf7f1]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="group relative p-7 rounded-2xl bg-[#faf7f1] border border-[#e6ddd0] hover:border-[#d8ccb9] hover:bg-white transition-all duration-300 animate-slide-up"
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