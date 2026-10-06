import type { AppEntry, Category } from '../types';

function collectDescendants(node: Category, acc: Set<string>): void {
  acc.add(node.id);
  node.children?.forEach((c) => collectDescendants(c, acc));
}

/** Expands the selected categories with all their descendants (a parent includes its subcategories). */
export function expandCategories(selected: string[], tree: Category[]): Set<string> {
  const byId = new Map<string, Category>();
  const index = (nodes: Category[]) =>
    nodes.forEach((n) => {
      byId.set(n.id, n);
      if (n.children) index(n.children);
    });
  index(tree);

  const out = new Set<string>();
  for (const id of selected) {
    const node = byId.get(id);
    if (node) collectDescendants(node, out);
    else out.add(id);
  }
  return out;
}

/**
 * Filters the apps: categories OR (with subcategories) AND tags OR AND name search.
 * An empty selection on a section = "all" (no filter on that section).
 */
export function filterApps(
  apps: AppEntry[],
  tree: Category[],
  selectedCategories: string[],
  selectedTags: string[],
  nameQuery: string,
): AppEntry[] {
  const expanded = expandCategories(selectedCategories, tree);
  const q = nameQuery.trim().toLowerCase();
  return apps.filter((app) => {
    const catOk = expanded.size === 0 || app.categories.some((c) => expanded.has(c));
    const tagOk = selectedTags.length === 0 || app.tags.some((t) => selectedTags.includes(t));
    const nameOk = q === '' || app.name.toLowerCase().includes(q);
    return catOk && tagOk && nameOk;
  });
}

/** Alphabetical sort by name (default). */
export function sortByName(apps: AppEntry[]): AppEntry[] {
  return [...apps].sort((a, b) => a.name.localeCompare(b.name));
}
