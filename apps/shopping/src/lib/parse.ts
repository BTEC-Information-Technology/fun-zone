export interface ParsedLabel {
  name: string;
  price: number | null;
  /** All detected price-like numbers (descending) — for quick selection. */
  candidates: number[];
}

// Price: 12,99 / 12.99 — but NOT a date (05.06.2026): exclude if another ".dd" group follows.
const PRICE_RE = /(\d{1,4})\s*[.,]\s*(\d{2})(?![.,]?\d)/g;

// Lines that are NOT the product name (store header, price/weight, date, code).
const NAME_SKIP = /magazin|timi[sș]oara|fabric|s\.?r\.?l\.?|\blei\b|\/\s*kg|greut|\bpre[țt]\b|\bplu\b|\bron\b|\btara\b|\bdata\b|\blot\b|\bkg\b|\d{1,2}\.\d{2}\.\d{2,4}/i;

function cleanName(line: string): string {
  return line
    .replace(/\s+/g, ' ')
    .replace(/[•·|"'’]+/g, ' ')
    .replace(/\s*\d+[.,]\d{2}.*$/, '') // cut the price from the end of the line
    .trim();
}

/**
 * Extracts a name and candidate prices from raw OCR text of a label.
 * Default price: the largest candidate. Name: the most "letter-rich" line
 * that is not a header/price/weight/date (best-effort — the user corrects it).
 */
export function parseLabel(text: string): ParsedLabel {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const seen = new Set<number>();
  const candidates: number[] = [];
  for (const line of lines) {
    PRICE_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = PRICE_RE.exec(line))) {
      const val = Number(m[1]) + Number(m[2]) / 100;
      if (val > 0 && val < 100000 && !seen.has(val)) {
        seen.add(val);
        candidates.push(val);
      }
    }
  }
  candidates.sort((a, b) => b - a);

  let name = '';
  let bestLetters = 0;
  for (const line of lines) {
    if (line.length > 30 || NAME_SKIP.test(line)) continue; // header/price/weight/address
    const letters = (line.match(/[A-Za-zĂÂÎȘȚăâîșț]/g) ?? []).length;
    if (letters > bestLetters && letters >= 3) {
      bestLetters = letters;
      name = line;
    }
  }

  return { name: cleanName(name), price: candidates[0] ?? null, candidates };
}

/** Formats a number as a price, with 2 decimals (no currency). */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '0.00';
  return n.toFixed(2);
}

export interface Item {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export function lineTotal(it: Item): number {
  return it.price * it.qty;
}

export function grandTotal(items: Item[]): number {
  return items.reduce((s, it) => s + lineTotal(it), 0);
}
