import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateQuestionBatch } from '@/lib/questionGenerator';
import { VALID_METHOD_IDS } from '@/data/methods';
import { DEFAULT_SESSION_LENGTH, SPEED_DRILL_LENGTH } from '@/lib/constants';
import { Difficulty } from '@/types';
import { PracticeStage } from '@/data/methods';

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
const VALID_STAGES = ['learn', 'guided', 'practice', 'speed', 'mastery'] as const;

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const methodId = searchParams.get('methodId');
  const difficultyParam = searchParams.get('difficulty');
  const stageParam = searchParams.get('stage');
  const countParam = Number(searchParams.get('count') ?? DEFAULT_SESSION_LENGTH);

  // Validate methodId
  if (!methodId || !VALID_METHOD_IDS.has(methodId)) {
    return NextResponse.json({ error: 'Invalid or missing methodId' }, { status: 400 });
  }

  // Clamp count to a safe range
  const stage: PracticeStage = (VALID_STAGES as readonly string[]).includes(stageParam ?? '')
    ? (stageParam as PracticeStage)
    : 'practice';

  const difficulty: Difficulty = (VALID_DIFFICULTIES as readonly string[]).includes(difficultyParam ?? '')
    ? (difficultyParam as Difficulty)
    : 'medium';

  const defaultCount = stage === 'speed' ? SPEED_DRILL_LENGTH : DEFAULT_SESSION_LENGTH;
  const count = Math.min(Math.max(1, Number.isInteger(countParam) ? countParam : defaultCount), 50);

  try {
    const batch = generateQuestionBatch(methodId, count, difficulty, stage);

    // Strip correctAnswer — only seed + methodId needed for server-side verification
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const safeQuestions = batch.map(({ correctAnswer, ...rest }) => rest);

    return NextResponse.json({ questions: safeQuestions });
  } catch {
    return NextResponse.json({ error: 'Could not generate questions for this method.' }, { status: 400 });
  }
}