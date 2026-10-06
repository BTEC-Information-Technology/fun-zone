import { GRID_H, GRID_W, LEVEL_COUNT, buildLevel } from './levels';

export type Dir = 'up' | 'down' | 'left' | 'right';
export type Status = 'menu' | 'playing' | 'paused' | 'crashed' | 'gameover';

export interface Cell {
  x: number;
  y: number;
}
export interface Food extends Cell {
  value: number;
}

const DELTA: Record<Dir, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };

const START_LIVES = 3;
const TARGET_NUMBER = 9; // eat 1..9, then a new level

/** Nibbles game engine (pure logic, no DOM — testable). */
export class NibblesGame {
  walls: boolean[][] = [];
  snake: Cell[] = [];
  dir: Dir = 'right';
  food: Food = { x: 0, y: 0, value: 1 };
  score = 0;
  level = 0;
  lives = START_LIVES;
  status: Status = 'menu';

  private nextDir: Dir = 'right';
  private growth = 0;
  private currentNumber = 1;
  private rng: () => number;

  constructor(rng: () => number = Math.random) {
    this.rng = rng;
    this.loadLevel(0);
  }

  /** Starts a new game. */
  start(): void {
    this.score = 0;
    this.lives = START_LIVES;
    this.status = 'playing';
    this.loadLevel(0);
  }

  get speedMs(): number {
    // speeds up with the level: 150ms → minimum 60ms
    return Math.max(60, 150 - this.level * 12);
  }

  get levelLabel(): number {
    return this.level + 1;
  }

  setDirection(d: Dir): void {
    if (this.status !== 'playing') return;
    if (d === OPPOSITE[this.dir]) return; // cannot turn back into its own tail
    this.nextDir = d;
  }

  pause(): void {
    if (this.status === 'playing') this.status = 'paused';
  }

  /** Resumes the game after a pause or after a crash (with lives left). */
  resume(): void {
    if (this.status === 'paused' || this.status === 'crashed') this.status = 'playing';
  }

  /** One game step. */
  step(): void {
    if (this.status !== 'playing') return;
    this.dir = this.nextDir;
    const head = this.snake[0];
    const nx = head.x + DELTA[this.dir].x;
    const ny = head.y + DELTA[this.dir].y;

    const eating = nx === this.food.x && ny === this.food.y;
    const willGrow = this.growth > 0 || eating;
    if (this.isWall(nx, ny) || this.hitsSnake(nx, ny, !willGrow)) {
      this.die();
      return;
    }

    this.snake.unshift({ x: nx, y: ny });

    if (eating) {
      this.score += this.food.value * (this.level + 1);
      this.growth += this.food.value;
      if (this.currentNumber >= TARGET_NUMBER) {
        this.loadLevel(this.level + 1);
        return;
      }
      this.currentNumber += 1;
      this.spawnFood();
    }

    if (this.growth > 0) this.growth -= 1;
    else this.snake.pop();
  }

  // --- internal -----------------------------------------------------------

  private loadLevel(index: number): void {
    this.level = index;
    this.walls = buildLevel(index);
    this.currentNumber = 1;
    this.resetSnake();
    this.spawnFood();
  }

  private resetSnake(): void {
    // free zone in all levels: row 2, columns 2–4
    this.snake = [
      { x: 4, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 2 },
    ];
    this.dir = 'right';
    this.nextDir = 'right';
    this.growth = 0;
  }

  private die(): void {
    this.lives -= 1;
    if (this.lives <= 0) {
      this.status = 'gameover';
      return;
    }
    // The position resets to start (safe), but the length is kept: the snake
    // reappears small and grows back to its previous length as it moves.
    const prevLength = this.snake.length;
    this.resetSnake();
    this.growth = prevLength - this.snake.length;
    this.status = 'crashed';
  }

  private isWall(x: number, y: number): boolean {
    return x < 0 || y < 0 || x >= GRID_W || y >= GRID_H || this.walls[y][x];
  }

  private hitsSnake(x: number, y: number, ignoreTail: boolean): boolean {
    const body = ignoreTail ? this.snake.slice(0, -1) : this.snake;
    return body.some((c) => c.x === x && c.y === y);
  }

  private spawnFood(): void {
    let x = 0;
    let y = 0;
    let guard = 0;
    do {
      x = Math.floor(this.rng() * GRID_W);
      y = Math.floor(this.rng() * GRID_H);
      guard += 1;
    } while ((this.isWall(x, y) || this.hitsSnake(x, y, false)) && guard < 1000);
    this.food = { x, y, value: this.currentNumber };
  }
}

export { GRID_W, GRID_H, LEVEL_COUNT };
