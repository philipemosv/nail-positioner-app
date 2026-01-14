import { Circle, Group, Line } from 'react-konva';
import type { Nail } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { nailClickFlag } from './nailClickFlag';

interface NailMarkerProps {
  nail: Nail;
  scale: number;
  objectCanvasX: number;
  objectCanvasY: number;
  objectId: string;
}

const NAIL_RADIUS = 6;
const NAIL_INNER_RADIUS = 2;

export function NailMarker({
  nail,
  scale,
  objectCanvasX,
  objectCanvasY,
  objectId,
}: NailMarkerProps) {
  const selectedNailId = useAppStore((state) => state.selectedNailId);
  const selectedObjectId = useAppStore((state) => state.selectedObjectId);

  const isSelected = selectedNailId === nail.id;

  const x = objectCanvasX + nail.offsetX * scale;
  const y = objectCanvasY + nail.offsetY * scale;

  const handleClick = () => {
    nailClickFlag.clicked = true;

    if (selectedObjectId !== objectId) {
      // Select both object and nail together (store's selectObject clears nail)
      useAppStore.setState({ selectedObjectId: objectId, selectedNailId: nail.id });
    } else {
      useAppStore.setState({ selectedNailId: nail.id });
    }
  };

  return (
    <Group
      x={x}
      y={y}
      onClick={handleClick}
      onTap={handleClick}
    >
      {/* Cross-hair lines */}
      <Line
        points={[-NAIL_RADIUS - 2, 0, NAIL_RADIUS + 2, 0]}
        stroke={isSelected ? '#dc2626' : '#374151'}
        strokeWidth={1}
      />
      <Line
        points={[0, -NAIL_RADIUS - 2, 0, NAIL_RADIUS + 2]}
        stroke={isSelected ? '#dc2626' : '#374151'}
        strokeWidth={1}
      />

      {/* Outer circle */}
      <Circle
        radius={NAIL_RADIUS}
        fill={isSelected ? '#fecaca' : '#f3f4f6'}
        stroke={isSelected ? '#dc2626' : '#6b7280'}
        strokeWidth={isSelected ? 2 : 1}
      />

      {/* Inner dot */}
      <Circle
        radius={NAIL_INNER_RADIUS}
        fill={isSelected ? '#dc2626' : '#374151'}
      />

      {/* Selection ring */}
      {isSelected && (
        <Circle
          radius={NAIL_RADIUS + 4}
          stroke="#dc2626"
          strokeWidth={2}
          dash={[4, 4]}
          listening={false}
        />
      )}
    </Group>
  );
}
