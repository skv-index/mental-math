import { LevelStage } from '@/types';

export const levels: LevelStage[] = [
  {
    id: 'K',
    label: 'Kindergarten',
    order: 0,
    description: 'Counting, number recognition, and simple addition up to 10.',
    colorTheme: 'pink',
    unlocked: true,
  },
  {
    id: '1',
    label: 'Grade 1',
    order: 1,
    description: 'Addition and subtraction within 20, basic place value.',
    colorTheme: 'orange',
    unlocked: false,
  },
  {
    id: '2',
    label: 'Grade 2',
    order: 2,
    description: 'Addition and subtraction within 100, intro to multiplication.',
    colorTheme: 'amber',
    unlocked: false,
  },
  {
    id: '3',
    label: 'Grade 3',
    order: 3,
    description: 'Multiplication and division facts, basic fractions.',
    colorTheme: 'yellow',
    unlocked: false,
  },
  {
    id: '4',
    label: 'Grade 4',
    order: 4,
    description: 'Multi-digit multiplication, fraction operations.',
    colorTheme: 'lime',
    unlocked: false,
  },
  {
    id: '5',
    label: 'Grade 5',
    order: 5,
    description: 'Decimals, fraction division, order of operations.',
    colorTheme: 'green',
    unlocked: false,
  },
  {
    id: '6',
    label: 'Grade 6',
    order: 6,
    description: 'Ratios, percentages, negative numbers.',
    colorTheme: 'emerald',
    unlocked: false,
  },
  {
    id: '7',
    label: 'Grade 7',
    order: 7,
    description: 'Proportions, integer operations, basic algebra.',
    colorTheme: 'teal',
    unlocked: false,
  },
  {
    id: '8',
    label: 'Grade 8',
    order: 8,
    description: 'Linear equations, exponents, square roots.',
    colorTheme: 'cyan',
    unlocked: false,
  },
  {
    id: '9',
    label: 'Grade 9',
    order: 9,
    description: 'Algebra I: quadratics, polynomials, functions.',
    colorTheme: 'sky',
    unlocked: false,
  },
  {
    id: '10',
    label: 'Grade 10',
    order: 10,
    description: 'Geometry and algebra II fundamentals.',
    colorTheme: 'blue',
    unlocked: false,
  },
  {
    id: '11',
    label: 'Grade 11',
    order: 11,
    description: 'Trigonometry, advanced algebra, sequences.',
    colorTheme: 'indigo',
    unlocked: false,
  },
  {
    id: '12',
    label: 'Grade 12',
    order: 12,
    description: 'Pre-calculus, statistics, mental estimation techniques.',
    colorTheme: 'violet',
    unlocked: false,
  },
  {
    id: 'College',
    label: 'College',
    order: 13,
    description: 'Calculus mental math, advanced estimation, competition math.',
    colorTheme: 'purple',
    unlocked: false,
  },
];

export function getLevelById(id: string): LevelStage | undefined {
  return levels.find((lvl) => lvl.id === id);
}

export function getUnlockedLevels(): LevelStage[] {
  return levels.filter((lvl) => lvl.unlocked);
}