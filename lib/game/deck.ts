import {
  Card,
  Shape,
  Color,
  NumberCount,
  Shading,
  SHAPES,
  COLOR_VALUES,
  NUMBERS,
  SHADINGS,
} from './types';

// Generate all 81 unique cards (3^4 combinations)
export function generateAllCards(): Card[] {
  const cards: Card[] = [];
  let id = 0;

  for (const shape of SHAPES) {
    for (const color of COLOR_VALUES) {
      for (const number of NUMBERS) {
        for (const shading of SHADINGS) {
          cards.push({
            id: id++,
            shape: shape as Shape,
            color: color as Color,
            number: number as NumberCount,
            shading: shading as Shading,
          });
        }
      }
    }
  }

  return cards;
}

// Simple string hash function for seeding
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Mulberry32 PRNG - deterministic random number generator
function mulberry32(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Seeded shuffle using Fisher-Yates algorithm
function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const result = [...array];
  const random = mulberry32(seed);

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

// Get today's date as a string (UTC)
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

// Get the seed for today's puzzle
export function getDateSeed(dateStr?: string): number {
  const date = dateStr || getTodayDateString();
  return hashString(date);
}

// Get the daily shuffled deck - same for all players on the same day
export function getDailyDeck(dateStr?: string): Card[] {
  const deck = generateAllCards();
  const seed = getDateSeed(dateStr);
  return shuffleWithSeed(deck, seed);
}
