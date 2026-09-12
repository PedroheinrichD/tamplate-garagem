import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ha um package-lock.json solto na pasta do usuario; fixa a raiz aqui.
  turbopack: {
    root: import.meta.dirname,
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  images: {
    remotePatterns: [
      // Placeholder de desenvolvimento das fotos de veículo (seed).
      // Trocar/remover quando as fotos reais forem para o Cloudinary.
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      // Cloudinary (fotos reais, enviadas pelo admin via PhotoManager).
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
