import { describe, expect, it } from 'vitest';
import { emptyCells, hasMoves, move, newGame, spawn, type Board } from './game2048';

const b = (rows: number[][]): Board => rows.map((r) => [...r]);

describe('move', () => {
  it('compresses a row to the left', () => {
    const { board, moved } = move(b([[0, 2, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'left');
    expect(board[0]).toEqual([4, 0, 0, 0]);
    expect(moved).toBe(true);
  });

  it('merges only once per move (2 2 2 2 -> 4 4)', () => {
    const { board, gained } = move(b([[2, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'left');
    expect(board[0]).toEqual([4, 4, 0, 0]);
    expect(gained).toBe(8);
  });

  it('moves right and keeps order', () => {
    const { board } = move(b([[2, 0, 2, 4], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'right');
    expect(board[0]).toEqual([0, 0, 4, 4]);
  });

  it('moves up by columns', () => {
    const { board } = move(b([[2, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0], [4, 0, 0, 0]]), 'up');
    expect(board.map((r) => r[0])).toEqual([4, 4, 0, 0]);
  });

  it('reports moved=false when nothing changes', () => {
    const { moved } = move(b([[2, 4, 8, 16], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'left');
    expect(moved).toBe(false);
  });
});

describe('spawn', () => {
  it('fills exactly one empty cell', () => {
    const before = emptyCells(b([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])).length;
    const after = emptyCells(spawn(b([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), () => 0.5)).length;
    expect(before - after).toBe(1);
  });
});

describe('hasMoves', () => {
  it('is false on a full, locked board', () => {
    expect(hasMoves(b([[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2]]))).toBe(false);
  });
  it('is true when an adjacent merge exists', () => {
    expect(hasMoves(b([[2, 2, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2]]))).toBe(true);
  });
});

describe('newGame', () => {
  it('starts with two tiles', () => {
    const start = newGame(() => 0.3);
    expect(emptyCells(start).length).toBe(14);
  });
});
