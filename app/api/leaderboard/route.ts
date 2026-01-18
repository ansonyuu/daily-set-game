import { NextRequest, NextResponse } from 'next/server';
import { getTodaysLeaderboard, submitScore } from '@/lib/storage/leaderboard';

export async function GET() {
  try {
    const entries = await getTodaysLeaderboard();
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, timeSeconds } = body;

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    if (typeof timeSeconds !== 'number' || timeSeconds < 0) {
      return NextResponse.json(
        { error: 'Valid time is required' },
        { status: 400 }
      );
    }

    const entry = await submitScore(username.trim(), timeSeconds);
    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Failed to submit score:', error);
    return NextResponse.json(
      { error: 'Failed to submit score' },
      { status: 500 }
    );
  }
}
