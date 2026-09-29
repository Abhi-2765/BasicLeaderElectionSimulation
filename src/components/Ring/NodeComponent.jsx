import React, { useRef, useState } from 'react';

export function NodeComponent({
  index, totalNodes, nodeState, inputValue, coord, hasError, isLeader, isFollower,
  onUpdateId, onSwap, onRemove, disabled,
}) {
  const { x, y, angle } = coord;
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const labelX = 47 * Math.cos(angle);
  const labelY = 47 * Math.sin(angle) + 4;

  let ringClass = 'ring-1 ring-stone-300 dark:ring-slate-600';
  let nodeClass = 'bg-[var(--color-surface)] dark:bg-slate-800';
  if (hasError) ringClass = 'ring-2 ring-amber-500';
  else if (isLeader) {
    ringClass = 'ring-2 ring-emerald-700 dark:ring-emerald-400';
    nodeClass = 'bg-emerald-50 dark:bg-emerald-950/30';
  } else if (isFollower) ringClass = 'ring-2 ring-rose-400/70';

  return (
    <g transform={`translate(${x}, ${y})`} className="group">
      <text x={labelX} y={labelY} textAnchor="middle" className="pointer-events-none select-none fill-stone-500 font-mono text-[10px] font-semibold dark:fill-stone-400">Node-{index}</text>

      {isLeader && (
        <g transform="translate(0, -42)" className="pointer-events-none">
          <rect x={-23} y={-8} width={46} height={16} rx={8} fill="var(--color-leader)" />
          <text y={3.5} textAnchor="middle" fontSize="8" fontWeight="700" fill="#fffdfa" letterSpacing="0.7">LEADER</text>
        </g>
      )}

      {isFollower && !isLeader && <circle cx={18} cy={-18} r={4} fill="var(--color-follower)" className="pointer-events-none" />}

      <foreignObject x={-32} y={-32} width={64} height={64} className="overflow-visible">
        <div
          draggable={!disabled}
          onDragStart={(event) => {
            if (disabled) return;
            event.dataTransfer.setData('text/plain', String(index));
            event.dataTransfer.effectAllowed = 'move';
          }}
          onDragOver={(event) => {
            if (disabled) return;
            event.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(event) => {
            if (disabled) return;
            event.preventDefault();
            setIsDragOver(false);
            const sourceIndex = Number.parseInt(event.dataTransfer.getData('text/plain'), 10);
            if (!Number.isNaN(sourceIndex) && sourceIndex !== index) onSwap(sourceIndex, index);
          }}
          className={`mx-auto flex h-[56px] w-[56px] items-center justify-center rounded-full transition-all duration-200 ${disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'} ${nodeClass} ${ringClass} ${isDragOver ? 'scale-110 ring-2 ring-slate-500' : ''}`}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={inputValue ?? nodeState.id}
            disabled={disabled}
            onChange={(event) => onUpdateId(index, event.target.value)}
            onFocus={(event) => event.target.select()}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' && event.shiftKey) { event.preventDefault(); onSwap(index, (index + 1) % totalNodes); }
              if (event.key === 'ArrowLeft' && event.shiftKey) { event.preventDefault(); onSwap(index, (index - 1 + totalNodes) % totalNodes); }
              if (event.key === 'Enter') inputRef.current?.blur();
            }}
            className="w-10 rounded bg-transparent text-center font-mono text-base font-bold tabular-nums text-[var(--color-text)] selection:bg-stone-300 focus:outline-none"
            aria-label={`Node P${index} ID`}
          />
        </div>
      </foreignObject>

      {totalNodes > 2 && !disabled && (
        <foreignObject x={14} y={19} width={40} height={18} className="overflow-visible">
          <button type="button" onClick={(event) => { event.stopPropagation(); onRemove(index); }} className="h-4 rounded border border-rose-300 bg-[var(--color-surface)] px-1 text-[8px] font-medium leading-none text-rose-700 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 dark:border-rose-900 dark:text-rose-300" aria-label={`Remove node P${index}`}>
            remove
          </button>
        </foreignObject>
      )}
    </g>
  );
}
