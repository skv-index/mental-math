import { MethodGenerator, GeneratedQuestion } from './types';
import { randInt, baseTime, pickOne } from './utils';

interface DivisorSpec {
  divisor: number;
  factors: [number, number];
}

export const divisionFactorsGenerator: MethodGenerator = {
  methodId: 'division-factors',
  generate(rand, difficulty, stage): GeneratedQuestion {
    const isEasy = difficulty === 'easy';
    const isHard = difficulty === 'hard';
    const needsHint = stage === 'guided';

    let specs: readonly DivisorSpec[];

    if (isEasy) {
      specs = [
        { divisor: 4, factors: [2, 2] },
        { divisor: 6, factors: [2, 3] },
        { divisor: 8, factors: [2, 4] },

      ];
    } else if (isHard) {
      specs = [
        { divisor: 24, factors: [3, 8] },
        { divisor: 24, factors: [4, 6] },
        { divisor: 36, factors: [4, 9] },
        { divisor: 36, factors: [6, 6] },
      ];
    } else {
      specs = [
        { divisor: 12, factors: [3, 4] },
        { divisor: 14, factors: [2, 7] },
        { divisor: 15, factors: [3, 5] },
        { divisor: 18, factors: [2, 9] },
      ];
    }

    const spec = pickOne(specs, rand);
    const quotient = randInt(rand, isEasy ? 6 : 12, isHard ? 45 : 30);
    const dividend = spec.divisor * quotient;

    const hint = `Factor ${spec.divisor} into ${spec.factors[0]} × ${spec.factors[1]}. First divide ${dividend} by ${spec.factors[0]}, then divide that quotient by ${spec.factors[1]}.`;

    return {
      type: 'numeric',
      prompt: `${dividend} ÷ ${spec.divisor} = ?`,
      correctAnswer: String(quotient),
      hint: needsHint ? hint : undefined,
      difficulty,
      timeLimitSeconds: baseTime(difficulty, 22),
    };
  },
};
