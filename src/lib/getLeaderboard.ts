import { LeaderboardEntry, GradeLevel } from '@/types';
import { createClient } from '@/lib/supabase/server';

interface LeaderboardRow {
  rank: number;
  user_id: string;
  name: string;
  avatar_url?: string | null;
  score: number;
  level: GradeLevel;
}

function mapRow(row: LeaderboardRow): LeaderboardEntry {
  return {
    rank: row.rank,
    userId: row.user_id,
    name: row.name,
    avatarUrl: row.avatar_url ?? undefined,
    score: row.score,
    level: row.level,
  };
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('leaderboard').select('*').order('rank');
  if (error || !data) return [];
  return data.map(mapRow);
}

export async function fetchTopLeaderboard(n: number): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('leaderboard').select('*').order('rank').limit(n);
  if (error || !data) return [];
  return data.map(mapRow);
}

export async function fetchLeaderboardEntry(userId: string): Promise<LeaderboardEntry | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('leaderboard').select('*').eq('user_id', userId).single();
  if (error || !data) return undefined;
  return mapRow(data);
}

export async function fetchLeaderboardByLevel(levelId: GradeLevel): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('level', levelId)
    .order('score', { ascending: false });
  if (error || !data) return [];
  // Re-rank within the filtered level since the view's `rank` column is global, not per-level
  return data.map((row, i) => ({ ...mapRow(row), rank: i + 1 }));
}