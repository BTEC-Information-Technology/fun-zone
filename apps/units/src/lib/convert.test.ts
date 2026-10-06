import { describe, expect, it } from 'vitest';
import { convert, formatResult, unitsOf } from './convert';

const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps;

describe('convert linear', () => {
  it('m -> km', () => {
    expect(convert(1500, 'length', 'm', 'km')).toBe(1.5);
  });
  it('kg -> lb', () => {
    expect(near(convert(1, 'mass', 'kg', 'lb'), 2.2046226218, 1e-6)).toBe(true);
  });
  it('km/h -> m/s', () => {
    expect(near(convert(36, 'speed', 'km/h', 'm/s'), 10, 1e-3)).toBe(true);
  });
  it('round trip is identity', () => {
    const there = convert(123.45, 'volume', 'l', 'gal');
    expect(near(convert(there, 'volume', 'gal', 'l'), 123.45, 1e-6)).toBe(true);
  });
});

describe('convert temperature', () => {
  it('100 C -> 212 F', () => {
    expect(convert(100, 'temperature', 'C', 'F')).toBe(212);
  });
  it('32 F -> 0 C', () => {
    expect(near(convert(32, 'temperature', 'F', 'C'), 0)).toBe(true);
  });
  it('0 C -> 273.15 K', () => {
    expect(convert(0, 'temperature', 'C', 'K')).toBe(273.15);
  });
});

describe('unitsOf', () => {
  it('temperature has C/F/K', () => {
    expect(unitsOf('temperature')).toEqual(['C', 'F', 'K']);
  });
  it('length lists several units', () => {
    expect(unitsOf('length')).toContain('mi');
  });
});

describe('formatResult', () => {
  it('trims float noise', () => {
    expect(formatResult(0.1 + 0.2)).toBe('0.3');
  });
  it('handles zero', () => {
    expect(formatResult(0)).toBe('0');
  });
});
