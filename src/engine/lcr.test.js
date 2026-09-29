import { describe, it, expect } from 'vitest';
import { init, step, validateIds } from './lcr.js';
import { PRESETS, calculateTheoreticalBounds } from './presets.js';

describe('LCR Engine Tests', () => {
  it('validates IDs correctly for uniqueness and integers', () => {
    // Valid set
    const valid = validateIds([10, 20, 30, 40]);
    expect(valid.valid).toBe(true);
    expect(Object.keys(valid.errors).length).toBe(0);

    // Duplicate IDs
    const dup = validateIds([10, 20, 10, 40]);
    expect(dup.valid).toBe(false);
    expect(dup.errors[0]).toBeDefined();
    expect(dup.errors[2]).toBeDefined();

    // Invalid non-integer
    const nonInt = validateIds([10, 'abc', 30]);
    expect(nonInt.valid).toBe(false);
    expect(nonInt.errors[1]).toBeDefined();

    // Out of bounds (> 20)
    const tooMany = validateIds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);
    expect(tooMany.valid).toBe(false);
  });

  it('elects minimum ID leader in min mode (User Specification)', () => {
    const ids = [5, 12, 3, 9, 7];
    let state = init(ids, 'min');
    expect(state.round).toBe(0);
    expect(state.done).toBe(false);

    let roundCount = 0;
    while (!state.done && roundCount < 20) {
      const result = step(state);
      state = result.next;
      roundCount++;
    }

    expect(state.done).toBe(true);
    // Minimum ID is 3
    expect(state.leaderId).toBe(3);
    expect(state.round).toBe(ids.length);
  });

  it('elects maximum ID leader when mode is max', () => {
    const ids = [5, 12, 3, 9, 7];
    let state = init(ids, 'max');

    let roundCount = 0;
    while (!state.done && roundCount < 20) {
      const result = step(state);
      state = result.next;
      roundCount++;
    }

    expect(state.done).toBe(true);
    // Maximum ID is 12
    expect(state.leaderId).toBe(12);
    expect(state.round).toBe(ids.length);
  });

  it('handles single node ring (n=1)', () => {
    const state = init([42], 'min');
    const { next } = step(state);

    expect(next.done).toBe(true);
    expect(next.leaderId).toBe(42);
    expect(next.round).toBe(1);
  });

  it('handles two node ring (n=2)', () => {
    const state0 = init([9, 4], 'min');
    const step1 = step(state0);
    expect(step1.next.done).toBe(false);

    const step2 = step(step1.next);
    expect(step2.next.done).toBe(true);
    expect(step2.next.leaderId).toBe(4);
    expect(step2.next.round).toBe(2);
  });

  it('achieves best-case message bound 2n - 1', () => {
    const n = 5;
    const bestPreset = PRESETS.find((p) => p.id === 'best');
    const ids = bestPreset.generate(n, 'min');

    let state = init(ids, 'min');
    let totalMessagesSent = 0;

    while (!state.done) {
      const { next, events } = step(state);
      totalMessagesSent += events.length;
      state = next;
    }

    const { best } = calculateTheoreticalBounds(n);
    expect(totalMessagesSent).toBe(best);
    expect(totalMessagesSent).toBe(2 * n - 1);
  });

  it('achieves worst-case message bound n(n+1)/2', () => {
    const n = 5;
    const worstPreset = PRESETS.find((p) => p.id === 'worst');
    const ids = worstPreset.generate(n, 'min');

    let state = init(ids, 'min');
    let totalMessagesSent = 0;

    while (!state.done) {
      const { next, events } = step(state);
      totalMessagesSent += events.length;
      state = next;
    }

    const { worst } = calculateTheoreticalBounds(n);
    expect(totalMessagesSent).toBe(worst);
    expect(totalMessagesSent).toBe((n * (n + 1)) / 2);
  });

  it('verifies that step() is pure and does not mutate previous state', () => {
    const state0 = init([7, 2, 5], 'min');
    const state0Json = JSON.stringify(state0);

    const { next } = step(state0);

    expect(JSON.stringify(state0)).toBe(state0Json);
    expect(next).not.toBe(state0);
    expect(next.nodes).not.toBe(state0.nodes);
  });
});
