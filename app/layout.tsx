import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { PersonJsonLd } from "@/components/seo/person-json-ld";
import "./globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const title = `${site.name} — Senior Software Engineer, Backend & AI Infrastructure`;

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.seoDescription,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.github.href }],
  creator: site.name,
  keywords: [...site.keywords],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title,
    description: site.seoDescription,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: site.seoDescription },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-fg px-3 py-2 text-sm font-medium text-canvas focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <PersonJsonLd />
      </body>
    </html>
  );
}
