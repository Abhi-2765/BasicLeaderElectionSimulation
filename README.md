# Ring Leader Election Simulator (LCR)

An interactive, educational React web application built with **Tailwind CSS and pure JavaScript / JSX** simulating leader election in a unidirectional ring topology using the **LCR (Le Lann–Chang–Roberts)** algorithm with synchronous rounds.

## Key Feature: Minimum ID Leader Election

Per user requirements, **the node with the lowest (minimum) ID value is elected as leader**.
- **Round 0**: Every node sends its own ID to its clockwise neighbor.
- **Each Synchronous Round**: All nodes receive the message sent by their counter-clockwise predecessor:
  - If received ID $v < u$ (node's own ID): $v$ is a smaller (better) candidate. Node $u$ becomes a **follower** (not elected) and **forwards** $v$ to its clockwise neighbor in the next round.
  - If received ID $v > u$: $v$ is larger than $u$. Since the lowest ID wins, $v$ cannot be the leader, so node $u$ **drops** $v$ (sends nothing).
  - If received ID $v = u$: Node $u$'s own ID completed a full traversal around the entire ring without encountering any smaller ID. Node $u$ is declared the **Leader**!
- An election criteria toggle in the header (**"Lowest ID Wins"** vs **"Highest ID Wins"**) enables students to compare both variants.

---

## Architecture Overview

All source files are organized inside the `src/` directory for simplified navigation:

```text
src/
├── main.jsx                     # Application entry point
├── App.jsx                      # 3-column layout & state orchestration
├── index.css                    # Tailwind setup & animation keyframes
├── tokens.css                   # Design tokens (CSS variables for light/dark)
├── engine/                      # Pure JavaScript (Zero React dependencies)
│   ├── lcr.js                   # init(), step(), validateIds(), isBetterCandidate()
│   ├── explain.js               # Event narration templates & glossary data
│   ├── presets.js               # Best/Worst/Random presets & theoretical bounds
│   └── lcr.test.js              # Vitest test suite (8 passing unit tests)
├── state/
│   └── useSimStore.js           # Simulation store with full undo/rewind history stack
├── components/
│   ├── Header.jsx               # App title, mode switch, tour/quiz triggers, theme toggle
│   ├── Ring/
│   │   ├── RingCanvas.jsx       # Responsive SVG ring canvas (viewBox 0 0 600 600)
│   │   ├── NodeComponent.jsx    # SVG node, in-place editable input, drag-drop/keyboard swap
│   │   ├── DirectedEdge.jsx     # Clockwise curved arrows with markers
│   │   ├── PacketChip.jsx       # Sliding/dropping animated packet pills
│   │   └── InlineTooltip.jsx    # Node-anchored floating comparison badges
│   ├── Controls/
│   │   ├── PlaybackControls.jsx # Next, Auto-play, Pause, Step back, Speed, Add node
│   │   ├── PresetSelector.jsx   # Best/Worst/Random presets with bound explanations
│   │   └── PredictModal.jsx     # Active-recall prediction challenge before round step
│   ├── Log/
│   │   └── RoundTable.jsx       # Sticky header matrix table with CSV export
│   ├── Explain/
│   │   ├── ExplainPanel.jsx     # Live event narration with ARIA live regions
│   │   └── PseudocodeView.jsx   # Side-by-side pseudocode with active branch highlights
│   ├── Learn/
│   │   ├── ComplexityPanel.jsx  # Live metrics, 2n-1 & n(n+1)/2 bounds, messages/round chart
│   │   ├── GlossaryDrawer.jsx   # Distributed systems concept cards
│   │   └── MiniQuiz.jsx         # 4-question interactive knowledge check
│   └── Tutorial/
│       ├── TourProvider.jsx     # Spotlight guided tour with focus trap & keyboard support
│       └── steps.js             # Data-driven tour steps
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

### Production Build
```bash
npm run build
```

---

## How to Add a New Algorithm Engine

To add another distributed algorithm (e.g. **Hirschberg–Sinclair** bidirectional election):

1. Create `src/engine/hs.js` with the same engine interface:
   ```javascript
   export function initHS(ids) { ... }
   export function stepHS(state) {
     return { next: nextState, events: packetEvents };
   }
   ```
2. In `src/state/useSimStore.js`, import the new engine and add an `algorithm` state switcher (`'lcr'` | `'hs'`).
3. Point `stepForward()` to the selected algorithm's `step` function.
4. Add pseudocode branches in `src/components/Explain/PseudocodeView.jsx`.

---

## How to Edit or Add Guided Tour Steps

All tour steps are data-driven in `src/components/Tutorial/steps.js`:
```javascript
export const TOUR_STEPS = [
  {
    targetId: 'ring-container',
    title: 'My Custom Step Title',
    content: 'Explanation text displayed to the learner.',
    placement: 'bottom', // 'top' | 'bottom' | 'left' | 'right' | 'center'
  },
  // Add new steps here...
];
```

---

## How to Add Translations / Localization

1. Create a dictionary file (e.g. `src/i18n/strings.js`):
   ```javascript
   export const STRINGS = {
     en: {
       lowestWins: 'Lowest ID Wins',
       highestWins: 'Highest ID Wins',
       nextRound: 'Next Round',
       ...
     },
     es: { ... },
     fr: { ... }
   };
   ```
2. Reference strings using a localization hook or helper function across the UI components.

---

## Features Implemented vs. Specification

### Priority 1: High Value (All Implemented)
- **Presets**: Best case ($2n-1$ messages), Worst case ($n(n+1)/2$ messages), Random ring, Tutorial example ($[5, 12, 3, 9, 7]$).
- **Live Complexity Panel**: Live messages sent, rounds count, theoretical bounds comparison bar, and messages-per-round bar chart.
- **Predict, Then Reveal Mode**: Active-recall modal asking learners to predict packet drops before each round.
- **Step Back / Rewind**: Full `SimState` history stack allowing users to undo steps or step backward one round at a time.
- **Mini Quiz**: 4-question interactive knowledge check with immediate explanations and score summary.

### Priority 2: Medium Value
- **Algorithm Code View**: Side-by-side pseudocode with active branch highlighting during execution.
- **Shareable State & CSV Export**: URL parameter sharing (`?ids=...&mode=...`) and CSV round log export.
- **In-Place Node ID Editing & Drag-and-Drop / Keyboard Swapping**: Real `<input>` inside nodes with duplicate/format validation, drag & drop, and Shift+Arrow keyboard swap.
- **Accessibility (WCAG 2.2 AA)**: Non-color status indicators (Crown for leader, Cross badge for followers, Warning for invalid), screen reader ARIA live region announcements, keyboard navigable controls.
