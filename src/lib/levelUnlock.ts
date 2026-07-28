import { GradeLevel } from '@/types';
import { levels } from '@/data/levels';
import { createClient } from '@/lib/supabase/server';
import {
  LEVEL_UNLOCK_ACCURACY_THRESHOLD,
  LEVEL_UNLOCK_QUESTIONS_THRESHOLD,
} from '@/lib/constants';

export interface LevelUnlockStatus {
  id: GradeLevel;
  unlocked: boolean;
}

export async function getUnlockedLevels(userId: string | null): Promise<LevelUnlockStatus[]> {
  const sorted = [...levels].sort((a, b) => a.order - b.order);

  if (!userId) {
    return sorted.map((l, i) => ({ id: l.id, unlocked: i === 0 }));
  }

  const supabase = await createClient();
  const { data: topics } = await supabase.from('topics').select('id, level_id');
  const { data: progress } = await supabase
    .from('progress_stats')
    .select('topic_id, accuracy, questions_answered')
    .eq('user_id', userId);

  const topicLevelMap = new Map((topics ?? []).map((t) => [t.id, t.level_id]));
  const byLevel = new Map<string, { totalQuestions: number; weightedAccuracy: number }>();

  for (const p of progress ?? []) {
    const levelId = topicLevelMap.get(p.topic_id);
    if (!levelId) continue;
    const existing = byLevel.get(levelId) ?? { totalQuestions: 0, weightedAccuracy: 0 };
    existing.totalQuestions += p.questions_answered;
    existing.weightedAccuracy += p.accuracy * p.questions_answered;
    byLevel.set(levelId, existing);
  }

  const result: LevelUnlockStatus[] = [];
  let previousMet = true;

  for (const level of sorted) {
    const unlocked: boolean = previousMet;
    result.push({ id: level.id, unlocked });

    const stats = byLevel.get(level.id);
    const avgAccuracy = stats && stats.totalQuestions > 0 ? stats.weightedAccuracy / stats.totalQuestions : 0;
    previousMet = unlocked && !!stats && stats.totalQuestions >= LEVEL_UNLOCK_QUESTIONS_THRESHOLD && avgAccuracy >= LEVEL_UNLOCK_ACCURACY_THRESHOLD;
  }

  return result;
}
