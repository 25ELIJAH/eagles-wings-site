import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tornPath } from '../src/lib/torn.ts';

const ys = (d: string) => [...d.matchAll(/L(\d+),([\d.]+)/g)].map((m) => Number(m[2])).slice(0, -2);

test('the torn edge is deterministic', () => {
  assert.equal(tornPath(7, 74, 26, 11), tornPath(7, 74, 26, 11));
  assert.notEqual(tornPath(7, 74, 26, 11), tornPath(31, 74, 26, 11));
});

test('the torn edge is a closed shape that spans the full width', () => {
  const d = tornPath(31, 96, 24, 9);
  assert.match(d, /^M0,200 L0,/);
  assert.match(d, /L1440,[\d.]+ L1440,200 Z$/);
});

test('the torn edge stays inside the drawing area and is genuinely irregular', () => {
  const heights = ys(tornPath(7, 74, 26, 11));
  assert.ok(heights.every((y) => y >= 4 && y <= 200));
  const steps = heights.slice(1).map((y, i) => Math.abs(y - heights[i]));
  const distinct = new Set(steps.map((s) => Math.round(s))).size;
  assert.ok(distinct > 10, 'step sizes should vary, not form a regular zigzag');
});
