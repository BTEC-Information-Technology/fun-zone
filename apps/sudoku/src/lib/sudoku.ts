export type Grid = number[]; // 81 cells, 0 = empty

export interface Difficulty {
  id: 'easy' | 'medium' | 'hard';
  remove: number; // how many cells get cleared
}

export const DIFFICULTIES: Difficulty[] = [
  { id: 'easy', remove: 40 },
  { id: 'medium', remove: 48 },
  { id: 'hard', remove: 54 },
];

const rc = (i: number): [number, number] => [Math.floor(i / 9), i % 9];

export function canPlace(g: Grid, idx: number, v: number): boolean {
  const [r, c] = rc(idx);
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let k = 0; k < 9; k++) {
    if (g[r * 9 + k] === v) return false; // row
    if (g[k * 9 + c] === v) return false; // column
    const bi = (br + Math.floor(k / 3)) * 9 + (bc + (k % 3));
    if (g[bi] === v) return false; // 3×3 box
  }
  return true;
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fillSolved(g: Grid, rng: () => number): boolean {
  const idx = g.indexOf(0);
  if (idx === -1) return true;
  for (const v of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng)) {
    if (canPlace(g, idx, v)) {
      g[idx] = v;
      if (fillSolved(g, rng)) return true;
      g[idx] = 0;
    }
  }
  return false;
}

export function generateSolved(rng: () => number = Math.random): Grid {
  const g = new Array(81).fill(0);
  fillSolved(g, rng);
  return g;
}

/** Counts the solutions (stops at `limit`). */
export function countSolutions(grid: Grid, limit = 2): number {
  const g = grid.slice();
  let count = 0;
  const bt = (): boolean => {
    const idx = g.indexOf(0);
    if (idx === -1) {
      count++;
      return count >= limit;
    }
    for (let v = 1; v <= 9; v++) {
      if (canPlace(g, idx, v)) {
        g[idx] = v;
        if (bt()) {
          g[idx] = 0;
          return true;
        }
        g[idx] = 0;
      }
    }
    return false;
  };
  bt();
  return count;
}

export function generatePuzzle(
  difficulty: Difficulty,
  rng: () => number = Math.random,
): { puzzle: Grid; solution: Grid } {
  const solution = generateSolved(rng);
  const puzzle = solution.slice();
  let removed = 0;
  for (const p of shuffle([...Array(81).keys()], rng)) {
    if (removed >= difficulty.remove) break;
    const saved = puzzle[p];
    puzzle[p] = 0;
    if (countSolutions(puzzle, 2) !== 1) puzzle[p] = saved; // would break uniqueness
    else removed++;
  }
  return { puzzle, solution };
}

const PEERS: number[][] = (() => {
  const all: number[][] = [];
  for (let i = 0; i < 81; i++) {
    const [r, c] = rc(i);
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    const set = new Set<number>();
    for (let k = 0; k < 9; k++) {
      set.add(r * 9 + k);
      set.add(k * 9 + c);
      set.add((br + Math.floor(k / 3)) * 9 + (bc + (k % 3)));
    }
    set.delete(i);
    all.push([...set]);
  }
  return all;
})();

export function peers(idx: number): number[] {
  return PEERS[idx];
}

/** Marks the cells in conflict (duplicate value in a row/column/box). */
export function findConflicts(values: Grid): boolean[] {
  const bad = new Array(81).fill(false);
  for (let i = 0; i < 81; i++) {
    const v = values[i];
    if (!v) continue;
    for (const p of PEERS[i]) {
      if (values[p] === v) {
        bad[i] = true;
        bad[p] = true;
      }
    }
  }
  return bad;
}

export function isComplete(values: Grid): boolean {
  return values.every((v) => v !== 0);
}

export function isSolved(values: Grid): boolean {
  return isComplete(values) && findConflicts(values).every((b) => !b);
}
