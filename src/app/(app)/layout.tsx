import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Home, BookOpen, Trophy, User, Settings, Zap } from 'lucide-react';
import { fetchCurrentUser } from '@/lib/getUser';

export const metadata: Metadata = {
  title: 'Dashboard — MentalMath',
};

const navItems = [
  { href: '/dashboard',    label: 'Home',             icon: Home },
  { href: '/practice',     label: 'Learning Journey', icon: BookOpen },
  { href: '/leaderboard',  label: 'Leaderboard',      icon: Trophy },
  { href: '/profile',      label: 'Profile',          icon: User },
  { href: '/settings',     label: 'Settings',         icon: Settings },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await fetchCurrentUser();
  const currentStreak = user?.currentStreak ?? 0;
  const totalScore    = user?.totalScore   ?? 0;

  return (
    <>
      {/* ── Decorative background blobs ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#7C4DFF]/[0.04] blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full bg-[#F472B6]/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 h-[400px] w-[400px] rounded-full bg-[#22D3EE]/[0.04] blur-3xl" />
      </div>

      {/* ── Desktop Header ── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(124,77,255,0.10)',
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="relative h-8 w-8">
              <Image
                src="/mascot-happy.png"
                alt="MentalMath mascot"
                fill
                sizes="32px"
                className="object-contain drop-shadow-sm"
              />
            </div>
            <span
              className="font-[family-name:var(--font-display)] text-lg font-900 tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Mental<span style={{ color: 'var(--purple)' }}>Math</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all text-[var(--text-secondary)] hover:bg-[#7C4DFF]/[0.08] hover:text-[#7C4DFF]"
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right pill cluster */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Streak badge */}
            {currentStreak > 0 && (
              <div
                className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, #FBBF24 0%, #FB923C 100%)',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(251,191,36,0.35)',
                }}
              >
                🔥 {currentStreak}
              </div>
            )}

            {/* XP badge */}
            <div
              className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
              style={{
                background: 'rgba(124,77,255,0.10)',
                color: 'var(--purple)',
                border: '1px solid rgba(124,77,255,0.20)',
              }}
            >
              <Zap size={13} strokeWidth={2.5} />
              {totalScore.toLocaleString()} XP
            </div>

            {/* Avatar */}
            {user && (
              <Link
                href="/profile"
                className="relative flex h-9 w-9 items-center justify-center rounded-full overflow-hidden shrink-0 transition-transform hover:scale-105 ring-2 ring-[#7C4DFF]/30"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,77,255,0.15), rgba(244,114,182,0.15))',
                  boxShadow: '0 2px 8px rgba(124,77,255,0.25)',
                }}
                title={user.name}
              >
                <Image
                  src="/mascot-happy.png"
                  alt={user.name ?? 'Profile'}
                  fill
                  sizes="36px"
                  className="object-contain p-0.5"
                />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 md:pb-8">
        {children}
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 md:hidden"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(124,77,255,0.10)',
          boxShadow: '0 -4px 20px rgba(124,77,255,0.08)',
        }}
      >
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
            style={{ color: 'var(--text-muted)' }}
          >
            <Icon size={20} strokeWidth={2} />
            <span className="text-[10px] font-semibold">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}