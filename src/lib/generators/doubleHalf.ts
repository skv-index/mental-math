import { MethodGenerator, GeneratedQuestion } from './types';
import { randInt, buildMcqOptions, baseTime, pickOne } from './utils';

export const doubleHalfGenerator: MethodGenerator = {
  methodId: 'double-half',
  generate(rand, difficulty, stage): GeneratedQuestion {
    const isEasy = difficulty === 'easy';
    const isHard = difficulty === 'hard';
    const needsHint = stage === 'guided';

    let a: number; // factor to double (ends in 5 or 25)
    let b: number; // factor to halve (even)

    if (isEasy) {
      a = pickOne([15, 25, 35], rand);
      b = pickOne([4, 6, 8, 12, 14, 16], rand);
    } else if (isHard) {
      a = pickOne([25, 35, 45, 75, 125], rand);
      b = pickOne([16, 24, 28, 32, 36, 44, 48], rand);
    } else {
      a = pickOne([15, 25, 35, 45], rand);
      b = pickOne([12, 14, 18, 22, 26, 28], rand);
    }

    const answer = a * b;
    const doubledA = a * 2;
    const halvedB = b / 2;

    const hint = `Double ${a} → ${doubledA}, and halve ${b} → ${halvedB}. Now calculate ${doubledA} × ${halvedB}.`;

    return {
      type: isEasy ? 'mcq' : 'numeric',
      prompt: `${a} × ${b} = ?`,
      correctAnswer: String(answer),
      options: isEasy ? buildMcqOptions(answer, rand, Math.max(10, Math.round(answer * 0.15))) : undefined,
      hint: needsHint ? hint : undefined,
      difficulty,
      timeLimitSeconds: baseTime(difficulty, 20),
    };
  },
};
