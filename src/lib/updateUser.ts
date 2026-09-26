import { createClient } from '@/lib/supabase/client';
import { Difficulty } from '@/types';

export async function updateDefaultDifficulty(difficulty: Difficulty): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false; // guest — caller falls back to localStorage only

  const { error } = await supabase
    .from('profiles')
    .update({ default_difficulty: difficulty })
    .eq('id', user.id);

  return !error;
}

export async function fetchDefaultDifficulty(): Promise<Difficulty | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('default_difficulty')
    .eq('id', user.id)
    .single();

  return (data?.default_difficulty as Difficulty) ?? null;
}