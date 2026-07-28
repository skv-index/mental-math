import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Flame,
  Target,
  Star,
  Trophy,
  ArrowRight,
  Brain,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Medal,
  Zap,
} from 'lucide-react';
import { fetchCurrentUser, fetchProgressByUser, fetchOverallAccuracy } from '@/lib/getUser';
import { fetchTopicById, fetchTopicsByIds } from '@/lib/getTopics';
import { fetchLeaderboardEntry } from '@/lib/getLeaderboard';

export default async function HomePage() {
  const user = await fetchCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const [progress, accuracy, leaderboardEntry] = await Promise.all([
    fetchProgressByUser(user.id),
    fetchOverallAccuracy(user.id),
    fetchLeaderboardEntry(user.id),
  ]);

  // Only fetch topics the user has actually practiced (avoids full table scan)
  const practicedTopicIds = progress.map((p) => p.topicId);
  const allPracticedTopics = await fetchTopicsByIds(practicedTopicIds);

  // Find most recently practiced topic for "continue learning"
  const sortedProgress = [...progress].sort(
    (a, b) => new Date(b.lastPracticedAt).getTime() - new Date(a.lastPracticedAt).getTime()
  );
  const lastPracticed = sortedProgress[0];
  const continueTopic = lastPracticed ? await fetchTopicById(lastPracticed.topicId) : undefined;

  // Derive recent activity (last 3 completed sessions)
  const recentActivities = sortedProgress.slice(0, 3);

  // Default fallback topic if none practiced yet
  const activeTopicName = continueTopic?.name ?? 'Addition & Subtraction';
  const activeTopicProgress = continueTopic?.progress ?? 60;
  const activeTopicDifficulty = continueTopic?.difficulty ?? 'medium';
  const activeTopicId = continueTopic?.id ?? 'k-addition';

  // Weakest topic: topic with most attempts but lowest accuracy
  const weakestProgress = progress
    .filter((p) => p.questionsAnswered >= 5)
    .sort((a, b) => a.accuracy - b.accuracy)[0];
  const weakestTopic = weakestProgress
    ? allPracticedTopics.get(weakestProgress.topicId)
    : undefined;

  // Rank info
  const userRank = leaderboardEntry?.rank ?? null;
  const totalScore = user.totalScore;

  // Daily goal: count questions answered today (approximate via recentActivities)
  const todayAnswered = Math.min(
    progress.reduce((sum, p) => sum + (p.questionsAnswered > 0 ? 1 : 0), 0),
    10
  );
  const dailyGoal = 10;
  const dailyPct = Math.min((todayAnswered / dailyGoal) * 100, 100);

  // Dynamic greeting based on server-side time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning 🌅' : hour < 17 ? 'Good Afternoon ☀️' : 'Good Evening 👋';

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12 font-sans text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#22D3EE]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-[#FBBF24]/10 blur-3xl" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-12 lg:items-center">
          <div className="space-y-3 lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-3.5 py-1 text-xs font-semibold text-[#0E7A90]">
              <span>{greeting}</span>
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back, <span className="text-[#B45309]">{user.name === 'You' ? 'Learner' : user.name}</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Sharpen your mind with daily bite-sized mental math challenges. Keep your momentum high!
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 backdrop-blur-md lg:col-span-5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="font-semibold text-slate-700">Today&apos;s Goal</span>
              <span className="font-mono font-bold text-[#B45309]">{todayAnswered} / {dailyGoal} Questions</span>
            </div>

            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FBBF24] to-[#22D3EE] transition-all duration-500"
                style={{ width: `${dailyPct}%` }}
              />
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-slate-500">Target: {dailyGoal} daily questions</span>
              <Link
                href={`/practice/session?topic=${activeTopicId}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#FFB020] px-4 py-2 text-xs font-bold text-[#0F1521] transition-all duration-200 hover:bg-[#f59e0b] hover:shadow-lg hover:shadow-[#FFB020]/20"
              >
                Continue Practice
                <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTICS */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Streak */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#FBBF24]/40">
          <div className="flex items-center gap-2 text-[#B45309]">
            <Flame size={18} strokeWidth={2.5} />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Streak</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-slate-900 sm:text-3xl">
            {user.currentStreak} <span className="text-xs font-normal text-slate-500">Days</span>
          </p>
        </div>

        {/* Accuracy */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#22D3EE]/40">
          <div className="flex items-center gap-2 text-[#0E7A90]">
            <Target size={18} strokeWidth={2.5} />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Accuracy</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-slate-900 sm:text-3xl">{accuracy}%</p>
        </div>

        {/* XP */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#FBBF24]/40">
          <div className="flex items-center gap-2 text-[#B45309]">
            <Star size={18} strokeWidth={2.5} />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">XP</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-slate-900 sm:text-3xl">
            {user.totalScore.toLocaleString()}
          </p>
        </div>

        {/* Level */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#22D3EE]/40">
          <div className="flex items-center gap-2 text-[#0E7A90]">
            <Trophy size={18} strokeWidth={2.5} />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Level</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-slate-900 sm:text-3xl">{user.currentLevel}</p>
        </div>
      </section>

      {/* 3. CONTINUE LEARNING */}
      <section className="relative overflow-hidden rounded-2xl border border-[#22D3EE]/20 bg-gradient-to-br from-white via-slate-50 to-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4 lg:max-w-xl">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#22D3EE]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0E7A90]">
                Current Topic
              </span>
              <span className="rounded-full bg-[#FBBF24]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#B45309]">
                {activeTopicDifficulty} Mode
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{activeTopicName}</h2>
            <p className="text-sm text-slate-600">
              Master speed calculation techniques and pattern recognition for higher accuracy scores.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Progress</span>
                <span className="font-mono text-[#0E7A90]">{activeTopicProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#22D3EE] transition-all duration-500"
                  style={{ width: `${activeTopicProgress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#0E7A90]" /> ~5 mins remaining
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#B45309]" /> 10 Questions Batch
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              href={`/practice/session?topic=${activeTopicId}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#22D3EE] px-6 py-3.5 text-sm font-bold text-[#0B1220] transition-all duration-200 hover:bg-[#06b6d4] hover:shadow-lg hover:shadow-[#22D3EE]/20 lg:w-auto"
            >
              Resume Practice
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. USEFUL WIDGETS: Weakest Topic · Rank · Streak Insight */}
      <section className="grid gap-4 sm:grid-cols-3">

        {/* Widget 1: Focus Area (Weakest Topic) */}
        <div className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
              <AlertTriangle size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Needs Work</p>
              <p className="text-sm font-bold text-slate-800">Focus Area</p>
            </div>
          </div>

          {weakestTopic ? (
            <>
              <div>
                <p className="text-base font-bold text-slate-900">{weakestTopic.name}</p>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{weakestTopic.description}</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Accuracy</span>
                  <span className="font-mono font-bold text-orange-500">{weakestProgress!.accuracy}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-orange-100">
                  <div
                    className="h-full rounded-full bg-orange-400 transition-all"
                    style={{ width: `${weakestProgress!.accuracy}%` }}
                  />
                </div>
              </div>
              <Link
                href={`/practice/session?topic=${weakestTopic.id}`}
                className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-orange-600 hover:shadow-md"
              >
                <Brain size={14} strokeWidth={2.5} />
                Practice Now
              </Link>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-4 text-center">
              <TrendingUp size={28} className="text-slate-300" />
              <p className="text-xs text-slate-500">Complete 5+ questions in any topic to see your weak areas.</p>
              <Link
                href="/practice"
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-orange-500 hover:underline"
              >
                Browse Topics <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>

        {/* Widget 2: Leaderboard Rank */}
        <div className="flex flex-col gap-4 rounded-2xl border border-yellow-100 bg-gradient-to-br from-yellow-50 to-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-500">
              <Medal size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Global Standing</p>
              <p className="text-sm font-bold text-slate-800">Your Rank</p>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <p className="font-mono text-5xl font-black text-yellow-500">
              {userRank != null ? `#${userRank}` : '—'}
            </p>
            <div className="mb-1 space-y-0.5">
              <p className="text-xs font-semibold text-slate-700">
                {totalScore.toLocaleString()} XP
              </p>
              <p className="text-[11px] text-slate-400">total score</p>
            </div>
          </div>

          {userRank == null && (
            <p className="text-xs text-slate-500">
              Answer questions to earn XP and appear on the leaderboard.
            </p>
          )}

          <div className="mt-auto flex items-center gap-2">
            <Zap size={13} className="text-yellow-400" />
            <p className="text-xs text-slate-500">
              {userRank != null
                ? `Top ${userRank <= 3 ? '🏆 podium' : userRank <= 10 ? 'top 10' : 'ranked'} — keep going!`
                : 'Start practicing to get ranked'}
            </p>
          </div>

          <Link
            href="/leaderboard"
            className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-yellow-200 bg-white px-4 py-2.5 text-xs font-bold text-yellow-600 transition-all hover:bg-yellow-50 hover:shadow-md"
          >
            <Trophy size={14} strokeWidth={2.5} />
            View Leaderboard
          </Link>
        </div>

        {/* Widget 3: Streak & Consistency */}
        <div className="flex flex-col gap-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-500">
              <Flame size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Consistency</p>
              <p className="text-sm font-bold text-slate-800">Daily Streak</p>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <p className="font-mono text-5xl font-black text-cyan-500">{user.currentStreak}</p>
            <div className="mb-1 space-y-0.5">
              <p className="text-xs font-semibold text-slate-700">Days</p>
              <p className="text-[11px] text-slate-400">in a row</p>
            </div>
          </div>

          {/* 7-day visual */}
          <div className="flex gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => {
              const filled = i < Math.min(user.currentStreak, 7);
              return (
                <div
                  key={i}
                  className={`h-7 flex-1 rounded-md transition-all ${
                    filled
                      ? 'bg-cyan-400 shadow-sm shadow-cyan-200'
                      : 'bg-slate-100'
                  }`}
                />
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400">Last 7 days</p>

          <Link
            href={`/practice/session?topic=${activeTopicId}`}
            className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-cyan-600 hover:shadow-md"
          >
            <Zap size={14} strokeWidth={2.5} />
            Keep Streak Alive
          </Link>
        </div>
      </section>

      {/* 5. BOTTOM SECTION (Recent Activity & Achievements) */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
            <span className="text-xs font-semibold text-[#0E7A90]">Last 3 Sessions</span>
          </div>

          <div className="mt-4 space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div
                  key={act.topicId}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-200"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-700 capitalize">
                      {act.topicId.replace('-', ' ')}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(act.lastPracticedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-[#0E7A90]">{act.accuracy}%</span>
                    <p className="text-xs text-slate-500">{act.questionsCorrect} correct</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                No recent activity recorded yet. Start practicing!
              </div>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="text-base font-bold text-slate-900">Progress Overview</h3>
            <Link
              href="/practice"
              className="text-xs font-semibold text-[#B45309] transition-colors hover:underline"
            >
              Browse Topics →
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {progress.length > 0 ? (
              progress.slice(0, 4).map((p) => (
                <div key={p.topicId} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-700 capitalize">
                      {p.topicId.replace(/-/g, ' ')}
                    </p>
                    <span className="font-mono text-xs font-bold text-slate-500">{p.accuracy}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        p.accuracy >= 80
                          ? 'bg-emerald-400'
                          : p.accuracy >= 50
                          ? 'bg-[#FBBF24]'
                          : 'bg-red-400'
                      }`}
                      style={{ width: `${p.accuracy}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <TrendingUp size={32} className="text-slate-200" />
                <p className="text-xs text-slate-500">No progress yet — complete your first session to see stats here.</p>
                <Link
                  href="/practice"
                  className="inline-flex items-center gap-1 rounded-lg bg-[#22D3EE]/10 px-4 py-2 text-xs font-semibold text-[#0E7A90] hover:bg-[#22D3EE]/20"
                >
                  Start Practicing <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}