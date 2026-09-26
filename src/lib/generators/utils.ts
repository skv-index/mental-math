import { Difficulty } from '@/types';

// ── Seeded PRNG (Mulberry32) ────────────────────────────────────────────────
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

export function pickOne<T>(arr: readonly T[], rand: () => number): T {
  return arr[randInt(rand, 0, arr.length - 1)];
}

export function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildMcqOptions(answer: number, rand: () => number, spread: number): string[] {
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const delta = randInt(rand, 1, Math.max(2, spread)) * (rand() > 0.5 ? 1 : -1);
    const candidate = answer + delta;
    if (candidate !== answer && candidate >= 0) wrongs.add(candidate);
  }
  return shuffle([answer, ...Array.from(wrongs)].map(String), rand);
}

export function baseTime(difficulty: Difficulty, base = 20): number {
  if (difficulty === 'easy') return base + 5;
  if (difficulty === 'hard') return Math.max(10, base - 6);
  return base;
}
