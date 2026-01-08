import { Line, Text, Group } from 'react-konva';
import { useAppStore, useSelectedObject } from '../../store/useAppStore';
import { fromCm } from '../../utils/units';

interface FrameDistanceLinesProps {
  scale: number;
  offsetX: number;
  offsetY: number;
  wallWidth: number;
  wallHeight: number;
  isDragging?: boolean;
}

export function FrameDistanceLines({
  scale,
  offsetX,
  offsetY,
  wallWidth,
  wallHeight,
  isDragging = false,
}: FrameDistanceLinesProps) {
  const wall = useAppStore((state) => state.wall);
  const unit = useAppStore((state) => state.unit);
  const selectedNailId = useAppStore((state) => state.selectedNailId);
  const selectedObject = useSelectedObject();

  // Only show frame distances when object is selected, no nail is selected, and not dragging
  if (!selectedObject || selectedNailId || isDragging) {
    return null;
  }

  // Calculate frame distances from wall edges
  const fromLeft = selectedObject.x;
  const fromRight = wall.width - (selectedObject.x + selectedObject.width);
  const fromTop = selectedObject.y;
  const fromBottom = wall.height - (selectedObject.y + selectedObject.height);

  // Calculate frame position on canvas
  const frameLeft = offsetX + selectedObject.x * scale;
  const frameRight = offsetX + (selectedObject.x + selectedObject.width) * scale;
  const frameTop = offsetY + selectedObject.y * scale;
  const frameBottom = offsetY + (selectedObject.y + selectedObject.height) * scale;
  const frameCenterX = (frameLeft + frameRight) / 2;
  const frameCenterY = (frameTop + frameBottom) / 2;

  // Format distance with unit
  const formatDistance = (cm: number) => {
    const value = fromCm(cm, unit);
    const suffix = unit === 'cm' ? 'cm' : '"';
    return `${value.toFixed(1)}${suffix}`;
  };

  const lineColor = '#3b82f6'; // Blue color for frame distance lines
  const textColor = '#2563eb';
  const fontSize = 12;
  const dashPattern = [6, 4];

  return (
    <Group>
      {/* Line to left wall */}
      {fromLeft > 0 && (
        <>
          <Line
            points={[offsetX, frameCenterY, frameLeft, frameCenterY]}
            stroke={lineColor}
            strokeWidth={1.5}
            dash={dashPattern}
          />
          <Text
            x={offsetX + (frameLeft - offsetX) / 2}
            y={frameCenterY - 20}
            text={formatDistance(fromLeft)}
            fontSize={fontSize}
            fill={textColor}
            fontStyle="bold"
            align="center"
            offsetX={20}
          />
        </>
      )}

      {/* Line to right wall */}
      {fromRight > 0 && (
        <>
          <Line
            points={[frameRight, frameCenterY, offsetX + wallWidth, frameCenterY]}
            stroke={lineColor}
            strokeWidth={1.5}
            dash={dashPattern}
          />
          <Text
            x={frameRight + (offsetX + wallWidth - frameRight) / 2}
            y={frameCenterY + 6}
            text={formatDistance(fromRight)}
            fontSize={fontSize}
            fill={textColor}
            fontStyle="bold"
            align="center"
            offsetX={20}
          />
        </>
      )}

      {/* Line to top wall */}
      {fromTop > 0 && (
        <>
          <Line
            points={[frameCenterX, offsetY, frameCenterX, frameTop]}
            stroke={lineColor}
            strokeWidth={1.5}
            dash={dashPattern}
          />
          <Text
            x={frameCenterX + 8}
            y={offsetY + (frameTop - offsetY) / 2 - 6}
            text={formatDistance(fromTop)}
            fontSize={fontSize}
            fill={textColor}
            fontStyle="bold"
          />
        </>
      )}

      {/* Line to bottom wall */}
      {fromBottom > 0 && (
        <>
          <Line
            points={[frameCenterX, frameBottom, frameCenterX, offsetY + wallHeight]}
            stroke={lineColor}
            strokeWidth={1.5}
            dash={dashPattern}
          />
          <Text
            x={frameCenterX - 40}
            y={frameBottom + (offsetY + wallHeight - frameBottom) / 2 - 6}
            text={formatDistance(fromBottom)}
            fontSize={fontSize}
            fill={textColor}
            fontStyle="bold"
          />
        </>
      )}
    </Group>
  );
}
