import type { Category, LanguageCode } from '../types';

export function emptyLabel(): Record<LanguageCode, string> {
  return { ro: '', en: '' };
}

/** Flattens the tree with depth (for selection/display). */
export function flatten(tree: Category[], depth = 0): { node: Category; depth: number }[] {
  const out: { node: Category; depth: number }[] = [];
  for (const n of tree) {
    out.push({ node: n, depth });
    if (n.children) out.push(...flatten(n.children, depth + 1));
  }
  return out;
}

/** Updates a node (by id) immutably. */
export function updateNode(tree: Category[], id: string, patch: Partial<Category>): Category[] {
  return tree.map((n) => {
    if (n.id === id) return { ...n, ...patch };
    if (n.children) return { ...n, children: updateNode(n.children, id, patch) };
    return n;
  });
}

/** Adds a child to the node with the given id. */
export function addChild(tree: Category[], parentId: string, child: Category): Category[] {
  return tree.map((n) => {
    if (n.id === parentId) return { ...n, children: [...(n.children ?? []), child] };
    if (n.children) return { ...n, children: addChild(n.children, parentId, child) };
    return n;
  });
}

/** Deletes a node (and its descendants). */
export function deleteNode(tree: Category[], id: string): Category[] {
  return tree
    .filter((n) => n.id !== id)
    .map((n) => (n.children ? { ...n, children: deleteNode(n.children, id) } : n));
}
