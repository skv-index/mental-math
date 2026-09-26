'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  Pencil,
  Zap,
  Trophy,
  Lock,
  ChevronRight,
  Target,
  ChevronLeft,
  Clock,
  Star,
  Play,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getMethodById } from '@/data/methods';
import type { MethodStatus } from '@/app/api/methods/route';
import { Difficulty } from '@/types';
import type { WorkedExample } from '@/data/methods';

export default function MethodDetailPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <MethodDetail />
    </Suspense>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      <div className="h-56 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200" />
      <div className="h-32 rounded-2xl bg-slate-100" />
      <div className="h-48 rounded-2xl bg-slate-100" />
    </div>
  );
}

/* ─── Stage config ─────────────────────────────────────────── */
type StageConfig = {
  id: 'learn' | 'guided' | 'practice' | 'speed' | 'mastery';
  label: string;
  description: string;
  icon: LucideIcon;
  accentColor: string;
  gradFrom: string;
  gradTo: string;
  unlockRequirement: string | null;
  xp: number;
  timeMin: number;
};

const STAGES: StageConfig[] = [
  {
    id: 'learn',
    label: 'Learn',
    description: 'Master the concept with worked examples & visual explanations.',
    icon: BookOpen,
    accentColor: '#7C4DFF',
    gradFrom: '#7C4DFF',
    gradTo: '#A855F7',
    unlockRequirement: null,
    xp: 20,
    timeMin: 3,
  },
  {
    id: 'guided',
    label: 'Guided',
    description: 'Solve questions with strategic hints & step decomposition.',
    icon: Lightbulb,
    accentColor: '#3B82F6',
    gradFrom: '#3B82F6',
    gradTo: '#6366F1',
    unlockRequirement: 'Complete Learn',
    xp: 40,
    timeMin: 5,
  },
  {
    id: 'practice',
    label: 'Practice',
    description: 'Independent practice — no hints, standard time limit.',
    icon: Pencil,
    accentColor: '#F59E0B',
    gradFrom: '#F59E0B',
    gradTo: '#FB923C',
    unlockRequirement: 'Complete Guided',
    xp: 60,
    timeMin: 6,
  },
  {
    id: 'speed',
    label: 'Speed Drill',
    description: '15 questions at 70% time limit. Build instant recall.',
    icon: Zap,
    accentColor: '#EF4444',
    gradFrom: '#EF4444',
    gradTo: '#F97316',
    unlockRequirement: 'Complete Practice',
    xp: 80,
    timeMin: 5,
  },
  {
    id: 'mastery',
    label: 'Mastery',
    description: 'Score 80%+ on 10 questions to unlock the next method.',
    icon: Trophy,
    accentColor: '#10B981',
    gradFrom: '#10B981',
    gradTo: '#22D3EE',
    unlockRequirement: 'Complete Speed Drill',
    xp: 150,
    timeMin: 8,
  },
];

/* ─── Floating particle ─────────────────────────────────────── */
type Particle = { id: number; value: string; x: number; y: number; size: number; delay: number; duration: number };

function HeroParticles({ color }: { color: string }) {
  const numbers = ['7', '3', '10', '47', '50', '8', '100', '6', '385', '5'];
  const particles: Particle[] = numbers.map((v, i) => ({
    id: i,
    value: v,
    x: 5 + (i * 9.5) % 90,
    y: 10 + (i * 17) % 75,
    size: 0.65 + (i % 3) * 0.25,
    delay: i * 0.4,
    duration: 3.5 + (i % 4) * 0.8,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute font-black opacity-0"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}rem`,
            color: `${color}60`,
            animation: `heroFloat ${p.duration}s ${p.delay}s ease-in-out infinite`,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {p.value}
        </span>
      ))}
    </div>
  );
}

/* ─── Bridge diagram ────────────────────────────────────────── */
function BridgeDiagram({ examples }: { examples: WorkedExample[] }) {
  // Use the first example to build the visual bridge
  const ex = examples[0];
  // Try to parse: e.g. "8 + 6" → a=8, b=6
  const parts = ex.problem.match(/(\d+)\s*[+\-×÷]\s*(\d+)/);
  if (!parts) return null;
  const a = parseInt(parts[1]);
  const b = parseInt(parts[2]);
  const target = Math.ceil(a / 10) * 10;
  const gap = target - a;
  const rem = b - gap;
  const answer = a + b;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white/80 p-5 overflow-x-auto">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">Visual Bridge Diagram</p>
      <div className="min-w-[320px] flex flex-col items-center gap-3">
        {/* Number line */}
        <div className="relative flex items-center w-full max-w-xs mx-auto">
          {/* Line */}
          <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent top-1/2 -translate-y-1/2" />
          {/* A */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white shadow-md" style={{ background: 'linear-gradient(135deg,#7C4DFF,#A855F7)' }}>{a}</div>
            <span className="text-[10px] font-bold text-[#7C4DFF] mt-1">Start</span>
          </div>
          {/* Gap arc */}
          <div className="flex-1 flex flex-col items-center px-1">
            <div className="flex items-center gap-1 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5">
              <span className="text-[10px] font-bold text-[#7C4DFF]">+{gap}</span>
            </div>
            <div className="w-full h-[2px] bg-gradient-to-r from-[#7C4DFF] to-[#5EEAD4] mt-1 rounded-full" style={{ animation: 'bridgeGrow 1.2s ease-out forwards' }} />
          </div>
          {/* Target (round) */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shadow-lg" style={{ background: 'linear-gradient(135deg,#5EEAD4,#22D3EE)', animation: 'glowPulseGreen 2s ease-in-out infinite' }}>{target}</div>
            <span className="text-[10px] font-bold text-[#10B981] mt-1">Bridge!</span>
          </div>
          {/* Remainder arc */}
          <div className="flex-1 flex flex-col items-center px-1">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
              <span className="text-[10px] font-bold text-[#D97706]">+{rem}</span>
            </div>
            <div className="w-full h-[2px] bg-gradient-to-r from-[#5EEAD4] to-[#F59E0B] mt-1 rounded-full" />
          </div>
          {/* Answer */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shadow-lg" style={{ background: 'linear-gradient(135deg,#F59E0B,#FB923C)' }}>{answer}</div>
            <span className="text-[10px] font-bold text-[#D97706] mt-1">Answer</span>
          </div>
        </div>

        {/* Split annotation */}
        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200/60 rounded-xl px-3 py-2">
          <span className="text-xs font-bold text-[#7C4DFF]">Split {b}</span>
          <span className="text-[#9CA3AF]">→</span>
          <span className="text-xs font-bold text-[#7C4DFF]">{gap} + {rem}</span>
          <span className="text-[#9CA3AF]">=</span>
          <span className="text-xs font-black text-[#D97706]">{b}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Interactive Worked Example viewer ─────────────────────── */
function WorkedExampleViewer({ examples, accentColor }: { examples: WorkedExample[]; accentColor: string }) {
  const [activeEx, setActiveEx] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const ex = examples[activeEx];

  function selectExample(idx: number) {
    setActiveEx(idx);
    setRevealedSteps(0);
    setShowAnswer(false);
  }

  function nextStep() {
    if (revealedSteps < ex.steps.length) {
      setRevealedSteps((s) => s + 1);
    } else {
      setShowAnswer(true);
    }
  }

  const allRevealed = revealedSteps >= ex.steps.length;

  return (
    <div className="space-y-4">
      {/* Example tabs */}
      <div className="flex gap-2 flex-wrap">
        {examples.map((e, i) => (
          <button
            key={i}
            onClick={() => selectExample(i)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
              activeEx === i
                ? 'text-white shadow-md scale-105'
                : 'bg-slate-100 text-[#6B7280] hover:bg-slate-200'
            }`}
            style={activeEx === i ? { background: `linear-gradient(135deg,${accentColor},${accentColor}cc)` } : {}}
          >
            <span className="font-mono">{e.problem}</span>
          </button>
        ))}
      </div>

      {/* Step reveal card */}
      <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-sm">
        {/* Problem header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg,${accentColor}18,${accentColor}08)` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-white shadow-sm"
              style={{ background: `linear-gradient(135deg,${accentColor},${accentColor}bb)` }}
            >
              ?
            </div>
            <span className="font-mono text-xl font-black text-[#111827]">{ex.problem}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] bg-white/70 rounded-full px-2 py-1">
            Ex. {activeEx + 1} of {examples.length}
          </span>
        </div>

        {/* Steps */}
        <div className="px-5 py-4 space-y-2.5 min-h-[130px]">
          {ex.steps.map((step, si) => (
            <div
              key={si}
              className="flex items-start gap-3 transition-all duration-500"
              style={{
                opacity: si < revealedSteps ? 1 : 0,
                transform: si < revealedSteps ? 'translateY(0)' : 'translateY(8px)',
                pointerEvents: si < revealedSteps ? 'auto' : 'none',
              }}
            >
              <div
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: `linear-gradient(135deg,${accentColor},${accentColor}aa)` }}
              >
                {si + 1}
              </div>
              <p className="text-sm text-[#374151] font-medium leading-snug">{step}</p>
            </div>
          ))}

          {revealedSteps === 0 && (
            <p className="text-sm text-[#9CA3AF] italic">Click &quot;Next Step&quot; to begin solving...</p>
          )}
        </div>

        {/* Answer reveal */}
        {showAnswer && (
          <div
            className="mx-4 mb-4 rounded-xl px-4 py-3 flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg,${accentColor}20,${accentColor}0a)`,
              border: `1.5px solid ${accentColor}40`,
              animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
            }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} style={{ color: accentColor }} />
              <span className="text-sm font-bold text-[#374151]">Answer</span>
            </div>
            <span className="font-mono text-xl font-black" style={{ color: accentColor }}>
              {ex.finalAnswer}
            </span>
          </div>
        )}

        {/* Controls */}
        <div className="px-5 pb-4 flex items-center justify-between gap-3">
          <div className="flex gap-1">
            {ex.steps.map((_, si) => (
              <div
                key={si}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: si < revealedSteps ? '20px' : '6px',
                  background: si < revealedSteps ? accentColor : '#E5E7EB',
                }}
              />
            ))}
          </div>

          {!showAnswer ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-md active:scale-95 shadow-sm"
              style={{ background: `linear-gradient(135deg,${accentColor},${accentColor}cc)` }}
            >
              {allRevealed ? (
                <>
                  <Eye size={14} /> Show Answer
                </>
              ) : (
                <>
                  <Play size={14} /> Next Step
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => selectExample((activeEx + 1) % examples.length)}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all hover:scale-105 active:scale-95"
              style={{ color: accentColor, background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
            >
              Try Next <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Difficulty selector ───────────────────────────────────── */
const DIFF_CONFIG = {
  easy:   { color: '#22C55E', grad: 'linear-gradient(135deg,#22C55E,#86EFAC)', label: 'Easy',   desc: 'Single-digit bridging',      emoji: '🌱' },
  medium: { color: '#F59E0B', grad: 'linear-gradient(135deg,#F59E0B,#FBBF24)', label: 'Medium', desc: 'Two-digit numbers',           emoji: '🔥' },
  hard:   { color: '#EF4444', grad: 'linear-gradient(135deg,#EF4444,#F97316)', label: 'Hard',   desc: 'Three-digit challenges',     emoji: '⚡' },
} as const;

function DifficultySelector({
  difficulty,
  setDifficulty,
  difficultyUnlocked,
  loading,
}: {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  difficultyUnlocked: (d: Difficulty) => boolean;
  loading: boolean;
}) {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Select Difficulty</p>
        {loading && <span className="text-[10px] text-[#9CA3AF] animate-pulse">Loading…</span>}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
          const cfg = DIFF_CONFIG[d];
          const unlocked = difficultyUnlocked(d);
          const active = difficulty === d && unlocked;
          return (
            <button
              key={d}
              type="button"
              disabled={!unlocked}
              onClick={() => unlocked && setDifficulty(d)}
              title={!unlocked ? 'Master the previous difficulty to unlock' : undefined}
              className={`relative flex flex-col items-center gap-1.5 rounded-2xl px-3 py-3.5 border-2 transition-all duration-200 ${
                active
                  ? 'border-transparent text-white shadow-lg scale-105'
                  : unlocked
                  ? 'border-[var(--border)] hover:border-opacity-50 hover:scale-102 bg-white text-[#374151]'
                  : 'border-[var(--border)] opacity-40 cursor-not-allowed bg-slate-50 text-[#9CA3AF]'
              }`}
              style={active ? { background: cfg.grad } : {}}
            >
              {!unlocked && (
                <div className="absolute top-1.5 right-1.5">
                  <Lock size={9} className="text-[#9CA3AF]" />
                </div>
              )}
              <span className="text-lg leading-none">{cfg.emoji}</span>
              <span className="text-xs font-black">{cfg.label}</span>
              <span className={`text-[9px] font-semibold text-center leading-tight ${active ? 'text-white/80' : 'text-[#9CA3AF]'}`}>
                {cfg.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Stage Journey card ───────────────────────────────── */
function StageCard({
  stage,
  idx,
  methodId,
  difficulty,
  locked,
  isLast,
}: {
  stage: StageConfig;
  idx: number;
  methodId: string;
  difficulty: Difficulty;
  locked: boolean;
  isLast: boolean;
}) {
  const StageIcon = stage.icon;
  const href = `/practice/session?method=${methodId}&difficulty=${difficulty}&stage=${stage.id}`;

  return (
    <div className="flex flex-col">
      {/* ─── Full-width stage card ─── */}
      <div
        className={`relative rounded-2xl border-2 p-5 sm:p-6 transition-all duration-200 ${
          locked
            ? 'border-[var(--border)] bg-slate-50/80 opacity-55'
            : 'bg-white hover:shadow-lg hover:-translate-y-0.5'
        }`}
        style={!locked ? { borderColor: `${stage.accentColor}35`, boxShadow: `0 2px 8px ${stage.accentColor}10` } : {}}
      >
        {/* Stage number badge (top-left corner) */}
        <div
          className="absolute -top-3.5 left-5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white shadow-md"
          style={{ background: locked ? '#9CA3AF' : `linear-gradient(135deg,${stage.gradFrom},${stage.gradTo})` }}
        >
          {idx + 1}
        </div>

        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background: locked ? 'rgba(156,163,175,0.10)' : `linear-gradient(135deg,${stage.gradFrom}25,${stage.gradTo}18)`,
              border: `2px solid ${locked ? 'rgba(156,163,175,0.18)' : `${stage.accentColor}35`}`,
            }}
          >
            {locked ? (
              <Lock size={22} className="text-[#9CA3AF]" />
            ) : (
              <StageIcon size={24} style={{ color: stage.accentColor }} />
            )}
          </div>

          {/* Text block */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-base font-black text-[#111827]">{stage.label}</p>
              {stage.id === 'mastery' && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white"
                  style={{ background: 'linear-gradient(135deg,#FBBF24,#FB923C)' }}
                >
                  🔑 Unlock Key
                </span>
              )}
            </div>
            <p className="text-sm text-[#4B5563] leading-relaxed">{stage.description}</p>
            {stage.unlockRequirement && (
              <p className="mt-1 text-xs text-[#9CA3AF] font-medium">Requires: {stage.unlockRequirement}</p>
            )}
          </div>

          {/* CTA */}
          <div className="shrink-0 flex flex-col items-end gap-2">
            {!locked ? (
              <Link
                href={href}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm"
                style={{ background: `linear-gradient(135deg,${stage.gradFrom},${stage.gradTo})` }}
              >
                {stage.id === 'learn' ? <><Eye size={15} /> View</> : <><Sparkles size={15} /> Start</>}
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-[#9CA3AF] bg-slate-100">
                <Lock size={13} /> Locked
              </div>
            )}

            {/* Meta pills */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                <Clock size={11} className="text-[#9CA3AF]" />
                <span className="text-xs font-semibold text-[#6B7280]">{stage.timeMin} min</span>
              </div>
              <div
                className="flex items-center gap-1 rounded-full px-2.5 py-1"
                style={{ background: `${stage.accentColor}18` }}
              >
                <Star size={11} style={{ color: stage.accentColor }} />
                <span className="text-xs font-black" style={{ color: stage.accentColor }}>+{stage.xp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical connector */}
      {!isLast && (
        <div className="flex justify-start pl-9 py-1">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-0.5 h-4 bg-gradient-to-b from-slate-300 to-slate-200 rounded-full" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <div className="w-0.5 h-4 bg-gradient-to-b from-slate-200 to-transparent rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main MethodDetail component ───────────────────────────── */
function MethodDetail() {
  const params = useParams<{ methodId: string }>();
  const searchParams = useSearchParams();
  const methodId = params.methodId;
  const urlDifficulty = (searchParams.get('difficulty') ?? 'easy') as Difficulty;

  const [difficulty, setDifficulty] = useState<Difficulty>(urlDifficulty);
  const [methodStatus, setMethodStatus] = useState<MethodStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  const methodDef = getMethodById(methodId);

  useEffect(() => {
    fetch('/api/methods')
      .then((r) => r.json())
      .then((data) => {
        const found = (data.methods ?? []).find((m: MethodStatus) => m.id === methodId);
        setMethodStatus(found ?? null);
        setLoading(false);
      });
  }, [methodId]);

  if (!methodDef) {
    return (
      <div className="card p-8 text-center space-y-3">
        <p className="text-sm text-[#6B7280]">Method not found in Learning Journey.</p>
        <Link href="/practice" className="inline-flex items-center gap-1 text-sm font-semibold text-[#7C4DFF] hover:underline">
          <ArrowLeft size={14} /> Back to Learning Journey
        </Link>
      </div>
    );
  }

  const MethodIcon = (Icons[methodDef.icon as keyof typeof Icons] as LucideIcon) ?? Icons.Brain;

  const difficultyUnlocked = (d: Difficulty) => {
    if (!methodStatus) return false;
    if (d === 'easy') return methodStatus.unlocked;
    if (d === 'medium') return methodStatus.easyMastered;
    return methodStatus.mediumMastered;
  };

  const locked = !methodStatus?.unlocked;

  // Build a rich accent from the method color
  const accent = methodDef.colorHex;

  return (
    <div className="space-y-5 pb-16 animate-fade-up">

      {/* ── Back nav ─────────────────────────────────────── */}
      <Link
        href="/practice"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B7280] transition-colors hover:text-[#7C4DFF] group"
      >
        <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
        Back to Learning Journey
      </Link>

      {/* ── Hero Banner ──────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white"
        style={{
          background: accent,
          boxShadow: `0 8px 40px ${accent}60, 0 2px 12px ${accent}30`,
        }}
      >
        {/* Dark contrast overlay — critical for light colors like teal */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.30) 50%, rgba(0,0,0,0.10) 100%)' }}
        />

        {/* Floating number particles */}
        <HeroParticles color="#ffffff" />

        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)' }} />
        <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex items-start gap-5">
          {/* Icon */}
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-xl"
            style={{
              background: 'rgba(255,255,255,0.22)',
              border: '1.5px solid rgba(255,255,255,0.50)',
              backdropFilter: 'blur(8px)',
              animation: 'heroIconPulse 3s ease-in-out infinite',
            }}
          >
            <MethodIcon size={32} strokeWidth={2.2} className="text-white drop-shadow-sm" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest"
                style={{ background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.40)', backdropFilter: 'blur(4px)' }}>
                Mental Strategy
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-black leading-tight"
              style={{ color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.30)' }}>
              {methodDef.name}
            </h1>
            <p className="mt-1.5 text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.92)' }}>{methodDef.tagline}</p>
          </div>
        </div>

        {/* Bottom stat pills */}
        <div className="relative z-10 mt-6 flex gap-2 flex-wrap">
          {[
            { icon: <Trophy size={12} />, label: '5 Stages' },
            { icon: <Star size={12} />, label: '350 XP Total' },
            { icon: <Clock size={12} />, label: '~27 min to Master' },
            { icon: <Target size={12} />, label: 'Addition' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.30)', backdropFilter: 'blur(4px)' }}>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{icon}</span>
              <span className="text-xs font-bold" style={{ color: '#ffffff' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Learning Objective ───────────────────────────── */}
      <div
        className="relative rounded-2xl p-5 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent}18 0%, ${accent}08 100%)`,
          border: `1.5px solid ${accent}50`,
        }}
      >
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-15 -translate-y-1/2 translate-x-1/2"
          style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
        />
        <div className="relative z-10 flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm"
            style={{ background: `${accent}30`, border: `1.5px solid ${accent}60` }}
          >
            <Target size={16} style={{ color: '#1a1a1a' }} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-[#374151]">
              🎯 Learning Objective
            </p>
            <p className="text-sm leading-relaxed text-[#1F2937] font-medium">{methodDef.objective}</p>
          </div>
        </div>
      </div>

      {/* ── Strategy Concept + Bridge Diagram ───────────── */}
      <div className="card p-5 sm:p-6 space-y-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#7C4DFF] mb-2">Strategy Concept</p>
          <p className="text-sm leading-relaxed text-[#4B5563] whitespace-pre-line">{methodDef.learnConcept}</p>
        </div>

        {/* Visual Bridge Diagram */}
        {methodId === 'make10' && <BridgeDiagram examples={methodDef.workedExamples} />}

        {/* Divider */}
        <div className="border-t border-[var(--border)]" />

        {/* Interactive Worked Examples */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#D97706] mb-3">
            Step-by-Step Worked Examples
          </p>
          <WorkedExampleViewer examples={methodDef.workedExamples} accentColor={accent} />
        </div>
      </div>

      {/* ── Difficulty Selector ──────────────────────────── */}
      <DifficultySelector
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        difficultyUnlocked={difficultyUnlocked}
        loading={loading}
      />

      {/* ── Stage Journey ─────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-[family-name:var(--font-display)] text-base font-black text-[#111827] uppercase tracking-wider">
            Your Journey
          </h2>
          <span className="text-xs text-[#9CA3AF] font-medium">5 stages to mastery</span>
        </div>

        {locked ? (
          <div className="card p-6 text-center space-y-3">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-slate-100">
              <Lock size={24} className="text-[#9CA3AF]" />
            </div>
            <p className="text-sm font-bold text-[#374151]">Complete the previous method to unlock this one</p>
            <p className="text-xs text-[#9CA3AF]">Progress through your learning journey to access all stages.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {STAGES.map((stage, idx) => (
              <StageCard
                key={stage.id}
                stage={stage}
                idx={idx}
                methodId={methodId}
                difficulty={difficulty}
                locked={false}
                isLast={idx === STAGES.length - 1}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
