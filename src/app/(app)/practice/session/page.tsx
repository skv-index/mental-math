'use client';

import { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowLeft,
  Lightbulb,
  BookOpen,
  Zap,
  Sparkles,
  Target,
} from 'lucide-react';
import { getMethodById } from '@/data/methods';
import { Difficulty } from '@/types';
import type { PracticeStage } from '@/data/methods';
import { fetchDefaultDifficulty } from '@/lib/updateUser';

interface SafeQuestion {
  id: string;
  topicId: string;
  seed: number;
  type: 'mcq' | 'numeric';
  prompt: string;
  options?: string[];
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimitSeconds: number;
}

export default function PracticeSessionPage() {
  return (
    <Suspense fallback={<div className="card-surface h-64 animate-pulse" />}>
      <PracticeSession />
    </Suspense>
  );
}

type AnswerState = 'idle' | 'correct' | 'incorrect';

import {
  AmbientMeshBackground,
  LearnHero,
  WhyThisStrategyMatters,
  AnimatedWorkedExample,
  StrategyComparison,
  BrainCoachCard,
  PatternRecognition,
  MiniChallenge,
  CommonMistakes,
  MemoryCheck,
  LessonCompletePanel,
} from '@/components/learn/LearnStageComponents';

// ── Learn Stage ────────────────────────────────────────────────────────────
function LearnStage({
  methodId,
  difficulty,
  onComplete,
}: {
  methodId: string;
  difficulty: Difficulty;
  onComplete: () => void;
}) {
  const method = getMethodById(methodId);
  if (!method) return null;

  return (
    <div className="relative mx-auto max-w-4xl space-y-5 pb-10">
      {/* Subtle Mesh Depth Background */}
      <AmbientMeshBackground />

      {/* Navigation Header */}
      <div className="flex items-center justify-between pt-1">
        <Link
          href={`/practice/${methodId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#7C4DFF] transition-colors bg-white/80 px-3 py-1 rounded-full border border-slate-200 shadow-2xs"
        >
          <ArrowLeft size={14} /> Exit Lesson
        </Link>
        <span className="text-xs font-extrabold text-[#7C4DFF] bg-purple-100/70 px-3.5 py-0.5 rounded-full border border-purple-200">
          Guided Learning Experience
        </span>
      </div>

      {/* 1. Learning Hero */}
      <LearnHero method={method} difficulty={difficulty} />

      {/* 2. Streamlined Why Strategy Matters (Merged Goal, Why, Benefit) */}
      <WhyThisStrategyMatters method={method} />

      {/* 3. CENTERPIECE WORKED EXAMPLE HERO */}
      <AnimatedWorkedExample workedExamples={method.workedExamples} />

      {/* 4. Visual Rhythm 2-Column Grid */}
      <div className="grid gap-4 lg:grid-cols-2 items-stretch">
        {/* Left Column: Strategy Rules & Scaling */}
        <div className="space-y-4">
          <BrainCoachCard />
          <StrategyComparison />
          <PatternRecognition />
        </div>

        {/* Right Column: Visual Pitfalls & Try It Yourself (Vertically Centered) */}
        <div className="flex flex-col justify-center space-y-4 h-full">
          <CommonMistakes />
          <MiniChallenge />
        </div>
      </div>

      {/* 5. 10-Second Active Recall Memory Check */}
      <MemoryCheck />

      {/* 6. Lesson Mastery Completion Panel (With Confetti, XP Counter & Summary) */}
      <LessonCompletePanel onContinue={onComplete} />
    </div>
  );
}

// ── Mastery Complete Banner ────────────────────────────────────────────────
function MasteryBanner({ methodName, onContinue }: { methodName: string; onContinue: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1521]/80 backdrop-blur-sm">
      <div className="card-surface mx-4 max-w-sm p-8 text-center space-y-4 animate-[fadeInScale_0.4s_ease]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FBBF24]/10">
          <Sparkles size={32} className="text-[#FBBF24]" />
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#EDF1F7]">
          Method Mastered!
        </h2>
        <p className="text-sm text-[#8B96AB]">
          You&apos;ve mastered <strong className="text-[#EDF1F7]">{methodName}</strong>. The next
          difficulty tier or method is now unlocked.
        </p>
        <button
          onClick={onContinue}
          className="w-full rounded-xl bg-[#FBBF24] py-3 text-sm font-semibold text-[#0F1521] transition-opacity hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ── Main Session Runner ────────────────────────────────────────────────────
function PracticeSession() {
  const searchParams = useSearchParams();
  const methodId = searchParams.get('method') ?? searchParams.get('topic') ?? '';
  const stageParam = (searchParams.get('stage') ?? 'practice') as PracticeStage;
  const difficultyParam = searchParams.get('difficulty') as Difficulty | null;

  const [questions, setQuestions] = useState<SafeQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [revealedAnswer, setRevealedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showMasteryBanner, setShowMasteryBanner] = useState(false);
  const [defaultDifficulty, setDefaultDifficulty] = useState<Difficulty>('medium');
  const [difficultyLoaded, setDifficultyLoaded] = useState(false);

  // Learn stage shows concept; questions load after user clicks "Got it"
  const [stage, setStage] = useState<PracticeStage>(stageParam);
  const [learnComplete, setLearnComplete] = useState(stageParam !== 'learn');

  const inputRef = useRef<HTMLInputElement>(null);

  const effectiveDifficulty: Difficulty =
    difficultyParam && ['easy', 'medium', 'hard'].includes(difficultyParam)
      ? difficultyParam
      : defaultDifficulty;

  const methodDef = getMethodById(methodId);

  // Load default difficulty
  useEffect(() => {
    (async () => {
      const accountValue = await fetchDefaultDifficulty();
      if (accountValue) {
        setDefaultDifficulty(accountValue);
      } else {
        const stored = window.localStorage.getItem('defaultDifficulty');
        if (stored === 'easy' || stored === 'medium' || stored === 'hard') {
          setDefaultDifficulty(stored);
        }
      }
      setDifficultyLoaded(true);
    })();
  }, []);

  // Fetch questions once Learn is complete
  useEffect(() => {
    if (!methodId || !learnComplete) return;
    if (!difficultyLoaded && !difficultyParam) return;

    const practiceStage = stage === 'learn' ? 'guided' : stage;

    async function load() {
      setLoading(true);
      const res = await fetch(
        `/api/practice/questions?methodId=${methodId}&difficulty=${effectiveDifficulty}&stage=${practiceStage}`
      );
      const data = await res.json();

      if (data.error) {
        setLoadError(data.error);
      } else {
        setQuestions(data.questions ?? []);
        setTimeLeft(data.questions?.[0]?.timeLimitSeconds ?? 20);
      }
      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methodId, learnComplete, difficultyLoaded, effectiveDifficulty, stage]);

  const currentQuestion = questions[currentIndex];

  // Auto-focus numeric input
  useEffect(() => {
    if (currentQuestion?.type === 'numeric' && answerState === 'idle') {
      inputRef.current?.focus();
    }
  }, [currentIndex, currentQuestion, answerState]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setSessionComplete(true);
    } else {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setSelectedAnswer('');
      setAnswerState('idle');
      setRevealedAnswer(null);
      setTimeLeft(questions[next]?.timeLimitSeconds ?? 20);
    }
  }, [currentIndex, questions]);

  const handleSubmit = useCallback(
    async (answer: string) => {
      if (answerState !== 'idle' || !currentQuestion || submitting) return;
      setSubmitting(true);

      const practiceStage = stage === 'learn' ? 'guided' : stage;

      const res = await fetch('/api/practice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          methodId,
          seed: currentQuestion.seed,
          answer,
          difficulty: effectiveDifficulty,
          stage: practiceStage,
        }),
      });
      const result = await res.json();

      setAnswerState(result.correct ? 'correct' : 'incorrect');
      setRevealedAnswer(result.correctAnswer);
      if (result.correct) {
        setScore((s) => s + result.pointsEarned);
        setCorrectCount((c) => c + 1);
      }
      if (result.masteryAchieved) {
        setShowMasteryBanner(true);
      }
      setSubmitting(false);
      setTimeout(handleNext, 900);
    },
    [answerState, currentQuestion, submitting, effectiveDifficulty, methodId, stage, handleNext]
  );

  // Keyboard shortcuts: 1–4 for MCQ
  useEffect(() => {
    if (!currentQuestion || currentQuestion.type !== 'mcq' || answerState !== 'idle') return;
    function onKeyDown(e: KeyboardEvent) {
      const num = Number(e.key);
      if (num >= 1 && num <= 4 && currentQuestion?.options && num <= currentQuestion.options.length) {
        const opt = currentQuestion.options[num - 1];
        setSelectedAnswer(opt);
        handleSubmit(opt);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentQuestion, answerState, handleSubmit]);

  // Countdown timer
  useEffect(() => {
    if (loading || sessionComplete || answerState !== 'idle' || !currentQuestion) return;
    if (timeLeft <= 0) {
      const tid = setTimeout(() => handleSubmit(''), 0);
      return () => clearTimeout(tid);
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, loading, sessionComplete, answerState, currentQuestion, handleSubmit]);

  // ── Learn Stage ───────────────────────────────────────────────────────────
  if (stage === 'learn' && !learnComplete) {
    return (
      <LearnStage
        methodId={methodId}
        difficulty={effectiveDifficulty}
        onComplete={() => {
          setLearnComplete(true);
          setStage('guided');
        }}
      />
    );
  }

  if (!methodId) {
    return (
      <div className="card-surface p-8 text-center">
        <p className="text-sm text-[#8B96AB]">No method selected.</p>
        <Link href="/practice" className="mt-3 inline-block text-sm font-medium text-[#5EEAD4] hover:underline">
          Browse methods
        </Link>
      </div>
    );
  }

  if (loading) return <div className="card-surface h-64 animate-pulse" />;

  if (loadError || questions.length === 0) {
    return (
      <div className="card-surface p-8 text-center">
        <p className="text-sm text-[#8B96AB]">{loadError || 'No questions available for this method yet.'}</p>
        <Link href="/practice" className="mt-3 inline-block text-sm font-medium text-[#5EEAD4] hover:underline">
          Browse methods
        </Link>
      </div>
    );
  }

  // ── Session Complete ───────────────────────────────────────────────────────
  if (sessionComplete) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const isMastery = stage === 'mastery';
    const passed = isMastery && accuracy >= 80;
    const stageLabels: Record<PracticeStage, string> = {
      learn: 'Learn',
      guided: 'Guided Practice',
      practice: 'Practice',
      speed: 'Speed Drill',
      mastery: 'Mastery Challenge',
    };
    return (
      <>
        {showMasteryBanner && methodDef && (
          <MasteryBanner
            methodName={methodDef.name}
            onContinue={() => setShowMasteryBanner(false)}
          />
        )}
        <div className="card-surface mx-auto max-w-md p-8 text-center space-y-4">
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${passed ? 'bg-[#FBBF24]/10' : 'bg-[#5EEAD4]/10'}`}
          >
            {passed ? (
              <Sparkles size={28} className="text-[#FBBF24]" />
            ) : (
              <Trophy size={28} className="text-[#5EEAD4]" strokeWidth={1.5} />
            )}
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#EDF1F7]">
            {isMastery && passed ? 'Challenge Passed!' : 'Session Complete!'}
          </h2>
          <p className="text-sm text-[#8B96AB]">
            {methodDef?.name} · {stageLabels[stage]}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#0F1521] p-3">
              <p className="font-[family-name:var(--font-mono)] text-2xl font-semibold text-[#FFB020]">{score}</p>
              <p className="text-xs text-[#8B96AB]">Points earned</p>
            </div>
            <div className="rounded-xl bg-[#0F1521] p-3">
              <p
                className="font-[family-name:var(--font-mono)] text-2xl font-semibold"
                style={{ color: accuracy >= 80 ? '#5EEAD4' : accuracy >= 60 ? '#FFB020' : '#FF6B6B' }}
              >
                {accuracy}%
              </p>
              <p className="text-xs text-[#8B96AB]">Accuracy</p>
            </div>
          </div>

          {isMastery && !passed && (
            <div className="rounded-xl border border-[#FF6B6B]/20 bg-[#FF6B6B]/5 p-3">
              <p className="text-xs text-[#FF6B6B]">
                Need 80%+ to unlock the next tier. You scored {accuracy}%. Keep practicing!
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#FFB020] px-4 py-2.5 text-sm font-semibold text-[#0F1521] transition-opacity hover:opacity-90"
            >
              <RotateCcw size={16} strokeWidth={2.5} />
              Try again
            </button>
            <Link
              href={`/practice/${methodId}`}
              className="flex flex-1 items-center justify-center rounded-lg bg-[#161E2E] px-4 py-2.5 text-sm font-semibold text-[#EDF1F7] transition-colors hover:bg-[#1C2536]"
            >
              Method Map
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ── Active Session ─────────────────────────────────────────────────────────
  const progressPct = ((currentIndex + 1) / questions.length) * 100;
  const timerPct = (timeLeft / (currentQuestion?.timeLimitSeconds ?? 20)) * 100;
  const isSpeed = stage === 'speed';
  const isMastery = stage === 'mastery';
  const isGuided = stage === 'guided';

  const diffColor = effectiveDifficulty === 'easy' ? '#5EEAD4' : effectiveDifficulty === 'medium' ? '#FFB020' : '#FF6B6B';
  const stageColor = isSpeed ? '#FF6B6B' : isMastery ? '#FBBF24' : isGuided ? '#60A5FA' : diffColor;

  const stageLabels: Record<PracticeStage, string> = {
    learn: 'Learn',
    guided: 'Guided',
    practice: 'Practice',
    speed: 'Speed Drill',
    mastery: 'Mastery',
  };

  return (
    <>
      {showMasteryBanner && methodDef && (
        <MasteryBanner
          methodName={methodDef.name}
          onContinue={() => setShowMasteryBanner(false)}
        />
      )}
      <div className="mx-auto max-w-lg space-y-5">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href={`/practice/${methodId}`}
            className="flex items-center gap-1 text-sm text-[#8B96AB] hover:text-[#EDF1F7]"
          >
            <ArrowLeft size={16} /> Exit
          </Link>
          <div className="flex items-center gap-2">
            {isSpeed && <Zap size={13} className="text-[#FF6B6B]" />}
            {isMastery && <Sparkles size={13} className="text-[#FBBF24]" />}
            {isGuided && <Lightbulb size={13} className="text-[#60A5FA]" />}
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
              style={{ backgroundColor: `${stageColor}1A`, color: stageColor }}
            >
              {stageLabels[stage]}
            </span>
          </div>
          <span className="font-[family-name:var(--font-mono)] text-xs text-[#8B96AB]">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="progress-track">
          <div className="h-full rounded-full bg-[#5EEAD4] transition-all" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Card */}
        <div className="card-surface p-6 sm:p-8">
          {/* Timer */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <Clock size={16} className={timeLeft <= 5 ? 'text-[#FF6B6B]' : 'text-[#8B96AB]'} />
            <span
              className={`font-[family-name:var(--font-mono)] text-sm font-semibold ${timeLeft <= 5 ? 'text-[#FF6B6B]' : 'text-[#8B96AB]'}`}
            >
              {timeLeft}s
            </span>
          </div>

          <div className="progress-track mb-6 h-1">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${timerPct}%`, backgroundColor: timeLeft <= 5 ? '#FF6B6B' : isSpeed ? '#FF6B6B' : '#5EEAD4' }}
            />
          </div>

          {/* Question */}
          <p className="text-center font-[family-name:var(--font-display)] text-3xl font-semibold text-[#EDF1F7] sm:text-4xl">
            {currentQuestion.prompt}
          </p>

          {/* Hint (guided stage) */}
          {isGuided && currentQuestion.hint && answerState === 'idle' && (
            <div className="mt-4 rounded-xl border border-[#60A5FA]/20 bg-[#60A5FA]/5 p-3 flex items-start gap-2">
              <Lightbulb size={14} className="mt-0.5 shrink-0 text-[#60A5FA]" />
              <p className="text-xs text-[#60A5FA]">{currentQuestion.hint}</p>
            </div>
          )}

          {/* Answer input */}
          <div className="mt-8">
            {currentQuestion.type === 'mcq' ? (
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options?.map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedAnswer(opt);
                      handleSubmit(opt);
                    }}
                    disabled={answerState !== 'idle' || submitting}
                    className={optionClass(opt, selectedAnswer, answerState, revealedAnswer)}
                  >
                    <span className="mr-2 text-xs font-normal text-[#8B96AB]">{i + 1}</span>
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <NumericInput
                inputRef={inputRef}
                value={selectedAnswer}
                onChange={setSelectedAnswer}
                onSubmit={() => handleSubmit(selectedAnswer)}
                disabled={answerState !== 'idle' || submitting}
                answerState={answerState}
              />
            )}
          </div>

          {/* Feedback */}
          {answerState !== 'idle' && (
            <div
              className={`mt-4 flex items-center justify-center gap-1.5 text-sm font-medium ${answerState === 'correct' ? 'text-[#5EEAD4]' : 'text-[#FF6B6B]'}`}
            >
              {answerState === 'correct' ? (
                <>
                  <CheckCircle2 size={16} /> Correct!
                </>
              ) : (
                <>
                  <XCircle size={16} /> Answer: {revealedAnswer}
                </>
              )}
            </div>
          )}

          {currentQuestion.type === 'mcq' && answerState === 'idle' && (
            <p className="mt-4 text-center text-xs text-[#8B96AB]">Tip: press 1–4 on your keyboard</p>
          )}
        </div>

        {/* Score */}
        <div className="text-center font-[family-name:var(--font-mono)] text-sm text-[#8B96AB]">
          Score: <span className="font-semibold text-[#FFB020]">{score}</span>
        </div>
      </div>
    </>
  );
}

function optionClass(opt: string, selected: string, state: AnswerState, revealedAnswer: string | null): string {
  const base =
    'rounded-xl border px-4 py-4 text-lg font-semibold transition-colors font-[family-name:var(--font-mono)] text-left';
  if (state === 'idle') {
    return `${base} border-[#5EEAD4]/10 bg-[#0F1521] text-[#EDF1F7] hover:border-[#5EEAD4]/40`;
  }
  const isCorrectOpt = revealedAnswer === opt;
  const isSelectedOpt = opt === selected;
  if (isCorrectOpt) return `${base} border-[#5EEAD4] bg-[#5EEAD4]/10 text-[#5EEAD4]`;
  if (isSelectedOpt) return `${base} border-[#FF6B6B] bg-[#FF6B6B]/10 text-[#FF6B6B]`;
  return `${base} border-[#5EEAD4]/10 bg-[#0F1521] text-[#8B96AB] opacity-50`;
}

function NumericInput({
  inputRef,
  value,
  onChange,
  onSubmit,
  disabled,
  answerState,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  answerState: AnswerState;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex gap-2"
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer, press Enter"
        className={`flex-1 rounded-xl border bg-[#0F1521] px-4 py-3 text-center font-[family-name:var(--font-mono)] text-xl font-semibold text-[#EDF1F7] outline-none transition-colors ${
          answerState === 'correct'
            ? 'border-[#5EEAD4]'
            : answerState === 'incorrect'
            ? 'border-[#FF6B6B]'
            : 'border-[#5EEAD4]/10 focus:border-[#5EEAD4]/50'
        }`}
      />
      <button
        type="submit"
        disabled={disabled || !value}
        className="rounded-xl bg-[#FFB020] px-5 py-3 text-sm font-semibold text-[#0F1521] transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Submit
      </button>
    </form>
  );
}
