export const GRID_W = 21;
export const GRID_H = 27;
export const LEVEL_COUNT = 4;

type Walls = boolean[][];

function emptyGrid(): Walls {
  return Array.from({ length: GRID_H }, () => Array<boolean>(GRID_W).fill(false));
}

function border(w: Walls): void {
  for (let x = 0; x < GRID_W; x++) {
    w[0][x] = true;
    w[GRID_H - 1][x] = true;
  }
  for (let y = 0; y < GRID_H; y++) {
    w[y][0] = true;
    w[y][GRID_W - 1] = true;
  }
}

function hbar(w: Walls, y: number, x0: number, x1: number): void {
  for (let x = x0; x <= x1; x++) w[y][x] = true;
}

function vbar(w: Walls, x: number, y0: number, y1: number): void {
  for (let y = y0; y <= y1; y++) w[y][x] = true;
}

/**
 * Builds the walls for a level. The index grows indefinitely (for speed),
 * but the maze cycles through the LEVEL_COUNT patterns. The start zone (row 2,
 * columns 2–4) is always free.
 */
export function buildLevel(index: number): Walls {
  const lvl = ((index % LEVEL_COUNT) + LEVEL_COUNT) % LEVEL_COUNT;
  const w = emptyGrid();
  border(w);

  if (lvl === 1) {
    // two horizontal barriers with a gap in the middle
    hbar(w, 9, 2, 8);
    hbar(w, 9, 12, GRID_W - 3);
    hbar(w, GRID_H - 10, 2, 8);
    hbar(w, GRID_H - 10, 12, GRID_W - 3);
  } else if (lvl === 2) {
    // two vertical columns
    vbar(w, 5, 5, GRID_H - 6);
    vbar(w, GRID_W - 6, 5, GRID_H - 6);
  } else if (lvl === 3) {
    // central box with one opening on each side
    const cx = Math.floor(GRID_W / 2);
    const cy = Math.floor(GRID_H / 2);
    hbar(w, cy - 4, cx - 4, cx + 4);
    hbar(w, cy + 4, cx - 4, cx + 4);
    vbar(w, cx - 4, cy - 4, cy + 4);
    vbar(w, cx + 4, cy - 4, cy + 4);
    w[cy][cx - 4] = false;
    w[cy][cx + 4] = false;
    w[cy - 4][cx] = false;
    w[cy + 4][cx] = false;
  }

  return w;
}
