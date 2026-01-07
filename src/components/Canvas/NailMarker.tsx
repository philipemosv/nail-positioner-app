import { Circle, Group, Line } from 'react-konva';
import type { Nail, WallObject } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { constrainNailPosition } from '../../utils/nailDistribution';
import type { KonvaEventObject } from 'konva/lib/Node';

interface NailMarkerProps {
  nail: Nail;
  object: WallObject;
  scale: number;
  objectCanvasX: number;
  objectCanvasY: number;
}

const NAIL_RADIUS = 6;
const NAIL_INNER_RADIUS = 2;

export function NailMarker({
  nail,
  object,
  scale,
  objectCanvasX,
  objectCanvasY,
}: NailMarkerProps) {
  const selectedNailId = useAppStore((state) => state.selectedNailId);
  const selectNail = useAppStore((state) => state.selectNail);
  const updateNail = useAppStore((state) => state.updateNail);

  const isSelected = selectedNailId === nail.id;

  // Position relative to canvas
  const x = objectCanvasX + nail.offsetX * scale;
  const y = objectCanvasY + nail.offsetY * scale;

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const node = e.target;

    // Convert canvas position back to nail offset within object
    const newOffsetX = (node.x() - objectCanvasX) / scale;
    const newOffsetY = (node.y() - objectCanvasY) / scale;

    // Constrain within object bounds
    const constrained = constrainNailPosition(
      newOffsetX,
      newOffsetY,
      object.width,
      object.height,
      NAIL_RADIUS / scale
    );

    updateNail(object.id, nail.id, {
      offsetX: constrained.offsetX,
      offsetY: constrained.offsetY,
    });

    // Snap visual position to constrained position
    node.position({
      x: objectCanvasX + constrained.offsetX * scale,
      y: objectCanvasY + constrained.offsetY * scale,
    });
  };

  const handleClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.cancelBubble = true; // Prevent object selection
    selectNail(nail.id);
  };

  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={handleDragEnd}
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
