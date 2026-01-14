import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CANVAS_PADDING } from '../constants';

interface CanvasDimensions {
  canvasWidth: number;
  canvasHeight: number;
  wallWidth: number;
  wallHeight: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Hook to calculate scale and positioning for the wall canvas
 */
export function useCanvasScale(
  containerWidth: number,
  containerHeight: number
): CanvasDimensions {
  const wall = useAppStore((state) => state.wall);

  return useMemo(() => {
    const availableWidth = containerWidth - CANVAS_PADDING * 2;
    const availableHeight = containerHeight - CANVAS_PADDING * 2;

    const scaleX = availableWidth / wall.width;
    const scaleY = availableHeight / wall.height;
    const scale = Math.min(scaleX, scaleY);

    const wallWidth = wall.width * scale;
    const wallHeight = wall.height * scale;

    const offsetX = (containerWidth - wallWidth) / 2;
    const offsetY = (containerHeight - wallHeight) / 2;

    return {
      canvasWidth: containerWidth,
      canvasHeight: containerHeight,
      wallWidth,
      wallHeight,
      scale,
      offsetX,
      offsetY,
    };
  }, [containerWidth, containerHeight, wall.width, wall.height]);
}
