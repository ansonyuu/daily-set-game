import { promises as fs } from 'fs';
import path from 'path';
import { LeaderboardEntry, DailyLeaderboard } from '../game/types';
import { getTodayDateString } from '../game/deck';

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADERBOARD_FILE = path.join(DATA_DIR, 'leaderboard.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readLeaderboard(): Promise<DailyLeaderboard> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(LEADERBOARD_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeLeaderboard(data: DailyLeaderboard): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(data, null, 2));
}

export async function getTodaysLeaderboard(): Promise<LeaderboardEntry[]> {
  const leaderboard = await readLeaderboard();
  const today = getTodayDateString();
  const entries = leaderboard[today] || [];
  // Sort by time (fastest first)
  return entries.sort((a, b) => a.timeSeconds - b.timeSeconds);
}

export async function submitScore(
  username: string,
  timeSeconds: number
): Promise<LeaderboardEntry> {
  const leaderboard = await readLeaderboard();
  const today = getTodayDateString();

  if (!leaderboard[today]) {
    leaderboard[today] = [];
  }

  const entry: LeaderboardEntry = {
    username,
    timeSeconds,
    date: today,
    timestamp: Date.now(),
  };

  // Check if user already has a score today
  const existingIndex = leaderboard[today].findIndex(
    e => e.username.toLowerCase() === username.toLowerCase()
  );

  if (existingIndex !== -1) {
    // Only update if new score is better (lower time)
    if (timeSeconds < leaderboard[today][existingIndex].timeSeconds) {
      leaderboard[today][existingIndex] = entry;
    } else {
      return leaderboard[today][existingIndex];
    }
  } else {
    leaderboard[today].push(entry);
  }

  await writeLeaderboard(leaderboard);
  return entry;
}
