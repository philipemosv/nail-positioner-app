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

interface FrameDistance {
  distance: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  direction: 'horizontal' | 'vertical';
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
  const objects = useAppStore((state) => state.objects);
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

  // Calculate distances to other frames
  const otherObjects = objects.filter((obj) => obj.id !== selectedObject.id);
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

    // Check horizontal gaps (selected frame is to the left or right of other)
    // Selected frame is to the left of other
    if (selectedObject.x + selectedObject.width <= otherLeft) {
      const gap = otherLeft - (selectedObject.x + selectedObject.width);
      const lineY =
        Math.max(frameTop, otherCanvasTop) +
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

    // Selected frame is to the right of other
    if (selectedObject.x >= otherRight) {
      const gap = selectedObject.x - otherRight;
      const lineY =
        Math.max(frameTop, otherCanvasTop) +
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

    // Check vertical gaps (selected frame is above or below other)
    // Selected frame is above other
    if (selectedObject.y + selectedObject.height <= otherTop) {
      const gap = otherTop - (selectedObject.y + selectedObject.height);
      const lineX =
        Math.max(frameLeft, otherCanvasLeft) +
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

    // Selected frame is below other
    if (selectedObject.y >= otherBottom) {
      const gap = selectedObject.y - otherBottom;
      const lineX =
        Math.max(frameLeft, otherCanvasLeft) +
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

  const lineColor = '#3b82f6'; // Blue color for wall distance lines
  const textColor = '#2563eb';
  const frameLineColor = '#f59e0b'; // Orange for frame-to-frame distances
  const frameTextColor = '#d97706';
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

      {/* Distances to other frames */}
      {frameDistances.map((fd, index) => (
        <Group key={`frame-dist-${index}`}>
          <Line
            points={[fd.fromX, fd.fromY, fd.toX, fd.toY]}
            stroke={frameLineColor}
            strokeWidth={2}
            dash={dashPattern}
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
            x={fd.direction === 'horizontal' ? (fd.fromX + fd.toX) / 2 - 15 : fd.fromX + 8}
            y={fd.direction === 'horizontal' ? fd.fromY - 18 : (fd.fromY + fd.toY) / 2 - 6}
            text={formatDistance(fd.distance)}
            fontSize={fontSize}
            fill={frameTextColor}
            fontStyle="bold"
          />
        </Group>
      ))}
    </Group>
  );
}
