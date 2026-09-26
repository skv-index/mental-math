// This endpoint is deprecated — /api/methods replaces it.
// Kept as a stub so any cached or external references don't 404.
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'This endpoint has moved to /api/methods', redirect: '/api/methods' },
    { status: 301 }
  );
}