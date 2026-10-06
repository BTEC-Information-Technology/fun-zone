export const LANGUAGES = ['ro', 'en'] as const;
export type LanguageCode = (typeof LANGUAGES)[number];
export type Localized = Record<LanguageCode, string>;

/** An app from the catalog. */
export interface AppEntry {
  id: string;
  /** Brand, fixed (not translated). */
  name: string;
  /** The app URL (opens in a new tab). */
  url: string;
  /** Card image (path in /public), falls back to an icon. */
  image: string;
  description: Localized;
  /** Category ids (from categories.json). */
  categories: string[];
  /** Tag ids (from tags.json). */
  tags: string[];
}

/** Node in the category tree (arbitrary depth). */
export interface Category {
  id: string;
  label: Localized;
  children?: Category[];
}

export interface Tag {
  id: string;
  label: Localized;
}

export function localized(l: Localized, lang: string): string {
  return l[lang as LanguageCode] ?? l.ro;
}
