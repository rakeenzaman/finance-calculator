import type { Metadata } from "next";
import { Geist, Geist_Mono, Google_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";
  
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"),
  title: {
    default: "Finance Calculator Suite",
    template: "%s | Finance Calculator",
  },
  description:
    "Free finance calculators for Roth IRA, Traditional IRA, HYSA, 401(k), mortgage, and auto loans.",
  keywords: [
    "finance calculators",
    "401k calculator",
    "mortgage calculator",
    "auto loan calculator",
    "HYSA calculator",
    "Traditional IRA calculator",
    "retirement calculator",
    "compound interest calculator",
    "IRA growth calculator"
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Finance Calculator Suite",
    description:
      "Use free calculators for retirement, savings, and loans with clear projections.",
    type: "website",
    siteName: "Finance Calculator",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Calculator Suite",
    description:
      "Use free calculators for retirement, savings, and loans with clear projections.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${googleSans.variable} app-shell`}>
        <div className="app-content">{children}</div>
        <footer className="site-disclaimer" role="contentinfo">
          <p>Disclaimer: This calculator provides estimates only and is not financial, tax, or legal advice.</p>
          <nav className="site-footer-links" aria-label="Footer links">
            <Link href="/about">About</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}
