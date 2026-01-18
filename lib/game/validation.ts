import { Card } from './types';

function isValidAttribute<T>(a: T, b: T, c: T): boolean {
  const allSame = a === b && b === c;
  const allDifferent = a !== b && b !== c && a !== c;
  return allSame || allDifferent;
}

export function isValidSet(cards: Card[]): boolean {
  if (cards.length !== 3) return false;

  const [c1, c2, c3] = cards;

  return (
    isValidAttribute(c1.shape, c2.shape, c3.shape) &&
    isValidAttribute(c1.color, c2.color, c3.color) &&
    isValidAttribute(c1.number, c2.number, c3.number) &&
    isValidAttribute(c1.shading, c2.shading, c3.shading)
  );
}

export function findAllSets(cards: Card[]): Card[][] {
  const sets: Card[][] = [];

  for (let i = 0; i < cards.length - 2; i++) {
    for (let j = i + 1; j < cards.length - 1; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        const potentialSet = [cards[i], cards[j], cards[k]];
        if (isValidSet(potentialSet)) {
          sets.push(potentialSet);
        }
      }
    }
  }

  return sets;
}

export function countSetsOnBoard(board: Card[]): number {
  return findAllSets(board).length;
}
