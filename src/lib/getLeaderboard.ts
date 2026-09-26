import { LeaderboardEntry } from '@/types';
import { createClient } from '@/lib/supabase/server';

interface LeaderboardRow {
  rank: number;
  user_id: string;
  name: string;
  avatar_url?: string | null;
  score: number;
}

function mapRow(row: LeaderboardRow): LeaderboardEntry {
  return {
    rank: row.rank,
    userId: row.user_id,
    name: row.name,
    avatarUrl: row.avatar_url ?? undefined,
    score: row.score,
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