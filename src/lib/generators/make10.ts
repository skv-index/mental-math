import { MethodGenerator, GeneratedQuestion } from './types';
import { randInt, buildMcqOptions, baseTime } from './utils';

export const make10Generator: MethodGenerator = {
  methodId: 'make10',
  generate(rand, difficulty, stage): GeneratedQuestion {
    const isEasy = difficulty === 'easy';
    const isHard = difficulty === 'hard';
    const needsHint = stage === 'guided';

    let a: number;
    let b: number;

    if (isEasy) {
      // Single digit + single digit bridging to 10
      a = randInt(rand, 6, 9);
      const neededTo10 = 10 - a;
      // b must be strictly greater than neededTo10 so there's a remainder
      b = randInt(rand, neededTo10 + 1, 9);
    } else if (isHard) {
      // 3-digit number + 1-2 digit number bridging to next 10 or 100
      const base = randInt(rand, 1, 8) * 100; // e.g. 300, 400
      const tens = randInt(rand, 7, 9) * 10;   // e.g. 70, 80, 90
      const ones = randInt(rand, 5, 9);        // e.g. 5..9
      a = base + tens + ones;                  // e.g. 385, 497
      const needed = (Math.floor(a / 10) + 1) * 10 - a;
      b = randInt(rand, needed + 1, 15);
    } else {
      // 2-digit number + 1-digit number bridging to next 10
      a = randInt(rand, 2, 8) * 10 + randInt(rand, 6, 9); // e.g. 47, 68
      const needed = 10 - (a % 10);
      b = randInt(rand, needed + 1, 9);
    }

    const answer = a + b;
    const targetRound = Math.ceil(a / 10) * 10;
    const gap = targetRound - a;
    const remainder = b - gap;

    const hint = `Bridge to ${targetRound}: ${a} needs ${gap} to reach ${targetRound}. Split ${b} into ${gap} + ${remainder}.`;

    return {
      type: isEasy ? 'mcq' : 'numeric',
      prompt: `${a} + ${b} = ?`,
      correctAnswer: String(answer),
      options: isEasy ? buildMcqOptions(answer, rand, 3) : undefined,
      hint: needsHint ? hint : undefined,
      difficulty,
      timeLimitSeconds: baseTime(difficulty, 18),
    };
  },
};
