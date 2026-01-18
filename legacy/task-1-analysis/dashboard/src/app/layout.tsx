import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dutch Startup Ecosystem Analysis",
    template: "%s | Startup Ecosystem Dashboard"
  },
  description: "Data-driven insights into the Dutch startup ecosystem. Analysis of funding patterns, company outcomes, and policy recommendations for the Ministry of Economic Affairs.",
  keywords: "startup ecosystem, venture capital, funding analysis, Dutch tech, policy analysis",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Startup Ecosystem Dashboard",
    title: "Dutch Startup Ecosystem Analysis",
    description: "Data-driven insights into the Dutch startup ecosystem.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${space.variable} ${inter.variable} min-h-screen flex flex-col`}>
        <nav className="border-b border-white/5 bg-bg-primary/95 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <span className="font-heading font-bold text-xl text-white group-hover:text-accent-orange transition-colors">
                  Startup <span className="text-accent-orange">Ecosystem</span>
                </span>
              </Link>
              <div className="hidden md:flex gap-8">
                <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  BRIEFING
                </Link>
                <Link href="/explore" className="text-sm font-medium text-gray-400 hover:text-accent-red transition-colors">
                  EXPLORE
                </Link>
                <Link href="/definitions" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  DEFINITIONS
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </main>
        <footer className="border-t border-white/5 mt-auto bg-bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-xs uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Techleap - Dutch Startup Ecosystem Analysis
          </div>
        </footer>
      </body>
    </html>
  );
}
