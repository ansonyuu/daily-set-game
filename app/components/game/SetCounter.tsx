'use client';

import { SETS_TO_WIN } from '@/lib/game/types';

interface SetCounterProps {
  foundCount: number;
}

export default function SetCounter({ foundCount }: SetCounterProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Sets</span>
      <span className="font-mono text-xl tabular-nums tracking-tight">
        <span className="text-purple font-semibold">{foundCount}</span>
        <span className="text-gray-400">/{SETS_TO_WIN}</span>
      </span>
    </div>
  );
}
