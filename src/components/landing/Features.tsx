import { FileText, BookOpen, Palette, Layers, Smartphone, Bookmark, UploadCloud, Wand2 } from 'lucide-react';

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
  {
    n: '01',
    icon: UploadCloud,
    title: 'Envie seu PDF',
    desc: 'Arraste o arquivo ou importe direto do seu dispositivo. Até 200MB.',
  },
  {
    n: '02',
    icon: Wand2,
    title: 'Processamos',
    desc: 'Texto, fontes, imagens e capa são extraídos — tudo localmente, sem servidores.',
  },
  {
    n: '03',
    icon: BookOpen,
    title: 'Leia onde quiser',
    desc: 'Um livro digital completo, salvo offline na sua biblioteca.',
  },
];

export default function Features() {
  return (
    <>
      {/* How it works */}
      <section className="py-20 bg-white border-b border-[#ece6da]">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#bb7a1c] mb-3">
              Como funciona
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-[#211d18] tracking-tight">
              Do upload à primeira página em três passos
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {steps.map(({ n, icon: Icon, title, desc }) => (
              <div
                key={n}
                className="relative flex flex-col p-7 rounded-2xl border border-[#ece6da] bg-[#fbf9f4]"
              >
                <span className="absolute top-6 right-6 font-serif text-lg font-medium text-[#d6cdbb]">
                  {n}
                </span>
                <div className="w-11 h-11 rounded-xl bg-white border border-[#ece6da] flex items-center justify-center mb-5 shadow-sm">
                  <Icon className="w-5 h-5 text-[#bb7a1c]" strokeWidth={1.8} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#211d18] mb-2">{title}</h3>
                <p className="text-[#6f675c] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-24 bg-[#fbf9f4]">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#bb7a1c] mb-3">
              Recursos
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-[#211d18] tracking-tight mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-[#6f675c] text-lg leading-relaxed">
              Do upload ao leitor, uma experiência completa e profissional — sem perder nada do seu PDF.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="group relative p-7 rounded-2xl bg-white border border-[#ece6da] hover:border-[#d6cdbb] hover:shadow-[0_14px_36px_rgba(28,24,18,0.08)] transition-all duration-300 animate-slide-up h-full flex flex-col"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-[#f7f0e0] flex items-center justify-center mb-5 transition-colors group-hover:bg-[#bb7a1c] group-hover:text-white">
                  <Icon className="w-5 h-5 text-[#b97a1c] transition-colors group-hover:text-white" strokeWidth={1.8} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#211d18] mb-2">{title}</h3>
                <p className="text-[#6f675c] text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}