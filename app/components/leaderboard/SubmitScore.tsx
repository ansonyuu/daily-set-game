'use client';

import { useState } from 'react';
import { formatTime } from '@/lib/game/gameUtils';

interface SubmitScoreProps {
  timeSeconds: number;
  onSubmit: (username: string) => Promise<void>;
  onClose: () => void;
}

export default function SubmitScore({ timeSeconds, onSubmit, onClose }: SubmitScoreProps) {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(username.trim());
      setHasSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-md shadow-2xl max-w-md w-full p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple mb-2">Congratulations!</h2>
          <p className="text-gray-600">You found all 6 sets!</p>
        </div>

        <div className="text-center py-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">Your Time</div>
          <div className="text-4xl font-mono font-bold text-black">
            {formatTime(timeSeconds)}
          </div>
        </div>

        {!hasSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Enter your name for the leaderboard
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-purple focus:border-purple outline-none transition-colors"
                maxLength={20}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={!username.trim() || isSubmitting}
                className="flex-1 px-4 py-3 bg-purple text-white rounded font-medium hover:bg-purple/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center text-green-600 font-medium">
              Score submitted successfully!
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-purple text-white rounded font-medium hover:bg-purple/90 transition-colors cursor-pointer"
            >
              View Leaderboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
