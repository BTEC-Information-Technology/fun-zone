import { describe, expect, it } from 'vitest';
import { bestMove, emptyBoard, isFull, winner, type Board } from './tictactoe';

const B = (s: string): Board => s.split('').map((c) => (c === '.' ? null : (c as 'X' | 'O')));

describe('winner', () => {
  it('detects a row win', () => {
    expect(winner(B('XXX' + 'O.O' + '...'))?.player).toBe('X');
  });
  it('detects a diagonal win', () => {
    expect(winner(B('O.X' + '.X.' + 'X.O'))?.player).toBe('X');
  });
  it('returns null with no winner', () => {
    expect(winner(B('XOX' + 'OOX' + '...'))).toBeNull();
  });
});

describe('isFull', () => {
  it('is true when board has no empties', () => {
    expect(isFull(B('XOXOXOXOX'))).toBe(true);
  });
  it('is false otherwise', () => {
    expect(isFull(emptyBoard())).toBe(false);
  });
});

describe('bestMove', () => {
  it('takes an immediate win', () => {
    // O can win at index 2
    expect(bestMove(B('OO.' + 'XX.' + '...'), 'O')).toBe(2);
  });
  it('blocks the opponent win', () => {
    // X threatens 0-1-2; O must block at 2
    expect(bestMove(B('XX.' + 'O..' + '...'), 'O')).toBe(2);
  });
  it('never loses from an empty board (optimal both sides)', () => {
    let b = emptyBoard();
    let turn: 'X' | 'O' = 'X';
    while (!winner(b) && !isFull(b)) {
      const m = bestMove(b, turn);
      b = b.slice();
      b[m] = turn;
      turn = turn === 'X' ? 'O' : 'X';
    }
    expect(winner(b)).toBeNull(); // optimal play => draw
  });
});
