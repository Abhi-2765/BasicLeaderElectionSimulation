import React from 'react';
import { calculateTheoreticalBounds } from '../../engine/presets.js';
import { BarChart3, Activity, Zap, CheckCircle } from 'lucide-react';

export function ComplexityPanel({ simState }) {
  const { nodes, stats, history, round, done } = simState;
  const n = nodes.length;

  const { best, worst, expected } = calculateTheoreticalBounds(n);

  // Compute total messages sent
  let totalMessagesSent = 0;
  const messagesPerRound = history.map((h) => {
    const count = h.round === 0 ? n : (h.events ? h.events.length : 0);
    totalMessagesSent += count;
    return { round: h.round, count };
  });

  // Calculate percentage within bounds range [best, worst]
  const clampedMsgs = Math.max(best, Math.min(worst, totalMessagesSent));
  const rangeSpan = Math.max(1, worst - best);
  const positionPct = Math.min(100, Math.max(0, ((clampedMsgs - best) / rangeSpan) * 100));

  // Max messages in any single round for bar chart scale
  const maxRoundMsgs = Math.max(1, ...messagesPerRound.map((m) => m.count));

  return (
    <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 shadow-card flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-theme-border pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold text-xs text-theme-text uppercase tracking-wider">
            Live Complexity & Bounds
          </h3>
        </div>
        <span className="text-[11px] font-mono text-theme-muted">
          n = {n} Nodes
        </span>
      </div>

      {/* Primary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 rounded-xl bg-theme-surface-subtle border border-theme-border flex flex-col">
          <span className="text-[10px] text-theme-muted uppercase tracking-wider font-semibold">
            Messages Sent
          </span>
          <span className="text-xl font-bold font-mono text-theme-text mt-0.5">
            {totalMessagesSent}
          </span>
          <span className="text-[10px] text-theme-muted mt-0.5">
            Cumul. traffic
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-theme-surface-subtle border border-theme-border flex flex-col">
          <span className="text-[10px] text-theme-muted uppercase tracking-wider font-semibold">
            Rounds
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold font-mono text-theme-text">
              {round}
            </span>
            <span className="text-xs text-theme-muted font-mono">/ {n}</span>
          </div>
          <span className="text-[10px] text-theme-muted mt-0.5">
            {done ? 'Election completed' : 'Synchronous steps'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-green-50/60 dark:bg-green-950/20 border border-green-200 dark:border-green-900 flex flex-col">
          <span className="text-[10px] text-green-700 dark:text-green-300 uppercase tracking-wider font-semibold">
            Best Case
          </span>
          <span className="text-xl font-bold font-mono text-green-700 dark:text-green-400 mt-0.5">
            {best}
          </span>
          <span className="text-[10px] text-green-600 dark:text-green-500 mt-0.5 font-mono">
            2n - 1 msgs
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900 flex flex-col">
          <span className="text-[10px] text-red-700 dark:text-red-300 uppercase tracking-wider font-semibold">
            Worst Case
          </span>
          <span className="text-xl font-bold font-mono text-red-700 dark:text-red-400 mt-0.5">
            {worst}
          </span>
          <span className="text-[10px] text-red-600 dark:text-red-500 mt-0.5 font-mono">
            n(n+1)/2 msgs
          </span>
        </div>
      </div>

      {/* Visual Complexity Gauge: Current vs Bounds */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex justify-between text-[11px] text-theme-muted font-mono">
          <span className="text-green-600 dark:text-green-400">Best ({best})</span>
          <span className="text-theme-muted">Avg ~{expected} (O(n log n))</span>
          <span className="text-red-600 dark:text-red-400">Worst ({worst})</span>
        </div>

        {/* Progress track */}
        <div className="relative w-full h-3 bg-theme-surface-subtle border border-theme-border rounded-full overflow-hidden">
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-green-500 via-blue-500 to-red-500 opacity-80 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(6, positionPct)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-theme-muted">
          <span>O(n)</span>
          <span>Current: {totalMessagesSent} msgs</span>
          <span>O(n²)</span>
        </div>
      </div>

      {/* Messages per Round Bar Chart */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-theme-muted">
          <span className="flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5" /> Messages Per Round
          </span>
        </div>
        <div className="flex items-end gap-1.5 h-16 bg-theme-surface-subtle p-2 rounded-xl border border-theme-border">
          {messagesPerRound.map((m) => {
            const barHeightPct = Math.round((m.count / maxRoundMsgs) * 100);
            return (
              <div
                key={`bar-${m.round}`}
                className="flex-1 flex flex-col items-center h-full justify-end group relative"
              >
                <div
                  className="w-full bg-blue-500 hover:bg-blue-600 rounded-t transition-all group-hover:brightness-110"
                  style={{ height: `${Math.max(12, barHeightPct)}%` }}
                />
                <span className="text-[9px] font-mono text-theme-muted mt-1 select-none">
                  R{m.round}
                </span>

                {/* Tooltip on hover */}
                <div className="absolute -top-7 hidden group-hover:block bg-theme-text text-theme-bg text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap z-20 font-mono shadow">
                  {m.count} msgs
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
