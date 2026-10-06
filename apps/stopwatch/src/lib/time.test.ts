import { describe, expect, it } from 'vitest';
import { formatStopwatch, formatTimer, lapDeltas, toMs } from './time';

describe('formatStopwatch', () => {
  it('zero', () => expect(formatStopwatch(0)).toBe('0:00.00'));
  it('sub-minute with centiseconds', () => expect(formatStopwatch(65230)).toBe('1:05.23'));
  it('over one hour', () => expect(formatStopwatch(3661230)).toBe('1:01:01.23'));
});

describe('formatTimer', () => {
  it('zero', () => expect(formatTimer(0)).toBe('00:00'));
  it('rounds the second up', () => expect(formatTimer(64001)).toBe('01:05'));
  it('over one hour', () => expect(formatTimer(3665000)).toBe('1:01:05'));
});

describe('lapDeltas', () => {
  it('first lap = absolute time, the rest are deltas', () => {
    expect(lapDeltas([1000, 2500, 4000])).toEqual([1000, 1500, 1500]);
  });
  it('empty list', () => expect(lapDeltas([])).toEqual([]));
});

describe('toMs', () => {
  it('1h 2m 3s', () => expect(toMs(1, 2, 3)).toBe(3723000));
});
