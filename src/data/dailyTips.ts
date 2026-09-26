import { MethodId } from './methods';

export interface DailyTip {
  id: string;
  methodId: MethodId;
  methodName: string;
  title: string;
  insight: string;
  exampleProblem: string;
  exampleSteps: string[];
  exampleAnswer: string;
}

export const DAILY_TIPS: DailyTip[] = [
  {
    id: 'tip-make10',
    methodId: 'make10',
    methodName: 'Make 10',
    title: 'Bridge to the nearest ten first',
    insight: 'Instead of adding 8 + 6 directly, break 6 into 2 + 4. Add 2 to 8 to hit 10, then add 4.',
    exampleProblem: '47 + 8',
    exampleSteps: ['47 needs 3 to reach 50', 'Split 8 into 3 + 5', '50 + 5 = 55'],
    exampleAnswer: '55',
  },
  {
    id: 'tip-compensation',
    methodId: 'compensation',
    methodName: 'Compensation',
    title: 'Round up, then pay back the difference',
    insight: 'When adding 39 or 48, round up to 40 or 50 to make addition easy, then subtract the offset.',
    exampleProblem: '64 + 29',
    exampleSteps: ['Round 29 up to 30', '64 + 30 = 94', 'Subtracted 1 too much: 94 − 1 = 93'],
    exampleAnswer: '93',
  },
  {
    id: 'tip-double-half',
    methodId: 'double-half',
    methodName: 'Doubling & Halving',
    title: 'Trade factors to simplify multiplication',
    insight: 'Multiply by doubling one number while halving the other. The product stays identical!',
    exampleProblem: '15 × 16',
    exampleSteps: ['Double 15 → 30', 'Halve 16 → 8', '30 × 8 = 240'],
    exampleAnswer: '240',
  },
  {
    id: 'tip-special-mult',
    methodId: 'special-mult',
    methodName: 'Special Multiplication',
    title: 'The ×25 shortcut',
    insight: 'To multiply any number by 25, divide it by 4 and append two zeros (multiply by 100).',
    exampleProblem: '36 × 25',
    exampleSteps: ['36 ÷ 4 = 9', '9 × 100 = 900'],
    exampleAnswer: '900',
  },
  {
    id: 'tip-near-round',
    methodId: 'near-round',
    methodName: 'Near 10 / 100 / 1000',
    title: 'Exploit numbers ending in 9 or 99',
    insight: 'Subtracting 99 is identical to subtracting 100 then adding 1 back. It avoids carrying!',
    exampleProblem: '425 − 99',
    exampleSteps: ['425 − 100 = 325', 'Add back 1: 325 + 1 = 326'],
    exampleAnswer: '326',
  },
];

export function getDailyTip(): DailyTip {
  // Deterministic daily rotation based on day of year
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = dayOfYear % DAILY_TIPS.length;
  return DAILY_TIPS[index];
}
