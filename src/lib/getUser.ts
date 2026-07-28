import { User, ProgressStats } from '@/types';
import { createClient } from '@/lib/supabase/server';

export async function fetchCurrentUser(): Promise<User | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error || !profile) return null;

  return {
  id: profile.id,
  name: profile.name,
  avatarUrl: profile.avatar_url ?? undefined,
  currentLevel: profile.current_level,
  joinedAt: profile.joined_at,
  totalScore: profile.total_score,
  currentStreak: profile.current_streak,
  defaultDifficulty: profile.default_difficulty ?? 'medium', // add this
};
}

export async function fetchProgressByTopic(topicId: string): Promise<ProgressStats | undefined> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return undefined;

  const { data } = await supabase
    .from('progress_stats')
    .select('*')
    .eq('user_id', authUser.id)
    .eq('topic_id', topicId)
    .single();

  if (!data) return undefined;

  return {
    userId: data.user_id,
    topicId: data.topic_id,
    accuracy: data.accuracy,
    questionsAnswered: data.questions_answered,
    questionsCorrect: data.questions_correct,
    bestStreak: data.best_streak,
    lastPracticedAt: data.last_practiced_at,
  };
}

export async function fetchProgressByUser(userId: string): Promise<ProgressStats[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('progress_stats')
    .select('*')
    .eq('user_id', userId);

  if (error || !data) return [];

  return data.map((row) => ({
    userId: row.user_id,
    topicId: row.topic_id,
    accuracy: row.accuracy,
    questionsAnswered: row.questions_answered,
    questionsCorrect: row.questions_correct,
    bestStreak: row.best_streak,
    lastPracticedAt: row.last_practiced_at,
  }));
}

export async function fetchOverallAccuracy(userId: string): Promise<number> {
  const stats = await fetchProgressByUser(userId);
  if (stats.length === 0) return 0;
  const totalCorrect = stats.reduce((sum, s) => sum + s.questionsCorrect, 0);
  const totalAnswered = stats.reduce((sum, s) => sum + s.questionsAnswered, 0);
  return totalAnswered === 0 ? 0 : Math.round((totalCorrect / totalAnswered) * 100);
}