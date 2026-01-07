import { useMemo, useCallback } from 'react';
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
 * @param containerWidth Available container width in pixels
 * @param containerHeight Available container height in pixels
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

    // Center the wall in the canvas
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

/**
 * Convert real-world cm to canvas pixels
 */
export function useCoordinateTransform(scale: number, offsetX: number, offsetY: number) {
  const toCanvas = useCallback(
    (cmX: number, cmY: number) => ({
      x: offsetX + cmX * scale,
      y: offsetY + cmY * scale,
    }),
    [scale, offsetX, offsetY]
  );

  const toReal = useCallback(
    (canvasX: number, canvasY: number) => ({
      x: (canvasX - offsetX) / scale,
      y: (canvasY - offsetY) / scale,
    }),
    [scale, offsetX, offsetY]
  );

  const sizeToCanvas = useCallback(
    (cmWidth: number, cmHeight: number) => ({
      width: cmWidth * scale,
      height: cmHeight * scale,
    }),
    [scale]
  );

  const sizeToReal = useCallback(
    (canvasWidth: number, canvasHeight: number) => ({
      width: canvasWidth / scale,
      height: canvasHeight / scale,
    }),
    [scale]
  );

  return { toCanvas, toReal, sizeToCanvas, sizeToReal };
}
