import { useState } from 'react';
import type { Category } from '../types';
import { CATEGORIES } from '../data/catalog';
import { addChild, deleteNode, emptyLabel, updateNode } from './treeOps';
import { saveData } from './adminApi';

function clone(tree: Category[]): Category[] {
  return tree.map((n) => ({ id: n.id, label: { ...n.label }, children: n.children ? clone(n.children) : undefined }));
}

function allIds(tree: Category[], acc: string[] = []): string[] {
  for (const n of tree) {
    acc.push(n.id.trim());
    if (n.children) allIds(n.children, acc);
  }
  return acc;
}

const input = 'rounded border border-white/15 bg-neutral-800 px-2 py-1 text-sm outline-none focus:border-indigo-500';

type SetTree = (fn: (t: Category[]) => Category[]) => void;

// Defined at module level (NOT inside the component) so it does not remount
// on every keystroke — otherwise the input loses focus.
function NodeRow({ node, depth, setTree }: { node: Category; depth: number; setTree: SetTree }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 py-1" style={{ paddingLeft: depth * 16 }}>
        <input
          value={node.id}
          onChange={(e) => setTree((t) => updateNode(t, node.id, { id: e.target.value }))}
          placeholder="id"
          className={`${input} w-32`}
        />
        <input
          value={node.label.ro}
          onChange={(e) => setTree((t) => updateNode(t, node.id, { label: { ...node.label, ro: e.target.value } }))}
          placeholder="RO"
          className={`${input} w-36`}
        />
        <input
          value={node.label.en}
          onChange={(e) => setTree((t) => updateNode(t, node.id, { label: { ...node.label, en: e.target.value } }))}
          placeholder="EN"
          className={`${input} w-36`}
        />
        <button
          type="button"
          onClick={() => setTree((t) => addChild(t, node.id, { id: '', label: emptyLabel() }))}
          className="rounded border border-white/15 px-2 py-1 text-xs hover:bg-white/10"
        >
          + sub
        </button>
        <button
          type="button"
          onClick={() => setTree((t) => deleteNode(t, node.id))}
          className="rounded border border-rose-500/40 px-2 py-1 text-xs text-rose-200 hover:bg-rose-950/40"
        >
          delete
        </button>
      </div>
      {node.children?.map((c, i) => <NodeRow key={i} node={c} depth={depth + 1} setTree={setTree} />)}
    </div>
  );
}

export function CategoryTreeEditor() {
  const [tree, setTree] = useState<Category[]>(() => clone(CATEGORIES));
  const [status, setStatus] = useState('');

  const save = async () => {
    const ids = allIds(tree);
    if (ids.some((id) => id === '')) {
      setStatus('Error: all ids must be filled in.');
      return;
    }
    if (new Set(ids).size !== ids.length) {
      setStatus('Error: duplicate ids.');
      return;
    }
    try {
      await saveData('categories', tree);
      setStatus('Saved. Reloading.');
    } catch (e) {
      setStatus(String(e));
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      <div>{tree.map((n, i) => <NodeRow key={i} node={n} depth={0} setTree={setTree} />)}</div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTree((t) => [...t, { id: '', label: emptyLabel() }])}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
        >
          + Root category
        </button>
        <button
          type="button"
          onClick={save}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Save
        </button>
        {status && <span className="text-sm text-neutral-400">{status}</span>}
      </div>
    </div>
  );
}
