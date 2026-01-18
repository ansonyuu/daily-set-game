'use client';

import { formatTime } from '@/lib/game/gameUtils';

interface TimerProps {
  seconds: number;
  isRunning: boolean;
}

export default function Timer({ seconds, isRunning }: TimerProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Time</span>
      <span className={`
        font-mono text-xl tabular-nums tracking-tight font-semibold
        ${isRunning ? 'text-black' : 'text-gray-400'}
      `}>
        {formatTime(seconds)}
      </span>
    </div>
  );
}
