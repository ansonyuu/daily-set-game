'use client';

import { Card as CardType } from '@/lib/game/types';
import Card from './Card';

interface GameBoardProps {
  board: CardType[];
  selectedCardIds: Set<number>;
  invalidCardIds: number[] | null;
  hintCardIds: number[] | null;
  onCardClick: (cardId: number) => void;
}

export default function GameBoard({
  board,
  selectedCardIds,
  invalidCardIds,
  hintCardIds,
  onCardClick,
}: GameBoardProps) {
  return (
    <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto">
      {board.map((card) => (
        <Card
          key={card.id}
          card={card}
          isSelected={selectedCardIds.has(card.id)}
          isInvalid={invalidCardIds?.includes(card.id) ?? false}
          isHint={hintCardIds?.includes(card.id) ?? false}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  );
}
