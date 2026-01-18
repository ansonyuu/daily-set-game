import { supabase } from '@/lib/supabase';
import { LeaderboardEntry } from '../game/types';

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export async function getTodaysLeaderboard(): Promise<LeaderboardEntry[]> {
  const today = getTodayDateString();

  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('date', today)
    .order('time_seconds', { ascending: true });

  if (error) {
    console.error('Supabase error:', error);
    return [];
  }

  return (data || []).map((row) => ({
    username: row.username,
    timeSeconds: row.time_seconds,
    date: row.date,
    timestamp: new Date(row.created_at).getTime(),
  }));
}

export async function submitScore(
  username: string,
  timeSeconds: number
): Promise<LeaderboardEntry> {
  const today = getTodayDateString();

  // Check if user already has a score today
  const { data: existing } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('date', today)
    .ilike('username', username)
    .single();

  if (existing) {
    // Only update if new score is better (lower time)
    if (timeSeconds < existing.time_seconds) {
      const { data, error } = await supabase
        .from('leaderboard')
        .update({ time_seconds: timeSeconds })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;

      return {
        username: data.username,
        timeSeconds: data.time_seconds,
        date: data.date,
        timestamp: new Date(data.created_at).getTime(),
      };
    }
    // Return existing score if new one isn't better
    return {
      username: existing.username,
      timeSeconds: existing.time_seconds,
      date: existing.date,
      timestamp: new Date(existing.created_at).getTime(),
    };
  }

  // Insert new score
  const { data, error } = await supabase
    .from('leaderboard')
    .insert({
      username,
      time_seconds: timeSeconds,
      date: today,
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return {
    username: data.username,
    timeSeconds: data.time_seconds,
    date: data.date,
    timestamp: new Date(data.created_at).getTime(),
  };
}
