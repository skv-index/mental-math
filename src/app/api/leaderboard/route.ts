import { NextRequest, NextResponse } from 'next/server';
import { fetchTopLeaderboard, fetchLeaderboardByLevel } from '@/lib/getLeaderboard';
import { GradeLevel } from '@/types';
import { LEADERBOARD_PAGE_SIZE } from '@/lib/constants';

const VALID_LEVELS = new Set<string>(['K','1','2','3','4','5','6','7','8','9','10','11','12','College']);

export async function GET(request: NextRequest) {
  const level = request.nextUrl.searchParams.get('level');

  const isAll = !level || level === 'all';
  const isValidLevel = !isAll && VALID_LEVELS.has(level);

  if (!isAll && !isValidLevel) {
    return NextResponse.json({ error: 'Invalid level parameter' }, { status: 400 });
  }

  const entries = isAll
    ? await fetchTopLeaderboard(LEADERBOARD_PAGE_SIZE)
    : await fetchLeaderboardByLevel(level as GradeLevel);

  // Cache for 60 seconds on CDN edge — leaderboard doesn't need to be real-time
  return NextResponse.json(
    { entries },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    }
  );
}
