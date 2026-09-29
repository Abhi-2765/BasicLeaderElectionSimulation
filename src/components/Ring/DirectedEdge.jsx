import React from 'react';

/**
 * Directed curved clockwise edge between two adjacent nodes on the ring.
 */
export function DirectedEdge({ fromCoord, toCoord, radius, isHighlighted }) {
  const { x: x1, y: y1, angle: a1 } = fromCoord;
  const { x: x2, y: y2, angle: a2 } = toCoord;

  // Node radius in SVG units is 26px, leave a small gap for arrow marker
  const nodeOffsetAngle = 0.16; // approx 9 degrees offset
  const startAngle = a1 + nodeOffsetAngle;
  const endAngle = a2 - nodeOffsetAngle;

  const startX = 300 + radius * Math.cos(startAngle);
  const startY = 300 + radius * Math.sin(startAngle);
  const endX = 300 + radius * Math.cos(endAngle);
  const endY = 300 + radius * Math.sin(endAngle);

  // SVG arc command for clockwise circle arc
  const pathD = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

  return (
    <g className="directed-edge transition-colors duration-200">
      <path
        d={pathD}
        fill="none"
        stroke={isHighlighted ? 'var(--color-undecided)' : 'var(--color-border-strong)'}
        strokeWidth={isHighlighted ? 2.5 : 1.75}
        strokeDasharray={isHighlighted ? 'none' : '4 3'}
        markerEnd={isHighlighted ? 'url(#arrow-active)' : 'url(#arrow-normal)'}
        className="transition-all duration-300"
      />
    </g>
  );
}
