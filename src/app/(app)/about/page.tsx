import { Brain, Target, TrendingUp, Users } from 'lucide-react';

export default function AboutPage() {
  const principles = [
    {
      icon: Brain,
      title: 'Built for mental math',
      description: 'No calculators, no scratch paper. Every exercise trains you to solve problems in your head, the way real speed and confidence with numbers is built.',
    },
    {
      icon: TrendingUp,
      title: 'K through College, one path',
      description: 'Start wherever you are. Topics are sequenced from counting to calculus, so you always know what comes next.',
    },
    {
      icon: Target,
      title: 'Practice that adapts',
      description: 'Timed sessions and instant feedback keep you working at the edge of what you can do, not below it.',
    },
    {
      icon: Users,
      title: 'See where you stand',
      description: 'Leaderboards and streaks turn practice into something you want to come back to, not something you have to force.',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#EDF1F7] sm:text-3xl">
          About Mental Math
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8B96AB]">
          Mental Math is a practice platform built on one idea: the ability to calculate quickly in your
          head is a skill, and skills are built through structured, repeated practice — not memorization.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {principles.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="card-surface p-5">
              <div className="mb-3 inline-flex rounded-lg bg-[#5EEAD4]/10 p-2.5 text-[#5EEAD4]">
                <Icon size={20} strokeWidth={2} />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-[#EDF1F7]">
                {p.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#8B96AB]">{p.description}</p>
            </div>
          );
        })}
      </div>

      <div className="card-surface p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#EDF1F7]">
          How it works
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-[#8B96AB]">
          <li>
            <span className="font-semibold text-[#EDF1F7]">1. Pick a level.</span> Browse topics from
            Kindergarten through College under Learn.
          </li>
          <li>
            <span className="font-semibold text-[#EDF1F7]">2. Practice against the clock.</span> Each
            topic has timed questions with instant right/wrong feedback.
          </li>
          <li>
            <span className="font-semibold text-[#EDF1F7]">3. Track your growth.</span> Your accuracy,
            streaks, and badges live on your Profile, and your rank lives on the Leaderboard.
          </li>
        </ol>
      </div>
    </div>
  );
}