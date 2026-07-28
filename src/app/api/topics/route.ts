import { NextRequest, NextResponse } from 'next/server';
import { fetchTopicsByLevel } from '@/lib/getTopics';
import { GradeLevel } from '@/types';
import { createClient } from '@/lib/supabase/server';

const VALID_LEVELS = new Set<string>(['K','1','2','3','4','5','6','7','8','9','10','11','12','College']);

export async function GET(request: NextRequest) {
  const levelId = request.nextUrl.searchParams.get('level');

  if (!levelId || !VALID_LEVELS.has(levelId)) {
    return NextResponse.json({ error: 'Invalid or missing level parameter' }, { status: 400 });
  }

  // Find out who's logged in (if anyone), so we can attach their real progress
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const topics = await fetchTopicsByLevel(levelId as GradeLevel, user?.id ?? null);

  return NextResponse.json({ topics });
}