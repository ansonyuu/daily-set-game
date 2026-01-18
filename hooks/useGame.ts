'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, GameState, SETS_TO_WIN, BOARD_SIZE } from '@/lib/game/types';
import { getDailyDeck, getTodayDateString } from '@/lib/game/deck';
import { isValidSet, findAllSets } from '@/lib/game/validation';
import { initializeBoard, replaceCards } from '@/lib/game/gameUtils';
import { useTimer } from './useTimer';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const deck = getDailyDeck();
    const { board, remainingDeck } = initializeBoard(deck);
    return {
      board,
      deck: remainingDeck,
      selectedCardIds: new Set<number>(),
      foundSets: [],
      isComplete: false,
      hasStarted: false,
      lastInvalidSet: null,
      hintCardIds: null,
    };
  });

  const timer = useTimer();

  // Clear invalid set highlight after a delay
  useEffect(() => {
    if (gameState.lastInvalidSet) {
      const timeout = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          lastInvalidSet: null,
        }));
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [gameState.lastInvalidSet]);

  // Clear hint highlight after a delay
  useEffect(() => {
    if (gameState.hintCardIds) {
      const timeout = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          hintCardIds: null,
        }));
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [gameState.hintCardIds]);

  const selectCard = useCallback((cardId: number) => {
    if (gameState.isComplete) return;

    // Start timer on first card click
    if (!gameState.hasStarted) {
      timer.start();
      setGameState((prev) => ({ ...prev, hasStarted: true }));
    }

    setGameState((prev) => {
      const newSelected = new Set(prev.selectedCardIds);

      // Toggle selection
      if (newSelected.has(cardId)) {
        newSelected.delete(cardId);
        return { ...prev, selectedCardIds: newSelected, lastInvalidSet: null };
      }

      // If already have 3, ignore
      if (newSelected.size >= 3) {
        return prev;
      }

      newSelected.add(cardId);

      // If we now have 3 cards, check for a valid set
      if (newSelected.size === 3) {
        const selectedCards = prev.board.filter((card) => newSelected.has(card.id));

        if (isValidSet(selectedCards)) {
          // Valid set found!
          const { newBoard, newDeck } = replaceCards(
            prev.board,
            prev.deck,
            Array.from(newSelected)
          );

          const newFoundSets = [...prev.foundSets, selectedCards];
          const isComplete = newFoundSets.length >= SETS_TO_WIN;

          if (isComplete) {
            timer.stop();
          }

          return {
            ...prev,
            board: newBoard,
            deck: newDeck,
            selectedCardIds: new Set<number>(),
            foundSets: newFoundSets,
            isComplete,
            lastInvalidSet: null,
          };
        } else {
          // Invalid set - show error and clear selection
          return {
            ...prev,
            selectedCardIds: new Set<number>(),
            lastInvalidSet: Array.from(newSelected),
          };
        }
      }

      return { ...prev, selectedCardIds: newSelected, lastInvalidSet: null };
    });
  }, [gameState.isComplete, gameState.hasStarted, timer]);

  const resetGame = useCallback(() => {
    const deck = getDailyDeck();
    const { board, remainingDeck } = initializeBoard(deck);
    timer.reset();
    setGameState({
      board,
      deck: remainingDeck,
      selectedCardIds: new Set<number>(),
      foundSets: [],
      isComplete: false,
      hasStarted: false,
      lastInvalidSet: null,
      hintCardIds: null,
    });
  }, [timer]);

  const [hintUsed, setHintUsed] = useState(false);

  const getHint = useCallback(() => {
    if (gameState.isComplete || hintUsed) return;

    const availableSets = findAllSets(gameState.board);
    if (availableSets.length > 0) {
      const hintSet = availableSets[0];
      setGameState((prev) => ({
        ...prev,
        hintCardIds: hintSet.map((card) => card.id),
        selectedCardIds: new Set<number>(), // Clear selection when showing hint
      }));
      setHintUsed(true);
    }
  }, [gameState.board, gameState.isComplete, hintUsed]);

  // Count available sets on board (for debugging/hints)
  const availableSetsCount = findAllSets(gameState.board).length;

  return {
    board: gameState.board,
    selectedCardIds: gameState.selectedCardIds,
    foundSets: gameState.foundSets,
    isComplete: gameState.isComplete,
    hasStarted: gameState.hasStarted,
    lastInvalidSet: gameState.lastInvalidSet,
    hintCardIds: gameState.hintCardIds,
    hintUsed,
    availableSetsCount,
    selectCard,
    resetGame,
    getHint,
    timerSeconds: timer.seconds,
    timerIsRunning: timer.isRunning,
  };
}
