import { MethodGenerator, GeneratedQuestion } from './types';
import { randInt, baseTime } from './utils';

export const estimationGenerator: MethodGenerator = {
  methodId: 'estimation',
  generate(rand, difficulty, stage): GeneratedQuestion {
    const isEasy = difficulty === 'easy';
    const isHard = difficulty === 'hard';
    const needsHint = stage === 'guided';

    let a: number;
    let b: number;
    let magA: number;
    let magB: number;

    if (isEasy) {
      // 2-digit x 2-digit
      a = randInt(rand, 15, 88);
      b = randInt(rand, 14, 52);
      magA = 10;
      magB = 10;
    } else if (isHard) {
      // 4-digit x 1-digit or 3-digit x 3-digit
      if (rand() > 0.5) {
        a = randInt(rand, 1200, 8900);
        b = randInt(rand, 3, 9);
        magA = 1000;
        magB = 1;
      } else {
        a = randInt(rand, 150, 850);
        b = randInt(rand, 150, 750);
        magA = 100;
        magB = 100;
      }
    } else {
      // 3-digit x 2-digit
      a = randInt(rand, 140, 890);
      b = randInt(rand, 15, 85);
      magA = 100;
      magB = 10;
    }

    const roundA = Math.round(a / magA) * magA;
    const roundB = Math.round(b / magB) * magB;
    const estimatedAnswer = roundA * roundB;

    const formattedA = a.toLocaleString();
    const formattedB = b.toLocaleString();

    const hint = `Round ${formattedA} → ${roundA.toLocaleString()} and ${formattedB} → ${roundB.toLocaleString()}. Multiply the leading non-zero digits and attach trailing zeros.`;

    return {
      type: 'numeric',
      prompt: `Estimate: ${formattedA} × ${formattedB}`,
      correctAnswer: String(estimatedAnswer),
      hint: needsHint ? hint : undefined,
      difficulty,
      timeLimitSeconds: baseTime(difficulty, 22),
    };
  },
};
