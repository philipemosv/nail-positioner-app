import { Line, Text, Group } from 'react-konva';
import { useAppStore } from '../../store/useAppStore';
import { fromCm } from '../../utils/units';
import type { DragInfo } from './WallObject';

interface DragDistanceIndicatorsProps {
  dragInfo: DragInfo | null;
  scale: number;
  offsetX: number;
  offsetY: number;
  wallWidth: number;
  wallHeight: number;
  draggingObjectId: string | null;
}

interface FrameDistance {
  distance: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  direction: 'horizontal' | 'vertical';
}

export function DragDistanceIndicators({
  dragInfo,
  scale,
  offsetX,
  offsetY,
  wallWidth,
  wallHeight,
  draggingObjectId,
}: DragDistanceIndicatorsProps) {
  const wall = useAppStore((state) => state.wall);
  const unit = useAppStore((state) => state.unit);
  const objects = useAppStore((state) => state.objects);

  if (!dragInfo) {
    return null;
  }

  // Calculate distances from wall edges
  const fromLeft = dragInfo.x;
  const fromRight = wall.width - (dragInfo.x + dragInfo.width);
  const fromTop = dragInfo.y;
  const fromBottom = wall.height - (dragInfo.y + dragInfo.height);

  // Calculate frame position on canvas
  const frameLeft = offsetX + dragInfo.x * scale;
  const frameRight = offsetX + (dragInfo.x + dragInfo.width) * scale;
  const frameTop = offsetY + dragInfo.y * scale;
  const frameBottom = offsetY + (dragInfo.y + dragInfo.height) * scale;
  const frameCenterY = (frameTop + frameBottom) / 2;
  const frameCenterX = (frameLeft + frameRight) / 2;

  // Calculate distances to other frames
  const otherObjects = objects.filter((obj) => obj.id !== draggingObjectId);
  const frameDistances: FrameDistance[] = [];

  for (const other of otherObjects) {
    const otherLeft = other.x;
    const otherRight = other.x + other.width;
    const otherTop = other.y;
    const otherBottom = other.y + other.height;

    const otherCanvasLeft = offsetX + otherLeft * scale;
    const otherCanvasRight = offsetX + otherRight * scale;
    const otherCanvasTop = offsetY + otherTop * scale;
    const otherCanvasBottom = offsetY + otherBottom * scale;

    // Check horizontal gaps (dragged frame is to the left or right of other)
    // Dragged frame is to the left of other
    if (dragInfo.x + dragInfo.width <= otherLeft) {
      const gap = otherLeft - (dragInfo.x + dragInfo.width);
      const lineY = Math.max(frameTop, otherCanvasTop) +
                    Math.min(frameBottom - frameTop, otherCanvasBottom - otherCanvasTop) / 2;
      // Only show if there's vertical overlap
      if (frameBottom > otherCanvasTop && frameTop < otherCanvasBottom) {
        frameDistances.push({
          distance: gap,
          fromX: frameRight,
          fromY: lineY,
          toX: otherCanvasLeft,
          toY: lineY,
          direction: 'horizontal',
        });
      }
    }

    // Dragged frame is to the right of other
    if (dragInfo.x >= otherRight) {
      const gap = dragInfo.x - otherRight;
      const lineY = Math.max(frameTop, otherCanvasTop) +
                    Math.min(frameBottom - frameTop, otherCanvasBottom - otherCanvasTop) / 2;
      // Only show if there's vertical overlap
      if (frameBottom > otherCanvasTop && frameTop < otherCanvasBottom) {
        frameDistances.push({
          distance: gap,
          fromX: otherCanvasRight,
          fromY: lineY,
          toX: frameLeft,
          toY: lineY,
          direction: 'horizontal',
        });
      }
    }

    // Check vertical gaps (dragged frame is above or below other)
    // Dragged frame is above other
    if (dragInfo.y + dragInfo.height <= otherTop) {
      const gap = otherTop - (dragInfo.y + dragInfo.height);
      const lineX = Math.max(frameLeft, otherCanvasLeft) +
                    Math.min(frameRight - frameLeft, otherCanvasRight - otherCanvasLeft) / 2;
      // Only show if there's horizontal overlap
      if (frameRight > otherCanvasLeft && frameLeft < otherCanvasRight) {
        frameDistances.push({
          distance: gap,
          fromX: lineX,
          fromY: frameBottom,
          toX: lineX,
          toY: otherCanvasTop,
          direction: 'vertical',
        });
      }
    }

    // Dragged frame is below other
    if (dragInfo.y >= otherBottom) {
      const gap = dragInfo.y - otherBottom;
      const lineX = Math.max(frameLeft, otherCanvasLeft) +
                    Math.min(frameRight - frameLeft, otherCanvasRight - otherCanvasLeft) / 2;
      // Only show if there's horizontal overlap
      if (frameRight > otherCanvasLeft && frameLeft < otherCanvasRight) {
        frameDistances.push({
          distance: gap,
          fromX: lineX,
          fromY: otherCanvasBottom,
          toX: lineX,
          toY: frameTop,
          direction: 'vertical',
        });
      }
    }
  }

  // Format distance with unit
  const formatDistance = (cm: number) => {
    const value = fromCm(cm, unit);
    const suffix = unit === 'cm' ? '' : '"';
    return `${value.toFixed(1)}${suffix}`;
  };

  const wallLineColor = '#10b981'; // Green for wall distances
  const wallTextColor = '#059669';
  const frameLineColor = '#f59e0b'; // Orange for frame-to-frame distances
  const frameTextColor = '#d97706';
  const fontSize = 11;

  return (
    <Group>
      {/* Distance to left wall */}
      {fromLeft > 0 && (
        <>
          <Line
            points={[offsetX, frameCenterY, frameLeft, frameCenterY]}
            stroke={wallLineColor}
            strokeWidth={1}
          />
          <Text
            x={offsetX + (frameLeft - offsetX) / 2 - 15}
            y={frameCenterY - 18}
            text={formatDistance(fromLeft)}
            fontSize={fontSize}
            fill={wallTextColor}
            fontStyle="bold"
          />
        </>
      )}

      {/* Distance to right wall */}
      {fromRight > 0 && (
        <>
          <Line
            points={[frameRight, frameCenterY, offsetX + wallWidth, frameCenterY]}
            stroke={wallLineColor}
            strokeWidth={1}
          />
          <Text
            x={frameRight + (offsetX + wallWidth - frameRight) / 2 - 15}
            y={frameCenterY + 5}
            text={formatDistance(fromRight)}
            fontSize={fontSize}
            fill={wallTextColor}
            fontStyle="bold"
          />
        </>
      )}

      {/* Distance to top wall */}
      {fromTop > 0 && (
        <>
          <Line
            points={[frameCenterX, offsetY, frameCenterX, frameTop]}
            stroke={wallLineColor}
            strokeWidth={1}
          />
          <Text
            x={frameCenterX + 5}
            y={offsetY + (frameTop - offsetY) / 2 - 6}
            text={formatDistance(fromTop)}
            fontSize={fontSize}
            fill={wallTextColor}
            fontStyle="bold"
          />
        </>
      )}

      {/* Distance to bottom wall */}
      {fromBottom > 0 && (
        <>
          <Line
            points={[frameCenterX, frameBottom, frameCenterX, offsetY + wallHeight]}
            stroke={wallLineColor}
            strokeWidth={1}
          />
          <Text
            x={frameCenterX - 30}
            y={frameBottom + (offsetY + wallHeight - frameBottom) / 2 - 6}
            text={formatDistance(fromBottom)}
            fontSize={fontSize}
            fill={wallTextColor}
            fontStyle="bold"
          />
        </>
      )}

      {/* Distances to other frames */}
      {frameDistances.map((fd, index) => (
        <Group key={`frame-dist-${index}`}>
          <Line
            points={[fd.fromX, fd.fromY, fd.toX, fd.toY]}
            stroke={frameLineColor}
            strokeWidth={2}
          />
          {/* Arrow heads */}
          {fd.direction === 'horizontal' ? (
            <>
              <Line
                points={[fd.fromX + 5, fd.fromY - 4, fd.fromX, fd.fromY, fd.fromX + 5, fd.fromY + 4]}
                stroke={frameLineColor}
                strokeWidth={2}
              />
              <Line
                points={[fd.toX - 5, fd.toY - 4, fd.toX, fd.toY, fd.toX - 5, fd.toY + 4]}
                stroke={frameLineColor}
                strokeWidth={2}
              />
            </>
          ) : (
            <>
              <Line
                points={[fd.fromX - 4, fd.fromY + 5, fd.fromX, fd.fromY, fd.fromX + 4, fd.fromY + 5]}
                stroke={frameLineColor}
                strokeWidth={2}
              />
              <Line
                points={[fd.toX - 4, fd.toY - 5, fd.toX, fd.toY, fd.toX + 4, fd.toY - 5]}
                stroke={frameLineColor}
                strokeWidth={2}
              />
            </>
          )}
          {/* Distance label */}
          <Text
            x={fd.direction === 'horizontal'
              ? (fd.fromX + fd.toX) / 2 - 15
              : fd.fromX + 8}
            y={fd.direction === 'horizontal'
              ? fd.fromY - 18
              : (fd.fromY + fd.toY) / 2 - 6}
            text={formatDistance(fd.distance)}
            fontSize={fontSize + 1}
            fill={frameTextColor}
            fontStyle="bold"
          />
        </Group>
      ))}
    </Group>
  );
}
