import { METHODS } from '../../data/methods';
import { generateQuestionBatch, regenerateQuestion } from '../questionGenerator';
import { Difficulty } from '../../types';

async function runValidationTests() {
  console.log('🧪 Starting Mental Math Strategy Generator Validation Suite...\n');

  let totalTested = 0;
  let passed = 0;
  let failed = 0;

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  for (const method of METHODS) {
    console.log(`Checking method: [${method.id}] ${method.name}`);

    for (const diff of difficulties) {
      // Generate batch of 20 questions per difficulty
      const batch = generateQuestionBatch(method.id, 20, diff, 'guided');

      for (const q of batch) {
        totalTested++;
        const errors: string[] = [];
        const answerStr = String(q.correctAnswer);

        // 1. Verify prompt is non-empty
        if (!q.prompt || typeof q.prompt !== 'string') {
          errors.push('Empty or invalid prompt');
        }

        // 2. Verify correctAnswer is non-empty
        if (q.correctAnswer === undefined || q.correctAnswer === null || answerStr === '') {
          errors.push('Empty correct answer');
        }

        // 3. Verify PRNG determinism / regeneration match
        const regen = regenerateQuestion(method.id, q.seed, diff, 'guided');
        if (String(regen.correctAnswer) !== answerStr) {
          errors.push(`PRNG mismatch: initial=${answerStr}, regenerated=${regen.correctAnswer}`);
        }

        // 4. Verify MCQ options when present
        if (q.type === 'mcq') {
          if (!q.options || q.options.length !== 4) {
            errors.push(`MCQ options length is not 4 (got ${q.options?.length})`);
          } else if (!q.options.includes(answerStr)) {
            errors.push(`MCQ options do not include correct answer ${answerStr}`);
          }
        }

        // 5. Verify hint exists for guided stage
        if (!q.hint) {
          errors.push('Missing hint for guided stage');
        }

        if (errors.length > 0) {
          failed++;
          console.error(`  ❌ Failed question: ${q.prompt} (seed: ${q.seed}, diff: ${diff})`);
          errors.forEach((err) => console.error(`     - ${err}`));
        } else {
          passed++;
        }
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Validation Complete: ${passed}/${totalTested} passed (${failed} failed).`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runValidationTests().catch((err) => {
  console.error('Validation test runner error:', err);
  process.exit(1);
});
