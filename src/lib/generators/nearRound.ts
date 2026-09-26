import { MethodGenerator, GeneratedQuestion } from './types';
import { randInt, baseTime } from './utils';

export const nearRoundGenerator: MethodGenerator = {
  methodId: 'near-round',
  generate(rand, difficulty, stage): GeneratedQuestion {
    const isEasy = difficulty === 'easy';
    const isHard = difficulty === 'hard';
    const needsHint = stage === 'guided';

    let a: number;
    let nearVal: number;
    let offset: number; // 1 or 2
    let rawB: number;
    let isAddition = rand() > 0.4;

    if (isEasy) {
      a = randInt(rand, 30, 95);
      nearVal = randInt(rand, 1, 4) * 10; // 10, 20, 30, 40
      offset = rand() > 0.5 ? 1 : 2;
      rawB = nearVal - offset; // e.g. 9, 19, 29, 38
    } else if (isHard) {
      a = randInt(rand, 1200, 5000);
      nearVal = rand() > 0.5 ? 1000 : 2000;
      offset = rand() > 0.5 ? 1 : 2;
      rawB = nearVal - offset; // e.g. 999, 998, 1999
    } else {
      a = randInt(rand, 250, 850);
      nearVal = randInt(rand, 1, 4) * 100; // 100, 200, 300, 400
      offset = rand() > 0.5 ? 1 : 2;
      rawB = nearVal - offset; // e.g. 99, 199, 298
    }

    if (!isAddition && a <= rawB) {
      a = rawB + randInt(rand, 50, 300);
    }

    const answer = isAddition ? a + rawB : a - rawB;
    const opSymbol = isAddition ? '+' : '−';

    const hint = isAddition
      ? `${rawB} is close to ${nearVal} (${nearVal} − ${offset}). Add ${nearVal} to ${a}, then subtract ${offset}.`
      : `${rawB} is close to ${nearVal} (${nearVal} − ${offset}). Subtract ${nearVal} from ${a}, then add back ${offset}.`;

    return {
      type: 'numeric',
      prompt: `${a.toLocaleString()} ${opSymbol} ${rawB.toLocaleString()} = ?`,
      correctAnswer: String(answer),
      hint: needsHint ? hint : undefined,
      difficulty,
      timeLimitSeconds: baseTime(difficulty, 18),
    };
  },
};
