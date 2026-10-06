import { describe, expect, it } from 'vitest';
import { buildDeck, DIFFICULTIES, isMatch, pairsOf } from './memory';

describe('buildDeck', () => {
  it('creates 2*pairs cards', () => {
    expect(buildDeck(8).length).toBe(16);
  });
  it('each symbol appears exactly twice', () => {
    const counts = new Map<number, number>();
    for (const c of buildDeck(6)) counts.set(c.symbol, (counts.get(c.symbol) ?? 0) + 1);
    expect([...counts.values()].every((n) => n === 2)).toBe(true);
    expect(counts.size).toBe(6);
  });
  it('keys are unique', () => {
    const deck = buildDeck(10);
    expect(new Set(deck.map((c) => c.key)).size).toBe(20);
  });
});

describe('isMatch', () => {
  it('pairs with the same symbol', () => {
    expect(isMatch({ key: 0, symbol: 3 }, { key: 1, symbol: 3 })).toBe(true);
    expect(isMatch({ key: 0, symbol: 3 }, { key: 2, symbol: 4 })).toBe(false);
  });
});

describe('DIFFICULTIES', () => {
  it('all have an even number of cards', () => {
    expect(DIFFICULTIES.every((d) => (d.cols * d.rows) % 2 === 0)).toBe(true);
  });
  it('pairs computed correctly', () => {
    expect(pairsOf({ id: 'easy', cols: 4, rows: 4 })).toBe(8);
  });
});
