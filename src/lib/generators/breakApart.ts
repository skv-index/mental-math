import { MethodGenerator, GeneratedQuestion } from './types';
import { randInt, baseTime } from './utils';

export const breakApartGenerator: MethodGenerator = {
  methodId: 'break-apart',
  generate(rand, difficulty, stage): GeneratedQuestion {
    const isEasy = difficulty === 'easy';
    const isHard = difficulty === 'hard';
    const needsHint = stage === 'guided';

    let a: number;
    let b: number;

    if (isEasy) {
      // 2-digit + 2-digit without carrying to focus on place-value split
      const aTens = randInt(rand, 2, 5) * 10;
      const aOnes = randInt(rand, 1, 4);
      const bTens = randInt(rand, 1, 4) * 10;
      const bOnes = randInt(rand, 1, 5);
      a = aTens + aOnes;
      b = bTens + bOnes;
    } else if (isHard) {
      // 3-digit + 3-digit
      const aH = randInt(rand, 1, 4) * 100;
      const aT = randInt(rand, 1, 4) * 10;
      const aO = randInt(rand, 1, 5);
      const bH = randInt(rand, 1, 4) * 100;
      const bT = randInt(rand, 1, 4) * 10;
      const bO = randInt(rand, 1, 5);
      a = aH + aT + aO;
      b = bH + bT + bO;
    } else {
      // 2-digit + 2-digit with place-value split
      const aTens = randInt(rand, 3, 6) * 10;
      const aOnes = randInt(rand, 4, 8);
      const bTens = randInt(rand, 2, 5) * 10;
      const bOnes = randInt(rand, 3, 7);
      a = aTens + aOnes;
      b = bTens + bOnes;
    }

    const answer = a + b;

    const hint = isHard
      ? `Break apart by place value: (${Math.floor(a / 100) * 100} + ${Math.floor(b / 100) * 100}) + (${(Math.floor(a / 10) % 10) * 10} + ${(Math.floor(b / 10) % 10) * 10}) + (${a % 10} + ${b % 10}).`
      : `Break apart: (${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10}) + (${a % 10} + ${b % 10}). Add tens, then ones, then combine.`;

    return {
      type: 'numeric',
      prompt: `${a} + ${b} = ?`,
      correctAnswer: String(answer),
      hint: needsHint ? hint : undefined,
      difficulty,
      timeLimitSeconds: baseTime(difficulty, 22),
    };
  },
};
