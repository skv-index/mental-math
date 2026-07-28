import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, BookOpen, Trophy, User, Settings, Flame } from 'lucide-react';
import { fetchCurrentUser } from '@/lib/getUser';

export const metadata: Metadata = {
  title: 'Dashboard — Mental Mathematics',
};

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/practice', label: 'Practice', icon: BookOpen },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await fetchCurrentUser();
  const currentStreak = user?.currentStreak ?? 0;

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#5EEAD4 1px, transparent 1px), linear-gradient(90deg, #5EEAD4 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <header className="sticky top-0 z-50 border-b border-[#5EEAD4]/10 bg-[#0F1521]/90 backdrop-blur-md">
        <div className="flex h-1.5 w-full items-end gap-[3px] overflow-hidden px-2">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className={`w-px bg-[#5EEAD4]/20 ${i % 5 === 0 ? 'h-1.5' : 'h-1'}`} />
          ))}
        </div>

        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[#EDF1F7]">
              Mental<span className="text-[#FFB020]">Math</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#8B96AB] transition-colors hover:bg-[#161E2E] hover:text-[#EDF1F7]"
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 rounded-full border border-[#FFB020]/30 bg-[#FFB020]/10 px-3 py-1.5">
            <Flame size={14} className="text-[#FFB020]" strokeWidth={2.5} />
            <span className="font-[family-name:var(--font-mono)] text-sm font-semibold text-[#FFB020]">
              {currentStreak}
            </span>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[#5EEAD4]/10 bg-[#0F1521]/95 py-2 backdrop-blur-md md:hidden">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-[#8B96AB] transition-colors hover:text-[#EDF1F7]"
          >
            <Icon size={20} strokeWidth={2} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 md:pb-6">{children}</main>
    </>
  );
}