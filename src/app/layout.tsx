import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

// Trazendo a fonte DM Sans nativamente e otimizada
const dmSans = DM_Sans({ 
  subsets: ["latin"], 
  variable: "--font-dm-sans",
  display: "swap",
});

// Configuração de SEO e compartilhamento de links
export const metadata: Metadata = {
  title: "Survival Protocol | USP Exchange Student Guide",
  description: "Automated protocol and AI concierge to sort out CPF, RNM, housing, and transport with zero headaches. Focused on the USP ecosystem.",
  keywords: ["USP", "Exchange Student", "Intercâmbio", "Brasil", "RNM", "CPF", "Survival Protocol"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // O lang="en" serve como fallback. Como o foco inicial é gringo, faz sentido.
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${dmSans.variable} font-sans antialiased bg-white text-slate-900 min-h-screen flex flex-col`}
      >
        {/* O conteúdo das páginas (como a Landing Page) será injetado aqui */}
        {children}
      </body>
    </html>
  );
}