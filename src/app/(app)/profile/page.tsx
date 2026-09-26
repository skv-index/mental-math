import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Zap } from 'lucide-react';
import { fetchCurrentUser, fetchProgressByUser, fetchOverallAccuracy } from '@/lib/getUser';
import { getMethodLabel } from '@/data/methods';

const BADGES = [
  { id: 'streak-5',    emoji: '🔥', label: '5-Day Streak',       pred: (u: User, _a: number, total: number) => u.currentStreak   >= 5,  color: '#FB923C' },
  { id: 'accuracy-80', emoji: '🎯', label: '80% Accuracy',        pred: (u: User,  a: number, _t: number)   => a >= 80,                   color: '#22D3EE' },
  { id: 'q-100',       emoji: '⚡', label: '100 Questions',       pred: (u: User, _a: number, total: number) => total >= 100,             color: '#FBBF24' },
  { id: 'methods-3',   emoji: '📚', label: '3 Methods Started',   pred: (_u: User, _a: number, _t: number, pLen: number) => pLen >= 3,   color: '#7C4DFF' },
  { id: 'streak-10',   emoji: '🏅', label: '10-Day Streak',       pred: (u: User) => u.currentStreak >= 10,                              color: '#F472B6' },
  { id: 'mastered-1',  emoji: '🏆', label: 'First Mastery',       pred: (u: User) => u.methodsMastered >= 1,                            color: '#22C55E' },
  { id: 'mastered-5',  emoji: '✨', label: '5 Methods Mastered',  pred: (u: User) => u.methodsMastered >= 5,                            color: '#A855F7' },
] as const;

type User = NonNullable<Awaited<ReturnType<typeof fetchCurrentUser>>>;

export default async function ProfilePage() {
  const user = await fetchCurrentUser();
  if (!user) redirect('/login');

  const progress = await fetchProgressByUser(user.id);
  const accuracy = await fetchOverallAccuracy(user.id);

  const totalQuestions   = progress.reduce((s, p) => s + p.questionsAnswered, 0);
  const totalCorrect     = progress.reduce((s, p) => s + p.questionsCorrect,  0);

  const joinDate = new Date(user.joinedAt).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric',
  });

  const badges = BADGES.map((b) => ({
    ...b,
    earned: b.pred(user, accuracy, totalQuestions, progress.length),
  }));

  const statCards = [
    { label: 'Current Streak', value: `${user.currentStreak} days`,         color: '#FB923C', grad: 'linear-gradient(135deg,#FBBF24,#FB923C)', emoji: '🔥' },
    { label: 'Accuracy',       value: `${totalQuestions > 0 ? accuracy : 0}%`, color: '#22D3EE', grad: 'linear-gradient(135deg,#22D3EE,#7C4DFF)', emoji: '🎯' },
    { label: 'Total XP',       value: user.totalScore.toLocaleString(),      color: '#7C4DFF', grad: 'linear-gradient(135deg,#7C4DFF,#A855F7)', emoji: '⚡' },
    { label: 'Methods Mastered', value: String(user.methodsMastered),        color: '#22C55E', grad: 'linear-gradient(135deg,#22C55E,#22D3EE)', emoji: '🏆' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Profile Hero ── */}
      <div
        className="relative overflow-hidden rounded-[28px] p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg,#7C4DFF 0%,#A855F7 60%,#F472B6 100%)',
          boxShadow: '0 12px 40px rgba(124,77,255,0.30)',
        }}
      >
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-xl" />

        <div className="relative z-10 flex items-center gap-5">
          {/* Avatar */}
          <div
            className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full overflow-hidden ring-4 ring-white/30 shadow-lg bg-white/20"
          >
            <Image
              src="/mascot-happy.png"
              alt={user.name}
              fill
              sizes="80px"
              className="object-contain p-1"
              priority
            />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-800 text-white">
              {user.name}
            </h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/70">
              <Calendar size={13} /> Joined {joinDate}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                🔥 {user.currentStreak} day streak
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                🏆 {user.methodsMastered} mastered
              </span>
            </div>
          </div>

          {/* Mascot */}
          <div className="hidden sm:block relative h-24 w-24 shrink-0">
            <Image
              src="/mascot-celebrating.png"
              alt="Celebrating mascot"
              fill
              sizes="96px"
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((sc) => (
          <div
            key={sc.label}
            className="relative overflow-hidden rounded-[20px] p-4 text-white"
            style={{
              background: sc.grad,
              boxShadow: `0 6px 20px ${sc.color}40`,
            }}
          >
            <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10 blur-lg" />
            <div className="relative z-10">
              <span className="text-xl">{sc.emoji}</span>
              <p className="mt-1 font-[family-name:var(--font-mono)] text-2xl font-bold">{sc.value}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-white/70">{sc.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Badges ── */}
      <div className="card p-6">
        <div className="section-header">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-800 text-[#111827]">
            Badges
          </h2>
          <span className="text-xs text-[#9CA3AF]">
            {badges.filter((b) => b.earned).length} / {badges.length} earned
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 sm:grid-cols-7">
          {badges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center gap-1.5">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-all"
                style={{
                  background: badge.earned ? `${badge.color}15` : 'rgba(156,163,175,0.08)',
                  border: `1.5px solid ${badge.earned ? `${badge.color}30` : 'rgba(156,163,175,0.15)'}`,
                  opacity: badge.earned ? 1 : 0.4,
                  transform: badge.earned ? 'scale(1)' : 'scale(0.9)',
                }}
              >
                {badge.earned ? badge.emoji : '🔒'}
              </div>
              <p
                className="text-center text-[10px] font-semibold leading-tight max-w-[60px]"
                style={{ color: badge.earned ? '#111827' : '#9CA3AF' }}
              >
                {badge.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Progress by Method ── */}
      <div className="card p-6">
        <div className="section-header">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-800 text-[#111827]">
            Method Progress
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#6B7280' }}>
            <Zap size={13} style={{ color: '#FBBF24' }} />
            {totalCorrect}/{totalQuestions} total correct
          </div>
        </div>

        {progress.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Image src="/mascot-thinking.png" alt="Thinking mascot" width={80} height={80} className="object-contain" />
            <p className="text-sm text-[#6B7280]">No practice history yet.</p>
            <p className="text-xs text-[#9CA3AF]">Start a session to see your progress here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {progress
              .sort((a, b) => b.accuracy - a.accuracy)
              .map((p) => {
                const barColor =
                  p.accuracy >= 80 ? '#22C55E'
                  : p.accuracy >= 60 ? '#FBBF24'
                  : '#F472B6';
                const mastered = p.accuracy >= 80 && p.questionsAnswered >= 10;
                return (
                  <div key={p.topicId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#111827]">
                        {getMethodLabel(p.topicId)} {mastered && '✅'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-[family-name:var(--font-mono)] text-xs font-semibold" style={{ color: barColor }}>
                          {p.accuracy}%
                        </span>
                        <span className="text-xs text-[#9CA3AF]">
                          {p.questionsCorrect}/{p.questionsAnswered}
                        </span>
                      </div>
                    </div>
                    <div className="progress-track">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${p.accuracy}%`, background: barColor }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}