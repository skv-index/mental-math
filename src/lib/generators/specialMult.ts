import { MethodGenerator, GeneratedQuestion } from './types';
import { randInt, buildMcqOptions, baseTime, pickOne } from './utils';

type Multiplier = 5 | 9 | 11 | 25 | 50;

export const specialMultGenerator: MethodGenerator = {
  methodId: 'special-mult',
  generate(rand, difficulty, stage): GeneratedQuestion {
    const isEasy = difficulty === 'easy';
    const isHard = difficulty === 'hard';
    const needsHint = stage === 'guided';

    let mults: readonly Multiplier[];
    if (isEasy) mults = [5, 9];
    else if (isHard) mults = [9, 11, 25, 50];
    else mults = [5, 9, 11, 25];

    const mult = pickOne(mults, rand);
    let other: number;

    // Ensure operand fits the shortcut nicely
    if (mult === 5 || mult === 50) {
      // even number
      other = randInt(rand, isEasy ? 4 : 12, isHard ? 48 : 28) * 2;
    } else if (mult === 25) {
      // multiple of 4
      other = randInt(rand, isEasy ? 2 : 4, isHard ? 24 : 15) * 4;
    } else if (mult === 11) {
      // 2-digit number
      other = randInt(rand, isEasy ? 12 : 21, isHard ? 89 : 65);
    } else {
      // mult === 9
      other = randInt(rand, isEasy ? 12 : 24, isHard ? 95 : 68);
    }

    const answer = mult * other;

    const hints: Record<Multiplier, string> = {
      5: `Shortcut for ×5: Halve ${other} (get ${other / 2}), then multiply by 10.`,
      9: `Shortcut for ×9: Multiply ${other} by 10 (${other * 10}), then subtract ${other}.`,
      11: `Shortcut for ×11: For 2-digit AB, write A, (A+B), B. Sum middle digits of ${other}.`,
      25: `Shortcut for ×25: Divide ${other} by 4 (${other / 4}), then multiply by 100.`,
      50: `Shortcut for ×50: Divide ${other} by 2 (${other / 2}), then multiply by 100.`,
    };

    return {
      type: isEasy ? 'mcq' : 'numeric',
      prompt: `${other} × ${mult} = ?`,
      correctAnswer: String(answer),
      options: isEasy ? buildMcqOptions(answer, rand, Math.max(8, Math.round(answer * 0.12))) : undefined,
      hint: needsHint ? hints[mult] : undefined,
      difficulty,
      timeLimitSeconds: baseTime(difficulty, 18),
    };
  },
};
