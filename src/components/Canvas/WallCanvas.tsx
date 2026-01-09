import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Line, Text } from 'react-konva';
import { useAppStore } from '../../store/useAppStore';
import { useCanvasScale } from '../../hooks/useMeasurements';
import { GRID_STEP_CM } from '../../constants';
import { WallObject, type DragInfo } from './WallObject';
import { Guidelines } from './Guidelines';
import { NailDistanceLines } from './NailDistanceLines';
import { FrameDistanceLines } from './FrameDistanceLines';
import { DragDistanceIndicators } from './DragDistanceIndicators';
import { fromCm } from '../../utils/units';
import type { SnapGuide } from '../../hooks/useSnapping';

const ARROW_MOVE_STEP = 0.1; // cm per arrow key press

export function WallCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [activeGuides, setActiveGuides] = useState<SnapGuide[]>([]);
  const [dragInfo, setDragInfo] = useState<DragInfo | null>(null);
  const [draggingObjectId, setDraggingObjectId] = useState<string | null>(null);
  const wall = useAppStore((state) => state.wall);
  const objects = useAppStore((state) => state.objects);
  const selectObject = useAppStore((state) => state.selectObject);
  const selectedObjectId = useAppStore((state) => state.selectedObjectId);
  const updateObject = useAppStore((state) => state.updateObject);
  const removeObject = useAppStore((state) => state.removeObject);
  const unit = useAppStore((state) => state.unit);

  const unitSuffix = unit === 'cm' ? 'cm' : 'in';
  const displayWidth = fromCm(wall.width, unit).toFixed(1);
  const displayHeight = fromCm(wall.height, unit).toFixed(1);

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

  // Keyboard event handler for delete and arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (!selectedObjectId) return;

      const selectedObject = objects.find((obj) => obj.id === selectedObjectId);
      if (!selectedObject) return;

      // Delete selected object
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        removeObject(selectedObjectId);
        return;
      }

      // Move with arrow keys (0.1cm per press, 1cm with Shift)
      const step = e.shiftKey ? 1 : ARROW_MOVE_STEP;
      let newX = selectedObject.x;
      let newY = selectedObject.y;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          newX = Math.max(0, selectedObject.x - step);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newX = Math.min(wall.width - selectedObject.width, selectedObject.x + step);
          break;
        case 'ArrowUp':
          e.preventDefault();
          newY = Math.max(0, selectedObject.y - step);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newY = Math.min(wall.height - selectedObject.height, selectedObject.y + step);
          break;
        default:
          return;
      }

      // Round to 1 decimal place to avoid floating point issues
      newX = Math.round(newX * 10) / 10;
      newY = Math.round(newY * 10) / 10;

      updateObject(selectedObjectId, { x: newX, y: newY });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObjectId, objects, wall, updateObject, removeObject]);

  const dimensions = useCanvasScale(containerSize.width, containerSize.height);
  const { scale, offsetX, offsetY, wallWidth, wallHeight } = dimensions;

  const handleObjectDrag = useCallback((objectId: string, guides: SnapGuide[], info: DragInfo) => {
    setActiveGuides(guides);
    setDragInfo(info);
    setDraggingObjectId(objectId);
  }, []);

  const handleObjectDragEnd = useCallback(() => {
    setActiveGuides([]);
    setDragInfo(null);
    setDraggingObjectId(null);
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

            {/* Drag distance indicators (shown while dragging) */}
            <DragDistanceIndicators
              dragInfo={dragInfo}
              scale={scale}
              offsetX={offsetX}
              offsetY={offsetY}
              wallWidth={wallWidth}
              wallHeight={wallHeight}
              draggingObjectId={draggingObjectId}
            />

            {/* Dimension labels */}
            <Text
              x={offsetX + wallWidth / 2}
              y={offsetY + wallHeight + 15}
              text={`${displayWidth} ${unitSuffix}`}
              fontSize={14}
              fill="#6b7280"
              align="center"
              offsetX={30}
            />
            <Text
              x={offsetX - 15}
              y={offsetY + wallHeight / 2 + 30}
              text={`${displayHeight} ${unitSuffix}`}
              fontSize={14}
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

            {/* Frame distance lines (shown when frame is selected, no nail, not dragging) */}
            <FrameDistanceLines
              scale={scale}
              offsetX={offsetX}
              offsetY={offsetY}
              wallWidth={wallWidth}
              wallHeight={wallHeight}
              isDragging={dragInfo !== null}
            />

            {/* Nail distance lines (shown when a nail is selected) */}
            <NailDistanceLines
              scale={scale}
              offsetX={offsetX}
              offsetY={offsetY}
              wallWidth={wallWidth}
              wallHeight={wallHeight}
              isDragging={dragInfo !== null}
            />
          </Layer>
        </Stage>
      )}
    </div>
  );
}
