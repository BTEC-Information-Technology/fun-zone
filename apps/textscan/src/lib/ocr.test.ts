import { describe, expect, it } from 'vitest';
import { cleanText } from './ocr';

describe('cleanText', () => {
  it('removes multiple spaces', () => {
    expect(cleanText('un    doi')).toBe('un doi');
  });
  it('collapses excess blank lines', () => {
    expect(cleanText('a\n\n\n\nb')).toBe('a\n\nb');
  });
  it('trims leading/trailing spaces', () => {
    expect(cleanText('  text  ')).toBe('text');
  });
  it('strips spaces before a newline', () => {
    expect(cleanText('a   \nb')).toBe('a\nb');
  });
});
