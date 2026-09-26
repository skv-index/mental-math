'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  Clock,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Brain,
  Award,
  Check,
  XCircle,
} from 'lucide-react';
import MascotAvatar from '@/components/MascotAvatar';
import type { MethodDefinition, WorkedExample } from '@/data/methods';
import { Difficulty } from '@/types';

/* ════════════════════════════════════════════════════════
   0. AMBIENT MESH BACKGROUND (Subtle depth lighting)
   ════════════════════════════════════════════════════════ */
export function AmbientMeshBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Primary Top Purple Mesh Orb */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 15, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-400/10 via-indigo-500/6 to-transparent blur-3xl"
      />
      {/* Secondary Bottom Cyan Orb */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 -right-40 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-cyan-400/8 via-emerald-400/5 to-transparent blur-3xl"
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   1. LEARN HERO (Sleek Compact Header)
   ════════════════════════════════════════════════════════ */
export function LearnHero({
  method,
  difficulty,
}: {
  method: MethodDefinition;
  difficulty: Difficulty;
}) {
  const diffColor =
    difficulty === 'easy' ? '#22C55E' : difficulty === 'medium' ? '#FBBF24' : '#EF4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative rounded-2xl p-4 sm:p-5 pt-5 sm:pt-6 border border-purple-500/15 shadow-md shadow-purple-500/5"
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,245,255,0.96) 50%, rgba(243,238,255,0.92) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex flex-row items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5 flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-full px-2.5 py-0.5 text-white bg-gradient-to-r from-[#7C4DFF] to-[#9333EA] shadow-2xs text-[11px]">
              Lesson 1 of 5 · Learn Stage
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 uppercase tracking-wider font-extrabold text-[10px]"
              style={{ background: `${diffColor}18`, color: diffColor }}
            >
              {difficulty}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-slate-600 border border-slate-200/80 text-[11px]">
              <Clock size={12} className="text-[#7C4DFF]" /> ~3 min
            </span>
          </div>

          {/* Title & Tagline */}
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-900 tracking-tight text-slate-900">
              {method.name}
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600 leading-snug max-w-xl font-medium">
              {method.tagline}
            </p>
          </div>
        </div>

        {/* Mascot Coach Header */}
        <div className="shrink-0 flex flex-col items-center">
          <MascotAvatar
            emotion="happy"
            size="md"
            animate={true}
            glow={true}
            speechBubble="Let's master this! 🧠"
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   2. WHY THIS STRATEGY MATTERS (Compact Merged Cards)
   ════════════════════════════════════════════════════════ */
export function WhyThisStrategyMatters({ method }: { method: MethodDefinition }) {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const features = [
    {
      icon: Target,
      color: '#7C4DFF',
      bgColor: 'rgba(124, 77, 255, 0.08)',
      borderColor: 'rgba(124, 77, 255, 0.20)',
      title: 'Learning Goal',
      highlight: method.objective.split(' ').slice(0, 3).join(' '),
      summary: method.objective,
      tooltip: 'Mastering this objective builds the core mental foundation for rapid multi-digit math.',
    },
    {
      icon: Brain,
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.08)',
      borderColor: 'rgba(59, 130, 246, 0.20)',
      title: 'Why It Works',
      highlight: '5× Faster',
      summary: 'Your brain processes round benchmark numbers up to 5× faster than carrying math.',
      tooltip: 'Eliminating pencil-and-paper carrying steps frees up working memory for complex problem solving.',
    },
    {
      icon: Zap,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.20)',
      title: 'Real-World Benefit',
      highlight: 'Instant Recall',
      summary: 'Essential for fast mental math during exams, shopping, finance, and timed challenges.',
      tooltip: 'Used daily by competitive mathletes and professionals to calculate speed totals effortlessly.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
          Why This Strategy Matters
        </h2>
        <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
          Core Insights
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {features.map((feat, idx) => {
          const IconComp = feat.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative rounded-xl p-3.5 border transition-all duration-200 shadow-2xs bg-white/90 backdrop-blur-md flex flex-col justify-between"
              style={{ borderColor: feat.borderColor }}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg shadow-2xs"
                    style={{ background: feat.bgColor, color: feat.color }}
                  >
                    <IconComp size={15} />
                  </div>
                  <button
                    onClick={() => setActiveTooltip(activeTooltip === idx ? null : idx)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                    title="More details"
                  >
                    <HelpCircle size={13} />
                  </button>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {feat.title}
                  </span>
                  <p className="text-xs font-bold text-slate-900 leading-snug">
                    <span style={{ color: feat.color }}>{feat.highlight}</span> — {feat.summary.replace(feat.highlight, '').trim()}
                  </p>
                </div>
              </div>

              {/* Tooltip Overlay */}
              <AnimatePresence>
                {activeTooltip === idx && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-2 p-2 rounded-lg bg-slate-900 text-white text-[10px] leading-relaxed shadow-md border border-slate-700"
                  >
                    {feat.tooltip}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export const LearningGoalCard = WhyThisStrategyMatters;

/* ════════════════════════════════════════════════════════
   3. CINEMATIC WORKED EXAMPLE HERO & PIP CANVAS (Compact)
   ════════════════════════════════════════════════════════ */

function parseProblem(problem: string): { a: number; b: number; op: '+' | '−' } {
  const m = problem.match(/^(\d+)\s*([+−\-])\s*(\d+)/);
  if (!m) return { a: 8, b: 6, op: '+' };
  return {
    a: parseInt(m[1], 10),
    b: parseInt(m[3], 10),
    op: (m[2] === '+' ? '+' : '−') as '+' | '−',
  };
}

function computeBridge(a: number, b: number): number {
  const target = Math.ceil((a + 1) / 10) * 10;
  const needed = target - a;
  return Math.min(needed, b);
}

function CinematicPipCanvas({
  example,
  stepIndex,
  totalSteps,
}: {
  example: WorkedExample;
  stepIndex: number;
  totalSteps: number;
}) {
  const { a, b, op } = parseProblem(example.problem);

  const bridge = computeBridge(a, b);
  const remainder = b - bridge;
  const benchmarkA = a + bridge;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4 px-3 select-none min-h-[170px] w-full">
      {/* Animated Equation Display */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {/* Container A */}
        <motion.div
          layout
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border-2 shadow-sm transition-colors"
          style={{
            borderColor: stepIndex >= 2 ? '#22C55E' : '#7C4DFF',
            background: stepIndex >= 2 ? 'rgba(34,197,94,0.05)' : 'rgba(124,77,255,0.05)',
          }}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            {stepIndex >= 2 ? 'Benchmark 10' : 'First Term'}
          </span>
          <motion.div
            key={`a-${stepIndex >= 2 ? benchmarkA : a}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-3xl sm:text-4xl font-900 font-mono tracking-tight"
            style={{ color: stepIndex >= 2 ? '#16A34A' : '#7C4DFF' }}
          >
            {stepIndex >= 2 ? benchmarkA : a}
          </motion.div>

          <div className="flex flex-wrap max-w-[100px] justify-center gap-1 pt-0.5">
            {Array.from({ length: Math.min(a, 10) }).map((_, i) => (
              <div key={`pip-a-${i}`} className="w-3 h-3 rounded-full bg-[#7C4DFF]" />
            ))}
            {stepIndex >= 2 &&
              Array.from({ length: bridge }).map((_, i) => (
                <motion.div
                  key={`pip-transferred-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 rounded-full bg-amber-400 ring-1 ring-amber-300"
                />
              ))}
          </div>
        </motion.div>

        <div className="text-2xl font-900 text-slate-400 font-mono">+</div>

        {/* Container B */}
        <motion.div
          layout
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border-2 border-amber-300 shadow-sm bg-amber-500/5"
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
            {stepIndex === 0 ? 'Second Term' : stepIndex === 1 ? 'Split Part' : 'Remainder'}
          </span>
          <motion.div
            key={`b-${stepIndex}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-3xl sm:text-4xl font-900 font-mono text-amber-600 tracking-tight"
          >
            {stepIndex === 0 ? b : stepIndex === 1 ? `${bridge} + ${remainder}` : remainder}
          </motion.div>

          <div className="flex flex-wrap max-w-[100px] justify-center gap-1 pt-0.5">
            {stepIndex === 0 &&
              Array.from({ length: Math.min(b, 10) }).map((_, i) => (
                <div key={`pip-b-${i}`} className="w-3 h-3 rounded-full bg-amber-400" />
              ))}
            {stepIndex === 1 && (
              <>
                {Array.from({ length: bridge }).map((_, i) => (
                  <motion.div
                    key={`pip-borrowed-${i}`}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-[#7C4DFF]"
                  />
                ))}
                {Array.from({ length: remainder }).map((_, i) => (
                  <div key={`pip-rem-${i}`} className="w-3 h-3 rounded-full bg-amber-200" />
                ))}
              </>
            )}
            {stepIndex >= 2 &&
              Array.from({ length: Math.min(remainder, 10) }).map((_, i) => (
                <div key={`pip-rem-after-${i}`} className="w-3 h-3 rounded-full bg-amber-400" />
              ))}
          </div>
        </motion.div>

        {stepIndex >= 2 && (
          <>
            <div className="text-2xl font-900 text-slate-400 font-mono">=</div>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-emerald-500 text-white shadow-md ring-2 ring-emerald-500/20"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-90">Result</span>
              <span className="text-3xl sm:text-4xl font-900 font-mono">{example.finalAnswer}</span>
            </motion.div>
          </>
        )}
      </div>

      <motion.div key={`cue-${stepIndex}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <span className="text-[11px] font-bold text-slate-600 bg-white/90 border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
          {stepIndex === 0 && `💡 Gap: ${a} needs ${bridge} to reach 10`}
          {stepIndex === 1 && `✨ Detach ${bridge} from ${b} → (${bridge} + ${remainder})`}
          {stepIndex === 2 && `⚡ ${a} + ${bridge} = ${benchmarkA}! Add remainder ${remainder}`}
          {stepIndex >= 3 && `🎉 Answer: ${benchmarkA} + ${remainder} = ${example.finalAnswer}`}
        </span>
      </motion.div>
    </div>
  );
}

export function AnimatedWorkedExample({
  workedExamples,
}: {
  workedExamples: WorkedExample[];
}) {
  const [activeExIndex, setActiveExIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<0.5 | 1 | 2>(1);

  const currentEx = workedExamples[activeExIndex] ?? workedExamples[0];
  const totalSteps = currentEx ? currentEx.steps.length : 0;

  useEffect(() => {
    setActiveStepIndex(0);
    setIsPlaying(false);
  }, [activeExIndex]);

  useEffect(() => {
    if (!isPlaying || !currentEx) return;
    const intervalMs = 2400 / speed;
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < totalSteps - 1) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, speed, totalSteps, currentEx]);

  if (!currentEx) return null;

  const { a, b } = parseProblem(currentEx.problem);
  const bridge = computeBridge(a, b);
  const remainder = b - bridge;
  const benchmarkA = a + bridge;

  const thinkingPrompts = [
    `"${a} needs ${bridge} to make ${benchmarkA}."`,
    `"Take ${bridge} from ${b}."`,
    `"Now we have ${benchmarkA} + ${remainder}."`,
    `"Final answer is ${currentEx.finalAnswer}!"`,
  ];

  const handlePlayPause = () => {
    if (activeStepIndex >= totalSteps - 1) {
      setActiveStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.12 }}
      className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 border border-purple-500/20 shadow-md space-y-4"
    >
      <div className="flex flex-row items-center justify-between gap-2 border-b border-purple-100/80 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#7C4DFF] bg-purple-100/60 px-2.5 py-0.5 rounded-full">
            <Sparkles size={12} />
            <span>Worked Example</span>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-900 text-slate-900">
            {currentEx.problem}
          </h2>
        </div>

        {workedExamples.length > 1 && (
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 shrink-0 text-xs">
            {workedExamples.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveExIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                  activeExIndex === idx ? 'bg-[#7C4DFF] text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                Ex {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mascot Companion */}
      <div className="flex items-center justify-center pt-1">
        <MascotAvatar
          emotion={activeStepIndex >= totalSteps - 1 ? 'celebrating' : 'thinking'}
          size="sm"
          animate={true}
          glow={true}
          isThought={true}
          speechBubble={thinkingPrompts[activeStepIndex] ?? thinkingPrompts[0]}
        />
      </div>

      <div className="rounded-2xl bg-slate-900/5 border border-purple-200/50 min-h-[170px] flex items-center justify-center">
        <CinematicPipCanvas example={currentEx} stepIndex={activeStepIndex} totalSteps={totalSteps} />
      </div>

      {/* Steps */}
      <div className="space-y-1.5">
        {currentEx.steps.map((stepText, sIdx) => {
          const isCurrent = sIdx === activeStepIndex;
          const isDone = sIdx < activeStepIndex;

          return (
            <button
              key={sIdx}
              onClick={() => {
                setIsPlaying(false);
                setActiveStepIndex(sIdx);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all text-xs ${
                isCurrent
                  ? 'bg-white border-[#7C4DFF] shadow-xs font-bold text-slate-900'
                  : isDone
                  ? 'bg-white/80 border-emerald-200 opacity-90 text-slate-700'
                  : 'bg-white/40 border-slate-200 opacity-40 text-slate-500'
              }`}
            >
              <div
                className={`h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent ? 'bg-[#7C4DFF] text-white' : isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? <Check size={12} strokeWidth={3} /> : sIdx + 1}
              </div>
              <span className="leading-tight">{stepText}</span>
              {isCurrent && <CheckCircle2 size={14} className="ml-auto shrink-0 text-[#7C4DFF]" />}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePlayPause}
            className="rounded-xl bg-[#7C4DFF] hover:bg-[#6C3DF5] text-white px-3.5 py-1.5 text-xs font-extrabold flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause' : activeStepIndex >= totalSteps - 1 ? 'Replay' : 'Play'}</span>
          </button>
          <button
            onClick={() => { setIsPlaying(false); if (activeStepIndex > 0) setActiveStepIndex((p) => p - 1); }}
            disabled={activeStepIndex === 0}
            className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => { setIsPlaying(false); if (activeStepIndex < totalSteps - 1) setActiveStepIndex((p) => p + 1); }}
            disabled={activeStepIndex >= totalSteps - 1}
            className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
          <button
            onClick={() => { setActiveStepIndex(0); setIsPlaying(true); }}
            className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900"
            title="Restart"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-[11px]">
          {([0.5, 1, 2] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded-md font-bold ${
                speed === s ? 'bg-[#7C4DFF] text-white' : 'text-slate-600'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export const StrategyBreakdown = ({ method }: { method: MethodDefinition }) => null;
export const NumberVisualization = () => null;

/* ════════════════════════════════════════════════════════
   4. STRATEGY COMPARISON (Compact 2 Cards)
   ════════════════════════════════════════════════════════ */
export function StrategyComparison() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.16 }}
      className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs space-y-3"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
          Efficiency Comparison
        </h3>
        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          Speedup
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl p-3 bg-rose-50/60 border border-rose-200/70 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700">
            <span className="flex items-center gap-1 text-[11px]"><XCircle size={13} /> Carry Math</span>
            <span className="text-[10px] bg-rose-100 px-1.5 py-0.5 rounded">~8s</span>
          </div>
          <p className="font-mono text-sm font-bold text-slate-900">47 + 8</p>
          <p className="text-[11px] text-rose-800/80 leading-tight">Counting up 48, 49, 50… High fatigue!</p>
        </div>

        <div className="rounded-xl p-3 bg-emerald-50/60 border border-emerald-200/70 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
            <span className="flex items-center gap-1 text-[11px]"><CheckCircle2 size={13} /> Shortcut</span>
            <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded">~2s ⚡</span>
          </div>
          <p className="font-mono text-sm font-bold text-slate-900">47 + 8 → 50 + 5 = 55</p>
          <p className="text-[11px] text-emerald-800/80 leading-tight">Bridge 47 to 50 using 3, add 5. Instant!</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   5. BRAIN COACH CARD (Compact)
   ════════════════════════════════════════════════════════ */
export function BrainCoachCard() {
  return (
    <div className="rounded-xl p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 flex items-center gap-3 shadow-2xs">
      <MascotAvatar emotion="confident" size="sm" animate={true} glow={false} className="shrink-0" />
      <div className="space-y-0.5 min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C4DFF]">
          Brain Coach Golden Rule
        </p>
        <p className="text-xs font-bold text-slate-900 leading-snug">
          "Always identify the closest round ten first. Split only what you need to bridge the gap!"
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   6. INTERACTIVE PATTERN RECOGNITION (Compact)
   ════════════════════════════════════════════════════════ */
export function PatternRecognition() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const patterns = [
    { problem: '8 + 6', breakdown: '(8 + 2) + 4', result: '14', scale: 'Single' },
    { problem: '18 + 7', breakdown: '(18 + 2) + 5', result: '25', scale: 'Teens' },
    { problem: '48 + 5', breakdown: '(48 + 2) + 3', result: '53', scale: 'Tens' },
    { problem: '198 + 6', breakdown: '(198 + 2) + 4', result: '204', scale: 'Hundreds' },
  ];

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % patterns.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [autoPlay, patterns.length]);

  const current = patterns[activeIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs space-y-3"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
          Pattern Recognition
        </h3>
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
            autoPlay ? 'bg-[#7C4DFF] text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {autoPlay ? <Pause size={10} /> : <Play size={10} />}
          <span>{autoPlay ? 'Pause' : 'Auto Play'}</span>
        </button>
      </div>

      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 justify-between gap-1">
        {patterns.map((item, idx) => (
          <button
            key={idx}
            onClick={() => { setAutoPlay(false); setActiveIdx(idx); }}
            className={`flex-1 py-1 text-[11px] font-extrabold rounded-lg transition-all text-center ${
              activeIdx === idx ? 'bg-white text-[#7C4DFF] shadow-2xs' : 'text-slate-500'
            }`}
          >
            {item.problem}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="rounded-xl p-3 bg-purple-500/5 border border-purple-200 flex items-center justify-between gap-2"
        >
          <div>
            <span className="text-[9px] font-extrabold uppercase text-[#7C4DFF]">
              Scale {activeIdx + 1}: {current.scale}
            </span>
            <div className="font-mono text-xl font-900 text-slate-900">{current.problem}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs font-bold text-[#7C4DFF]">{current.breakdown}</div>
            <div className="font-mono text-lg font-900 text-emerald-600">= {current.result}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   7. VISUAL PITFALLS & COMMON MISTAKES (Compact)
   ════════════════════════════════════════════════════════ */
export function CommonMistakes() {
  const [activePitfall, setActivePitfall] = useState(0);

  const pitfalls = [
    {
      title: 'Splitting wrong number',
      wrongText: 'Splitting 47 instead of 8: (40 + 7) + 8',
      correctText: 'Split 8 to bridge 47 to 50: 47 + 3 + 5 = 55',
    },
    {
      title: 'Forgetting remainder',
      wrongText: 'Bridging 18 to 20 using 2, forgetting remaining 5 from 7',
      correctText: '7 splits into 2 + 5 → 20 + 5 = 25',
    },
  ];

  const current = pitfalls[activePitfall];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.22 }}
      className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs space-y-3"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
          Visual Pitfalls
        </h3>
        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
          Avoid Errors
        </span>
      </div>

      <div className="flex gap-1.5 border-b border-slate-100 pb-1.5">
        {pitfalls.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setActivePitfall(idx)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
              activePitfall === idx ? 'bg-rose-100 text-rose-800' : 'text-slate-500'
            }`}
          >
            Mistake {idx + 1}
          </button>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 text-xs">
        <div className="rounded-xl p-2.5 bg-rose-50 border border-rose-200 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-rose-600 flex items-center gap-1">
            <XCircle size={12} /> Incorrect
          </div>
          <p className="text-[11px] font-medium text-slate-800">{current.wrongText}</p>
        </div>

        <div className="rounded-xl p-2.5 bg-emerald-50 border border-emerald-200 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-emerald-600 flex items-center gap-1">
            <CheckCircle2 size={12} /> Fix
          </div>
          <p className="text-[11px] font-medium text-slate-800">{current.correctText}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   8. MINI CHALLENGE (Interactive 3-Test Suite with Hints)
   ════════════════════════════════════════════════════════ */
export function MiniChallenge() {
  const tests = [
    {
      id: 1,
      problem: '18 + 7 = ?',
      answer: '25',
      hint: '18 needs 2 to reach the round ten (20). Split 7 into 2 + 5 → 20 + 5 = 25.',
      explanation: '18 + 2 = 20, then add remaining 5 → 25',
    },
    {
      id: 2,
      problem: '47 + 8 = ?',
      answer: '55',
      hint: '47 needs 3 to reach the round ten (50). Split 8 into 3 + 5 → 50 + 5 = 55.',
      explanation: '47 + 3 = 50, then add remaining 5 → 55',
    },
    {
      id: 3,
      problem: '88 + 6 = ?',
      answer: '94',
      hint: '88 needs 2 to reach the round ten (90). Split 6 into 2 + 4 → 90 + 4 = 94.',
      explanation: '88 + 2 = 90, then add remaining 4 → 94',
    },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userVal, setUserVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  const currentTest = tests[currentIdx]!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userVal.trim() === currentTest.answer) {
      setStatus('correct');
      if (!completed.includes(currentIdx)) {
        setCompleted((prev) => [...prev, currentIdx]);
      }
    } else {
      setStatus('incorrect');
    }
  };

  const handleReset = () => {
    setUserVal('');
    setStatus('idle');
    setShowHint(false);
  };

  const handleSelectTest = (idx: number) => {
    setCurrentIdx(idx);
    setUserVal('');
    setStatus('idle');
    setShowHint(false);
  };

  const handleNextTest = () => {
    if (currentIdx < tests.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setUserVal('');
      setStatus('idle');
      setShowHint(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-2xl p-4 sm:p-5 bg-white border border-purple-500/25 shadow-sm space-y-4 text-center"
    >
      {/* Header & Test Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-2.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C4DFF]">
          <Target size={14} />
          <span>Interactive Check: Try It Yourself</span>
        </div>

        {/* 3 Practice Test Selector Pills */}
        <div className="flex items-center gap-1.5 justify-center">
          {tests.map((t, idx) => {
            const isDone = completed.includes(idx);
            const isCurrent = currentIdx === idx;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTest(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-[#7C4DFF] text-white shadow-2xs'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Test {idx + 1}</span>
                {isDone && <Check size={12} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Box */}
      <div className="space-y-3.5 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Practice Test {currentIdx + 1} of 3
          </span>
          <button onClick={handleReset} className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 underline">
            Reset
          </button>
        </div>

        <div className="font-mono text-3xl font-900 text-slate-900 tracking-tight">
          {currentTest.problem}
        </div>

        {/* Input Form & Buttons */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full">
          <input
            type="number"
            value={userVal}
            onChange={(e) => setUserVal(e.target.value)}
            placeholder="Answer"
            className="w-full sm:w-36 text-center font-mono text-base font-bold p-2 rounded-xl border border-purple-200 focus:border-[#7C4DFF] focus:ring-2 focus:ring-purple-500/20 outline-none shadow-2xs"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="flex-1 sm:flex-none rounded-xl bg-[#7C4DFF] hover:bg-[#6C3DF5] text-white px-4 py-2 text-xs font-extrabold shadow-sm active:scale-95 transition-all"
            >
              Check
            </button>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3 py-2 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Lightbulb size={13} className="text-amber-600" />
              <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
            </button>
          </div>
        </form>

        {/* Hint Box */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-xl bg-amber-500/10 border border-amber-300/80 text-amber-900 text-xs font-semibold text-left space-y-0.5 shadow-2xs"
            >
              <div className="flex items-center gap-1 font-bold text-amber-800">
                <Lightbulb size={13} /> Strategy Hint:
              </div>
              <p className="leading-snug">{currentTest.hint}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback States */}
        {status === 'correct' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold space-y-2 border border-emerald-200"
          >
            <div className="flex items-center justify-center gap-1.5 text-emerald-800">
              <CheckCircle2 size={16} />
              <span>🎉 Correct! ({currentTest.explanation})</span>
            </div>

            {currentIdx < tests.length - 1 ? (
              <button
                type="button"
                onClick={handleNextTest}
                className="mt-1 inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-2xs transition-all"
              >
                <span>Next Test ({currentIdx + 2}/3)</span>
                <ArrowRight size={13} />
              </button>
            ) : (
              <div className="text-[11px] font-extrabold text-emerald-700">
                🏆 Excellent! All 3 practice tests cleared!
              </div>
            )}
          </motion.div>
        )}

        {status === 'incorrect' && (
          <p className="text-xs font-bold text-rose-600">
            Not quite. Try using the Strategy Hint above!
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   9. MEMORY CHECK (Compact 10-Second Active Recall)
   ════════════════════════════════════════════════════════ */
export function MemoryCheck() {
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  const options = [
    { text: 'Split 47 into 40 + 7', correct: false },
    { text: 'Split 8 into 3 + 5 to reach 50', correct: true },
    { text: 'Carry 1 over to tens column', correct: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.28 }}
      className="rounded-2xl p-4 bg-gradient-to-r from-amber-500/8 via-purple-500/8 to-indigo-500/8 border border-amber-300/60 shadow-xs space-y-2.5"
    >
      <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">
          <Brain size={14} className="text-amber-600" />
          <span>Quick Recall Check</span>
        </div>
        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
          Active Recall
        </span>
      </div>

      <p className="text-xs font-bold text-slate-900">
        In <span className="font-mono text-purple-700">47 + 8</span>, what is the fastest first step?
      </p>

      <div className="space-y-1.5">
        {options.map((opt, idx) => {
          const isChosen = selectedOpt === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedOpt(idx)}
              className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                isChosen && opt.correct
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                  : isChosen && !opt.correct
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{opt.text}</span>
              {isChosen && opt.correct && <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />}
              {isChosen && !opt.correct && <XCircle size={15} className="text-rose-500 shrink-0" />}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   10. MASTERY COMPLETION PANEL (Compact Clean Card)
   ════════════════════════════════════════════════════════ */
export function LessonCompletePanel({ onContinue }: { onContinue: () => void }) {
  const [xp, setXp] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth ?? 400;
    canvas.height = 160;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
    }> = [];

    const colors = ['#7C4DFF', '#22C55E', '#FBBF24', '#3B82F6', '#EC4899'];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.6) * 6,
        color: colors[Math.floor(Math.random() * colors.length)] ?? '#7C4DFF',
        size: Math.random() * 5 + 3,
        rotation: Math.random() * 360,
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      animId = requestAnimationFrame(render);
    };
    render();

    const xpTimer = setInterval(() => {
      setXp((prev) => {
        if (prev < 100) return prev + 5;
        clearInterval(xpTimer);
        return 100;
      });
    }, 40);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(xpTimer);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl p-5 sm:p-6 text-center space-y-4 overflow-hidden border border-emerald-400/40 shadow-xl"
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,253,244,0.95) 50%, rgba(236,253,245,0.90) 100%)',
      }}
    >
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-70 rounded-2xl" />

      {/* Mascot Celebration */}
      <div className="relative z-10 flex flex-col items-center pt-1">
        <MascotAvatar
          emotion="celebrating"
          size="md"
          animate={true}
          glow={true}
          speechBubble="Strategy Mastered! 🎉"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-1">
        <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
          <Award size={12} /> Strategy Mastered!
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-900 text-slate-900">
          You&apos;ve Mastered Make 10
        </h2>
        <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
          You now intuitively understand how to bridge addends to round ten benchmarks.
        </p>
      </div>

      {/* Merged Takeaways Summary */}
      <div className="relative z-10 p-3.5 rounded-xl bg-white/90 border border-emerald-200 text-left max-w-md mx-auto space-y-1.5 shadow-2xs">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
          <CheckCircle2 size={14} /> Key Summary Takeaways
        </div>
        <ul className="text-xs text-slate-700 space-y-0.5 font-medium list-disc list-inside">
          <li>Identify addends closest to a round ten benchmark (10, 100).</li>
          <li>Split the secondary addend to satisfy the gap to the benchmark.</li>
          <li>Add the remaining leftover to compute the final answer instantly.</li>
        </ul>
      </div>

      {/* Reward Meta */}
      <div className="relative z-10 flex items-center justify-center gap-3 text-xs font-bold text-slate-600">
        <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[11px]">
          <Clock size={13} className="text-purple-600" /> ~3-5 min practice next
        </span>
        <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-purple-700 text-[11px]">
          <Zap size={13} className="text-amber-500 fill-amber-400" /> +{xp} XP Earned
        </span>
      </div>

      {/* CTA Button */}
      <div className="relative z-10 pt-1">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7C4DFF] via-[#9333EA] to-[#C084FC] text-white px-6 py-2.5 text-xs font-extrabold shadow-lg shadow-purple-500/20 active:scale-95"
        >
          <span>Continue to Guided Practice</span>
          <ArrowRight size={15} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export const LessonSummary = () => null;
