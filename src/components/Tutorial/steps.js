/**
 * Interactive Guided Tour Steps Definition
 * Pure data structure for easy customization and localization.
 */

export const TOUR_STEPS = [
  {
    targetId: 'ring-container',
    title: 'Welcome to Ring Leader Election',
    content:
      'In a distributed system, a ring of computers must agree on one leader without knowing each other’s IDs or the size of the ring. Let’s explore how the LCR algorithm achieves this in lockstep synchronous rounds.',
    placement: 'center',
  },
  {
    targetId: 'ring-canvas-area',
    title: 'The Ring Topology',
    content:
      'Each circle is an autonomous computer (node). Packets travel strictly clockwise along the directed circular edges from node P_i to P_{i+1}.',
    placement: 'bottom',
  },
  {
    targetId: 'node-edit-section',
    title: 'Editable Node IDs',
    content:
      'Click directly inside any node to edit its ID. All IDs must be integers and strictly unique. An amber border warns you if an ID is empty or duplicated.',
    placement: 'bottom',
  },
  {
    targetId: 'node-swap-section',
    title: 'Drag & Drop Node Swapping',
    content:
      'You can drag any node onto another to swap their positions on the ring! You can also select a node and press Shift+Arrow to swap via keyboard.',
    placement: 'bottom',
  },
  {
    targetId: 'mode-toggle-section',
    title: 'Election Criterion (Min vs Max)',
    content:
      'By default, the simulator elects the lowest (minimum) ID value as leader per your instructions. You can toggle to the classic highest-ID variant anytime to compare.',
    placement: 'bottom',
  },
  {
    targetId: 'playback-controls-area',
    title: 'Synchronous Playback Controls',
    content:
      'Click "Next Round" to advance one round, or "Auto-Play" to run continuously. You can also "Step Back" using the undo history or adjust simulation speed.',
    placement: 'top',
  },
  {
    targetId: 'explain-panel-area',
    title: 'Live Educational Narration',
    content:
      'Whenever a packet is dropped, forwarded, or elects a leader, this panel explains the exact reasoning in plain language with mathematical comparisons.',
    placement: 'left',
  },
  {
    targetId: 'complexity-panel-area',
    title: 'Message Complexity Bounds',
    content:
      'Watch live message counters compared against theoretical bounds: 2n − 1 in the best case and n(n+1)/2 in the worst case.',
    placement: 'left',
  },
  {
    targetId: 'round-log-table',
    title: 'Round Execution Log',
    content:
      'Every synchronous step is recorded in this matrix table. You can inspect cell fates, follow message paths, and export the entire run as a CSV file.',
    placement: 'top',
  },
  {
    targetId: 'header-actions',
    title: 'Ready to Experiment!',
    content:
      'Try the Best/Worst case presets, test your intuition with "Predict Mode", or challenge yourself with the Mini-Quiz. Have fun exploring!',
    placement: 'center',
  },
];
