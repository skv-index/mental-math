'use client';

import { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, CheckCircle2, XCircle, Trophy, RotateCcw, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Difficulty } from '@/types';
import { fetchDefaultDifficulty } from '@/lib/updateUser';


interface TopicInfo {
  id: string;
  name: string;
  description: string;
}

interface SafeQuestion {
  id: string;
  topicId: string;
  seed: number;
  type: 'mcq' | 'numeric';
  prompt: string;
  options?: string[];
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

function PracticeSession() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get('topic');
  const supabase = createClient();

  const [topic, setTopic] = useState<TopicInfo | null>(null);
  const [questions, setQuestions] = useState<SafeQuestion[]>([]);
  const [loading, setLoading] = useState(Boolean(topicId));
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
  const [defaultDifficulty, setDefaultDifficulty] = useState<Difficulty>('medium');
  const [difficultyLoaded, setDifficultyLoaded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const urlDifficulty = searchParams.get('difficulty') as Difficulty | null;
  const effectiveDifficulty = urlDifficulty && ['easy', 'medium', 'hard'].includes(urlDifficulty) ? urlDifficulty : defaultDifficulty;

  useEffect(() => {
    if (!topicId) {
      return;
    }

    if (!difficultyLoaded && !urlDifficulty) {
      return;
    }

    async function load() {
      setLoading(true);
      const [topicResult, questionsResult] = await Promise.all([
        supabase.from('topics').select('id, name, description').eq('id', topicId).single(),
        fetch(`/api/practice/questions?topicId=${topicId}&count=10&difficulty=${effectiveDifficulty}`).then((r) => r.json()),
      ]);

      if (topicResult.data) setTopic(topicResult.data);

      if (questionsResult.error) {
        setLoadError(questionsResult.error);
      } else {
        setQuestions(questionsResult.questions);
        setTimeLeft(questionsResult.questions[0]?.timeLimitSeconds ?? 20);
      }
      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, difficultyLoaded, effectiveDifficulty]);

  const currentQuestion = questions[currentIndex];

  // Auto-focus the numeric input every time a new question appears
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

      const res = await fetch('/api/practice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: currentQuestion.topicId,
          seed: currentQuestion.seed,
          answer,
          difficulty: effectiveDifficulty,
        }),
      });
      const result = await res.json();

      setAnswerState(result.correct ? 'correct' : 'incorrect');
      setRevealedAnswer(result.correctAnswer);
      if (result.correct) {
        setScore((s) => s + result.pointsEarned);
        setCorrectCount((c) => c + 1);
      }
      setSubmitting(false);
      setTimeout(handleNext, 900);
    },
    [answerState, currentQuestion, submitting, effectiveDifficulty, handleNext]
  );

  // Keyboard shortcuts: 1-4 to pick MCQ options
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
      const timeoutId = setTimeout(() => {
        handleSubmit('');
      }, 0);
      return () => clearTimeout(timeoutId);
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, loading, sessionComplete, answerState, currentQuestion, handleSubmit]);

  if (!topicId) {
    return (
      <div className="card-surface p-8 text-center">
        <p className="text-sm text-[#8B96AB]">No topic selected.</p>
        <Link href="/practice" className="mt-3 inline-block text-sm font-medium text-[#5EEAD4] hover:underline">
          Browse topics
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="card-surface h-64 animate-pulse" />;
  }

  if (loadError || questions.length === 0) {
    return (
      <div className="card-surface p-8 text-center">
        <p className="text-sm text-[#8B96AB]">{loadError || 'No questions available for this topic yet.'}</p>
        <Link href="/practice" className="mt-3 inline-block text-sm font-medium text-[#5EEAD4] hover:underline">
          Browse other topics
        </Link>
      </div>
    );
  }

  if (sessionComplete) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="card-surface mx-auto max-w-md p-8 text-center">
        <Trophy size={40} className="mx-auto text-[#FFB020]" strokeWidth={1.5} />
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-[#EDF1F7]">
          Session complete!
        </h2>
        <p className="mt-1 text-sm text-[#8B96AB]">{topic?.name}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#0F1521] p-3">
            <p className="font-[family-name:var(--font-mono)] text-2xl font-semibold text-[#FFB020]">{score}</p>
            <p className="text-xs text-[#8B96AB]">Points earned</p>
          </div>
          <div className="rounded-xl bg-[#0F1521] p-3">
            <p className="font-[family-name:var(--font-mono)] text-2xl font-semibold text-[#5EEAD4]">{accuracy}%</p>
            <p className="text-xs text-[#8B96AB]">Accuracy</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#FFB020] px-4 py-2.5 text-sm font-semibold text-[#0F1521] transition-opacity hover:opacity-90"
          >
            <RotateCcw size={16} strokeWidth={2.5} />
            Try again
          </button>
          <Link
            href="/practice"
            className="flex flex-1 items-center justify-center rounded-lg bg-[#161E2E] px-4 py-2.5 text-sm font-semibold text-[#EDF1F7] transition-colors hover:bg-[#1C2536]"
          >
            Back to Practice
          </Link>
        </div>
      </div>
    );
  }

  const progressPct = ((currentIndex + 1) / questions.length) * 100;
  const timerPct = (timeLeft / (currentQuestion?.timeLimitSeconds ?? 20)) * 100;

  const diffColor = effectiveDifficulty === 'easy' ? '#5EEAD4' : effectiveDifficulty === 'medium' ? '#FFB020' : '#FF6B6B';

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/practice" className="flex items-center gap-1 text-sm text-[#8B96AB] hover:text-[#EDF1F7]">
          <ArrowLeft size={16} />
          Exit
        </Link>
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
          style={{ backgroundColor: `${diffColor}1A`, color: diffColor }}
        >
          {effectiveDifficulty} Mode
        </span>
        <span className="font-[family-name:var(--font-mono)] text-xs text-[#8B96AB]">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="progress-track">
        <div className="h-full rounded-full bg-[#5EEAD4] transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="card-surface p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Clock size={16} className={timeLeft <= 5 ? 'text-[#FF6B6B]' : 'text-[#8B96AB]'} />
          <span className={`font-[family-name:var(--font-mono)] text-sm font-semibold ${timeLeft <= 5 ? 'text-[#FF6B6B]' : 'text-[#8B96AB]'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="progress-track mb-6 h-1">
          <div
            className={`h-full rounded-full transition-all ${timeLeft <= 5 ? 'bg-[#FF6B6B]' : 'bg-[#5EEAD4]'}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>

        <p className="text-center font-[family-name:var(--font-display)] text-3xl font-semibold text-[#EDF1F7] sm:text-4xl">
          {currentQuestion.prompt}
        </p>

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

        {answerState !== 'idle' && (
          <div className={`mt-4 flex items-center justify-center gap-1.5 text-sm font-medium ${answerState === 'correct' ? 'text-[#5EEAD4]' : 'text-[#FF6B6B]'}`}>
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

      <div className="text-center font-[family-name:var(--font-mono)] text-sm text-[#8B96AB]">
        Score: <span className="font-semibold text-[#FFB020]">{score}</span>
      </div>
    </div>
  );
}

function optionClass(opt: string, selected: string, state: AnswerState, revealedAnswer: string | null): string {
  const base = 'rounded-xl border px-4 py-4 text-lg font-semibold transition-colors font-[family-name:var(--font-mono)] text-left';
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
        className={`flex-1 rounded-xl border bg-[#0F1521] px-4 py-3 text-center font-[family-name:var(--font-mono)] text-xl font-semibold text-[#EDF1F7] outline-none transition-colors ${answerState === 'correct' ? 'border-[#5EEAD4]' : answerState === 'incorrect' ? 'border-[#FF6B6B]' : 'border-[#5EEAD4]/10 focus:border-[#5EEAD4]/50'
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
