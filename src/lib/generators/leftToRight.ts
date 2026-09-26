import { MethodGenerator, GeneratedQuestion } from './types';
import { randInt, baseTime } from './utils';

export const leftToRightGenerator: MethodGenerator = {
  methodId: 'left-to-right',
  generate(rand, difficulty, stage): GeneratedQuestion {
    const isEasy = difficulty === 'easy';
    const isHard = difficulty === 'hard';
    const needsHint = stage === 'guided';

    let a: number;
    let b: number;
    let isAddition = isEasy ? true : rand() > 0.4;

    if (isEasy) {
      a = randInt(rand, 3, 8) * 10 + randInt(rand, 1, 9);
      b = randInt(rand, 2, 6) * 10 + randInt(rand, 1, 9);
    } else if (isHard) {
      a = randInt(rand, 3, 7) * 100 + randInt(rand, 2, 9) * 10 + randInt(rand, 1, 9);
      b = randInt(rand, 1, 4) * 100 + randInt(rand, 3, 9) * 10 + randInt(rand, 1, 9);
    } else {
      a = randInt(rand, 2, 6) * 100 + randInt(rand, 1, 8) * 10 + randInt(rand, 1, 9);
      b = isAddition
        ? randInt(rand, 1, 3) * 100 + randInt(rand, 2, 8) * 10 + randInt(rand, 1, 9)
        : randInt(rand, 1, Math.floor(a / 100)) * 100 + randInt(rand, 1, 6) * 10 + randInt(rand, 1, 8);
    }

    if (!isAddition && a <= b) {
      a = b + randInt(rand, 50, 200);
    }

    const answer = isAddition ? a + b : a - b;
    const opSymbol = isAddition ? '+' : '−';

    const hint = isAddition
      ? `Work left-to-right: First compute the highest place values, then add the next place value to your running total.`
      : `Work left-to-right: Subtract the largest place value first (${Math.floor(b / (isHard || !isEasy ? 100 : 10)) * (isHard || !isEasy ? 100 : 10)}), then subtract the remaining parts.`;

    return {
      type: 'numeric',
      prompt: `${a} ${opSymbol} ${b} = ?`,
      correctAnswer: String(answer),
      hint: needsHint ? hint : undefined,
      difficulty,
      timeLimitSeconds: baseTime(difficulty, 20),
    };
  },
};
