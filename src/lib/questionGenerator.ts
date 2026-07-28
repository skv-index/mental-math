import { Question, QuestionType, Difficulty } from '@/types';

// Seeded PRNG so the same seed always produces the same question —
// this lets us regenerate and verify an answer server-side without storing anything.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildMcqOptions(answer: number, rand: () => number, spread: number): string[] {
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const delta = randInt(rand, 1, spread) * (rand() > 0.5 ? 1 : -1);
    const candidate = answer + delta;
    if (candidate !== answer && candidate >= 0) wrongs.add(candidate);
  }
  return shuffle([answer, ...Array.from(wrongs)].map(String), rand);
}

interface GeneratedQuestion {
  type: QuestionType;
  prompt: string;
  correctAnswer: string;
  options?: string[];
  difficulty: Difficulty;
  timeLimitSeconds: number;
}

// Topic-specific generation logic with Easy, Medium, and Hard variations
function generate(topicId: string, rand: () => number, difficulty: Difficulty = 'medium'): GeneratedQuestion {
  const isEasy = difficulty === 'easy';
  const isHard = difficulty === 'hard';

  switch (topicId) {
    case 'k-counting': {
      const emojis = ['⭐', '🍎', '❤️', '⚪', '🔵', '☀️'];
      const emoji = emojis[randInt(rand, 0, emojis.length - 1)];
      const count = isEasy ? randInt(rand, 1, 5) : isHard ? randInt(rand, 6, 15) : randInt(rand, 1, 10);
      const answer = count;
      return {
        type: 'mcq',
        prompt: `How many ${emoji}? ${emoji.repeat(count)}`,
        correctAnswer: String(answer),
        options: buildMcqOptions(answer, rand, isEasy ? 2 : isHard ? 4 : 3),
        difficulty,
        timeLimitSeconds: isEasy ? 20 : isHard ? 10 : 15,
      };
    }
    case 'k-addition': {
      const max = isEasy ? 3 : isHard ? 10 : 5;
      const min = isHard ? 4 : 1;
      const a = randInt(rand, min, max);
      const b = randInt(rand, min, max);
      const answer = a + b;
      return {
        type: 'numeric',
        prompt: `${a} + ${b} = ?`,
        correctAnswer: String(answer),
        difficulty,
        timeLimitSeconds: isEasy ? 20 : isHard ? 10 : 15,
      };
    }
    case 'g1-addition': {
      const maxA = isEasy ? 10 : isHard ? 30 : 15;
      const maxB = isEasy ? 10 : isHard ? 30 : 20;
      const a = randInt(rand, 1, maxA);
      const b = randInt(rand, 1, maxB);
      const answer = a + b;
      return {
        type: 'numeric',
        prompt: `${a} + ${b} = ?`,
        correctAnswer: String(answer),
        difficulty,
        timeLimitSeconds: isEasy ? 20 : isHard ? 10 : 15,
      };
    }
    case 'g1-subtraction': {
      const maxA = isEasy ? 10 : isHard ? 40 : 20;
      const minA = isEasy ? 5 : isHard ? 15 : 5;
      let a = randInt(rand, minA, maxA);
      let b = randInt(rand, 1, a);
      const answer = a - b;
      return {
        type: 'numeric',
        prompt: `${a} - ${b} = ?`,
        correctAnswer: String(answer),
        difficulty,
        timeLimitSeconds: isEasy ? 20 : isHard ? 10 : 15,
      };
    }
    case 'g2-addition100': {
      const a = isEasy ? randInt(rand, 10, 40) : isHard ? randInt(rand, 50, 99) : randInt(rand, 10, 89);
      const b = isEasy ? randInt(rand, 10, 40) : isHard ? randInt(rand, 50, 99) : randInt(rand, 10, 99 - a);
      const answer = a + b;
      return {
        type: 'numeric',
        prompt: `${a} + ${b} = ?`,
        correctAnswer: String(answer),
        difficulty,
        timeLimitSeconds: isEasy ? 25 : isHard ? 12 : 20,
      };
    }
    case 'g2-subtraction100': {
      let a = isEasy ? randInt(rand, 20, 50) : isHard ? randInt(rand, 60, 150) : randInt(rand, 30, 99);
      let b = isEasy ? randInt(rand, 5, a - 1) : isHard ? randInt(rand, 25, a - 1) : randInt(rand, 10, a - 1);
      const answer = a - b;
      return {
        type: 'numeric',
        prompt: `${a} - ${b} = ?`,
        correctAnswer: String(answer),
        difficulty,
        timeLimitSeconds: isEasy ? 25 : isHard ? 12 : 20,
      };
    }
    case 'g3-mult-facts': {
      const maxVal = isEasy ? 5 : isHard ? 15 : 12;
      const minVal = isEasy ? 2 : isHard ? 6 : 2;
      const a = randInt(rand, minVal, maxVal);
      const b = randInt(rand, minVal, maxVal);
      const answer = a * b;
      return {
        type: 'mcq',
        prompt: `${a} × ${b} = ?`,
        correctAnswer: String(answer),
        options: buildMcqOptions(answer, rand, isEasy ? 3 : isHard ? 6 : 4),
        difficulty,
        timeLimitSeconds: isEasy ? 25 : isHard ? 12 : 20,
      };
    }
    case 'g3-division-facts': {
      const maxVal = isEasy ? 5 : isHard ? 15 : 12;
      const minVal = isEasy ? 2 : isHard ? 6 : 2;
      const b = randInt(rand, minVal, maxVal);
      const answer = randInt(rand, minVal, maxVal);
      const a = b * answer;
      return {
        type: 'numeric',
        prompt: `${a} ÷ ${b} = ?`,
        correctAnswer: String(answer),
        difficulty,
        timeLimitSeconds: isEasy ? 25 : isHard ? 12 : 20,
      };
    }
    case 'g4-multi-digit-mult': {
      const a = isEasy ? randInt(rand, 12, 30) : isHard ? randInt(rand, 25, 99) : randInt(rand, 12, 45);
      const b = isEasy ? randInt(rand, 2, 6) : isHard ? randInt(rand, 12, 45) : randInt(rand, 11, 25);
      const answer = a * b;
      return {
        type: 'numeric',
        prompt: `${a} × ${b} = ?`,
        correctAnswer: String(answer),
        difficulty,
        timeLimitSeconds: isEasy ? 25 : isHard ? 15 : 20,
      };
    }
    case 'g5-decimals': {
      const factor = isHard ? 100 : 10;
      const a = Math.round((randInt(rand, 10, isEasy ? 50 : 99) / 10) * factor) / factor;
      const b = Math.round((randInt(rand, 10, isEasy ? 50 : 99) / 10) * factor) / factor;
      const op = rand() > 0.5 ? '+' : '-';
      const [x, y] = op === '-' && b > a ? [b, a] : [a, b];
      const answer = op === '+' ? Math.round((x + y) * factor) / factor : Math.round((x - y) * factor) / factor;
      return {
        type: 'numeric',
        prompt: `${x} ${op} ${y} = ?`,
        correctAnswer: String(answer),
        difficulty,
        timeLimitSeconds: isEasy ? 25 : isHard ? 15 : 20,
      };
    }
    case 'g6-percentages': {
      const pcts = isEasy ? [10, 20, 50] : isHard ? [15, 35, 60, 80, 125] : [10, 20, 25, 50, 75];
      const pct = pcts[randInt(rand, 0, pcts.length - 1)];
      const base = randInt(rand, 2, isEasy ? 20 : isHard ? 60 : 40) * 4;
      const answer = (pct / 100) * base;
      return {
        type: 'mcq',
        prompt: `${pct}% of ${base} = ?`,
        correctAnswer: String(answer),
        options: buildMcqOptions(answer, rand, Math.max(5, Math.round(answer * 0.2))),
        difficulty,
        timeLimitSeconds: isEasy ? 25 : isHard ? 15 : 20,
      };
    }
    case 'g6-negatives': {
      const range = isEasy ? 10 : isHard ? 50 : 20;
      const a = randInt(rand, -range, range);
      const b = randInt(rand, -range, range);
      const isMult = isHard && rand() > 0.5;
      const answer = isMult ? a * b : a + b;
      return {
        type: 'numeric',
        prompt: isMult ? `(${a}) × (${b}) = ?` : `(${a}) + (${b}) = ?`,
        correctAnswer: String(answer),
        difficulty,
        timeLimitSeconds: isEasy ? 25 : isHard ? 12 : 20,
      };
    }
    case 'g7-basic-algebra': {
      if (isEasy) {
        const x = randInt(rand, 1, 10);
        const b = randInt(rand, 1, 20);
        const c = x + b;
        return {
          type: 'numeric',
          prompt: `Solve for x: x + ${b} = ${c}`,
          correctAnswer: String(x),
          difficulty,
          timeLimitSeconds: 25,
        };
      }
      const x = randInt(rand, 1, isHard ? 25 : 15);
      const a = randInt(rand, 2, isHard ? 15 : 9);
      const b = randInt(rand, 1, isHard ? 50 : 30);
      const c = a * x + b;
      return {
        type: 'numeric',
        prompt: `Solve for x: ${a}x + ${b} = ${c}`,
        correctAnswer: String(x),
        difficulty,
        timeLimitSeconds: isHard ? 15 : 20,
      };
    }
    case 'g8-square-roots': {
      const maxN = isEasy ? 10 : isHard ? 30 : 15;
      const n = randInt(rand, 2, maxN);
      const answer = n * n;
      return {
        type: 'mcq',
        prompt: `√${answer} = ?`,
        correctAnswer: String(n),
        options: buildMcqOptions(n, rand, 2),
        difficulty,
        timeLimitSeconds: isEasy ? 25 : isHard ? 12 : 20,
      };
    }
    case 'college-estimation': {
      const a = isEasy ? randInt(rand, 10, 99) : isHard ? randInt(rand, 1000, 9999) : randInt(rand, 100, 999);
      const b = isEasy ? randInt(rand, 10, 50) : isHard ? randInt(rand, 100, 999) : randInt(rand, 10, 99);
      const roundedA = isEasy ? Math.round(a / 10) * 10 : isHard ? Math.round(a / 1000) * 1000 : Math.round(a / 100) * 100;
      const roundedB = isEasy ? Math.round(b / 10) * 10 : isHard ? Math.round(b / 100) * 100 : Math.round(b / 10) * 10;
      const answer = roundedA * roundedB;
      return {
        type: 'numeric',
        prompt: `Estimate: ${a} × ${b}`,
        correctAnswer: String(answer),
        difficulty,
        timeLimitSeconds: isEasy ? 25 : isHard ? 15 : 20,
      };
    }
    default: {
      const a = isEasy ? randInt(rand, 1, 10) : isHard ? randInt(rand, 20, 100) : randInt(rand, 5, 25);
      const b = isEasy ? randInt(rand, 1, 10) : isHard ? randInt(rand, 20, 100) : randInt(rand, 5, 25);
      const answer = a + b;
      return {
        type: 'numeric',
        prompt: `${a} + ${b} = ?`,
        correctAnswer: String(answer),
        difficulty,
        timeLimitSeconds: isEasy ? 25 : isHard ? 12 : 20,
      };
    }
  }
}

// Public API: generate a batch of questions for a topic, each with an embedded seed
export function generateQuestionBatch(topicId: string, count: number, difficulty: Difficulty = 'medium'): (Question & { seed: number })[] {
  const questions: (Question & { seed: number })[] = [];
  for (let i = 0; i < count; i++) {
    const seed = Math.floor(Math.random() * 2_147_483_647);
    const rand = mulberry32(seed);
    const q = generate(topicId, rand, difficulty);
    questions.push({
      id: `${topicId}-${seed}`,
      topicId,
      seed,
      ...q,
      difficulty,
    });
  }
  return questions;
}

// Regenerate a single question from its seed to verify an answer server-side
export function regenerateQuestion(topicId: string, seed: number, difficulty: Difficulty = 'medium'): GeneratedQuestion {
  const rand = mulberry32(seed);
  return generate(topicId, rand, difficulty);
}