import React from 'react';
import { Code2 } from 'lucide-react';

export function PseudocodeView({ mode, latestEvents }) {
  const isMin = mode === 'min';

  // Determine active branch from latest events
  const hasLeader = latestEvents.some((e) => e.fate === 'leader');
  const hasForward = latestEvents.some((e) => e.fate === 'forward');
  const hasDrop = latestEvents.some((e) => e.fate === 'drop');

  return (
    <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 shadow-card flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold text-xs text-theme-text uppercase tracking-wider">
            Algorithm Pseudocode (LCR)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-theme-muted uppercase">
          {isMin ? 'Min-ID Variant' : 'Max-ID Variant'}
        </span>
      </div>

      <pre className="font-mono text-xs bg-theme-surface-subtle p-3 rounded-xl border border-theme-border overflow-x-auto leading-relaxed text-theme-text select-text">
        <div className="text-theme-muted">// Round 0:</div>
        <div>  send := own_id;</div>
        <div>  status := unknown;</div>
        <div className="mt-2 text-theme-muted">// Each synchronous round, on receiving v:</div>
        <div>  if (v == null) then: pass;</div>

        <div
          className={`px-1.5 py-0.5 rounded transition-colors ${
            hasLeader ? 'bg-green-100 dark:bg-green-950 font-bold text-green-700 dark:text-green-300' : ''
          }`}
        >
          {`  else if (v == own_id) then:`}
          <div className="pl-4">{`status := LEADER;  // Own ID returned`}</div>
        </div>

        <div
          className={`px-1.5 py-0.5 rounded transition-colors ${
            hasForward ? 'bg-blue-100 dark:bg-blue-950 font-bold text-blue-700 dark:text-blue-300' : ''
          }`}
        >
          {`  else if (${isMin ? 'v < own_id' : 'v > own_id'}) then:`}
          <div className="pl-4">{`status := FOLLOWER;`}</div>
          <div className="pl-4">{`send := v;          // Forward candidate`}</div>
        </div>

        <div
          className={`px-1.5 py-0.5 rounded transition-colors ${
            hasDrop ? 'bg-red-100 dark:bg-red-950 font-bold text-red-700 dark:text-red-300' : ''
          }`}
        >
          {`  else:`}
          <div className="pl-4">{`send := null;       // Drop worse candidate`}</div>
        </div>
      </pre>
    </div>
  );
}
