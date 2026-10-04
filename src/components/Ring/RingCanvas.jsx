import { useMemo } from 'react';
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
  const { nodes, round, direction } = simState;
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

  return (
    <svg
      viewBox="0 0 600 600"
      className="h-full w-auto max-w-full mx-auto overflow-visible select-none"
      aria-label="Ring topology visualization"
    >
      <defs>
        <marker id="arrow-normal" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" className="fill-zinc-300" />
        </marker>
      </defs>

      <g transform="translate(300, 296)">
        <text textAnchor="middle" className="fill-zinc-400 text-xs font-semibold tracking-wide uppercase">
          {mode === 'min' ? 'Lowest ID Wins' : 'Highest ID Wins'}
        </text>
        <text y="22" textAnchor="middle" className="fill-zinc-800 text-lg font-bold">
          Round {round}
        </text>
      </g>

      {nodeCoords.map((coord, i) => {
        const targetIndex = direction === 'cw' ? (i + 1) % n : (i - 1 + n) % n;
        return (
          <DirectedEdge
            key={`edge-${i}`}
            fromCoord={coord}
            toCoord={nodeCoords[targetIndex]}
          />
        );
      })}

      {round === 0 && !isAnimating && nodes.map((node, i) => (
        <StaticNodePacket key={`p-${i}`} coord={nodeCoords[i]} value={node.id} />
      ))}

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
            travelDurationMs={packetTravelDurationMs}
            isDropped={event.fate === 'drop'}
            isLeader={event.fate === 'leader'}
            isForwarded={event.fate === 'forward'}
          />
        );
      })}

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
          isStarted={round > 0}
        />
      ))}
    </svg>
  );
}
