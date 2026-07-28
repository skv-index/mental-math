import Link from 'next/link';
import { ArrowRight, Brain, Zap, Trophy, TrendingUp, Flame, Check } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: 'Train your head, not a calculator',
      description: 'Every exercise is built to be solved mentally — the way real speed with numbers is built.',
    },
    {
      icon: TrendingUp,
      title: 'K through College, one path',
      description: 'Structured topics from counting to calculus. Start where you are, always know what\'s next.',
    },
    {
      icon: Zap,
      title: 'Timed, adaptive practice',
      description: 'Sessions keep you working at the edge of your ability with instant feedback on every answer.',
    },
    {
      icon: Trophy,
      title: 'Streaks, scores, leaderboards',
      description: 'Practice that\'s actually worth coming back to — see exactly where you stand.',
    },
  ];

  const levels = ['K', '3', '6', '9', '12', 'College'];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F1521]">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#5EEAD4 1px, transparent 1px), linear-gradient(90deg, #5EEAD4 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#EDF1F7]">
          Mental<span className="text-[#FFB020]">Math</span>
        </span>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#8B96AB] transition-colors hover:text-[#EDF1F7]"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[#FFB020] px-4 py-2 text-sm font-semibold text-[#0F1521] transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-12 text-center sm:px-6 sm:pt-20">
        <div className="mx-auto mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#FFB020]/30 bg-[#FFB020]/10 px-3 py-1.5">
          <Flame size={13} className="text-[#FFB020]" strokeWidth={2.5} />
          <span className="font-[family-name:var(--font-mono)] text-xs font-semibold text-[#FFB020]">
            Join learners building daily streaks
          </span>
        </div>

        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight text-[#EDF1F7] sm:text-5xl md:text-6xl">
          Do the math.
          <br />
          <span className="text-[#5EEAD4]">In your head.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#8B96AB] sm:text-lg">
          A gamified mental math platform for Kindergarten through College. Structured topics,
          timed practice, and real progress tracking — no calculator required.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#FFB020] px-6 py-3 text-sm font-semibold text-[#0F1521] transition-opacity hover:opacity-90 sm:w-auto"
          >
            Start practicing free
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
          <Link
            href="/login"
            className="w-full rounded-lg border border-[#5EEAD4]/10 bg-[#161E2E] px-6 py-3 text-center text-sm font-semibold text-[#EDF1F7] transition-colors hover:bg-[#1C2536] sm:w-auto"
          >
            I have an account
          </Link>
        </div>

        {/* Level chips — signature element echo from Learn page */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {levels.map((lvl) => (
            <span
              key={lvl}
              className="rounded-full bg-[#161E2E] px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs font-medium text-[#8B96AB]"
            >
              {lvl === 'K' || lvl === 'College' ? lvl : `Grade ${lvl}`}
            </span>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="card-surface p-5 sm:p-6">
                <div className="mb-3 inline-flex rounded-lg bg-[#5EEAD4]/10 p-2.5 text-[#5EEAD4]">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[#EDF1F7]">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#8B96AB]">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social proof / stats strip */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="card-surface grid grid-cols-3 divide-x divide-[#5EEAD4]/10 p-6 text-center">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-2xl font-semibold text-[#FFB020] sm:text-3xl">
              14
            </p>
            <p className="mt-1 text-xs text-[#8B96AB]">Grade levels</p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-2xl font-semibold text-[#5EEAD4] sm:text-3xl">
              30+
            </p>
            <p className="mt-1 text-xs text-[#8B96AB]">Topics</p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-2xl font-semibold text-[#FF6B6B] sm:text-3xl">
              100%
            </p>
            <p className="mt-1 text-xs text-[#8B96AB]">Free to start</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#EDF1F7] sm:text-3xl">
          Your first streak starts today
        </h2>
        <div className="mt-5 flex flex-col items-center gap-2 text-sm text-[#8B96AB] sm:flex-row sm:justify-center sm:gap-6">
          <span className="flex items-center gap-1.5">
            <Check size={14} className="text-[#5EEAD4]" /> No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={14} className="text-[#5EEAD4]" /> Takes 2 minutes
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={14} className="text-[#5EEAD4]" /> Cancel anytime
          </span>
        </div>
        <Link
          href="/register"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-[#FFB020] px-6 py-3 text-sm font-semibold text-[#0F1521] transition-opacity hover:opacity-90"
        >
          Create your account
          <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
      </section>

      <footer className="relative z-10 border-t border-[#5EEAD4]/10 py-6 text-center text-xs text-[#8B96AB]">
        © 2026 MentalMath. Built for learners everywhere.
      </footer>
    </div>
  );
}