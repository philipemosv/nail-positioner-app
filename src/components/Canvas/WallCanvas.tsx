import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Line, Text } from 'react-konva';
import { useAppStore } from '../../store/useAppStore';
import { useCanvasScale } from '../../hooks/useMeasurements';
import { GRID_STEP_CM } from '../../constants';
import { WallObject } from './WallObject';
import { Guidelines } from './Guidelines';
import type { SnapGuide } from '../../hooks/useSnapping';

export function WallCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [activeGuides, setActiveGuides] = useState<SnapGuide[]>([]);
  const wall = useAppStore((state) => state.wall);
  const objects = useAppStore((state) => state.objects);
  const selectObject = useAppStore((state) => state.selectObject);

  // Update container size on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setContainerSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  const dimensions = useCanvasScale(containerSize.width, containerSize.height);
  const { scale, offsetX, offsetY, wallWidth, wallHeight } = dimensions;

  const handleObjectDrag = useCallback((guides: SnapGuide[]) => {
    setActiveGuides(guides);
  }, []);

  const handleObjectDragEnd = useCallback(() => {
    setActiveGuides([]);
  }, []);

  // Generate grid lines
  const gridLines = [];
  if (scale > 0) {
    // Vertical lines
    for (let x = 0; x <= wall.width; x += GRID_STEP_CM) {
      const canvasX = offsetX + x * scale;
      gridLines.push(
        <Line
          key={`v-${x}`}
          points={[canvasX, offsetY, canvasX, offsetY + wallHeight]}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      );
    }
    // Horizontal lines
    for (let y = 0; y <= wall.height; y += GRID_STEP_CM) {
      const canvasY = offsetY + y * scale;
      gridLines.push(
        <Line
          key={`h-${y}`}
          points={[offsetX, canvasY, offsetX + wallWidth, canvasY]}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      );
    }
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-100">
      {containerSize.width > 0 && containerSize.height > 0 && (
        <Stage width={containerSize.width} height={containerSize.height}>
          <Layer>
            {/* Wall background */}
            <Rect
              x={offsetX}
              y={offsetY}
              width={wallWidth}
              height={wallHeight}
              fill="#ffffff"
              stroke="#374151"
              strokeWidth={2}
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.1}
              shadowOffset={{ x: 2, y: 2 }}
              onClick={() => selectObject(null)}
              onTap={() => selectObject(null)}
            />

            {/* Grid */}
            {gridLines}

            {/* Snap guidelines */}
            <Guidelines
              guides={activeGuides}
              scale={scale}
              offsetX={offsetX}
              offsetY={offsetY}
              wallWidth={wallWidth}
              wallHeight={wallHeight}
            />

            {/* Dimension labels */}
            <Text
              x={offsetX + wallWidth / 2}
              y={offsetY + wallHeight + 10}
              text={`${wall.width} cm`}
              fontSize={12}
              fill="#6b7280"
              align="center"
              offsetX={20}
            />
            <Text
              x={offsetX - 35}
              y={offsetY + wallHeight / 2}
              text={`${wall.height} cm`}
              fontSize={12}
              fill="#6b7280"
              rotation={-90}
            />

            {/* Objects */}
            {objects.map((obj) => (
              <WallObject
                key={obj.id}
                object={obj}
                scale={scale}
                offsetX={offsetX}
                offsetY={offsetY}
                onDrag={handleObjectDrag}
                onDragEnd={handleObjectDragEnd}
              />
            ))}
          </Layer>
        </Stage>
      )}
    </div>
  );
}
