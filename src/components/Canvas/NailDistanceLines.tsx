import { Line, Text, Group } from 'react-konva';
import { useAppStore, useSelectedObject } from '../../store/useAppStore';
import { getNailDistances } from '../../utils/coordinates';
import { fromCm } from '../../utils/units';

interface NailDistanceLinesProps {
  scale: number;
  offsetX: number;
  offsetY: number;
  wallWidth: number;
  wallHeight: number;
  isDragging?: boolean;
}

export function NailDistanceLines({
  scale,
  offsetX,
  offsetY,
  wallWidth,
  wallHeight,
  isDragging = false,
}: NailDistanceLinesProps) {
  const wall = useAppStore((state) => state.wall);
  const unit = useAppStore((state) => state.unit);
  const selectedNailId = useAppStore((state) => state.selectedNailId);
  const selectedObject = useSelectedObject();

  // Find the selected nail
  const selectedNail = selectedObject?.nails.find((n) => n.id === selectedNailId);

  // Don't show while dragging
  if (!selectedObject || !selectedNail || isDragging) {
    return null;
  }

  // Calculate distances from wall edges
  const distances = getNailDistances(selectedObject, selectedNail, wall);

  // Calculate nail position on canvas
  const nailCanvasX = offsetX + (selectedObject.x + selectedNail.offsetX) * scale;
  const nailCanvasY = offsetY + (selectedObject.y + selectedNail.offsetY) * scale;

  // Format distance with unit
  const formatDistance = (cm: number) => {
    const value = fromCm(cm, unit);
    const suffix = unit === 'cm' ? 'cm' : '"';
    return `${value.toFixed(1)}${suffix}`;
  };

  const lineColor = '#ef4444'; // Red color for distance lines
  const textColor = '#dc2626';
  const fontSize = 11;
  const dashPattern = [4, 4];

  return (
    <Group>
      {/* Line to left wall */}
      <Line
        points={[offsetX, nailCanvasY, nailCanvasX, nailCanvasY]}
        stroke={lineColor}
        strokeWidth={1}
        dash={dashPattern}
      />
      <Text
        x={offsetX + (nailCanvasX - offsetX) / 2}
        y={nailCanvasY - 18}
        text={formatDistance(distances.fromLeft)}
        fontSize={fontSize}
        fill={textColor}
        fontStyle="bold"
        align="center"
        offsetX={20}
        padding={2}
      />

      {/* Line to right wall */}
      <Line
        points={[nailCanvasX, nailCanvasY, offsetX + wallWidth, nailCanvasY]}
        stroke={lineColor}
        strokeWidth={1}
        dash={dashPattern}
      />
      <Text
        x={nailCanvasX + (offsetX + wallWidth - nailCanvasX) / 2}
        y={nailCanvasY + 5}
        text={formatDistance(distances.fromRight)}
        fontSize={fontSize}
        fill={textColor}
        fontStyle="bold"
        align="center"
        offsetX={20}
        padding={2}
      />

      {/* Line to top wall */}
      <Line
        points={[nailCanvasX, offsetY, nailCanvasX, nailCanvasY]}
        stroke={lineColor}
        strokeWidth={1}
        dash={dashPattern}
      />
      <Text
        x={nailCanvasX + 5}
        y={offsetY + (nailCanvasY - offsetY) / 2}
        text={formatDistance(distances.fromTop)}
        fontSize={fontSize}
        fill={textColor}
        fontStyle="bold"
        padding={2}
      />

      {/* Line to bottom wall */}
      <Line
        points={[nailCanvasX, nailCanvasY, nailCanvasX, offsetY + wallHeight]}
        stroke={lineColor}
        strokeWidth={1}
        dash={dashPattern}
      />
      <Text
        x={nailCanvasX - 35}
        y={nailCanvasY + (offsetY + wallHeight - nailCanvasY) / 2}
        text={formatDistance(distances.fromBottom)}
        fontSize={fontSize}
        fill={textColor}
        fontStyle="bold"
        padding={2}
      />

      {/* Nail highlight circle */}
      <Line
        points={[nailCanvasX - 6, nailCanvasY - 6, nailCanvasX + 6, nailCanvasY + 6]}
        stroke={lineColor}
        strokeWidth={2}
      />
      <Line
        points={[nailCanvasX + 6, nailCanvasY - 6, nailCanvasX - 6, nailCanvasY + 6]}
        stroke={lineColor}
        strokeWidth={2}
      />
    </Group>
  );
}
