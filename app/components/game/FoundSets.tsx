'use client';

import { Card as CardType, COLORS, SETS_TO_WIN } from '@/lib/game/types';
import CardShape from './CardShape';

interface FoundSetsProps {
  foundSets: CardType[][];
}

function MiniCard({ card, setIndex }: { card: CardType; setIndex: number }) {
  return (
    <div className="w-8 h-10 md:w-10 md:h-12 bg-white rounded border border-gray-200 p-1 flex flex-col items-center justify-center gap-0.5">
      {Array.from({ length: card.number }, (_, i) => (
        <div key={i} className="w-full h-2">
          <CardShape
            shape={card.shape}
            color={card.color}
            shading={card.shading}
            index={setIndex * 100 + card.id * 3 + i}
          />
        </div>
      ))}
    </div>
  );
}

export default function FoundSets({ foundSets }: FoundSetsProps) {
  // Create array of slots based on SETS_TO_WIN
  const slots = Array.from({ length: SETS_TO_WIN }, (_, i) => foundSets[i] || null);
  const half = Math.ceil(SETS_TO_WIN / 2);
  const leftColumn = slots.slice(0, half);
  const rightColumn = slots.slice(half, SETS_TO_WIN);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest">
        Found Sets
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {/* Left column */}
        <div className="space-y-2">
          {leftColumn.map((set, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-xs text-gray-300 w-4 shrink-0">{i + 1}.</span>
              {set ? (
                <div className="flex gap-0.5 p-1 bg-gray-50 rounded border border-gray-100">
                  {set.map((card) => (
                    <MiniCard key={card.id} card={card} setIndex={i} />
                  ))}
                </div>
              ) : (
                <div className="h-10 w-24 border border-dashed border-gray-200 rounded" />
              )}
            </div>
          ))}
        </div>
        {/* Right column */}
        <div className="space-y-2">
          {rightColumn.map((set, i) => (
            <div key={i + half} className="flex items-center gap-1">
              <span className="text-xs text-gray-300 w-4 shrink-0">{i + half + 1}.</span>
              {set ? (
                <div className="flex gap-0.5 p-1 bg-gray-50 rounded border border-gray-100">
                  {set.map((card) => (
                    <MiniCard key={card.id} card={card} setIndex={i + half} />
                  ))}
                </div>
              ) : (
                <div className="h-10 w-24 border border-dashed border-gray-200 rounded" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
