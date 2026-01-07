import { Rect, Group, Text } from 'react-konva';
import type { WallObject as WallObjectType } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { constrainToWall } from '../../utils/coordinates';
import { useSnapping, type SnapGuide } from '../../hooks/useSnapping';
import { NailMarker } from './NailMarker';
import type { KonvaEventObject } from 'konva/lib/Node';

interface WallObjectProps {
  object: WallObjectType;
  scale: number;
  offsetX: number;
  offsetY: number;
  onDrag?: (guides: SnapGuide[]) => void;
  onDragEnd?: () => void;
}

export function WallObject({ object, scale, offsetX, offsetY, onDrag, onDragEnd }: WallObjectProps) {
  const wall = useAppStore((state) => state.wall);
  const objects = useAppStore((state) => state.objects);
  const selectedObjectId = useAppStore((state) => state.selectedObjectId);
  const selectObject = useAppStore((state) => state.selectObject);
  const updateObject = useAppStore((state) => state.updateObject);

  const { calculateSnap } = useSnapping(wall, objects, object.id);

  const isSelected = selectedObjectId === object.id;

  // Convert real coordinates to canvas coordinates
  const x = offsetX + object.x * scale;
  const y = offsetY + object.y * scale;
  const width = object.width * scale;
  const height = object.height * scale;

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const node = e.target;
    // Convert canvas position back to real coordinates
    const newX = (node.x() - offsetX) / scale;
    const newY = (node.y() - offsetY) / scale;

    // Calculate snap position
    const snapResult = calculateSnap(newX, newY, object.width, object.height);

    // Apply snap position visually
    node.position({
      x: offsetX + snapResult.x * scale,
      y: offsetY + snapResult.y * scale,
    });

    // Notify parent of guides
    onDrag?.(snapResult.guides);
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const node = e.target;
    // Convert canvas position back to real coordinates
    const newX = (node.x() - offsetX) / scale;
    const newY = (node.y() - offsetY) / scale;

    // Calculate snap position
    const snapResult = calculateSnap(newX, newY, object.width, object.height);

    // Constrain to wall bounds (snap first, then constrain)
    const constrained = constrainToWall(snapResult.x, snapResult.y, object.width, object.height, wall);

    updateObject(object.id, {
      x: constrained.x,
      y: constrained.y,
    });

    // Snap the visual position to the constrained position
    node.position({
      x: offsetX + constrained.x * scale,
      y: offsetY + constrained.y * scale,
    });

    // Clear guides
    onDragEnd?.();
  };

  const handleClick = () => {
    selectObject(object.id);
  };

  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onTap={handleClick}
    >
      {/* Object rectangle */}
      <Rect
        width={width}
        height={height}
        fill={isSelected ? '#dbeafe' : '#f3f4f6'}
        stroke={isSelected ? '#2563eb' : '#9ca3af'}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={4}
        shadowColor="black"
        shadowBlur={isSelected ? 8 : 4}
        shadowOpacity={0.15}
        shadowOffset={{ x: 1, y: 1 }}
      />

      {/* Object name label */}
      <Text
        text={object.name}
        fontSize={Math.max(10, Math.min(14, width / 6))}
        fill="#374151"
        width={width}
        height={height}
        align="center"
        verticalAlign="middle"
        listening={false}
      />

      {/* Selection indicator */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <Rect x={-4} y={-4} width={8} height={8} fill="#2563eb" cornerRadius={2} />
          <Rect x={width - 4} y={-4} width={8} height={8} fill="#2563eb" cornerRadius={2} />
          <Rect x={-4} y={height - 4} width={8} height={8} fill="#2563eb" cornerRadius={2} />
          <Rect x={width - 4} y={height - 4} width={8} height={8} fill="#2563eb" cornerRadius={2} />
        </>
      )}

      {/* Nails - rendered outside the draggable group for independent movement */}
      {object.nails.map((nail) => (
        <NailMarker
          key={nail.id}
          nail={nail}
          object={object}
          scale={scale}
          objectCanvasX={0} // Relative to group position
          objectCanvasY={0}
        />
      ))}
    </Group>
  );
}
