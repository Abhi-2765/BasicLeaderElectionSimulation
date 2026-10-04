import React, { useEffect, useState } from 'react';

export function PacketChip({
  event,
  fromCoord,
  toCoord,
  travelDurationMs,
  isDropped,
  isLeader,
  isForwarded,
}) {
  const [progress, setProgress] = useState(0);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    let start = null;
    let animId;

    const tick = (timestamp) => {
      if (!start) start = timestamp;
      const t = Math.min(1, (timestamp - start) / travelDurationMs);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setProgress(eased);

      if (t >= 1) {
        setArrived(true);
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [travelDurationMs]);

  const { x: x1, y: y1 } = fromCoord;
  const { x: x2, y: y2 } = toCoord;

  const nodeRadius = 30;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / len;
  const ny = dy / len;

  const startX = x1 + nx * nodeRadius;
  const startY = y1 + ny * nodeRadius;
  const endX = x2 - nx * nodeRadius;
  const endY = y2 - ny * nodeRadius;

  const currentX = startX + (endX - startX) * progress;
  const currentY = startY + (endY - startY) * progress;

  let bgColor = 'var(--color-undecided)';
  let scale = 1;
  let opacity = 1;

  if (arrived) {
    if (isDropped) {
      bgColor = 'var(--color-follower)';
      scale = 0.8;
      opacity = 0.5;
    } else if (isLeader) {
      bgColor = 'var(--color-leader)';
      scale = 1.1;
    } else if (isForwarded) {
      opacity = 0.7;
    }
  }

  return (
    <g transform={`translate(${currentX}, ${currentY}) scale(${scale})`} style={{ opacity }} className="pointer-events-none">
      <rect
        x={-19}
        y={-12}
        width={38}
        height={24}
        rx={12}
        ry={12}
        fill={bgColor}
        stroke="#FFFFFF"
        strokeWidth={1.5}
        className="transition-colors duration-200"
      />
      <text
        x={0}
        y={4}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={13}
        fontWeight="700"
        fontFamily="ui-monospace, monospace"
      >
        {event.value}
      </text>
    </g>
  );
}

export function StaticNodePacket({ coord, value }) {
  const { x, y } = coord;
  const px = x + 35;
  const py = y - 10;

  return (
    <g transform={`translate(${px}, ${py})`} className="pointer-events-none">
      <rect
        x={-17}
        y={-11}
        width={34}
        height={22}
        rx={11}
        ry={11}
        fill="var(--color-undecided)"
        stroke="#FFFFFF"
        strokeWidth={1.5}
      />
      <text
        x={0}
        y={3.5}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={12}
        fontWeight="700"
        fontFamily="ui-monospace, monospace"
      >
        {value}
      </text>
    </g>
  );
}
