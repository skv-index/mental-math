import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUnlockedLevels } from '@/lib/levelUnlock';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const statuses = await getUnlockedLevels(user?.id ?? null);
  return NextResponse.json({ levels: statuses });
}
