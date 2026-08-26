'use client';

const features = [
  {
    icon: '📄',
    title: 'Extração Inteligente',
    description: 'Analisa e extrai textos, imagens, capítulos e estrutura do PDF automaticamente.',
  },
  {
    icon: '📖',
    title: 'Leitor Premium',
    description: 'Experiência de leitura inspirada nos melhores apps de livros digitais.',
  },
  {
    icon: '🎨',
    title: 'Temas Personalizáveis',
    description: 'Claro, sépia, escuro, AMOLED e personalizado. Tipografia completa.',
  },
  {
    icon: '🔄',
    title: 'Page Flip',
    description: 'Animação realista de virar página com física suave e perspectiva.',
  },
  {
    icon: '📱',
    title: '100% Responsivo',
    description: 'Desktop, tablet e smartphone. Experiência mobile como prioridade.',
  },
  {
    icon: '🔖',
    title: 'Marcadores e Notas',
    description: 'Destaque trechos, adicione marcadores e anote suas ideias.',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Tudo que você precisa
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Do upload ao leitor, uma experiência completa e profissional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center text-xl mb-4 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
