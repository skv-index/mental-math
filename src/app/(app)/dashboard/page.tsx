import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Zap,
  Flame,
  Target,
  TrendingUp,
  Play,
  Trophy,
  Star,
} from 'lucide-react';
import MascotAvatar from '@/components/MascotAvatar';
import { fetchCurrentUser, fetchProgressByUser, fetchOverallAccuracy } from '@/lib/getUser';
import { fetchLeaderboardEntry } from '@/lib/getLeaderboard';
import { METHODS, getMethodById } from '@/data/methods';
import { getDailyTip } from '@/data/dailyTips';
import { METHOD_MASTERY_ACCURACY, METHOD_MASTERY_QUESTIONS } from '@/lib/constants';

export default async function DashboardPage() {
  const user = await fetchCurrentUser();
  if (!user) redirect('/login');

  const [progress, accuracy, leaderboardEntry] = await Promise.all([
    fetchProgressByUser(user.id),
    fetchOverallAccuracy(user.id),
    fetchLeaderboardEntry(user.id),
  ]);

  /* ── progress helpers ── */
  const progressMap = new Map(progress.map((p) => [p.topicId, p]));
  const getStats = (methodId: string, diff: string) =>
    progressMap.get(`${methodId}-${diff}`) ?? null;
  const isTierMastered = (methodId: string, diff: string) => {
    const p = getStats(methodId, diff);
    return !!p && p.accuracy >= METHOD_MASTERY_ACCURACY && p.questionsAnswered >= METHOD_MASTERY_QUESTIONS;
  };

  const masteredMethodIds = new Set<string>();
  METHODS.forEach((m) => {
    if (isTierMastered(m.id, 'easy') || isTierMastered(m.id, 'medium') || isTierMastered(m.id, 'hard')) {
      masteredMethodIds.add(m.id);
    }
  });

  const methodStatuses = METHODS.map((method) => {
    const unlocked = method.prerequisiteId === null || masteredMethodIds.has(method.prerequisiteId);
    const easyMastered   = isTierMastered(method.id, 'easy');
    const mediumMastered = isTierMastered(method.id, 'medium');
    const hardMastered   = isTierMastered(method.id, 'hard');
    const totalAnswered  =
      (getStats(method.id, 'easy')?.questionsAnswered   ?? 0) +
      (getStats(method.id, 'medium')?.questionsAnswered ?? 0) +
      (getStats(method.id, 'hard')?.questionsAnswered   ?? 0);

    const fullyMastered    = easyMastered && mediumMastered && hardMastered;
    const partiallyMastered = easyMastered || mediumMastered || hardMastered;

    let status: 'Mastered' | 'In Progress' | 'Not Started' | 'Locked';
    if (!unlocked)           status = 'Locked';
    else if (fullyMastered)  status = 'Mastered';
    else if (totalAnswered > 0 || partiallyMastered) status = 'In Progress';
    else                     status = 'Not Started';

    const tiersMasteredCount = [easyMastered, mediumMastered, hardMastered].filter(Boolean).length;
    const progressPct = Math.round((tiersMasteredCount / 3) * 100);

    let currentDifficulty: 'easy' | 'medium' | 'hard' = 'easy';
    if (easyMastered && mediumMastered) currentDifficulty = 'hard';
    else if (easyMastered)              currentDifficulty = 'medium';

    return { method, unlocked, status, easyMastered, mediumMastered, hardMastered, tiersMasteredCount, progressPct, totalAnswered, currentDifficulty };
  });

  /* ── hero target ── */
  const sortedProgress = [...progress].sort(
    (a, b) => new Date(b.lastPracticedAt).getTime() - new Date(a.lastPracticedAt).getTime()
  );
  const mostRecentSession = sortedProgress[0];

  const parseKey = (key: string) => {
    const parts = key.split('-');
    const diff  = parts[parts.length - 1];
    if (['easy', 'medium', 'hard'].includes(diff))
      return { methodId: parts.slice(0, -1).join('-'), difficulty: diff as 'easy' | 'medium' | 'hard' };
    return { methodId: key, difficulty: 'easy' as const };
  };

  let heroMethod = methodStatuses.find((m) => m.status === 'In Progress') ??
    methodStatuses.find((m) => m.status === 'Not Started') ??
    methodStatuses[0];
  let heroDifficulty: 'easy' | 'medium' | 'hard' = heroMethod.currentDifficulty;
  const heroStage: 'learn' | 'guided' | 'practice' | 'speed' | 'mastery' = 'practice';

  if (mostRecentSession) {
    const parsed = parseKey(mostRecentSession.topicId);
    const found  = methodStatuses.find((m) => m.method.id === parsed.methodId);
    if (found && found.unlocked && found.status !== 'Mastered') {
      heroMethod     = found;
      heroDifficulty = parsed.difficulty;
    }
  }

  const heroStats             = getStats(heroMethod.method.id, heroDifficulty);
  const heroQuestionsAnswered = heroStats?.questionsAnswered ?? 0;
  const heroTargetQuestions   = 10;
  const heroProgressPct       = Math.min(100, Math.round((heroQuestionsAnswered / heroTargetQuestions) * 100));
  const heroQuestionsLeft     = Math.max(0, heroTargetQuestions - heroQuestionsAnswered);

  /* ── last practiced display ── */
  const lastPracticedDate = mostRecentSession ? new Date(mostRecentSession.lastPracticedAt) : null;
  const lastPracticedLabel = lastPracticedDate
    ? (() => {
        const now = new Date();
        const diffMs = now.getTime() - lastPracticedDate.getTime();
        const diffH = Math.floor(diffMs / 3600000);
        if (diffH < 1) return 'Just now';
        if (diffH < 24) return `${diffH}h ago`;
        const diffD = Math.floor(diffH / 24);
        if (diffD === 1) return 'Yesterday';
        return `${diffD} days ago`;
      })()
    : null;

  /* ── quick stats ── */
  const totalQuestionsAll = progress.reduce((s, p) => s + p.questionsAnswered, 0);
  const totalCorrectAll   = progress.reduce((s, p) => s + p.questionsCorrect,  0);
  const dailyGoalTarget   = 10;
  const todayQuestions    = Math.min(dailyGoalTarget, totalQuestionsAll > 0 ? Math.min(totalQuestionsAll, 10) : 0);

  /* ── mastery metrics ── */
  const totalMethodsMastered = methodStatuses.filter((m) => m.easyMastered || m.mediumMastered || m.hardMastered).length;

  /* ── achievements ── */
  const achievements = [
    { id: 'first-step',    title: 'First Step',     desc: 'Solve your first question',        unlocked: totalQuestionsAll >= 1,                    color: '#7C4DFF', emoji: '🌟' },
    { id: 'streak-3',      title: 'Streak Ignited', desc: 'Maintain a 3-day streak',          unlocked: user.currentStreak >= 3,                   color: '#FB923C', emoji: '🔥' },
    { id: 'method-master', title: 'Method Master',  desc: 'Master a difficulty tier',         unlocked: user.methodsMastered >= 1,                 color: '#22C55E', emoji: '🏆' },
    { id: 'accuracy-pro',  title: 'Accuracy Pro',   desc: '80%+ accuracy over 10 questions',  unlocked: accuracy >= 80 && totalQuestionsAll >= 10, color: '#22D3EE', emoji: '🎯' },
    { id: 'century-club',  title: 'Century Club',   desc: 'Earn 100+ total XP',               unlocked: user.totalScore >= 100,                    color: '#FBBF24', emoji: '⚡' },
    { id: 'multi-method',  title: 'Mastery Chest',  desc: 'Unlock 3 methods curriculum-wide', unlocked: totalMethodsMastered >= 3,                 color: '#F472B6', emoji: '📦' },
  ];
  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  /* ── daily tip ── */
  const dailyTip       = getDailyTip();
  const dailyTipMethod = getMethodById(dailyTip.methodId);

  /* ── greeting ── */
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user.name === 'You' ? 'Learner' : (user.name?.split(' ')[0] ?? 'Learner');

  /* ── Brain Coach contextual message ── */
  const nextLockedMethod = methodStatuses.find((m) => m.status === 'Locked');
  const prerequisiteMethod = nextLockedMethod?.method.prerequisiteId
    ? methodStatuses.find((m) => m.method.id === nextLockedMethod.method.prerequisiteId)
    : null;

  let coachMessage = '';
  let coachAction  = '';
  let coachHref    = '';

  if (todayQuestions >= dailyGoalTarget) {
    coachMessage = "Daily goal complete! 🎉 Ready for another challenge?";
    coachAction  = "Keep Going";
    coachHref    = `/practice/session?method=${heroMethod.method.id}&difficulty=${heroDifficulty}&stage=${heroStage}`;
  } else if (user.currentStreak === 0) {
    coachMessage = "Start a practice session today — one session builds the habit.";
    coachAction  = "Start Now";
    coachHref    = `/practice/session?method=${heroMethod.method.id}&difficulty=${heroDifficulty}&stage=${heroStage}`;
  } else if (user.currentStreak === 1) {
    coachMessage = "You practiced yesterday. Come back today to keep your streak alive.";
    coachAction  = "Resume";
    coachHref    = `/practice/session?method=${heroMethod.method.id}&difficulty=${heroDifficulty}&stage=${heroStage}`;
  } else if (heroQuestionsLeft > 0 && heroQuestionsLeft <= 3) {
    coachMessage = `You're only ${heroQuestionsLeft} question${heroQuestionsLeft > 1 ? 's' : ''} away from mastering ${heroMethod.method.name} on ${heroDifficulty}.`;
    coachAction  = "Finish It";
    coachHref    = `/practice/session?method=${heroMethod.method.id}&difficulty=${heroDifficulty}&stage=${heroStage}`;
  } else if (prerequisiteMethod && nextLockedMethod) {
    coachMessage = `Complete ${prerequisiteMethod.method.name} to unlock ${nextLockedMethod.method.name}.`;
    coachAction  = `Practice ${prerequisiteMethod.method.name}`;
    coachHref    = `/practice/${prerequisiteMethod.method.id}`;
  } else if (user.currentStreak >= 3) {
    coachMessage = `🔥 ${user.currentStreak}-day streak — you're building real momentum. Keep it up!`;
    coachAction  = "Continue Practice";
    coachHref    = `/practice/session?method=${heroMethod.method.id}&difficulty=${heroDifficulty}&stage=${heroStage}`;
  } else {
    coachMessage = `Practice ${dailyGoalTarget - todayQuestions} more questions to hit your daily goal.`;
    coachAction  = "Resume Practice";
    coachHref    = `/practice/session?method=${heroMethod.method.id}&difficulty=${heroDifficulty}&stage=${heroStage}`;
  }

  const coachEmotion =
    user.currentStreak >= 3 ? 'celebrating'
    : todayQuestions >= dailyGoalTarget ? 'excited'
    : heroQuestionsLeft <= 3 && heroQuestionsLeft > 0 ? 'confident'
    : 'happy';

  return (
    <div className="space-y-8 pb-10">

      {/* ════════════════════════════════════════
          1. HERO — TODAY'S MISSION
      ════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden rounded-[28px] p-5 sm:p-7"
        style={{
          background: 'linear-gradient(135deg,#7C4DFF 0%,#A855F7 55%,#F472B6 100%)',
          boxShadow: '0 10px 36px rgba(124,77,255,0.32)',
        }}
        aria-label="Today's mission — continue learning"
      >
        <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-3.5">
            {/* Greeting */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-[13px] font-semibold text-white backdrop-blur-sm">
              <span aria-hidden="true">👋</span>
              <span>{greeting}, {firstName}!</span>
            </div>

            {/* Method */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/55">
                Today's Mission
              </p>
              <h1 className="mt-0.5 font-[family-name:var(--font-display)] text-2xl font-800 text-white sm:text-[1.75rem] leading-tight">
                {heroMethod.method.name}
              </h1>
              <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-white/70">
                {heroMethod.method.tagline}
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white capitalize backdrop-blur-sm">
                {heroDifficulty}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <Clock size={11} aria-hidden="true" />
                ~{Math.max(1, heroQuestionsLeft)} min
              </span>
              {heroProgressPct > 0 && (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {heroProgressPct}% this tier
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="max-w-xs space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-white/70">
                <span>Tier Progress</span>
                <span className="font-[family-name:var(--font-mono)]">
                  {heroQuestionsAnswered} / {heroTargetQuestions}
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-white/20"
                role="progressbar"
                aria-valuenow={heroProgressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${heroProgressPct}% of tier progress`}
              >
                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{ width: `${Math.max(3, heroProgressPct)}%` }}
                />
              </div>
            </div>

            {/* CTA + last practiced */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/practice/session?method=${heroMethod.method.id}&difficulty=${heroDifficulty}&stage=${heroStage}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold transition-all hover:scale-105 hover:shadow-lg animate-pulse-glow focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2"
                style={{ color: '#7C4DFF' }}
                aria-label={`Resume practice: ${heroMethod.method.name}, ${heroDifficulty} difficulty`}
              >
                <Play size={14} strokeWidth={2.5} aria-hidden="true" />
                Resume Practice
                <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
              </Link>
              {lastPracticedLabel && (
                <span className="text-[11px] text-white/55">
                  Last practiced: <span className="text-white/80 font-medium">{lastPracticedLabel}</span>
                </span>
              )}
            </div>
          </div>

          {/* Mascot */}
          <div className="hidden lg:flex items-center justify-center" aria-hidden="true">
            <MascotAvatar
              emotion={
                user.currentStreak >= 3 ? 'celebrating'
                : heroQuestionsAnswered > 0 ? 'excited'
                : 'happy'
              }
              size="xl"
              animate={true}
              glow={true}
              speechBubble={heroQuestionsAnswered > 0 ? 'Keep going!' : "Let's go!"}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          2. QUICK STATS
      ════════════════════════════════════════ */}
      <section
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        aria-label="Your learning stats"
      >
        {/* Daily Goal */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Daily Goal</p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgba(124,77,255,0.10)' }} aria-hidden="true">
              <Target size={14} style={{ color: '#7C4DFF' }} />
            </div>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[#111827]" aria-label={`Daily goal: ${todayQuestions} of ${dailyGoalTarget}`}>
              {todayQuestions}<span className="text-base font-semibold text-[#9CA3AF]">/{dailyGoalTarget}</span>
            </p>
            <p className="mt-0.5 text-[11px] text-[#9CA3AF]">
              {todayQuestions >= dailyGoalTarget ? 'Goal hit today 🎉' : `${dailyGoalTarget - todayQuestions} to go`}
            </p>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={Math.round((todayQuestions / dailyGoalTarget) * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${Math.max(2, (todayQuestions / dailyGoalTarget) * 100)}%` }} />
          </div>
        </div>

        {/* Streak */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Streak</p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgba(251,191,36,0.12)' }} aria-hidden="true">
              <Flame size={14} style={{ color: '#D97706' }} />
            </div>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[#111827]" aria-label={`Current streak: ${user.currentStreak} days`}>
              {user.currentStreak}<span className="text-base font-semibold text-[#9CA3AF]"> days</span>
            </p>
            <p className="mt-0.5 text-[11px] text-[#9CA3AF]">
              {user.currentStreak > 0 ? 'Keep the habit!' : 'Start today'}
            </p>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={Math.min(100, (user.currentStreak / 7) * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="progress-fill"
              style={{
                width: `${Math.max(2, Math.min(100, (user.currentStreak / 7) * 100))}%`,
                background: 'linear-gradient(135deg,#FBBF24,#FB923C)',
              }}
            />
          </div>
        </div>

        {/* Accuracy */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Accuracy</p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgba(34,197,94,0.10)' }} aria-hidden="true">
              <CheckCircle2 size={14} style={{ color: '#16A34A' }} />
            </div>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[#111827]" aria-label={`Overall accuracy: ${totalQuestionsAll > 0 ? accuracy + '%' : 'not yet tracked'}`}>
              {totalQuestionsAll > 0 ? `${accuracy}%` : '—'}
            </p>
            <p className="mt-0.5 text-[11px] text-[#9CA3AF]">
              {totalQuestionsAll > 0 ? `${totalCorrectAll}/${totalQuestionsAll} correct` : 'No questions yet'}
            </p>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={accuracy} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="progress-fill"
              style={{
                width: `${Math.max(2, accuracy)}%`,
                background: 'linear-gradient(135deg,#22C55E,#22D3EE)',
              }}
            />
          </div>
        </div>

        {/* XP */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Total XP</p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgba(124,77,255,0.10)' }} aria-hidden="true">
              <Zap size={14} style={{ color: '#7C4DFF' }} />
            </div>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[#111827]" aria-label={`Total XP: ${user.totalScore.toLocaleString()}`}>
              {user.totalScore.toLocaleString()}
            </p>
            <p className="mt-0.5 text-[11px] text-[#9CA3AF]">
              {leaderboardEntry?.rank ? `Rank #${leaderboardEntry.rank}` : 'Earn XP practicing'}
            </p>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={Math.min(100, (user.totalScore / 1000) * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="progress-fill"
              style={{ width: `${Math.max(2, Math.min(100, (user.totalScore / 1000) * 100))}%` }}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          3. BRAIN COACH
      ════════════════════════════════════════ */}
      <section className="card overflow-hidden" aria-label="Brain Coach — personalized guidance">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">
          {/* Mascot */}
          <div className="shrink-0" aria-hidden="true">
            <MascotAvatar
              emotion={coachEmotion}
              size="md"
              animate={true}
              glow={false}
            />
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-1">
              Brain Coach
            </p>
            <p className="text-sm font-semibold text-[#111827] leading-relaxed">
              {coachMessage}
            </p>
          </div>

          {/* Action */}
          <div className="shrink-0">
            <Link
              href={coachHref}
              className="btn-primary"
              style={{ padding: '0.55rem 1.2rem', fontSize: '0.8rem' }}
            >
              {coachAction}
              <ChevronRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4. LEARNING JOURNEY
      ════════════════════════════════════════ */}
      <section className="card p-6 sm:p-8" aria-label="Your learning journey">
        {/* Header */}
        <div className="section-header">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-800 text-[#111827]">
              Learning Journey
            </h2>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              Master methods in order to build complete mental math fluency.
            </p>
          </div>
          <span
            className="rounded-full px-3 py-1.5 text-xs font-bold"
            style={{ background: 'rgba(124,77,255,0.08)', color: '#7C4DFF' }}
            aria-label={`${totalMethodsMastered} of 10 methods mastered`}
          >
            {totalMethodsMastered} / 10 Mastered
          </span>
        </div>

        {/* Method cards */}
        <div className="flex flex-col gap-3">
          {methodStatuses.map(({ method, unlocked, status, tiersMasteredCount, progressPct, currentDifficulty, easyMastered, mediumMastered, hardMastered }) => {
            const isMastered   = status === 'Mastered';
            const isInProgress = status === 'In Progress';
            const isActive     = !isMastered && method.id === heroMethod.method.id;
            const isLocked     = status === 'Locked';

            const prereqName = method.prerequisiteId
              ? methodStatuses.find((m) => m.method.id === method.prerequisiteId)?.method.name
              : null;

            const tierColors: Record<string, string> = {
              easy: '#22C55E', medium: '#FBBF24', hard: '#F472B6',
            };

            return (
              <div
                key={method.id}
                className={`relative rounded-[18px] border transition-all duration-200 ${
                  isActive
                    ? 'shadow-md hover:shadow-lg hover:-translate-y-0.5'
                    : isMastered
                    ? 'hover:shadow-sm hover:-translate-y-0.5'
                    : isLocked
                    ? 'opacity-55'
                    : 'hover:shadow-md hover:border-[var(--border-hover)] hover:-translate-y-0.5'
                }`}
                style={{
                  borderColor: isActive
                    ? 'rgba(124,77,255,0.35)'
                    : isMastered
                    ? 'rgba(34,197,94,0.20)'
                    : isLocked
                    ? 'rgba(156,163,175,0.15)'
                    : 'var(--border)',
                  background: isActive
                    ? 'rgba(124,77,255,0.025)'
                    : isMastered
                    ? 'rgba(34,197,94,0.025)'
                    : 'var(--surface)',
                }}
              >
                {/* Active accent bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                    style={{ background: 'var(--grad-brand)' }}
                    aria-hidden="true"
                  />
                )}

                <div className={`p-4 ${isActive ? 'pl-5' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: icon + info */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Icon */}
                      <div
                        className="mt-0.5 h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-base"
                        style={{
                          background: isLocked
                            ? 'rgba(156,163,175,0.10)'
                            : isMastered
                            ? 'rgba(34,197,94,0.12)'
                            : isActive
                            ? 'rgba(124,77,255,0.12)'
                            : `${method.colorHex}18`,
                        }}
                        aria-hidden="true"
                      >
                        {isLocked ? '🔒' : isMastered ? '✅' : isActive ? '⚡' : isInProgress ? '🔵' : '⭕'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`font-semibold truncate ${isActive ? 'text-[15px]' : 'text-sm'} text-[#111827]`}>
                            {method.name}
                          </h3>
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{
                              background: isMastered
                                ? 'rgba(34,197,94,0.10)'
                                : isActive
                                ? 'rgba(124,77,255,0.10)'
                                : isLocked
                                ? 'rgba(156,163,175,0.10)'
                                : 'rgba(251,191,36,0.10)',
                              color: isMastered
                                ? '#16A34A'
                                : isActive
                                ? '#7C4DFF'
                                : isLocked
                                ? '#9CA3AF'
                                : '#D97706',
                            }}
                          >
                            {isActive ? 'Active' : status}
                          </span>
                        </div>

                        <p className="mt-0.5 text-xs text-[#6B7280] line-clamp-1">{method.tagline}</p>

                        {/* Locked unlock hint */}
                        {isLocked && prereqName && (
                          <p className="mt-1 text-[11px] text-[#9CA3AF]">
                            Unlock after completing <span className="font-semibold text-[#6B7280]">{prereqName}</span>
                          </p>
                        )}

                        {/* Tier pips */}
                        {!isLocked && (
                          <div
                            className="mt-2.5 flex items-center gap-2"
                            role="group"
                            aria-label={`${tiersMasteredCount} of 3 difficulty tiers mastered`}
                          >
                            {(['easy', 'medium', 'hard'] as const).map((d) => {
                              const mastered =
                                d === 'easy' ? easyMastered
                                : d === 'medium' ? mediumMastered
                                : hardMastered;
                              return (
                                <div key={d} className="flex-1 space-y-0.5">
                                  <div
                                    className="h-1.5 w-full rounded-full transition-all duration-500"
                                    style={{ background: mastered ? tierColors[d] : 'rgba(124,77,255,0.08)' }}
                                    aria-label={`${d}: ${mastered ? 'mastered' : 'not yet mastered'}`}
                                  />
                                  <p
                                    className="text-[9px] font-semibold capitalize text-center"
                                    style={{ color: mastered ? tierColors[d] : '#9CA3AF' }}
                                  >
                                    {d}
                                  </p>
                                </div>
                              );
                            })}
                            <span className="text-[10px] font-mono text-[#9CA3AF] shrink-0 ml-1" aria-hidden="true">
                              {tiersMasteredCount}/3
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: action button */}
                    <div className="shrink-0 pt-0.5">
                      {unlocked ? (
                        <Link
                          href={`/practice/${method.id}`}
                          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all hover:scale-105"
                          style={
                            isActive
                              ? { background: 'var(--grad-brand)', color: 'white', boxShadow: '0 4px 12px rgba(124,77,255,0.3)' }
                              : isMastered
                              ? { background: 'rgba(34,197,94,0.08)', color: '#16A34A', border: '1px solid rgba(34,197,94,0.25)' }
                              : { background: 'rgba(124,77,255,0.08)', color: '#7C4DFF' }
                          }
                          aria-label={`${isMastered ? 'Review' : isInProgress ? 'Continue' : 'Start'} ${method.name}`}
                        >
                          {isMastered ? 'Review' : isInProgress ? 'Continue' : 'Start'}
                          <ChevronRight size={13} aria-hidden="true" />
                        </Link>
                      ) : (
                        <div
                          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] text-[#9CA3AF]"
                          style={{ background: 'rgba(156,163,175,0.08)' }}
                          aria-label={`${method.name} is locked`}
                        >
                          <Lock size={11} aria-hidden="true" />
                          Locked
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. RECENT ACTIVITY
      ════════════════════════════════════════ */}
      <section className="card p-6" aria-label="Recent practice activity">
        <div className="section-header">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-800 text-[#111827]">
            Recent Activity
          </h2>
          <span className="text-xs text-[#9CA3AF]">Last session</span>
        </div>

        {mostRecentSession ? (() => {
          const parsed = parseKey(mostRecentSession.topicId);
          const mDef   = getMethodById(parsed.methodId);
          const sessionXP = mostRecentSession.questionsCorrect * 10;
          const timeLabel = (() => {
            const d = new Date(mostRecentSession.lastPracticedAt);
            const now = new Date();
            const diffMs = now.getTime() - d.getTime();
            const diffH  = Math.floor(diffMs / 3600000);
            if (diffH < 1) return 'Just now';
            if (diffH < 24) return `${diffH}h ago`;
            const diffD = Math.floor(diffH / 24);
            if (diffD === 1) return 'Yesterday';
            return `${diffD} days ago`;
          })();

          return (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Timeline info */}
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 h-9 w-9 shrink-0 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(124,77,255,0.10)' }}
                  aria-hidden="true"
                >
                  <TrendingUp size={16} style={{ color: '#7C4DFF' }} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-[#111827]">{mDef?.name ?? parsed.methodId}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold capitalize"
                      style={{ background: 'rgba(251,191,36,0.12)', color: '#D97706' }}
                    >
                      {parsed.difficulty}
                    </span>
                    <span className="text-[11px] text-[#9CA3AF]">{timeLabel}</span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <span className="flex items-center gap-1 text-[12px] text-[#6B7280]">
                      <CheckCircle2 size={12} style={{ color: '#16A34A' }} aria-hidden="true" />
                      <strong className="text-[#111827]">{mostRecentSession.accuracy}%</strong> accuracy
                    </span>
                    <span className="flex items-center gap-1 text-[12px] text-[#6B7280]">
                      <span className="font-[family-name:var(--font-mono)] font-bold text-[#111827]">
                        {mostRecentSession.questionsCorrect}/{mostRecentSession.questionsAnswered}
                      </span> correct
                    </span>
                    <span className="flex items-center gap-1 text-[12px] text-[#6B7280]">
                      <Zap size={11} style={{ color: '#7C4DFF' }} aria-hidden="true" />
                      <strong style={{ color: '#7C4DFF' }}>+{sessionXP} XP</strong>
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/practice/session?method=${parsed.methodId}&difficulty=${parsed.difficulty}&stage=practice`}
                className="btn-secondary shrink-0"
                style={{ padding: '0.5rem 1.2rem', fontSize: '0.78rem' }}
              >
                Practice Again
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          );
        })() : (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <MascotAvatar emotion="thinking" size="md" animate={true} />
            <div>
              <p className="text-sm font-semibold text-[#111827]">No sessions yet!</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Start your first method to record activity here.
              </p>
            </div>
            <Link href="/practice" className="btn-primary text-xs" style={{ padding: '0.55rem 1.3rem' }}>
              Browse Methods
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════
          6. ACHIEVEMENTS
      ════════════════════════════════════════ */}
      <section className="card p-6" aria-label="Your achievements">
        <div className="section-header">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-lg font-800 text-[#111827]">
              Achievements
            </h2>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              {unlockedAchievements.length} of {achievements.length} unlocked
            </p>
          </div>
          <Link
            href="/profile"
            className="text-xs font-semibold transition-colors hover:opacity-70"
            style={{ color: '#7C4DFF' }}
          >
            View All →
          </Link>
        </div>

        <div className="flex flex-wrap gap-2.5" role="list">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              role="listitem"
              className="flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all"
              style={{
                borderColor: ach.unlocked ? `${ach.color}30` : 'rgba(156,163,175,0.18)',
                background: ach.unlocked ? `${ach.color}08` : 'rgba(156,163,175,0.04)',
                opacity: ach.unlocked ? 1 : 0.5,
              }}
              aria-label={`${ach.title}: ${ach.desc} — ${ach.unlocked ? 'Unlocked' : 'Locked'}`}
            >
              <span className="text-base" aria-hidden="true">
                {ach.unlocked ? ach.emoji : '🔒'}
              </span>
              <span
                className="text-[11px] font-bold"
                style={{ color: ach.unlocked ? ach.color : '#9CA3AF' }}
              >
                {ach.title}
              </span>
              {ach.unlocked && (
                <Sparkles size={10} style={{ color: ach.color }} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          7. DAILY MENTAL MATH TIP
      ════════════════════════════════════════ */}
      <section
        className="rounded-[24px] p-5 sm:p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(34,211,238,0.05) 0%, rgba(124,77,255,0.05) 100%)',
          border: '1px solid rgba(34,211,238,0.15)',
        }}
        aria-label="Daily mental math tip"
      >
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div className="space-y-1">
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
              style={{ background: 'rgba(34,211,238,0.10)', color: '#0891B2' }}
            >
              <Zap size={12} strokeWidth={2.5} aria-hidden="true" />
              Today's Mental Math Tip
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-base font-800 text-[#111827]">
              {dailyTip.title}
            </h3>
            <p className="text-[11px] text-[#9CA3AF]">Method: {dailyTip.methodName}</p>
          </div>
          <Link
            href={`/practice/session?method=${dailyTip.methodId}&difficulty=easy&stage=practice`}
            className="btn-primary shrink-0"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.78rem' }}
            aria-label={`Practice ${dailyTip.methodName}`}
          >
            Practice This
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>

        <p className="text-sm leading-relaxed text-[#374151] mb-4">{dailyTip.insight}</p>

        {/* Worked example */}
        <div
          className="rounded-[14px] p-4 space-y-2"
          style={{ background: 'var(--surface)', border: '1px solid rgba(34,211,238,0.15)' }}
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
            <span>Example: {dailyTip.exampleProblem}</span>
            <span className="font-mono" style={{ color: '#7C4DFF' }}>= {dailyTip.exampleAnswer}</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-xs text-[#6B7280]">
            {dailyTip.exampleSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      </section>

    </div>
  );
}