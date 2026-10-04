import React, { useRef, useState } from 'react';

export function NodeComponent({
  index, totalNodes, nodeState, inputValue, coord, hasError, isLeader, isFollower,
  onUpdateId, onSwap, onRemove, disabled, isStarted,
}) {
  const { x, y, angle } = coord;
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const labelX = 54 * Math.cos(angle);
  const labelY = 54 * Math.sin(angle) + 4;

  let ringClass = 'ring-1 ring-stone-300';
  let nodeClass = 'bg-[var(--color-surface)]';
  if (hasError) ringClass = 'ring-2 ring-amber-500';
  else if (isLeader) {
    ringClass = 'ring-2 ring-emerald-700';
    nodeClass = 'bg-emerald-50';
  } else if (isFollower) ringClass = 'ring-2 ring-rose-400/70';

  return (
    <g transform={`translate(${x}, ${y})`} className="group">
      <text x={labelX} y={labelY} textAnchor="middle" className="pointer-events-none select-none fill-slate-800 font-sans text-[12px] font-bold tracking-tight">Node {index}</text>

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

      {totalNodes > 2 && !disabled && !isStarted && (
        <foreignObject x={10} y={-30} width={20} height={20} className="overflow-visible">
          <button
            type="button"
            onClick={(event) => { event.stopPropagation(); onRemove(index); }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm opacity-100 transition-all hover:bg-rose-600 hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label={`Remove node P${index}`}
          >
            <span className="mb-[1px] text-[14px] font-bold leading-none">&times;</span>
          </button>
        </foreignObject>
      )}
    </g>
  );
}
