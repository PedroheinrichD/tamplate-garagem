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
      // Trocar/remover quando as fotos reais forem para o Supabase Storage.
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      // Supabase Storage (fotos reais, quando o cliente enviar).
      { protocol: "https", hostname: "vetqzeeefvqvxiekzokw.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
