'use client';

import { useState, useEffect, useRef } from 'react';
import { useGame } from '@/hooks/useGame';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import GameBoard from './components/game/GameBoard';
import Timer from './components/game/Timer';
import SetCounter from './components/game/SetCounter';
import FoundSets from './components/game/FoundSets';
import Leaderboard from './components/leaderboard/Leaderboard';
import SubmitScore from './components/leaderboard/SubmitScore';

export default function Home() {
  const game = useGame();
  const leaderboard = useLeaderboard();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedUsername, setSubmittedUsername] = useState<string | null>(null);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const leaderboardRef = useRef<HTMLDivElement>(null);

  // Show modal when game completes
  useEffect(() => {
    if (game.isComplete && !hasShownModal) {
      setShowSubmitModal(true);
      setHasShownModal(true);
    }
  }, [game.isComplete, hasShownModal]);

  const handleSubmitScore = async (username: string) => {
    await leaderboard.submitScore(username, game.timerSeconds);
    setSubmittedUsername(username);
  };

  const handleCloseModal = () => {
    setShowSubmitModal(false);
    // Scroll to leaderboard after modal closes
    setTimeout(() => {
      leaderboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Format today's date nicely
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Masthead */}
        <header className="text-center relative">
          <div className="border-y border-black py-4">
            <h1 className="text-4xl md:text-5xl tracking-tight">The Daily Set</h1>
            <p className="text-sm text-gray-500 mt-3">{formattedDate}</p>
          </div>

          {/* Info icon */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="absolute top-4 right-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="How to play"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </button>

          {/* Help popover */}
          {showHelp && (
            <div className="absolute top-14 right-0 w-72 bg-white rounded-lg shadow-lg border border-gray-100 p-4 text-left z-10">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">How to Play</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                A <strong className="text-gray-700">Set</strong> consists of 3 cards where each feature (shape, color, number, shading) is either ALL the same OR ALL different across the 3 cards.
              </p>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Click 3 cards to select them. Valid sets are automatically detected and replaced with new cards.
              </p>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-4 text-xs font-medium text-purple uppercase tracking-widest hover:underline cursor-pointer"
              >
                Got it
              </button>
            </div>
          )}

          {/* Stats integrated into header */}
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <SetCounter foundCount={game.foundSets.length} />
            <button
              onClick={game.getHint}
              className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-widest border border-gray-200 rounded hover:bg-gray-50 hover:text-gray-600 cursor-pointer transition-colors"
            >
              Hint
            </button>
            <Timer seconds={game.timerSeconds} isRunning={game.timerIsRunning} />
          </div>
        </header>

        {/* Game Board + Found Sets - side by side on larger screens */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Game Board */}
          <div className="flex-1 w-full lg:max-w-xl">
            <GameBoard
              board={game.board}
              selectedCardIds={game.selectedCardIds}
              invalidCardIds={game.lastInvalidSet}
              hintCardIds={game.hintCardIds}
              onCardClick={game.selectCard}
            />
          </div>

          {/* Found Sets - sidebar on larger screens */}
          <div className="w-full lg:w-auto bg-white rounded-xl p-4 shadow-sm overflow-hidden">
            <FoundSets foundSets={game.foundSets} />
          </div>
        </div>

        {/* Leaderboard - only show after game complete */}
        {game.isComplete && (
          <div ref={leaderboardRef} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="mb-4">Today&apos;s Leaderboard</h2>
            <Leaderboard
              entries={leaderboard.entries}
              isLoading={leaderboard.isLoading}
              currentUsername={submittedUsername || undefined}
            />
          </div>
        )}
      </div>

      {/* Submit Score Modal */}
      {showSubmitModal && (
        <SubmitScore
          timeSeconds={game.timerSeconds}
          onSubmit={handleSubmitScore}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
}
