import type { NextConfig } from "next";

// CAPACITOR_BUILD=1 produces the static site without the GitHub Pages basePath,
// so the Capacitor WebView (served at https://localhost) resolves assets at root.
const forApk = process.env.CAPACITOR_BUILD === "1";

const nextConfig: NextConfig = {
  output: "export",
  basePath: forApk ? "" : "/Leitor-de-Livros",
  assetPrefix:
    !forApk && process.env.NODE_ENV === "production" ? "/Leitor-de-Livros/" : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;