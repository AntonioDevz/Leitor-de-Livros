# BookFlow

Transforme seus PDFs em livros digitais interativos com experiência de leitura premium.

## Sobre

O BookFlow é uma plataforma web completa que converte arquivos PDF em livros digitais interativos, com experiência de leitura inspirada em aplicativos como Google Play Livros e Apple Books.

### Funcionalidades

- **Upload com Drag & Drop** — Arraste ou selecione seus PDFs
- **Extração Inteligente** — Texto, imagens, capítulos e estrutura automaticamente
- **Leitor Premium** — Page flip, temas, tipografia personalizável
- **Biblioteca** — Organize, busque e gerencie seus livros
- **Marcadores & Notas** — Destaque trechos e anote suas ideias
- **Pesquisa Interna** — Encontre qualquer palavra no livro
- **5 Temas** — Claro, Sépia, Escuro, Preto (AMOLED), Personalizado
- **100% Responsivo** — Desktop, tablet e smartphone

## Como Usar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ instalado
- [Git](https://git-scm.com/) instalado

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/AntonioDevz/Leitor-de-Livros.git
cd Leitor-de-Livros
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Acesse no navegador:

```
http://localhost:3000
```

### Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Verifica código com ESLint |
| `npm run build:android` | Build web para o app Android + `cap sync` |

## App Android (APK)

O BookFlow também é distribuído como **aplicativo Android** (Capacitor) — o
mesmo leitor e biblioteca local, instalável no celular.

- 📦 **APK pronto para instalar:** pasta [`apk/`](apk/) (`bookflow-debug.apk`);
- 📖 **Documentação da adaptação mobile:** [`docs/mobile-app.md`](docs/mobile-app.md);
- 🤖 **Build do APK:** workflow "Build Android APK" nas GitHub Actions
  (disparo manual → baixar artefato `bookflow-debug.apk`).

## Stack Tecnológica

- **Framework:** Next.js 16
- **Linguagem:** TypeScript
- **Estilo:** Tailwind CSS
- **PDF:** pdf.js (pdfjs-dist)
- **Armazenamento:** IndexedDB (local)
- **Ícones:** Lucide React
- **Mobile:** Capacitor 8 (`@capacitor/core`, `@capacitor/android`,
  `@capacitor/app`, `@capacitor/status-bar`)

## Estrutura do Projeto

```
├── src/
│   ├── app/                    # Rotas da aplicação
│   │   ├── page.tsx            # Landing page
│   │   ├── library/page.tsx    # Biblioteca
│   │   ├── upload/page.tsx     # Upload de PDF
│   │   └── book/[id]/
│   │       ├── page.tsx        # Detalhes do livro
│   │       └── read/page.tsx   # Leitor digital
│   ├── components/             # Componentes React
│   ├── hooks/                  # Hooks customizados
│   ├── lib/                    # Utilitários e serviços
│   └── types/                  # Definições TypeScript
├── public/                     # Arquivos estáticos
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

## Fluxo de Uso

1. **Upload** → Arraste um PDF ou clique para selecionar
2. **Conversão** → O sistema analisa e extrai conteúdo automaticamente
3. **Biblioteca** → O livro aparece na sua biblioteca local
4. **Leitura** → Abra o leitor e personalize sua experiência
5. **Progresso** → Seu progresso é salvo automaticamente

## Licença

MIT
