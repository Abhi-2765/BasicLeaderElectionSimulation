import React, { useMemo } from 'react';
import { NodeComponent } from './NodeComponent.jsx';
import { DirectedEdge } from './DirectedEdge.jsx';
import { PacketChip, StaticNodePacket } from './PacketChip.jsx';

export function RingCanvas({
  simState,
  validation,
  latestEvents,
  isAnimating,
  speed,
  mode,
  ids,
  onUpdateId,
  onSwap,
  onRemove,
  disabled,
}) {
  const { nodes, round, done, leaderId } = simState;
  const n = nodes.length;

  const radius = useMemo(() => {
    if (n <= 3) return 130;
    if (n <= 5) return 160;
    if (n <= 8) return 190;
    if (n <= 12) return 210;
    return 230;
  }, [n]);

  const nodeCoords = useMemo(() => {
    return nodes.map((_, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      return {
        x: 300 + radius * Math.cos(angle),
        y: 300 + radius * Math.sin(angle),
        angle,
      };
    });
  }, [nodes, n, radius]);

  const packetTravelDurationMs = Math.round(620 / speed);
  const packetResolutionDurationMs = Math.round(430 / speed);

  return (
    <svg
      viewBox="0 0 600 600"
      className="h-full w-auto max-w-full mx-auto overflow-visible select-none"
      aria-label="Ring topology visualization"
    >
      <defs>
        {/* Subtle dot pattern for the canvas background */}
        <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" className="fill-zinc-200 dark:fill-zinc-800" />
        </pattern>
        <marker id="arrow-normal" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" className="fill-zinc-300 dark:fill-zinc-700" />
        </marker>
        <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" className="fill-blue-500" />
        </marker>
      </defs>

      {/* Faint guide circle connecting the nodes */}
      <circle cx="300" cy="300" r={radius} fill="none" className="stroke-stone-300 dark:stroke-slate-600" strokeWidth="1.5" strokeDasharray="3 7" />

      {/* Center status label */}
      <g transform="translate(300, 296)">
        <text textAnchor="middle" className="fill-zinc-400 dark:fill-zinc-500 text-xs font-semibold tracking-wide uppercase">
          {mode === 'min' ? 'Lowest ID Wins' : 'Highest ID Wins'}
        </text>
        <text y="22" textAnchor="middle" className="fill-zinc-800 dark:fill-zinc-200 text-lg font-bold">
          Round {round}
        </text>
      </g>

      {/* Edges */}
      {nodeCoords.map((coord, i) => (
        <DirectedEdge
          key={`edge-${i}`}
          fromCoord={coord}
          toCoord={nodeCoords[(i + 1) % n]}
          radius={radius}
          isHighlighted={false}
        />
      ))}

      {/* Static packets at round 0 */}
      {round === 0 && !isAnimating && nodes.map((node, i) => (
        <StaticNodePacket key={`p-${i}`} coord={nodeCoords[i]} radius={radius} value={node.id} />
      ))}

      {/* Animated packets */}
      {isAnimating && latestEvents.map((event, idx) => {
        const from = nodeCoords[event.from];
        const to = nodeCoords[event.to];
        if (!from || !to) return null;
        return (
          <PacketChip
            key={`pkt-${round}-${idx}`}
            event={event}
            fromCoord={from}
            toCoord={to}
            radius={radius}
            travelDurationMs={packetTravelDurationMs}
            resolutionDurationMs={packetResolutionDurationMs}
            isDropped={event.fate === 'drop'}
            isLeader={event.fate === 'leader'}
            isForwarded={event.fate === 'forward'}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <NodeComponent
          key={`n-${i}`}
          index={i}
          totalNodes={n}
          nodeState={node}
          inputValue={ids[i]}
          coord={nodeCoords[i]}
          hasError={validation?.errors?.[i]}
          isLeader={node.status === 'leader'}
          isFollower={node.status === 'follower'}
          onUpdateId={onUpdateId}
          onSwap={onSwap}
          onRemove={onRemove}
          disabled={disabled}
        />
      ))}
    </svg>
  );
}
