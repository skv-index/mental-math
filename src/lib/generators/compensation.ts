import { MethodGenerator, GeneratedQuestion } from './types';
import { randInt, baseTime } from './utils';

export const compensationGenerator: MethodGenerator = {
  methodId: 'compensation',
  generate(rand, difficulty, stage): GeneratedQuestion {
    const isEasy = difficulty === 'easy';
    const isHard = difficulty === 'hard';
    const needsHint = stage === 'guided';

    let base: number;
    let rawB: number;
    let isAddition = rand() > 0.3; // slightly more addition

    if (isEasy) {
      base = randInt(rand, 15, 60);
      const tens = randInt(rand, 1, 4) * 10;
      const end = rand() > 0.5 ? 8 : 9; // ends in 8 or 9
      rawB = tens + end;
    } else if (isHard) {
      base = randInt(rand, 150, 600);
      const hundreds = randInt(rand, 1, 3) * 100;
      const end = randInt(rand, 96, 99); // ends in 96..99
      rawB = hundreds + end;
    } else {
      base = randInt(rand, 35, 120);
      const tens = randInt(rand, 2, 7) * 10;
      const end = rand() > 0.5 ? 8 : 9;
      rawB = tens + end;
    }

    const roundedB = Math.ceil(rawB / 10) * 10;
    const gap = roundedB - rawB;

    if (!isAddition && base <= rawB) {
      base = rawB + randInt(rand, 15, 50);
    }

    const answer = isAddition ? base + rawB : base - rawB;
    const opSymbol = isAddition ? '+' : '−';

    const hint = isAddition
      ? `Round ${rawB} UP to ${roundedB} (added ${gap} too much). Calculate ${base} + ${roundedB}, then subtract ${gap}.`
      : `Round ${rawB} UP to ${roundedB} (subtracted ${gap} too much). Calculate ${base} − ${roundedB}, then add back ${gap}.`;

    return {
      type: 'numeric',
      prompt: `${base} ${opSymbol} ${rawB} = ?`,
      correctAnswer: String(answer),
      hint: needsHint ? hint : undefined,
      difficulty,
      timeLimitSeconds: baseTime(difficulty, 20),
    };
  },
};
