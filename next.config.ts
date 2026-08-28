import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Leitor-de-Livros",
  assetPrefix: process.env.NODE_ENV === "production" ? "/Leitor-de-Livros/" : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;