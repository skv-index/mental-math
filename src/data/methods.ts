// ============================================================
// Methods Curriculum — defines all 10 mental math techniques.
// To add a new method: append an entry to METHODS and create a
// corresponding generator in src/lib/generators/.
// ============================================================

export type MethodId =
  | 'make10'
  | 'compensation'
  | 'break-apart'
  | 'left-to-right'
  | 'near-round'
  | 'double-half'
  | 'distributive'
  | 'special-mult'
  | 'estimation'
  | 'division-factors';

export type PracticeStage = 'learn' | 'guided' | 'practice' | 'speed' | 'mastery';

export interface WorkedExample {
  problem: string;
  steps: string[];
  finalAnswer: string;
}

export interface MethodDefinition {
  id: MethodId;
  name: string;
  tagline: string;
  icon: string;           // lucide icon name
  colorHex: string;       // primary accent colour
  prerequisiteId: MethodId | null; // null = always unlocked
  order: number;
  objective: string;      // explicit learning target
  learnConcept: string;   // short explanation shown on Learn card
  workedExamples: WorkedExample[]; // 2-3 step-by-step examples
}

export const METHODS: MethodDefinition[] = [
  {
    id: 'make10',
    name: 'Make 10',
    tagline: 'Bridge through 10 / 100 to add faster',
    icon: 'PlusCircle',
    colorHex: '#5EEAD4',
    prerequisiteId: null,
    order: 0,
    objective: 'Decompose addends to bridge through a round benchmark of 10, 100, or 1000 before adding the remainder.',
    learnConcept:
      'When adding two numbers, identify how much the first number needs to reach the next round ten (10, 100, or 1000). Split the second number to satisfy that gap, then easily add whatever is left.',
    workedExamples: [
      {
        problem: '8 + 6',
        steps: [
          '8 needs 2 to reach 10.',
          'Split 6 into 2 + 4.',
          '(8 + 2) + 4 = 10 + 4 = 14',
        ],
        finalAnswer: '14',
      },
      {
        problem: '47 + 8',
        steps: [
          '47 needs 3 to reach 50.',
          'Split 8 into 3 + 5.',
          '(47 + 3) + 5 = 50 + 5 = 55',
        ],
        finalAnswer: '55',
      },
      {
        problem: '385 + 7',
        steps: [
          '385 needs 5 to reach 390.',
          'Split 7 into 5 + 2.',
          '(385 + 5) + 2 = 390 + 2 = 392',
        ],
        finalAnswer: '392',
      },
    ],
  },
  {
    id: 'compensation',
    name: 'Compensation',
    tagline: 'Round up or down, calculate, then adjust',
    icon: 'RefreshCw',
    colorHex: '#FFB020',
    prerequisiteId: 'make10',
    order: 1,
    objective: 'Adjust an awkward number to a friendly round number, perform the mental calculation, then compensate for the change.',
    learnConcept:
      'If an operand is close to a friendly multiple of 10 or 100 (like 39 or 98), temporarily round it up to make the calculation effortless. Afterwards, compensate by subtracting or adding back the amount you borrowed.',
    workedExamples: [
      {
        problem: '47 + 38',
        steps: [
          'Round 38 UP to 40 (added 2 too much).',
          'Calculate: 47 + 40 = 87',
          'Compensate: 87 − 2 = 85',
        ],
        finalAnswer: '85',
      },
      {
        problem: '83 − 29',
        steps: [
          'Round 29 UP to 30 (subtracted 1 too much).',
          'Calculate: 83 − 30 = 53',
          'Compensate: 53 + 1 = 54',
        ],
        finalAnswer: '54',
      },
      {
        problem: '354 + 197',
        steps: [
          'Round 197 UP to 200 (added 3 too much).',
          'Calculate: 354 + 200 = 554',
          'Compensate: 554 − 3 = 551',
        ],
        finalAnswer: '551',
      },
    ],
  },
  {
    id: 'break-apart',
    name: 'Break Apart Numbers',
    tagline: 'Split into place values you know',
    icon: 'Scissors',
    colorHex: '#FF6B6B',
    prerequisiteId: 'compensation',
    order: 2,
    objective: 'Decompose numbers into place values (hundreds, tens, ones), process each component separately, and combine.',
    learnConcept:
      'Break complex multidigit numbers into their expanded place values (e.g. 234 = 200 + 30 + 4). Group hundreds with hundreds, tens with tens, and ones with ones, then sum the sub-results.',
    workedExamples: [
      {
        problem: '43 + 25',
        steps: [
          'Break apart: (40 + 3) + (20 + 5)',
          'Add tens: 40 + 20 = 60',
          'Add ones: 3 + 5 = 8',
          'Combine: 60 + 8 = 68',
        ],
        finalAnswer: '68',
      },
      {
        problem: '234 + 152',
        steps: [
          'Hundreds: 200 + 100 = 300',
          'Tens: 30 + 50 = 80',
          'Ones: 4 + 2 = 6',
          'Combine: 300 + 80 + 6 = 386',
        ],
        finalAnswer: '386',
      },
    ],
  },
  {
    id: 'left-to-right',
    name: 'Left-to-Right',
    tagline: 'Calculate from the largest place value first',
    icon: 'ArrowRight',
    colorHex: '#A78BFA',
    prerequisiteId: 'break-apart',
    order: 3,
    objective: 'Process addition and subtraction from left to right (highest place value to lowest) to build instantaneous mental estimates and exact results.',
    learnConcept:
      'Unlike written column math which moves right-to-left, mental calculation is fastest left-to-right. Start with the largest place values so you immediately know the scale of the answer, then refine with remaining digits.',
    workedExamples: [
      {
        problem: '463 + 278',
        steps: [
          'Start with hundreds: 400 + 200 = 600',
          'Add tens: 600 + (60 + 70) = 600 + 130 = 730',
          'Add ones: 730 + (3 + 8) = 730 + 11 = 741',
        ],
        finalAnswer: '741',
      },
      {
        problem: '528 − 164',
        steps: [
          'Subtract hundreds: 528 − 100 = 428',
          'Subtract tens: 428 − 60 = 368',
          'Subtract ones: 368 − 4 = 364',
        ],
        finalAnswer: '364',
      },
    ],
  },
  {
    id: 'near-round',
    name: 'Near 10 / 100 / 1000',
    tagline: 'Exploit proximity to round numbers',
    icon: 'Target',
    colorHex: '#34D399',
    prerequisiteId: 'left-to-right',
    order: 4,
    objective: 'Identify numbers ending in 8, 9, 1, or 2 and convert them into operations involving exact powers of 10.',
    learnConcept:
      'When a number is 1 or 2 away from 10, 100, or 1000, substitute it with the clean power of 10 and adjust by +1, +2, -1, or -2. This bypasses carrying or borrowing across columns.',
    workedExamples: [
      {
        problem: '63 − 29',
        steps: [
          '29 is 30 − 1.',
          'Subtract 30: 63 − 30 = 33',
          'Adjust (+1 because we subtracted 1 too much): 33 + 1 = 34',
        ],
        finalAnswer: '34',
      },
      {
        problem: '425 + 99',
        steps: [
          '99 is 100 − 1.',
          'Add 100: 425 + 100 = 525',
          'Adjust: 525 − 1 = 524',
        ],
        finalAnswer: '524',
      },
    ],
  },
  {
    id: 'double-half',
    name: 'Doubling & Halving',
    tagline: 'Trade factors to simplify multiplication',
    icon: 'Repeat',
    colorHex: '#F472B6',
    prerequisiteId: 'near-round',
    order: 5,
    objective: 'Transform complex multiplication into simpler equivalents by doubling one factor while halving the other.',
    learnConcept:
      'The product of two numbers remains constant if you double one factor while halving the other. Repeatedly double and halve until one factor becomes a round number or power of 2.',
    workedExamples: [
      {
        problem: '25 × 16',
        steps: [
          'Double 25 → 50 | Halve 16 → 8',
          'Double 50 → 100 | Halve 8 → 4',
          'Calculate: 100 × 4 = 400',
        ],
        finalAnswer: '400',
      },
      {
        problem: '15 × 14',
        steps: [
          'Double 15 → 30 | Halve 14 → 7',
          'Calculate: 30 × 7 = 210',
        ],
        finalAnswer: '210',
      },
    ],
  },
  {
    id: 'distributive',
    name: 'Distributive Property',
    tagline: 'Expand to multiply parts, then sum',
    icon: 'Grid2x2',
    colorHex: '#60A5FA',
    prerequisiteId: 'double-half',
    order: 6,
    objective: 'Decompose multidigit factors into sums to compute partial products mentally.',
    learnConcept:
      'Multiply a single-digit factor by a multidigit number by breaking the larger number into tens and ones. Multiply each part individually, then sum the sub-products.',
    workedExamples: [
      {
        problem: '7 × 48',
        steps: [
          'Expand 48 into 40 + 8.',
          'Multiply tens: 7 × 40 = 280',
          'Multiply ones: 7 × 8 = 56',
          'Sum: 280 + 56 = 336',
        ],
        finalAnswer: '336',
      },
      {
        problem: '6 × 104',
        steps: [
          'Expand 104 into 100 + 4.',
          'Multiply hundreds: 6 × 100 = 600',
          'Multiply ones: 6 × 4 = 24',
          'Sum: 600 + 24 = 624',
        ],
        finalAnswer: '624',
      },
    ],
  },
  {
    id: 'special-mult',
    name: 'Special Multiplication',
    tagline: 'Master shortcuts for ×5, ×9, ×11, ×25, ×50',
    icon: 'Zap',
    colorHex: '#FBBF24',
    prerequisiteId: 'distributive',
    order: 7,
    objective: 'Apply specialized algebraic shortcuts for key multipliers (5, 9, 11, 25, 50).',
    learnConcept:
      'Use algorithmic tricks for specific numbers:\n' +
      '• ×5: Halve the number, then multiply by 10\n' +
      '• ×9: Multiply by 10, then subtract the original number\n' +
      '• ×11: Sandwich rule (add adjacent digits for the middle value)\n' +
      '• ×25: Divide by 4, then multiply by 100\n' +
      '• ×50: Divide by 2, then multiply by 100',
    workedExamples: [
      {
        problem: '36 × 25',
        steps: [
          'Shortcut for ×25: divide by 4, then multiply by 100.',
          'Divide: 36 ÷ 4 = 9',
          'Multiply by 100: 9 × 100 = 900',
        ],
        finalAnswer: '900',
      },
      {
        problem: '45 × 11',
        steps: [
          'Shortcut for ×11: sum middle digits (4 + 5 = 9).',
          'Sandwich: 4 _ 5 → 495',
        ],
        finalAnswer: '495',
      },
      {
        problem: '68 × 5',
        steps: [
          'Shortcut for ×5: halve, then multiply by 10.',
          'Halve: 68 ÷ 2 = 34',
          'Multiply by 10: 34 × 10 = 340',
        ],
        finalAnswer: '340',
      },
    ],
  },
  {
    id: 'estimation',
    name: 'Estimation & Rounding',
    tagline: 'Get fast approximate answers using leading digits',
    icon: 'Gauge',
    colorHex: '#FB923C',
    prerequisiteId: 'special-mult',
    order: 8,
    objective: 'Round large numbers to their highest place value to rapidly estimate products and sums with high accuracy.',
    learnConcept:
      'For fast real-world calculations, round each factor to its leading digit (e.g. 4,823 → 5,000; 63 → 60). Multiply the single-digit numbers and append all trailing zeros.',
    workedExamples: [
      {
        problem: 'Estimate 4,823 × 6',
        steps: [
          'Round 4,823 to nearest thousand: 5,000',
          'Multiply leading digits: 5 × 6 = 30',
          'Append 3 zeros: 30,000',
        ],
        finalAnswer: '30000',
      },
      {
        problem: 'Estimate 294 × 41',
        steps: [
          'Round 294 to 300; round 41 to 40',
          'Multiply leading digits: 3 × 4 = 12',
          'Append 3 zeros (2 from 300, 1 from 40): 12,000',
        ],
        finalAnswer: '12000',
      },
    ],
  },
  {
    id: 'division-factors',
    name: 'Division Using Factors',
    tagline: 'Divide by factors one step at a time',
    icon: 'Divide',
    colorHex: '#38BDF8',
    prerequisiteId: 'estimation',
    order: 9,
    objective: 'Decompose composite divisors into prime or small factor pairs to execute long division as a series of simple single-digit divisions.',
    learnConcept:
      'Instead of dividing by a difficult composite number like 12, 18, or 24, break the divisor into its factors (e.g. 12 = 3 × 4). Divide by the first factor, then divide the quotient by the second factor.',
    workedExamples: [
      {
        problem: '576 ÷ 12',
        steps: [
          'Factor 12 into 3 × 4.',
          'Step 1: 576 ÷ 3 = 192',
          'Step 2: 192 ÷ 4 = 48',
        ],
        finalAnswer: '48',
      },
      {
        problem: '432 ÷ 18',
        steps: [
          'Factor 18 into 2 × 9.',
          'Step 1: 432 ÷ 2 = 216',
          'Step 2: 216 ÷ 9 = 24',
        ],
        finalAnswer: '24',
      },
    ],
  },
];

// ── Lookup helpers ──────────────────────────────────────────
export function getMethodById(id: string): MethodDefinition | undefined {
  return METHODS.find((m) => m.id === id);
}

export function getMethodLabel(topicId: string): string {
  // topicId format: "make10-easy", "compensation-hard", etc.
  const diffSuffixes = ['-easy', '-medium', '-hard'] as const;
  for (const suffix of diffSuffixes) {
    if (topicId.endsWith(suffix)) {
      const methodId = topicId.slice(0, -suffix.length);
      const method = getMethodById(methodId);
      const diff = suffix.slice(1); // remove leading "-"
      const diffLabel = diff.charAt(0).toUpperCase() + diff.slice(1);
      return method ? `${method.name} · ${diffLabel}` : topicId;
    }
  }
  // Fallback: return the raw id prettified
  return topicId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export const VALID_METHOD_IDS = new Set<string>(METHODS.map((m) => m.id));
