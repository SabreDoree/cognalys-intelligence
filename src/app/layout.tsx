import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { isIndexable, siteConfig } from "@/config/site";
import "./globals.css";

const manrope = localFont({ src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2", variable: "--font-manrope", display: "swap", weight: "200 800" });

export const metadata: Metadata = {
  ...(siteConfig.url ? { metadataBase: new URL(siteConfig.url) } : {}),
  title: { default: `${siteConfig.name} — Automatisation, IA & outils sur mesure`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  robots: { index: isIndexable(), follow: isIndexable() },
  openGraph: { type: "website", locale: "fr_FR", siteName: siteConfig.name, title: `${siteConfig.name} — ${siteConfig.tagline}`, description: siteConfig.description, ...(siteConfig.url ? { url: siteConfig.url, images: [{ url: `${siteConfig.url}/og-image.png`, width: 1200, height: 630, alt: `${siteConfig.name} — ${siteConfig.tagline}` }] } : {}) },
  twitter: { card: "summary_large_image", title: `${siteConfig.name} — ${siteConfig.tagline}`, description: siteConfig.description, ...(siteConfig.url ? { images: [`${siteConfig.url}/og-image.png`] } : {}) },
  icons: { icon: [{ url: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icon.svg`, type: "image/svg+xml" }, { url: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/favicon.ico`, sizes: "32x32" }], apple: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/apple-touch-icon.png` },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" className={manrope.variable}><body><a href="#contenu" className="skip-link">Aller au contenu</a><div id="top" /><Header />{children}<Footer /></body></html>;
}
