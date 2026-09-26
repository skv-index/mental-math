import { Question, Difficulty } from '@/types';
import { MethodId, PracticeStage } from '@/data/methods';
import { SPEED_DRILL_TIME_FACTOR } from '@/lib/constants';
import { getGenerator } from './generators';
import { mulberry32 } from './generators/utils';

export function generateQuestionBatch(
  methodId: string,
  count: number,
  difficulty: Difficulty = 'medium',
  stage: PracticeStage = 'practice'
): (Question & { seed: number })[] {
  const generator = getGenerator(methodId);
  const questions: (Question & { seed: number })[] = [];

  for (let i = 0; i < count; i++) {
    const seed = Math.floor(Math.random() * 2_147_483_647);
    const rand = mulberry32(seed);
    const q = generator.generate(rand, difficulty, stage);

    // Speed drill: shorten time limits
    const timeLimitSeconds =
      stage === 'speed'
        ? Math.max(5, Math.round(q.timeLimitSeconds * SPEED_DRILL_TIME_FACTOR))
        : q.timeLimitSeconds;

    questions.push({
      id: `${methodId}-${seed}`,
      topicId: methodId,
      seed,
      ...q,
      timeLimitSeconds,
      difficulty,
    });
  }

  return questions;
}

export function regenerateQuestion(
  methodId: string,
  seed: number,
  difficulty: Difficulty = 'medium',
  stage: PracticeStage = 'practice'
): { correctAnswer: string } {
  const generator = getGenerator(methodId);
  const rand = mulberry32(seed);
  const q = generator.generate(rand, difficulty, stage);
  return { correctAnswer: q.correctAnswer };
}