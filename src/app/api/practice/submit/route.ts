import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { regenerateQuestion } from '@/lib/questionGenerator';
import { POINTS_PER_CORRECT, MAX_DISPLAY_NAME_LENGTH } from '@/lib/constants';

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
type Difficulty = (typeof VALID_DIFFICULTIES)[number];

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

  const { topicId, seed, answer, difficulty } = body as Record<string, unknown>;

  if (typeof topicId !== 'string' || topicId.length === 0 || topicId.length > 64) {
    return NextResponse.json({ error: 'Invalid topicId' }, { status: 400 });
  }

  if (typeof seed !== 'number' || !Number.isInteger(seed) || seed < 0 || seed > 2_147_483_647) {
    return NextResponse.json({ error: 'Invalid seed' }, { status: 400 });
  }

  if (typeof answer !== 'string' || answer.length > 64) {
    return NextResponse.json({ error: 'Invalid answer' }, { status: 400 });
  }

  const safeDifficulty: Difficulty =
    typeof difficulty === 'string' && (VALID_DIFFICULTIES as readonly string[]).includes(difficulty)
      ? (difficulty as Difficulty)
      : 'medium';

  // ── Regenerate question to verify answer ───────────────────────────────────
  let regenerated;
  try {
    regenerated = regenerateQuestion(topicId, seed, safeDifficulty);
  } catch {
    // Don't expose internal error details to the client
    return NextResponse.json({ error: 'Unknown question. Please start a new session.' }, { status: 400 });
  }

  const isCorrect = regenerated.correctAnswer.trim() === answer.trim();

  // ── Upsert progress_stats ──────────────────────────────────────────────────
  const { data: existing } = await supabase
    .from('progress_stats')
    .select('questions_answered, questions_correct, best_streak')
    .eq('user_id', user.id)
    .eq('topic_id', topicId)
    .single();

  const newAnswered = (existing?.questions_answered ?? 0) + 1;
  const newCorrect = (existing?.questions_correct ?? 0) + (isCorrect ? 1 : 0);
  const newAccuracy = Math.round((newCorrect / newAnswered) * 100);

  await supabase.from('progress_stats').upsert(
    {
      user_id: user.id,
      topic_id: topicId,
      questions_answered: newAnswered,
      questions_correct: newCorrect,
      accuracy: newAccuracy,
      best_streak: existing?.best_streak ?? 0,
      last_practiced_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,topic_id' }
  );

  // ── Atomic score increment (prevents race condition) ───────────────────────
  // Uses a single SQL UPDATE instead of read-then-write, so concurrent
  // submissions cannot cause score to be double-counted or dropped.
  if (isCorrect) {
    await supabase.rpc('increment_total_score', {
      user_id_input: user.id,
      points: POINTS_PER_CORRECT,
    });
  }

  return NextResponse.json({
    correct: isCorrect,
    correctAnswer: regenerated.correctAnswer,
    pointsEarned: isCorrect ? POINTS_PER_CORRECT : 0,
  });
}