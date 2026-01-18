'use client';

import { Card as CardType } from '@/lib/game/types';
import CardShape from './CardShape';

interface CardProps {
  card: CardType;
  isSelected: boolean;
  isInvalid: boolean;
  isHint: boolean;
  onClick: () => void;
}

export default function Card({ card, isSelected, isInvalid, isHint, onClick }: CardProps) {
  const shapes = Array.from({ length: card.number }, (_, i) => (
    <CardShape
      key={i}
      shape={card.shape}
      color={card.color}
      shading={card.shading}
      index={card.id * 3 + i}
    />
  ));

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full aspect-[3/4] rounded-lg bg-white
        border-2 transition-all duration-150
        flex flex-col items-center justify-center gap-1 p-3
        hover:shadow-md cursor-pointer
        ${isSelected && !isInvalid && !isHint ? 'border-purple ring-2 ring-purple ring-opacity-50 shadow-lg' : ''}
        ${isHint ? 'border-green ring-2 ring-green ring-opacity-50 shadow-lg bg-green/5' : ''}
        ${isInvalid ? 'border-red-500 ring-2 ring-red-500 ring-opacity-50 animate-shake' : ''}
        ${!isSelected && !isInvalid && !isHint ? 'border-gray-200' : ''}
      `}
    >
      <div className={`
        w-full flex flex-col items-center justify-center gap-1
        ${card.number === 1 ? 'h-1/3' : card.number === 2 ? 'h-2/3' : 'h-full'}
      `}>
        {shapes}
      </div>
    </button>
  );
}
