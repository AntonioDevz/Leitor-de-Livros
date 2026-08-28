# BookFlow — Adaptação para App Mobile (Android / APK)

O BookFlow é nativamente um **site estático** (Next.js + output export) que
roda 100% no navegador: converte PDFs, armazena a biblioteca e faz a leitura
tudo localmente no dispositivo (IndexedDB). Esta documentação explica como o
mesmo código foi empacotado como **aplicativo Android** via **Capacitor**,
gerando um APK instalável.

## Visão geral

| | Site (GitHub Pages) | App Android (APK) |
| --- | --- | --- |
| Roda em | navegador qualquer | WebView Android (Capacitor) |
| Build | `next build` com `basePath=/Leitor-de-Livros` | `next build` sem `basePath` + pacote nativo |
| Armazenamento | IndexedDB/localStorage | IndexedDB/localStorage (WebView) |
| Conversão de PDF | pdf.js (worker via CDN) | pdf.js (worker **local**, off-line) |
| Entrega | GitHub Pages | APK de debug via GitHub Actions |

O aplicativo é **focado em leitura** com a mesma biblioteca baseada nos livros
do usuário e o mesmo sistema de leitura (virada de página, re-paginação por
tela, capítulos, marcadores, notas, temas).

## Arquitetura

```
Leitor-de-Livros/
├─ src/                 # aplicação web (Next.js App Router, cliente)
├─ public/pdfjs/        # worker do pdf.js copiado na hora do build (off-line)
├─ capacitor.config.ts  # config do Capacitor (appId, appName, webDir)
├─ android/             # projeto nativo gerado por `npx cap add android`
├─ scripts/
│  ├─ prepare-pdfjs-worker.mjs   # copia pdf.worker.min.mjs de node_modules → public/pdfjs
│  └─ build-android.mjs          # build web (sem basePath) + `cap sync android`
├─ .github/workflows/
│  ├─ deploy.yml                 # publica o site no GitHub Pages
│  └─ android-apk.yml            # gera o APK a cada disparo manual
└─ apk/                # APK pronto + README de instalação
```

## Como funciona a integração

### 1. Build web para o WebView (sem basePath)

O site de GitHub Pages usa `basePath=/Leitor-de-Livros`. O WebView do
Capacitor serve os arquivos na raiz (`https://localhost`). Por isso o
`next.config.ts` alterna conforme o ambiente:

```ts
const forApk = process.env.CAPACITOR_BUILD === "1";
basePath:      forApk ? "" : "/Leitor-de-Livros",
assetPrefix:   !forApk && process.env.NODE_ENV === "production" ? "/Leitor-de-Livros/" : undefined,
```

`npm run build:android` (`scripts/build-android.mjs`) roda `next build` com
`CAPACITOR_BUILD=1` e depois `cap sync android`, que copia `out/` para
`android/app/src/main/assets/public/`.

### 2. pdf.js off-line

`src/lib/pdf-processor.ts` aponta o worker do pdf.js para um asset local no
app (injetado via `NEXT_PUBLIC_PDFJS_WORKER` no build Android); no site mantém
o CDN. `scripts/prepare-pdfjs-worker.mjs` copia
`node_modules/pdfjs-dist/build/pdf.worker.min.mjs` → `public/pdfjs/` .

### 3. Integrações nativas

- `src/components/NativePlatform.tsx`: montado no `layout.tsx`. No dispositivo
  nativo, configura o estilo da status bar (overlay + ícones escuros) e trata
  o botão "voltar" físico (volta na navegação ou fecha o app).
- `src/app/read/page.tsx`: no leitor, oculta a status bar **enquanto lê**
  (imersivo) e a restaura ao sair (`StatusBar.hide/show` do
  `@capacitor/status-bar`), acompanhando o fullscreen já existente.
- Plugins usados: `@capacitor/app`, `@capacitor/status-bar`. O seletor de PDF
  reutiliza o `<input type="file">` (abre o picker nativo do Android); o resto
  do fluxo (converter, salvar, ler) é idêntico ao site.

### 4. Geração do APK em CI

`.github/workflows/android-apk.yml` (disparo manual na aba Actions):

1. Node 22 + JDK 21 (Temurin) — requisitos do Capacitor 8.
2. `npm ci` e `npm run build:android` (web + sync).
3. `./gradlew assembleDebug` em `android/`.
4. Publica o artefato `bookflow-debug.apk`.

O APK de debug é assinado com a chave de debug (instalável em aparelhos, sem
passar por loja). Para a Play Store é preciso gerar um keystore de release e
configurá-lo como secret do repositório (assinatura + UploadKey).

## Requisitos

- **Node.js ≥ 22** (o Capacitor CLI v8 exige ≥ 22; o build do site aceita 20).
- **JDK 21** (Capacitor 8 compila Java com `source 21`); **JDK 17 não serve**.
- **Android SDK** (somente para build local; na GitHub Actions já vem instalado).
- npm ≥ 10.

## Como gerar o APK

### Pela GitHub Actions (recomendado)

1. **Actions → Build Android APK → Run workflow** (branch `main`).
2. Ao terminar, baixe o artefato `bookflow-debug.apk`.
3. Instale no Android (veja `apk/README.md`).

### Localmente

```bash
npm install
npm run build:android      # build web p/ APK + cap sync
cd android
./gradlew assembleDebug    # APK em android/app/build/outputs/apk/debug/
```

> No Windows, o binário do Node pode estar numa pasta com espaços; o
> `scripts/build-android.mjs` usa `spawnSync` sem `shell` justamente para
> evitar problemas de escaping.

## Solução de problemas

| Sintoma | Causa | Correção |
| --- | --- | --- |
| `The Capacitor CLI requires NodeJS >=22.0.0` | Node 20 no runner/local | Subir para Node ≥ 22 (workflow `setup-node` com 22) |
| `error: invalid source release: 21` | JDK < 21 no build | Usar JDK 21 (`actions/setup-java` com 21) |
| Run antigo "fail" mesmo após fix | "Re-run" refaz o commit antigo | Disparar **Run workflow** novo no branch `main` |

## Limitações atuais (decisões conscientes)

- Ícone/launcher e splash ainda são os padrão do Capacitor (não há asset
  customizado de marca).
- APK de debug: aplicável apenas para instalação direta/distribuição informal;
  para distribuição oficial é necessária a assinatura de release.
- Dados (livros, progresso) ficam por biblioteca do WebView — removem o app,
  removem os dados (igual ao navegador).

## Scripts npm

| Comando | O que faz |
| --- | --- |
| `npm run build` | build web para GitHub Pages (`basePath` ativo) |
| `npm run build:android` | build web p/ Android + `cap sync android` |
| `npm run prepare:pdfjs-worker` | copia apenas o worker do pdf.js para `public/pdfjs` |
| `npm run cap:sync` | copia `out/` atual para o projeto nativo |
| `npx cap add android` | (re)cria o projeto nativo `android/` |
| `npx cap open android` | abre o projeto no Android Studio |