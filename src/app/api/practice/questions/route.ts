import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateQuestionBatch } from '@/lib/questionGenerator';
import { DEFAULT_SESSION_LENGTH } from '@/lib/constants';

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
type Difficulty = (typeof VALID_DIFFICULTIES)[number];

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get('topicId');
  const countParam = Number(searchParams.get('count') ?? DEFAULT_SESSION_LENGTH);
  const difficultyParam = searchParams.get('difficulty');

  if (!topicId || typeof topicId !== 'string' || topicId.length > 64) {
    return NextResponse.json({ error: 'topicId is required' }, { status: 400 });
  }

  // Clamp count to a safe range to prevent abuse (e.g. ?count=100000)
  const count = Math.min(Math.max(1, Number.isInteger(countParam) ? countParam : DEFAULT_SESSION_LENGTH), 50);

  const difficulty: Difficulty =
    typeof difficultyParam === 'string' && (VALID_DIFFICULTIES as readonly string[]).includes(difficultyParam)
      ? (difficultyParam as Difficulty)
      : 'medium';

  try {
    const batch = generateQuestionBatch(topicId, count, difficulty);

    // Strip correctAnswer before sending to client — only seed + topicId are needed
    // to verify the answer server-side later.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const safeQuestions = batch.map(({ correctAnswer, ...rest }) => rest);

    return NextResponse.json({ questions: safeQuestions });
  } catch {
    // Don't expose internal error details
    return NextResponse.json({ error: 'Could not generate questions for this topic.' }, { status: 400 });
  }
}