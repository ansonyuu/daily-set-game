export type Shape = 'diamond' | 'oval' | 'squiggle';
export type Color = 'red' | 'green' | 'purple';
export type NumberCount = 1 | 2 | 3;
export type Shading = 'solid' | 'striped' | 'empty';

export interface Card {
  id: number;
  shape: Shape;
  color: Color;
  number: NumberCount;
  shading: Shading;
}

export interface GameState {
  board: Card[];
  deck: Card[];
  selectedCardIds: Set<number>;
  foundSets: Card[][];
  isComplete: boolean;
  hasStarted: boolean;
  lastInvalidSet: number[] | null;
  hintCardIds: number[] | null;
}

export interface LeaderboardEntry {
  username: string;
  timeSeconds: number;
  date: string;
  timestamp: number;
}

export interface DailyLeaderboard {
  [date: string]: LeaderboardEntry[];
}

export const COLORS: Record<Color, string> = {
  red: '#E74C3C',
  green: '#27AE60',
  purple: '#9B59B6',
};

export const SHAPES: Shape[] = ['diamond', 'oval', 'squiggle'];
export const COLOR_VALUES: Color[] = ['red', 'green', 'purple'];
export const NUMBERS: NumberCount[] = [1, 2, 3];
export const SHADINGS: Shading[] = ['solid', 'striped', 'empty'];

export const SETS_TO_WIN = 10;
export const BOARD_SIZE = 12;
