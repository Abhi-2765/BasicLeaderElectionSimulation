export function DirectedEdge({ fromCoord, toCoord }) {
  const { x: x1, y: y1 } = fromCoord;
  const { x: x2, y: y2 } = toCoord;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / len;
  const ny = dy / len;

  const nodeRadius = 30;
  const startX = x1 + nx * nodeRadius;
  const startY = y1 + ny * nodeRadius;
  const endX = x2 - nx * nodeRadius;
  const endY = y2 - ny * nodeRadius;

  return (
    <g className="directed-edge">
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="var(--color-border-strong)"
        strokeWidth={1.75}
        strokeDasharray="4 3"
        markerEnd="url(#arrow-normal)"
      />
    </g>
  );
}
