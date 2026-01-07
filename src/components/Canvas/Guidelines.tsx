import { Line } from 'react-konva';
import type { SnapGuide } from '../../hooks/useSnapping';

interface GuidelinesProps {
  guides: SnapGuide[];
  scale: number;
  offsetX: number;
  offsetY: number;
  wallWidth: number;
  wallHeight: number;
}

export function Guidelines({
  guides,
  scale,
  offsetX,
  offsetY,
  wallWidth,
  wallHeight,
}: GuidelinesProps) {
  if (guides.length === 0) return null;

  return (
    <>
      {guides.map((guide, index) => {
        if (guide.type === 'vertical') {
          const x = offsetX + guide.position * scale;
          return (
            <Line
              key={`guide-${index}`}
              points={[x, offsetY, x, offsetY + wallHeight]}
              stroke="#ef4444"
              strokeWidth={1}
              dash={[6, 4]}
              opacity={0.8}
              listening={false}
            />
          );
        } else {
          const y = offsetY + guide.position * scale;
          return (
            <Line
              key={`guide-${index}`}
              points={[offsetX, y, offsetX + wallWidth, y]}
              stroke="#ef4444"
              strokeWidth={1}
              dash={[6, 4]}
              opacity={0.8}
              listening={false}
            />
          );
        }
      })}
    </>
  );
}
