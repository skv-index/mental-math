import { QuestionType, Difficulty } from '@/types';
import { MethodId, PracticeStage } from '@/data/methods';

export interface GeneratedQuestion {
  type: QuestionType;
  prompt: string;
  correctAnswer: string;
  options?: string[];
  hint?: string;
  difficulty: Difficulty;
  timeLimitSeconds: number;
}

export interface MethodGenerator {
  methodId: MethodId;
  generate(
    rand: () => number,
    difficulty: Difficulty,
    stage: PracticeStage
  ): GeneratedQuestion;
}
