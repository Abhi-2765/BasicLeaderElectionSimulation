import React, { useEffect, useState } from 'react';

/**
 * Animated packet chip that slides along the ring edge.
 * - Forward: smooth slide then fade
 * - Drop: arrives, flashes, wobbles, tumbles down with scatter particles
 * - Leader: arrives with a golden glow pulse
 */
export function PacketChip({
  event,
  fromCoord,
  toCoord,
  radius,
  travelDurationMs,
  resolutionDurationMs,
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

      // Smooth ease-in-out
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

  const { angle: a1 } = fromCoord;
  let a2 = toCoord.angle;
  if (a2 <= a1) a2 += 2 * Math.PI;

  const startAngle = a1 + 0.16;
  const endAngle = a2 - 0.16;
  const currentAngle = startAngle + (endAngle - startAngle) * progress;

  const cx = 300 + radius * Math.cos(currentAngle);
  const cy = 300 + radius * Math.sin(currentAngle);

  // Colors
  let bgColor = 'var(--color-undecided)';
  let animClass = '';

  if (arrived && isDropped) {
    bgColor = 'var(--color-follower)';
    animClass = 'animate-packet-drop';
  } else if (arrived && isLeader) {
    bgColor = 'var(--color-leader)';
    animClass = 'animate-leader-packet';
  } else if (arrived && isForwarded) {
    animClass = 'animate-packet-forward';
  }

  return (
    <g transform={`translate(${cx}, ${cy})`} className="pointer-events-none">

      {/* A tiny burst makes a discarded packet read as a deliberate decision. */}
      {arrived && isDropped && (
        <g className="packet-drop-burst" aria-hidden="true">
          <circle cx="-9" cy="-4" r="2" fill="var(--color-follower)" />
          <circle cx="8" cy="-7" r="1.7" fill="var(--color-follower)" />
          <circle cx="12" cy="3" r="1.3" fill="var(--color-warning)" />
          <path d="M -5 5 l -7 6" stroke="var(--color-follower)" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {/* The packet pill */}
      <g
        className={animClass}
        style={{ transformOrigin: '0 0', '--resolution-duration': `${resolutionDurationMs}ms` }}
      >
        {/* Shadow for depth */}
        <ellipse
          cx={0}
          cy={12}
          rx={15}
          ry={4.5}
          fill="rgba(0,0,0,0.08)"
        className={arrived && isDropped ? 'packet-drop-shadow' : 'opacity-100'}
        />

        {/* Pill background */}
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
        className="drop-shadow-md"
        />

        {/* ID text */}
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
    </g>
  );
}

/**
 * Static packet sitting near a node before the simulation starts.
 */
export function StaticNodePacket({ coord, radius, value }) {
  const a = coord.angle + 0.18;
  const px = 300 + radius * Math.cos(a);
  const py = 300 + radius * Math.sin(a);

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
        className="opacity-80 drop-shadow-sm"
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
