export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];

export const LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function emptyBoard(): Board {
  return Array<Cell>(9).fill(null);
}

export function other(p: Player): Player {
  return p === 'X' ? 'O' : 'X';
}

export function winner(b: Board): { player: Player; line: number[] } | null {
  for (const line of LINES) {
    const [a, c, d] = line;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { player: b[a] as Player, line };
  }
  return null;
}

export function isFull(b: Board): boolean {
  return b.every((c) => c !== null);
}

export function emptyIndices(b: Board): number[] {
  const out: number[] = [];
  b.forEach((c, i) => {
    if (c === null) out.push(i);
  });
  return out;
}

function minimax(board: Board, turn: Player, me: Player, depth: number): number {
  const w = winner(board);
  if (w) return w.player === me ? 10 - depth : depth - 10;
  if (isFull(board)) return 0;
  const scores = emptyIndices(board).map((i) => {
    const nb = board.slice();
    nb[i] = turn;
    return minimax(nb, other(turn), me, depth + 1);
  });
  return turn === me ? Math.max(...scores) : Math.min(...scores);
}

/** Optimal move (minimax) for `player`. Unbeatable. */
export function bestMove(board: Board, player: Player): number {
  let bestScore = -Infinity;
  let bestIdx = -1;
  for (const i of emptyIndices(board)) {
    const nb = board.slice();
    nb[i] = player;
    const score = minimax(nb, other(player), player, 0);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}

/** Random move (for the “easy” difficulty). */
export function randomMove(board: Board, rng: () => number = Math.random): number {
  const empty = emptyIndices(board);
  if (empty.length === 0) return -1;
  return empty[Math.floor(rng() * empty.length)];
}
