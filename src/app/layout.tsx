import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://beneventoveiculos.com.br"),
  title: {
    default: `${site.name} - Seminovos com procedência`,
    template: `%s - ${site.name}`,
  },
  description: `${site.tagline} Mais de ${site.soldCount} veículos vendidos em ${site.yearsActive} anos.`,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: `${site.name} - Seminovos com procedência`,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${inter.variable}`}>
      <body className="flex min-h-[100svh] flex-col bg-bg text-fg">
        {children}
      </body>
    </html>
  );
}
