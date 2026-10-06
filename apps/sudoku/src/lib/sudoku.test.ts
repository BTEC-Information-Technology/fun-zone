import { describe, expect, it } from 'vitest';
import {
  canPlace,
  countSolutions,
  findConflicts,
  generatePuzzle,
  generateSolved,
  isSolved,
} from './sudoku';

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

describe('generateSolved', () => {
  it('produces a valid complete grid', () => {
    const g = generateSolved(lcg(42));
    expect(g.every((v) => v >= 1 && v <= 9)).toBe(true);
    for (let r = 0; r < 9; r++) {
      expect(new Set(g.slice(r * 9, r * 9 + 9)).size).toBe(9);
    }
    expect(findConflicts(g).every((b) => !b)).toBe(true);
    expect(isSolved(g)).toBe(true);
  });
});

describe('generatePuzzle', () => {
  it('has a unique solution and matches the solution on the given cells', () => {
    const { puzzle, solution } = generatePuzzle({ id: 'easy', remove: 40 }, lcg(7));
    expect(countSolutions(puzzle, 2)).toBe(1);
    puzzle.forEach((v, i) => {
      if (v !== 0) expect(v).toBe(solution[i]);
    });
  });
});

describe('canPlace / findConflicts', () => {
  it('detects a duplicate in a row', () => {
    const g = new Array(81).fill(0);
    g[0] = 5;
    g[1] = 5;
    const bad = findConflicts(g);
    expect(bad[0] && bad[1]).toBe(true);
  });
  it('canPlace respects the 3×3 box', () => {
    const g = new Array(81).fill(0);
    g[0] = 3;
    expect(canPlace(g, 10, 3)).toBe(false);
    expect(canPlace(g, 10, 4)).toBe(true);
  });
});
