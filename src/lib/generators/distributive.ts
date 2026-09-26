import { MethodGenerator, GeneratedQuestion } from './types';
import { randInt, baseTime } from './utils';

export const distributiveGenerator: MethodGenerator = {
  methodId: 'distributive',
  generate(rand, difficulty, stage): GeneratedQuestion {
    const isEasy = difficulty === 'easy';
    const isHard = difficulty === 'hard';
    const needsHint = stage === 'guided';

    let a: number;
    let b: number;
    let bTens: number;
    let bOnes: number;

    if (isEasy) {
      a = randInt(rand, 3, 7);
      bTens = randInt(rand, 1, 3) * 10;
      bOnes = randInt(rand, 2, 8);
      b = bTens + bOnes;
    } else if (isHard) {
      a = randInt(rand, 4, 9);
      const bHundreds = randInt(rand, 1, 3) * 100;
      bOnes = randInt(rand, 2, 9);
      b = bHundreds + bOnes;
      bTens = bHundreds; // for hint display
    } else {
      a = randInt(rand, 4, 9);
      bTens = randInt(rand, 4, 8) * 10;
      bOnes = randInt(rand, 3, 9);
      b = bTens + bOnes;
    }

    const answer = a * b;

    const hint = isHard
      ? `Expand ${b} into ${Math.floor(b / 100) * 100} + ${b % 100}. Compute ${a} × ${Math.floor(b / 100) * 100} and ${a} × ${b % 100}, then add them.`
      : `Expand ${b} into ${bTens} + ${bOnes}. Compute ${a} × ${bTens} and ${a} × ${bOnes}, then add them.`;

    return {
      type: 'numeric',
      prompt: `${a} × ${b} = ?`,
      correctAnswer: String(answer),
      hint: needsHint ? hint : undefined,
      difficulty,
      timeLimitSeconds: baseTime(difficulty, 22),
    };
  },
};
