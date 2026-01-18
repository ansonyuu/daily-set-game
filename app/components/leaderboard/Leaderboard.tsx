'use client';

import { LeaderboardEntry } from '@/lib/game/types';
import { formatTime } from '@/lib/game/gameUtils';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  currentUsername?: string;
}

export default function Leaderboard({ entries, isLoading, currentUsername }: LeaderboardProps) {
  if (isLoading && entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Loading leaderboard...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No scores yet today. Be the first!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => {
        const isCurrentUser = currentUsername?.toLowerCase() === entry.username.toLowerCase();
        const rank = index + 1;

        return (
          <div
            key={`${entry.username}-${entry.timestamp}`}
            className={`
              flex items-center gap-4 p-3 rounded-lg
              ${isCurrentUser ? 'bg-purple/10 border border-purple/20' : 'bg-gray-50'}
            `}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${rank === 1 ? 'bg-yellow-400 text-yellow-900' : ''}
              ${rank === 2 ? 'bg-gray-300 text-gray-700' : ''}
              ${rank === 3 ? 'bg-amber-600 text-amber-100' : ''}
              ${rank > 3 ? 'bg-gray-200 text-gray-600' : ''}
            `}>
              {rank}
            </div>
            <div className="flex-1 font-medium">
              {entry.username}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-purple font-normal">(you)</span>
              )}
            </div>
            <div className="font-mono text-lg tabular-nums">
              {formatTime(entry.timeSeconds)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
