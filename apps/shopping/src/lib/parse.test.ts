import { describe, expect, it } from 'vitest';
import { formatNumber, grandTotal, lineTotal, parseLabel, type Item } from './parse';

describe('parseLabel', () => {
  it('extracts the name and the largest price', () => {
    const r = parseLabel('LAPTE ZUZU 1.5%\n5,99\npret/l 3,99');
    expect(r.price).toBe(5.99);
    expect(r.name.toLowerCase()).toContain('lapte');
  });
  it('accepts a dot as decimal separator', () => {
    expect(parseLabel('Ceva\n12.49').price).toBe(12.49);
  });
  it('missing price → null', () => {
    expect(parseLabel('FĂRĂ PREȚ AICI').price).toBeNull();
  });
  it('cuts the price from the end of the name', () => {
    const r = parseLabel('Cafea boabe 9,90');
    expect(r.name).toBe('Cafea boabe');
  });
  it('does not confuse a date with a price', () => {
    const r = parseLabel('05.06.2026\n10,85 LEI');
    expect(r.candidates).toEqual([10.85]);
    expect(r.price).toBe(10.85);
  });
  it('skips the store header for the name', () => {
    const r = parseLabel('Magazin 4500 Timisoara - Fabric\nDOVLECEI ZUCCHINI\n6,99 lei/kg\n10,85 LEI');
    expect(r.name).toBe('DOVLECEI ZUCCHINI');
    expect(r.candidates).toEqual([10.85, 6.99]);
  });
});

describe('totals', () => {
  const items: Item[] = [
    { id: 'a', name: 'x', price: 2.5, qty: 2 },
    { id: 'b', name: 'y', price: 1.2, qty: 3 },
  ];
  it('line total', () => expect(lineTotal(items[0])).toBe(5));
  it('grand total', () => expect(grandTotal(items)).toBeCloseTo(8.6, 5));
});

describe('formatNumber', () => {
  it('two decimals', () => expect(formatNumber(3.1)).toBe('3.10'));
});
