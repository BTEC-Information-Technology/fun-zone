import type { AppEntry, Category, Tag } from '../types';
import { localized } from '../types';
import catalogData from './catalog.json';
import categoriesData from './categories.json';
import tagsData from './tags.json';

export const CATALOG = catalogData as unknown as AppEntry[];
export const CATEGORIES = categoriesData as Category[];
export const TAGS = tagsData as Tag[];

const catById = new Map<string, Category>();
function indexCats(nodes: Category[]): void {
  nodes.forEach((n) => {
    catById.set(n.id, n);
    if (n.children) indexCats(n.children);
  });
}
indexCats(CATEGORIES);

const tagById = new Map(TAGS.map((t) => [t.id, t]));

export function categoryLabel(id: string, lang: string): string {
  const c = catById.get(id);
  return c ? localized(c.label, lang) : id;
}

export function tagLabel(id: string, lang: string): string {
  const t = tagById.get(id);
  return t ? localized(t.label, lang) : id;
}
