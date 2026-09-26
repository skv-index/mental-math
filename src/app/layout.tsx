import type { Metadata } from 'next';
import { Nunito, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

/* Nunito — friendly rounded display font that pairs perfectly with the mascot */
const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800', '900'],
  fallback: ['system-ui', 'sans-serif'],
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  fallback: ['system-ui', 'sans-serif'],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['500', '600', '700'],
  fallback: ['monospace'],
});

export const metadata: Metadata = {
  title: 'MentalMath — Master Mental Calculation',
  description:
    'A strategy-first mental math platform. Learn 10 proven techniques, drill them to fluency, and track your progress through a gamified mastery curriculum.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`light ${nunito.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-[#F8FAFC] font-[family-name:var(--font-body)] text-[#111827] antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}