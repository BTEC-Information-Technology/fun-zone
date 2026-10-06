export type Dir = 'left' | 'right' | 'up' | 'down';
export type Board = number[][];
export type Rng = () => number;

export const SIZE = 4;

export function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array<number>(SIZE).fill(0));
}

function slide(row: number[]): { row: number[]; gained: number } {
  const nums = row.filter((n) => n !== 0);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const merged = nums[i] * 2;
      out.push(merged);
      gained += merged;
      i++;
    } else {
      out.push(nums[i]);
    }
  }
  while (out.length < SIZE) out.push(0);
  return { row: out, gained };
}

function transpose(b: Board): Board {
  return b[0].map((_, c) => b.map((r) => r[c]));
}

function equal(a: Board, b: Board): boolean {
  return a.every((row, r) => row.every((v, c) => v === b[r][c]));
}

export function move(board: Board, dir: Dir): { board: Board; gained: number; moved: boolean } {
  let gained = 0;
  const slideAll = (rows: Board): Board =>
    rows.map((r) => {
      const s = slide(r);
      gained += s.gained;
      return s.row;
    });

  let work: Board;
  if (dir === 'left') work = slideAll(board);
  else if (dir === 'right') work = slideAll(board.map((r) => [...r].reverse())).map((r) => [...r].reverse());
  else if (dir === 'up') work = transpose(slideAll(transpose(board)));
  else work = transpose(slideAll(transpose(board).map((r) => [...r].reverse())).map((r) => [...r].reverse()));

  return { board: work, gained, moved: !equal(work, board) };
}

export function emptyCells(b: Board): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (b[r][c] === 0) cells.push([r, c]);
  return cells;
}

/** Adds a new tile (2 with 90%, 4 with 10%) in a random empty cell. */
export function spawn(b: Board, rng: Rng = Math.random): Board {
  const cells = emptyCells(b);
  if (cells.length === 0) return b;
  const [r, c] = cells[Math.floor(rng() * cells.length)];
  const nb = b.map((row) => [...row]);
  nb[r][c] = rng() < 0.9 ? 2 : 4;
  return nb;
}

export function hasMoves(b: Board): boolean {
  if (emptyCells(b).length > 0) return true;
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (c + 1 < SIZE && b[r][c] === b[r][c + 1]) return true;
      if (r + 1 < SIZE && b[r][c] === b[r + 1][c]) return true;
    }
  return false;
}

export function newGame(rng: Rng = Math.random): Board {
  return spawn(spawn(emptyBoard(), rng), rng);
}
