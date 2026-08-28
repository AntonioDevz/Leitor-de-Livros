# APK Android — BookFlow

Esta pasta contém o APK do BookFlow gerado pela adaptação móvel do projeto
(Capacitor). É o mesmo leitor web (biblioteca local + sistema de leitura), já
empacotado como aplicativo Android para instalação direta.

## Arquivo

| Arquivo | Tamanho | SHA256 |
| --- | --- | --- |
| `bookflow-debug.apk` | ~5,5 MB | `72165D3C29F5CE4CAC1023DE6DA9B39FDA3140C571EE1F74D35012CD8A4DED8B` |

- **Pacote (applicationId):** `com.bookflow.reader`
- **Versão:** 1.0.0 (versionCode 1)
- **Assinatura:** chave de *debug* do Android (instalável, não é para a Play Store)

## Como instalar

1. Transfira `bookflow-debug.apk` para o celular Android (USB, e-mail, Drive,
   etc.).
2. Toque no arquivo e confirme a instalação.
3. Se o sistema pedir, ative **"Instalar de fontes desconhecidas"** para o
   aplicativo usado para abrir o arquivo (navegador / gerenciador de arquivos).
4. Abra o **BookFlow**. Seus livros ficam salvos **apenas no dispositivo**
   (IndexedDB) — nada é enviado para a internet.

> **Por que "fontes desconhecidas"?** O APK desta pasta é assinado com a chave
> de debug e não passa pela loja oficial. É seguro pois foi gerado pelo build
> do próprio projeto, mas essa confirmação é exigida pelo Android.

## Versão e orçamento de funcionalidades

- Conversão de PDF **100% local** (pdf.js embutido no app, funciona off-line).
- Biblioteca, leitura com virar de página (toque/teclado), capítulos,
  marcadores, destaques e notas — todos salvos no aparelho.
- Status bar escondida durante a leitura (modo imersivo) e botão "voltar"
  nativo funcionando.
- Mesmas páginas do tamanho da tela (re-paginação) do site.

## Como reconstruir (desenvolvedores)

O APK não é versionado manualmente — ele sai do workflow **"Build Android
APK"** nas GitHub Actions:

1. Abra **Actions → Build Android APK → Run workflow** (branch `main`).
2. Ao finalizar, baixe o artefato `bookflow-debug.apk`.

Ou, com JDK 21 e Android SDK instalados localmente:

```bash
npm install
npm run build:android   # build web p/ Capacitor + copia p/ android/
cd android
./gradlew assembleDebug # gera app/build/outputs/apk/debug/app-debug.apk
```

Para publicar oficialmente na Play Store será necessário criar um keystore de
**release** e configurá-lo como segredo (secret) no repositório. Veja
`docs/mobile-app.md` para a documentação completa da adaptação.