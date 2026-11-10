import assert from 'node:assert/strict';
import { test } from 'node:test';

import { sortMenuItems } from './menu-items';

// Run with: bun test
const item = (name: string, ...prices: number[]) => ({ name, sizes: prices.map((price) => ({ price })) });
const names = (items: Array<{ name: string }>) => items.map((entry) => entry.name);

const menu = [item('Zaatar', 100), item('cheese', 300, 50), item('Unpriced'), item('Akkawi', 100)];

test('sorts by name, ignoring case', () => {
  assert.deepEqual(names(sortMenuItems(menu, 'name', 'en')), ['Akkawi', 'cheese', 'Unpriced', 'Zaatar']);
});

test('sorts by cheapest size, ties by name, unpriced items last in both directions', () => {
  assert.deepEqual(names(sortMenuItems(menu, 'priceAsc', 'en')), ['cheese', 'Akkawi', 'Zaatar', 'Unpriced']);
  assert.deepEqual(names(sortMenuItems(menu, 'priceDesc', 'en')), ['Akkawi', 'Zaatar', 'cheese', 'Unpriced']);
});

test('sorts Arabic names in Arabic order and leaves the input untouched', () => {
  const arabic = [item('مناقيش'), item('بيتزا'), item('جبنة')];
  assert.deepEqual(names(sortMenuItems(arabic, 'name', 'ar')), ['بيتزا', 'جبنة', 'مناقيش']);
  assert.equal(arabic[0].name, 'مناقيش');
});
