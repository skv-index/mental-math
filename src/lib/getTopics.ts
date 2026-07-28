import { Topic, GradeLevel } from '@/types';
import { createClient } from '@/lib/supabase/server';

interface TopicRow {
  id: string;
  level_id: GradeLevel;
  name: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_count: number;
}

function mapRow(row: TopicRow, progress: number = 0, questionsCorrect: number = 0): Topic {
  return {
    id: row.id,
    levelId: row.level_id,
    name: row.name,
    description: row.description,
    icon: row.icon,
    difficulty: row.difficulty,
    questionCount: row.question_count,
    progress,
    questionsCorrect,
  };
}

export async function fetchAllTopics(): Promise<Topic[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('topics').select('*');
  if (error || !data) return [];
  return data.map((row) => mapRow(row));
}

export async function fetchTopicsByLevel(levelId: GradeLevel, userId: string | null = null): Promise<Topic[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('topics').select('*').eq('level_id', levelId);
  if (error || !data) return [];

  if (!userId || data.length === 0) {
    return data.map((row) => mapRow(row));
  }

  const topicIds = data.map((t) => t.id);
  const { data: progressRows } = await supabase
    .from('progress_stats')
    .select('topic_id, accuracy, questions_correct')
    .eq('user_id', userId)
    .in('topic_id', topicIds);

  const progressMap = new Map((progressRows ?? []).map((p) => [p.topic_id, { accuracy: p.accuracy, questionsCorrect: p.questions_correct ?? 0 }]));

  return data.map((row) => {
    const progressData = progressMap.get(row.id);
    return mapRow(row, progressData?.accuracy ?? 0, progressData?.questionsCorrect ?? 0);
  });
}

export async function fetchTopicById(id: string): Promise<Topic | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('topics').select('*').eq('id', id).single();
  if (error || !data) return undefined;
  return mapRow(data);
}

/**
 * Fetch multiple topics by their IDs in a single query.
 * Use this instead of calling fetchTopicById() in a loop (N+1 problem).
 */
export async function fetchTopicsByIds(ids: string[]): Promise<Map<string, Topic>> {
  if (ids.length === 0) return new Map();
  const supabase = await createClient();
  const { data, error } = await supabase.from('topics').select('*').in('id', ids);
  if (error || !data) return new Map();
  return new Map(data.map((row) => [row.id, mapRow(row)]));
}