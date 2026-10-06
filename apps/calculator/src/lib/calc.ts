export type Op = '+' | '−' | '×' | '÷';

export function operate(a: number, op: Op, b: number): number {
  switch (op) {
    case '+':
      return a + b;
    case '−':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return a / b;
  }
}

/** Formats the number without floating-point noise. */
export function formatNumber(n: number): string {
  if (Number.isNaN(n)) return 'Error';
  if (!Number.isFinite(n)) return '∞';
  return String(parseFloat(n.toPrecision(12)));
}
