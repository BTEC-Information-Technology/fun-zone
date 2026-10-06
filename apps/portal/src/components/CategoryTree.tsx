import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Category } from '../types';
import { localized } from '../types';
import { ChevronRightIcon } from './icons';

interface Props {
  tree: Category[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 flex-none items-center justify-center rounded border ${
        checked ? 'border-indigo-500 bg-indigo-600' : 'border-white/30'
      }`}
    >
      {checked && (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
  );
}

function TreeNode({
  node,
  depth,
  lang,
  selected,
  toggle,
}: {
  node: Category;
  depth: number;
  lang: string;
  selected: string[];
  toggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = !!node.children?.length;
  const checked = selected.includes(node.id);

  return (
    <li>
      <div className="flex items-center gap-1" style={{ paddingLeft: depth * 14 }}>
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded p-0.5 text-neutral-400 hover:text-white"
            aria-label="toggle"
          >
            <ChevronRightIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <span className="w-5" />
        )}
        <button
          type="button"
          onClick={() => toggle(node.id)}
          className="flex flex-1 items-center gap-2 rounded px-1 py-1 text-left text-sm transition-colors hover:bg-white/10"
        >
          <Checkbox checked={checked} />
          <span>{localized(node.label, lang)}</span>
        </button>
      </div>
      {hasChildren && open && (
        <ul>
          {node.children!.map((c) => (
            <TreeNode key={c.id} node={c} depth={depth + 1} lang={lang} selected={selected} toggle={toggle} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function CategoryTree({ tree, selected, onChange }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  return (
    <ul className="flex flex-col gap-0.5">
      {/* Show all */}
      <li>
        <button
          type="button"
          onClick={() => onChange([])}
          className="flex w-full items-center gap-2 rounded px-1 py-1 text-left text-sm transition-colors hover:bg-white/10"
        >
          <Checkbox checked={selected.length === 0} />
          <span className="font-medium">{t('filters.showAll')}</span>
        </button>
      </li>
      {tree.map((node) => (
        <TreeNode key={node.id} node={node} depth={0} lang={lang} selected={selected} toggle={toggle} />
      ))}
    </ul>
  );
}
