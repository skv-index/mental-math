'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  ChevronRight,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Pencil,
  Zap,
  Trophy,
  Clock,
  Target,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import MascotAvatar from '@/components/MascotAvatar';
import type { MethodStatus } from '@/app/api/methods/route';

/* ── Contextual Brain Coach tips per method ── */
const METHOD_COACH_TIPS: Record<string, string> = {
  make10: 'Look for numbers close to 10 or 100 first to bridge the addends easily.',
  compensation: 'Adjust one number to a friendly benchmark, then compensate at the end!',
  'break-apart': 'Decompose the second number into place values (tens and ones) to add step-by-step.',
  'left-to-right': 'Calculate from left to right — work on the largest place value first for speed!',
  'near-round': 'Round numbers ending in 8 or 9 up to the nearest 10 or 100, then adjust.',
  'double-half': 'Double one factor and halve the other to create an easier multiplication problem.',
  distributive: 'Split complex multipliers into simpler parts: e.g. 14 × 6 = (10 × 6) + (4 × 6).',
  'special-mult': 'Use special shortcuts for 5, 9, 11, 15, and 25 to multiply in seconds.',
  estimation: 'Round each value to 1 significant figure first to get a quick sanity check!',
  'division-factors': 'Break down the divisor into smaller factors to divide in easy steps.',
};

export default function LearningJourneyPage() {
  const [methods, setMethods]   = useState<MethodStatus[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/methods')
      .then((r) => r.json())
      .then((data) => {
        const fetchedMethods = (data.methods ?? []) as MethodStatus[];
        setMethods(fetchedMethods);
        const firstUnlocked = fetchedMethods.find((m) => m.unlocked);
        if (firstUnlocked) setSelected(firstUnlocked.id);
        setLoading(false);
      });
  }, []);

  const selectedMethod = methods.find((m) => m.id === selected);

  // Find the next locked method in curriculum order for "Next Unlock Preview"
  const nextLockedMethod = methods.find((m) => !m.unlocked);
  const prereqForLocked = nextLockedMethod?.prerequisiteId
    ? methods.find((m) => m.id === nextLockedMethod.prerequisiteId)
    : null;

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page header ── */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#7C4DFF]/10 px-3.5 py-1 text-xs font-bold text-[#7C4DFF] mb-2">
          <span>🧠</span>
          <span>Guided Mastery Curriculum</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-800 text-[#111827] sm:text-3xl">
          Learning Journey
        </h1>
        <p className="mt-1 text-sm text-[#6B7280] max-w-2xl leading-relaxed">
          Master all 10 mental math techniques through a guided learning journey. Complete each stage to unlock the next challenge.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-[18px]" />
            ))}
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="skeleton h-48 rounded-[24px]" />
            <div className="skeleton h-32 rounded-[20px]" />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Left Navigation: Journey Navigator ── */}
          <div className="lg:col-span-1 space-y-2.5" aria-label="Curriculum Method Navigator">
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                Curriculum Methods
              </span>
              <span className="text-[11px] font-mono text-[#7C4DFF] font-semibold">
                {methods.filter((m) => m.easyMastered || m.mediumMastered || m.hardMastered).length} / {methods.length} Unlocked
              </span>
            </div>

            {methods.map((method) => {
              const prereqMethod = method.prerequisiteId
                ? methods.find((p) => p.id === method.prerequisiteId)
                : null;
              return (
                <MethodRow
                  key={method.id}
                  method={method}
                  prereqName={prereqMethod?.name ?? null}
                  active={selected === method.id}
                  onClick={() => method.unlocked && setSelected(method.id)}
                />
              );
            })}
          </div>

          {/* ── Right Panel: Current Mission Workspace ── */}
          <div className="lg:col-span-2">
            {selectedMethod ? (
              <WorkspacePanel
                method={selectedMethod}
                nextLocked={nextLockedMethod ?? null}
                prereqForLocked={prereqForLocked ?? null}
              />
            ) : (
              <div
                className="flex h-72 items-center justify-center rounded-[24px] text-sm card p-6 text-center"
                style={{ color: 'var(--text-muted)' }}
              >
                Select an unlocked method from the list to view your Learning Journey workspace.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   1. METHOD LIST ROW (Left Journey Navigator)
   ════════════════════════════════════════════════════════ */
function MethodRow({
  method,
  prereqName,
  active,
  onClick,
}: {
  method: MethodStatus;
  prereqName: string | null;
  active: boolean;
  onClick: () => void;
}) {
  const fullyMastered = method.easyMastered && method.mediumMastered && method.hardMastered;
  const anyMastered   = method.easyMastered || method.mediumMastered || method.hardMastered;
  const tiersCompletedCount = [method.easyMastered, method.mediumMastered, method.hardMastered].filter(Boolean).length;

  const diffColors: Record<string, string> = {
    easy: '#22C55E', medium: '#FBBF24', hard: '#F472B6',
  };

  return (
    <button
      onClick={onClick}
      disabled={!method.unlocked}
      className={`w-full relative flex items-start gap-3 rounded-[18px] p-3.5 text-left transition-all duration-200 ${
        active
          ? 'shadow-md border-[#7C4DFF] bg-[#7C4DFF]/[0.04]'
          : fullyMastered
          ? 'border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.02)] hover:border-[rgba(34,197,94,0.40)]'
          : method.unlocked
          ? 'border-[var(--border)] bg-[var(--surface)] hover:border-[#7C4DFF]/30 hover:shadow-sm'
          : 'border-[rgba(156,163,175,0.15)] bg-[rgba(156,163,175,0.04)] opacity-55 cursor-not-allowed'
      }`}
      style={{
        borderWidth: '1.5px',
      }}
    >
      {/* Active Indicator Bar */}
      {active && (
        <div
          className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-[#7C4DFF]"
          aria-hidden="true"
        />
      )}

      {/* Method Icon / Status Dot */}
      <div
        className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-base"
        style={{
          background: method.unlocked
            ? fullyMastered
              ? 'rgba(34,197,94,0.12)'
              : active
              ? 'rgba(124,77,255,0.12)'
              : `${method.colorHex}18`
            : 'rgba(156,163,175,0.10)',
        }}
        aria-hidden="true"
      >
        {method.unlocked
          ? fullyMastered
            ? '✅'
            : anyMastered
            ? '🔵'
            : '⭕'
          : '🔒'}
      </div>

      {/* Method Meta */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p
            className={`text-sm font-semibold truncate ${
              active ? 'text-[#7C4DFF]' : method.unlocked ? 'text-[#111827]' : 'text-[#9CA3AF]'
            }`}
          >
            {method.name}
          </p>
          {fullyMastered && <Sparkles size={13} style={{ color: '#FBBF24' }} className="shrink-0" />}
          {active && !fullyMastered && <ChevronRight size={14} style={{ color: '#7C4DFF' }} className="shrink-0" />}
        </div>

        {/* Unlock Requirement for locked methods */}
        {!method.unlocked ? (
          <p className="mt-0.5 text-[11px] text-[#9CA3AF] leading-tight">
            {prereqName ? `Complete ${prereqName} to unlock` : 'Complete previous method'}
          </p>
        ) : (
          <p className="mt-0.5 text-[11px] text-[#6B7280] line-clamp-1">
            {method.tagline}
          </p>
        )}

        {/* Compact Tier Pips & Progress */}
        {method.unlocked && (
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-1">
              {(['easy', 'medium', 'hard'] as const).map((d) => {
                const ms = d === 'easy' ? method.easyMastered : d === 'medium' ? method.mediumMastered : method.hardMastered;
                return (
                  <div
                    key={d}
                    className="h-1.5 flex-1 rounded-full transition-all duration-300"
                    style={{ background: ms ? diffColors[d] : 'rgba(124,77,255,0.10)' }}
                  />
                );
              })}
            </div>
            <span className="text-[10px] font-mono text-[#9CA3AF] font-semibold shrink-0">
              {tiersCompletedCount}/3 Tiers
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

/* ════════════════════════════════════════════════════════
   2. CURRENT MISSION WORKSPACE (Right Panel)
   ════════════════════════════════════════════════════════ */
function WorkspacePanel({
  method,
  nextLocked,
  prereqForLocked,
}: {
  method: MethodStatus;
  nextLocked: MethodStatus | null;
  prereqForLocked: MethodStatus | null;
}) {
  const Icon = (Icons[method.icon as keyof typeof Icons] as LucideIcon) ?? Icons.Brain;

  const tiersMastered = [method.easyMastered, method.mediumMastered, method.hardMastered].filter(Boolean).length;
  const progressPct   = Math.round((tiersMastered / 3) * 100);

  /* Current Stage Determination */
  let currentStageName = 'Learn Stage';
  let currentStageId: 'learn' | 'guided' | 'practice' | 'speed' | 'mastery' = 'learn';
  let recommendedDifficulty: 'easy' | 'medium' | 'hard' = 'easy';

  if (method.easyMastered && method.mediumMastered) {
    recommendedDifficulty = 'hard';
    currentStageId = 'practice';
    currentStageName = 'Hard Tier Practice';
  } else if (method.easyMastered) {
    recommendedDifficulty = 'medium';
    currentStageId = 'practice';
    currentStageName = 'Medium Tier Practice';
  } else if (method.easyStats && method.easyStats.questionsAnswered > 0) {
    recommendedDifficulty = 'easy';
    currentStageId = 'guided';
    currentStageName = 'Guided Practice';
  }

  const coachTip = METHOD_COACH_TIPS[method.id] ?? 'Master step-by-step techniques to unlock instant calculations.';

  /* Milestone Difficulty Cards Config */
  const milestoneCards = [
    {
      id: 'easy' as const,
      label: 'Easy',
      color: '#22C55E',
      mastered: method.easyMastered,
      unlocked: true,
      stats: method.easyStats,
      ctaText: method.easyMastered ? 'Continue Practice' : method.easyStats ? 'Resume Easy' : 'Start Easy',
    },
    {
      id: 'medium' as const,
      label: 'Medium',
      color: '#FBBF24',
      mastered: method.mediumMastered,
      unlocked: method.easyMastered,
      stats: method.mediumStats,
      ctaText: method.mediumMastered
        ? 'Continue Practice'
        : method.easyMastered
        ? 'Start Tier'
        : 'Unlock by completing Easy',
    },
    {
      id: 'hard' as const,
      label: 'Hard',
      color: '#F472B6',
      mastered: method.hardMastered,
      unlocked: method.mediumMastered,
      stats: method.hardStats,
      ctaText: method.hardMastered
        ? 'Continue Practice'
        : method.mediumMastered
        ? 'Start Tier'
        : 'Unlock by completing Medium',
    },
  ];

  /* 5-Stage Roadmap Steps */
  const stagesRoadmap = [
    { id: 'learn',    label: 'Learn',     icon: BookOpen,  done: method.easyStats && method.easyStats.questionsAnswered > 0 },
    { id: 'guided',   label: 'Guided',    icon: Lightbulb, done: method.easyStats && method.easyStats.questionsAnswered >= 5 },
    { id: 'practice', label: 'Practice',  icon: Pencil,    done: method.easyMastered },
    { id: 'speed',    label: 'Speed',     icon: Zap,       done: method.mediumMastered },
    { id: 'mastery',  label: 'Mastery',   icon: Trophy,    done: method.hardMastered },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* ── 1. Mission Workspace Header Card ── */}
      <div
        className="card relative overflow-hidden p-6 sm:p-7"
        style={{
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#7C4DFF]/[0.06] blur-2xl" />

        <div className="relative z-10 space-y-5">
          {/* Badge & Meta Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#7C4DFF]/10 px-3 py-1 text-xs font-bold text-[#7C4DFF]">
              <Target size={13} />
              <span>Current Mission</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7280]">
              <span className="flex items-center gap-1">
                <Clock size={12} /> ~3–5 min
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#7C4DFF]">
                <Zap size={12} /> +10 XP / question
              </span>
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl shadow-sm"
              style={{ background: `${method.colorHex}20` }}
            >
              <Icon size={24} strokeWidth={2.2} style={{ color: method.colorHex }} />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-800 text-[#111827]">
                {method.name}
              </h2>
              <p className="mt-0.5 text-sm text-[#6B7280]">{method.tagline}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-semibold text-[#6B7280]">
              <span>Overall Method Progress</span>
              <span className="font-mono text-[#7C4DFF] font-bold">{progressPct}% ({tiersMastered}/3 Tiers)</span>
            </div>
            <div className="progress-track" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${Math.max(4, progressPct)}%` }} />
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <Link
              href={`/practice/session?method=${method.id}&difficulty=${recommendedDifficulty}&stage=${currentStageId}`}
              className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-bold animate-pulse-glow"
              style={{ padding: '0.75rem 1.8rem' }}
            >
              <span>Continue Learning Journey</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Stage Journey (5-Stage Guided Progression) ── */}
      <div className="card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-purple-50">
          <h3 className="font-[family-name:var(--font-display)] text-sm font-800 uppercase tracking-wider text-[#111827]">
            Stage Progression
          </h3>
          <span className="text-xs font-semibold text-[#7C4DFF]">
            Current Stage: {currentStageName}
          </span>
        </div>

        {/* 5-Step Horizontal Flow */}
        <div className="grid grid-cols-5 gap-2 pt-1" role="list">
          {stagesRoadmap.map((st, idx) => {
            const StageIcon = st.icon;
            const isCurrent = currentStageId === st.id;
            return (
              <Link
                key={st.id}
                href={`/practice/session?method=${method.id}&difficulty=${recommendedDifficulty}&stage=${st.id}`}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center transition-all ${
                  isCurrent
                    ? 'bg-[#7C4DFF]/10 ring-2 ring-[#7C4DFF]/40'
                    : st.done
                    ? 'bg-emerald-50/70 hover:bg-emerald-100/50'
                    : 'bg-slate-50 hover:bg-purple-50/50'
                }`}
                title={`Stage ${idx + 1}: ${st.label}`}
              >
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform"
                  style={{
                    background: st.done
                      ? '#22C55E'
                      : isCurrent
                      ? '#7C4DFF'
                      : 'rgba(156,163,175,0.15)',
                    color: st.done || isCurrent ? '#FFFFFF' : '#9CA3AF',
                  }}
                >
                  {st.done ? '✓' : <StageIcon size={13} />}
                </div>
                <span
                  className={`text-[11px] font-semibold truncate w-full ${
                    isCurrent ? 'text-[#7C4DFF]' : st.done ? 'text-[#16A34A]' : 'text-[#6B7280]'
                  }`}
                >
                  {st.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── 3. Brain Coach Compact Card ── */}
      <div
        className="card p-4 flex items-center gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(124,77,255,0.04) 0%, rgba(168,85,247,0.04) 100%)',
          borderColor: 'rgba(124,77,255,0.18)',
        }}
      >
        <MascotAvatar emotion="thinking" size="sm" animate={true} glow={false} className="shrink-0" />
        <div className="space-y-0.5 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7C4DFF]">
            Brain Coach Strategy Tip
          </p>
          <p className="text-xs font-medium text-[#374151] leading-relaxed">
            "{coachTip}"
          </p>
        </div>
      </div>

      {/* ── 4. Difficulty Milestones ── */}
      <div className="space-y-3">
        <h3 className="font-[family-name:var(--font-display)] text-sm font-800 uppercase tracking-wider text-[#111827] px-1">
          Difficulty Milestones
        </h3>

        <div className="grid gap-3 sm:grid-cols-3">
          {milestoneCards.map((m) => (
            <div
              key={m.id}
              className={`rounded-[18px] p-4 flex flex-col justify-between space-y-3 border transition-all ${
                m.unlocked
                  ? 'bg-[var(--surface)] border-[var(--border)] hover:border-[#7C4DFF]/30 hover:shadow-sm'
                  : 'bg-[rgba(156,163,175,0.04)] border-[rgba(156,163,175,0.15)] opacity-60'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ background: `${m.color}15`, color: m.color }}
                >
                  {m.label} Tier
                </span>
                {m.mastered && <CheckCircle2 size={15} style={{ color: m.color }} />}
                {!m.unlocked && <Lock size={13} className="text-[#9CA3AF]" />}
              </div>

              {/* Stats */}
              <div>
                {m.stats ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold text-[#6B7280]">
                      <span>Accuracy</span>
                      <span className="font-mono" style={{ color: m.color }}>{m.stats.accuracy}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full transition-all" style={{ width: `${m.stats.accuracy}%`, background: m.color }} />
                    </div>
                    <p className="text-[10px] text-[#9CA3AF]">
                      {m.stats.questionsAnswered} questions solved
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#9CA3AF]">Not started yet</p>
                )}
              </div>

              {/* CTA Action Button */}
              <div>
                {m.unlocked ? (
                  <Link
                    href={`/practice/${method.id}?difficulty=${m.id}`}
                    className="flex w-full items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold transition-all hover:scale-[1.02]"
                    style={{ background: `${m.color}18`, color: m.color }}
                  >
                    <span>{m.ctaText}</span>
                    <ChevronRight size={13} />
                  </Link>
                ) : (
                  <div className="w-full text-center py-2 text-[11px] font-semibold text-[#9CA3AF] bg-slate-100 rounded-xl">
                    {m.ctaText}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Next Unlock Preview ("What's Next?") ── */}
      {nextLocked && (
        <div
          className="rounded-[20px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border"
          style={{
            background: 'linear-gradient(135deg, rgba(251,191,36,0.06) 0%, rgba(124,77,255,0.04) 100%)',
            borderColor: 'rgba(251,191,36,0.20)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-[#FBBF24]/15 flex items-center justify-center text-base">
              🔒
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#D97706]">
                What's Next?
              </p>
              <h4 className="font-bold text-sm text-[#111827]">{nextLocked.name}</h4>
              <p className="text-xs text-[#6B7280]">
                {prereqForLocked ? `Complete ${prereqForLocked.name} Mastery Challenge to unlock.` : 'Complete previous curriculum challenge to unlock.'}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-[#FBBF24]/15 px-3 py-1 text-xs font-bold text-[#D97706]">
            Locked Milestone
          </span>
        </div>
      )}
    </div>
  );
}