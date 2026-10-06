export type CategoryId =
  | 'length'
  | 'mass'
  | 'temperature'
  | 'volume'
  | 'area'
  | 'speed'
  | 'time'
  | 'data';

export const CATEGORIES: CategoryId[] = [
  'length',
  'mass',
  'temperature',
  'volume',
  'area',
  'speed',
  'time',
  'data',
];

/** Factors to the base unit of each category (linear conversion). */
export const LINEAR: Record<Exclude<CategoryId, 'temperature'>, Record<string, number>> = {
  length: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344, nmi: 1852 },
  mass: { mg: 1e-6, g: 0.001, kg: 1, t: 1000, oz: 0.028349523125, lb: 0.45359237, st: 6.35029318 },
  volume: {
    ml: 0.001,
    l: 1,
    m3: 1000,
    tsp: 0.00492892159375,
    tbsp: 0.01478676478125,
    cup: 0.2365882365,
    pt: 0.473176473,
    qt: 0.946352946,
    gal: 3.785411784,
  },
  area: { cm2: 1e-4, m2: 1, ha: 1e4, km2: 1e6, in2: 0.00064516, ft2: 0.09290304, ac: 4046.8564224, mi2: 2589988.110336 },
  speed: { 'm/s': 1, 'km/h': 0.2777777778, mph: 0.44704, kn: 0.5144444444, 'ft/s': 0.3048 },
  time: { ms: 0.001, s: 1, min: 60, h: 3600, day: 86400, week: 604800 },
  data: { bit: 0.125, B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
};

const TEMP_TO_C: Record<string, (v: number) => number> = {
  C: (v) => v,
  F: (v) => ((v - 32) * 5) / 9,
  K: (v) => v - 273.15,
};
const TEMP_FROM_C: Record<string, (v: number) => number> = {
  C: (v) => v,
  F: (v) => (v * 9) / 5 + 32,
  K: (v) => v + 273.15,
};

export function unitsOf(category: CategoryId): string[] {
  if (category === 'temperature') return ['C', 'F', 'K'];
  return Object.keys(LINEAR[category]);
}

export function convert(value: number, category: CategoryId, from: string, to: string): number {
  if (category === 'temperature') return TEMP_FROM_C[to](TEMP_TO_C[from](value));
  const table = LINEAR[category];
  return (value * table[from]) / table[to];
}

/** “Pretty” display for symbols with exponents etc. */
export const DISPLAY: Record<string, string> = {
  m3: 'm³',
  cm2: 'cm²',
  m2: 'm²',
  km2: 'km²',
  in2: 'in²',
  ft2: 'ft²',
  mi2: 'mi²',
};

export function displayUnit(id: string): string {
  return DISPLAY[id] ?? id;
}

export function formatResult(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e12 || abs < 1e-6) return n.toExponential(4);
  return String(parseFloat(n.toPrecision(8)));
}
