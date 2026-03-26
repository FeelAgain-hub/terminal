import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Feel Again — Strategic Briefing",
  description: "Institutional Fintech terminal for mental health and strategic recovery initiatives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} style={{ scrollbarGutter: 'stable' }} suppressHydrationWarning>
      <body className="bg-[#050A15] text-slate-200 font-sans min-h-screen selection:bg-emerald-500/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
