import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { regenerateQuestion } from '@/lib/questionGenerator';
import { POINTS_PER_CORRECT, METHOD_MASTERY_ACCURACY, METHOD_MASTERY_QUESTIONS } from '@/lib/constants';
import { VALID_METHOD_IDS } from '@/data/methods';
import { Difficulty } from '@/types';
import { PracticeStage } from '@/data/methods';

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
const VALID_STAGES = ['learn', 'guided', 'practice', 'speed', 'mastery'] as const;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Input validation ───────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { methodId, seed, answer, difficulty, stage } = body as Record<string, unknown>;

  if (typeof methodId !== 'string' || !VALID_METHOD_IDS.has(methodId)) {
    return NextResponse.json({ error: 'Invalid methodId' }, { status: 400 });
  }

  if (typeof seed !== 'number' || !Number.isInteger(seed) || seed < 0 || seed > 2_147_483_647) {
    return NextResponse.json({ error: 'Invalid seed' }, { status: 400 });
  }

  if (typeof answer !== 'string' || answer.length > 64) {
    return NextResponse.json({ error: 'Invalid answer' }, { status: 400 });
  }

  const safeDifficulty: Difficulty = (VALID_DIFFICULTIES as readonly string[]).includes(difficulty as string)
    ? (difficulty as Difficulty)
    : 'medium';

  const safeStage: PracticeStage = (VALID_STAGES as readonly string[]).includes(stage as string)
    ? (stage as PracticeStage)
    : 'practice';

  // ── Regenerate question to verify answer ───────────────────────────────────
  let regenerated: { correctAnswer: string };
  try {
    regenerated = regenerateQuestion(methodId, seed, safeDifficulty, safeStage);
  } catch {
    return NextResponse.json({ error: 'Unknown question. Please start a new session.' }, { status: 400 });
  }

  const isCorrect = regenerated.correctAnswer.trim() === answer.trim();

  // ── Composite key: "{methodId}-{difficulty}" ───────────────────────────────
  const compositeKey = `${methodId}-${safeDifficulty}`;

  // ── Upsert progress_stats ──────────────────────────────────────────────────
  const { data: existing } = await supabase
    .from('progress_stats')
    .select('questions_answered, questions_correct, best_streak')
    .eq('user_id', user.id)
    .eq('topic_id', compositeKey)
    .single();

  const newAnswered = (existing?.questions_answered ?? 0) + 1;
  const newCorrect = (existing?.questions_correct ?? 0) + (isCorrect ? 1 : 0);
  const newAccuracy = Math.round((newCorrect / newAnswered) * 100);

  await supabase.from('progress_stats').upsert(
    {
      user_id: user.id,
      topic_id: compositeKey,
      questions_answered: newAnswered,
      questions_correct: newCorrect,
      accuracy: newAccuracy,
      best_streak: existing?.best_streak ?? 0,
      last_practiced_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,topic_id' }
  );

  // ── Atomic score increment (prevents race condition) ───────────────────────
  if (isCorrect) {
    await supabase.rpc('increment_total_score', {
      user_id_input: user.id,
      points: POINTS_PER_CORRECT,
    });
  }

  // ── Mastery check (returned to client so it can show unlock animation) ─────
  const masteryAchieved =
    safeStage === 'mastery' &&
    newAccuracy >= METHOD_MASTERY_ACCURACY &&
    newAnswered >= METHOD_MASTERY_QUESTIONS;

  return NextResponse.json({
    correct: isCorrect,
    correctAnswer: regenerated.correctAnswer,
    pointsEarned: isCorrect ? POINTS_PER_CORRECT : 0,
    masteryAchieved,
  });
}