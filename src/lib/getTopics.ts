import { ProgressStats } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { getMethodLabel } from '@/data/methods';

// Re-export the label helper so callers import from one place
export { getMethodLabel } from '@/data/methods';

// ── Progress fetching ──────────────────────────────────────────────────────
// progress_stats.topic_id now stores method-difficulty composites
// e.g. "make10-easy", "compensation-hard"
// The Supabase `topics` table is no longer used by the app.

export async function fetchProgressByIds(
  topicIds: string[],
  userId: string | null = null
): Promise<Map<string, { accuracy: number; questionsCorrect: number; questionsAnswered: number }>> {
  if (topicIds.length === 0 || !userId) return new Map();
  const supabase = await createClient();
  const { data } = await supabase
    .from('progress_stats')
    .select('topic_id, accuracy, questions_correct, questions_answered')
    .eq('user_id', userId)
    .in('topic_id', topicIds);
  return new Map(
    (data ?? []).map((p) => [
      p.topic_id,
      { accuracy: p.accuracy, questionsCorrect: p.questions_correct ?? 0, questionsAnswered: p.questions_answered ?? 0 },
    ])
  );
}

/**
 * Fetch multiple topics by their IDs.
 * In the new system, these are method-difficulty composite keys.
 * Returns a Map of topicId → { name, accuracy, questionsCorrect }
 * using the method label resolver for display names.
 */
export async function fetchTopicsByIds(
  ids: string[]
): Promise<Map<string, { id: string; name: string; description: string; progress: number; questionsCorrect: number; difficulty: string }>> {
  if (ids.length === 0) return new Map();
  // Build display data purely from the IDs — no DB lookup needed
  return new Map(
    ids.map((id) => [
      id,
      {
        id,
        name: getMethodLabel(id),
        description: '',
        progress: 0,
        questionsCorrect: 0,
        difficulty: id.split('-').pop() ?? 'medium',
      },
    ])
  );
}

/**
 * Legacy compat: fetch a single topic by ID.
 * Returns a minimal object using the method label.
 */
export async function fetchTopicById(id: string) {
  return {
    id,
    name: getMethodLabel(id),
    description: '',
    progress: 0,
    questionsCorrect: 0,
    difficulty: (id.split('-').pop() ?? 'medium') as ProgressStats['topicId'],
  };
}