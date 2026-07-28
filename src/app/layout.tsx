import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600'] });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['500', '600'] });

export const metadata: Metadata = {
  title: 'Mental Mathematics — Sharpen Your Mind',
  description: 'A gamified mental math learning platform from Kindergarten to College.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`light ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`} data-theme="light">
      <body className="min-h-screen bg-[#F8FAFC] font-[family-name:var(--font-body)] text-[#0F172A] antialiased">
        {children}
      </body>
    </html>
  );
}