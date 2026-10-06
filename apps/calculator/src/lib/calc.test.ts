import { describe, expect, it } from 'vitest';
import { formatNumber, operate } from './calc';

describe('operate', () => {
  it('adds, subtracts, multiplies, divides', () => {
    expect(operate(2, '+', 3)).toBe(5);
    expect(operate(5, '−', 8)).toBe(-3);
    expect(operate(4, '×', 2.5)).toBe(10);
    expect(operate(9, '÷', 2)).toBe(4.5);
  });
});

describe('formatNumber', () => {
  it('cleans up floating-point noise', () => {
    expect(formatNumber(0.1 + 0.2)).toBe('0.3');
  });
  it('handles division by zero and NaN', () => {
    expect(formatNumber(1 / 0)).toBe('∞');
    expect(formatNumber(0 / 0)).toBe('Error');
  });
});
