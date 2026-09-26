import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { METHODS, VALID_METHOD_IDS } from '@/data/methods';
import { METHOD_MASTERY_ACCURACY, METHOD_MASTERY_QUESTIONS } from '@/lib/constants';

export interface MethodStatus {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  colorHex: string;
  order: number;
  prerequisiteId: string | null;
  unlocked: boolean;
  easyMastered: boolean;
  mediumMastered: boolean;
  hardMastered: boolean;
  easyStats: { accuracy: number; questionsAnswered: number } | null;
  mediumStats: { accuracy: number; questionsAnswered: number } | null;
  hardStats: { accuracy: number; questionsAnswered: number } | null;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Build composite key list for all methods × difficulties
  const allKeys = METHODS.flatMap((m) =>
    ['easy', 'medium', 'hard'].map((d) => `${m.id}-${d}`)
  );

  let progressMap = new Map<string, { accuracy: number; questions_answered: number }>();

  if (user) {
    const { data: progressRows } = await supabase
      .from('progress_stats')
      .select('topic_id, accuracy, questions_answered')
      .eq('user_id', user.id)
      .in('topic_id', allKeys);

    progressMap = new Map(
      (progressRows ?? []).map((p) => [
        p.topic_id,
        { accuracy: p.accuracy, questions_answered: p.questions_answered },
      ])
    );
  }

  const isMastered = (methodId: string, diff: string) => {
    const key = `${methodId}-${diff}`;
    const p = progressMap.get(key);
    return !!p && p.accuracy >= METHOD_MASTERY_ACCURACY && p.questions_answered >= METHOD_MASTERY_QUESTIONS;
  };

  const getStats = (methodId: string, diff: string) => {
    const key = `${methodId}-${diff}`;
    const p = progressMap.get(key);
    return p ? { accuracy: p.accuracy, questionsAnswered: p.questions_answered } : null;
  };

  // Compute unlock chain: first method always unlocked,
  // subsequent methods unlock when prerequisite has at least Easy mastered.
  const masteredSet = new Set<string>(
    METHODS.filter((m) => isMastered(m.id, 'easy') || isMastered(m.id, 'medium') || isMastered(m.id, 'hard')).map(
      (m) => m.id
    )
  );

  const statuses: MethodStatus[] = METHODS.map((m) => {
    const unlocked = m.prerequisiteId === null || masteredSet.has(m.prerequisiteId);
    return {
      id: m.id,
      name: m.name,
      tagline: m.tagline,
      icon: m.icon,
      colorHex: m.colorHex,
      order: m.order,
      prerequisiteId: m.prerequisiteId,
      unlocked,
      easyMastered: isMastered(m.id, 'easy'),
      mediumMastered: isMastered(m.id, 'medium'),
      hardMastered: isMastered(m.id, 'hard'),
      easyStats: getStats(m.id, 'easy'),
      mediumStats: getStats(m.id, 'medium'),
      hardStats: getStats(m.id, 'hard'),
    };
  });

  return NextResponse.json({ methods: statuses });
}
