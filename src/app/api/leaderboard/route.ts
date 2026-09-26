import { NextRequest, NextResponse } from 'next/server';
import { fetchTopLeaderboard } from '@/lib/getLeaderboard';
import { LEADERBOARD_PAGE_SIZE } from '@/lib/constants';

export async function GET(_request: NextRequest) {
  const entries = await fetchTopLeaderboard(LEADERBOARD_PAGE_SIZE);

  // Cache for 60 seconds on CDN edge — leaderboard doesn't need real-time updates
  return NextResponse.json(
    { entries },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    }
  );
}
