/**
 * Ring Topology Presets
 * Generates initial ID configurations and bounds for educational comparison.
 */

export const PRESETS = [
  {
    id: 'tutorial',
    name: 'Tutorial Example',
    ids: [5, 12, 3, 9, 7],
    description: 'A classic 5-node arrangement showing clean drop, forward, and victory steps.',
  },
  {
    id: 'best',
    name: 'Best Case (O(n) msgs)',
    generate: (n = 5, mode = 'min') => {
      // In min mode: decreasing order [n, n-1, ..., 1] causes all non-minimal IDs
      // to be dropped in round 1. Total msgs = 2n - 1.
      // In max mode: increasing order [1, 2, ..., n] achieves the same.
      if (mode === 'min') {
        return Array.from({ length: n }, (_, i) => (n - i) * 2 + 1);
      }
      return Array.from({ length: n }, (_, i) => (i + 1) * 2);
    },
    description: (mode = 'min') =>
      mode === 'min'
        ? 'IDs ordered decreasingly clockwise: every node drops its neighbor’s message in round 1 except the minimum ID, achieving minimal 2n − 1 messages.'
        : 'IDs ordered increasingly clockwise: every node drops in round 1 except the maximum ID, achieving minimal 2n − 1 messages.',
  },
  {
    id: 'worst',
    name: 'Worst Case (O(n²) msgs)',
    generate: (n = 5, mode = 'min') => {
      // In min mode: increasing order [1, 2, ..., n] maximizes message survivals: n(n+1)/2.
      // In max mode: decreasing order [n, n-1, ..., 1] maximizes message survivals.
      if (mode === 'min') {
        return Array.from({ length: n }, (_, i) => (i + 1) * 3);
      }
      return Array.from({ length: n }, (_, i) => (n - i) * 3);
    },
    description: (mode = 'min') =>
      mode === 'min'
        ? 'IDs ordered increasingly clockwise: messages travel the farthest distances before being stopped, reaching worst-case n(n+1)/2 messages.'
        : 'IDs ordered decreasingly clockwise: messages travel the farthest distances before being dropped, reaching worst-case n(n+1)/2 messages.',
  },
  {
    id: 'random',
    name: 'Random Ring',
    generate: (n = 6) => {
      const pool = new Set();
      while (pool.size < n) {
        const val = Math.floor(Math.random() * 80) + 1;
        pool.add(val);
      }
      return Array.from(pool);
    },
    description: 'Random permutation of unique node IDs. Typical complexity is O(n log n).',
  },
];

/**
 * Calculates theoretical bounds for a ring of size n.
 * @param {number} n
 * @returns {{ best: number, worst: number, expected: number }}
 */
export function calculateTheoreticalBounds(n) {
  if (n <= 1) return { best: 1, worst: 1, expected: 1 };

  const best = 2 * n - 1;
  const worst = Math.floor((n * (n + 1)) / 2);

  // Harmonic number H_n approximation: ln(n) + gamma + 1/(2n)
  let harmonic = 0;
  for (let i = 1; i <= n; i++) {
    harmonic += 1 / i;
  }
  const expected = Math.round(n * harmonic);

  return { best, worst, expected };
}
