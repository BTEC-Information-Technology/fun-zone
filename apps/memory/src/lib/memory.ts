export interface Card {
  /** Unique key per card (0..2*pairs-1). */
  key: number;
  /** The symbol (0..pairs-1); a pair shares the same symbol. */
  symbol: number;
}

/** Builds a shuffled deck with `pairs` pairs (2*pairs cards). */
export function buildDeck(pairs: number, rng: () => number = Math.random): Card[] {
  const cards: Card[] = [];
  for (let s = 0; s < pairs; s++) {
    cards.push({ key: s * 2, symbol: s });
    cards.push({ key: s * 2 + 1, symbol: s });
  }
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function isMatch(a: Card, b: Card): boolean {
  return a.symbol === b.symbol;
}

export interface Difficulty {
  id: 'easy' | 'medium' | 'hard';
  cols: number;
  rows: number;
}

export const DIFFICULTIES: Difficulty[] = [
  { id: 'easy', cols: 4, rows: 4 }, // 8 pairs
  { id: 'medium', cols: 4, rows: 6 }, // 12 pairs
  { id: 'hard', cols: 6, rows: 6 }, // 18 pairs
];

export function pairsOf(d: Difficulty): number {
  return (d.cols * d.rows) / 2;
}
