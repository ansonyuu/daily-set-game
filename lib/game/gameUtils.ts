import { Card, BOARD_SIZE } from './types';
import { findAllSets } from './validation';

// Initialize the board with enough cards to have at least one valid set
export function initializeBoard(deck: Card[]): { board: Card[]; remainingDeck: Card[] } {
  let board = deck.slice(0, BOARD_SIZE);
  let remainingDeck = deck.slice(BOARD_SIZE);

  // Keep adding cards until we have at least one valid set
  while (findAllSets(board).length === 0 && remainingDeck.length > 0) {
    board.push(remainingDeck.shift()!);
  }

  return { board, remainingDeck };
}

// Replace found cards with new ones from the deck, ensuring valid sets remain
export function replaceCards(
  board: Card[],
  deck: Card[],
  foundCardIds: number[]
): { newBoard: Card[]; newDeck: Card[] } {
  let newBoard = [...board];
  let newDeck = [...deck];

  // Find positions of cards to replace
  const positions = foundCardIds.map(id => board.findIndex(card => card.id === id));

  // If board is larger than 12, just remove the cards (shrink back toward 12)
  if (newBoard.length > BOARD_SIZE) {
    // Remove the found cards from the board
    newBoard = newBoard.filter(card => !foundCardIds.includes(card.id));
  } else {
    // Replace each card with a new one from the deck (if available)
    for (const pos of positions) {
      if (newDeck.length > 0) {
        newBoard[pos] = newDeck.shift()!;
      } else {
        // No cards left - remove the position (shrink board)
        newBoard = newBoard.filter((_, i) => i !== pos);
      }
    }
  }

  // If no valid sets exist, keep adding cards from deck
  while (findAllSets(newBoard).length === 0 && newDeck.length > 0) {
    newBoard.push(newDeck.shift()!);
  }

  return { newBoard, newDeck };
}

// Check if the board has any valid sets
export function boardHasSets(board: Card[]): boolean {
  return findAllSets(board).length > 0;
}

// Format time in seconds to MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
