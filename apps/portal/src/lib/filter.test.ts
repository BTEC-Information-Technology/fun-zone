import { describe, expect, it } from 'vitest';
import type { AppEntry, Category } from '../types';
import { expandCategories, filterApps } from './filter';

const tree: Category[] = [
  {
    id: 'games',
    label: { ro: '', en: '' },
    children: [
      { id: 'arcade', label: { ro: '', en: '' } },
      { id: 'puzzle', label: { ro: '', en: '' } },
    ],
  },
  { id: 'tools', label: { ro: '', en: '' } },
];

function app(id: string, categories: string[], tags: string[]): AppEntry {
  return { id, name: id, url: '', image: '', description: { ro: '', en: '' }, categories, tags };
}

const apps = [
  app('snake', ['arcade'], ['offline', 'classic']),
  app('p2048', ['puzzle'], ['brain']),
  app('calc', ['tools'], ['quick']),
];

describe('expandCategories', () => {
  it('includes the descendants of a parent category', () => {
    const set = expandCategories(['games'], tree);
    expect(set).toEqual(new Set(['games', 'arcade', 'puzzle']));
  });
});

describe('filterApps', () => {
  it('empty selection = all', () => {
    expect(filterApps(apps, tree, [], [], '')).toHaveLength(3);
  });

  it('the games parent includes arcade and puzzle', () => {
    const r = filterApps(apps, tree, ['games'], [], '').map((a) => a.id);
    expect(r.sort()).toEqual(['p2048', 'snake']);
  });

  it('tags = OR; categories AND tags', () => {
    const r = filterApps(apps, tree, ['games'], ['classic'], '').map((a) => a.id);
    expect(r).toEqual(['snake']);
  });

  it('search by name', () => {
    const r = filterApps(apps, tree, [], [], 'cal').map((a) => a.id);
    expect(r).toEqual(['calc']);
  });
});
