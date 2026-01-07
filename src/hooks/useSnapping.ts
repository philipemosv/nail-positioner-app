import { useMemo } from 'react';
import type { WallObject, Wall } from '../types';
import { SNAP_THRESHOLD } from '../constants';
import { getObjectCenter } from '../utils/coordinates';

export interface SnapGuide {
  type: 'vertical' | 'horizontal';
  position: number; // cm from left (vertical) or top (horizontal)
  label: string;
}

export interface SnapResult {
  x: number;
  y: number;
  guides: SnapGuide[];
}

/**
 * Calculate snap positions and guidelines for an object being dragged
 */
export function useSnapping(
  wall: Wall,
  objects: WallObject[],
  currentObjectId: string | null
) {
  return useMemo(() => {
    const wallCenterX = wall.width / 2;
    const wallCenterY = wall.height / 2;

    // Get other objects for alignment
    const otherObjects = objects.filter((obj) => obj.id !== currentObjectId);

    /**
     * Calculate snapping for an object at a given position
     */
    function calculateSnap(
      x: number,
      y: number,
      objectWidth: number,
      objectHeight: number
    ): SnapResult {
      const guides: SnapGuide[] = [];
      let snappedX = x;
      let snappedY = y;

      const objectCenterX = x + objectWidth / 2;
      const objectCenterY = y + objectHeight / 2;
      const objectRight = x + objectWidth;
      const objectBottom = y + objectHeight;

      // Snap to wall center (vertical line)
      if (Math.abs(objectCenterX - wallCenterX) < SNAP_THRESHOLD) {
        snappedX = wallCenterX - objectWidth / 2;
        guides.push({
          type: 'vertical',
          position: wallCenterX,
          label: 'Center',
        });
      }

      // Snap to wall center (horizontal line)
      if (Math.abs(objectCenterY - wallCenterY) < SNAP_THRESHOLD) {
        snappedY = wallCenterY - objectHeight / 2;
        guides.push({
          type: 'horizontal',
          position: wallCenterY,
          label: 'Center',
        });
      }

      // Snap to wall edges
      if (Math.abs(x) < SNAP_THRESHOLD) {
        snappedX = 0;
        guides.push({
          type: 'vertical',
          position: 0,
          label: 'Edge',
        });
      }
      if (Math.abs(objectRight - wall.width) < SNAP_THRESHOLD) {
        snappedX = wall.width - objectWidth;
        guides.push({
          type: 'vertical',
          position: wall.width,
          label: 'Edge',
        });
      }
      if (Math.abs(y) < SNAP_THRESHOLD) {
        snappedY = 0;
        guides.push({
          type: 'horizontal',
          position: 0,
          label: 'Edge',
        });
      }
      if (Math.abs(objectBottom - wall.height) < SNAP_THRESHOLD) {
        snappedY = wall.height - objectHeight;
        guides.push({
          type: 'horizontal',
          position: wall.height,
          label: 'Edge',
        });
      }

      // Snap to other objects' centers
      for (const other of otherObjects) {
        const otherCenter = getObjectCenter(other);

        // Align center X
        if (Math.abs(objectCenterX - otherCenter.x) < SNAP_THRESHOLD) {
          snappedX = otherCenter.x - objectWidth / 2;
          guides.push({
            type: 'vertical',
            position: otherCenter.x,
            label: 'Align',
          });
        }

        // Align center Y
        if (Math.abs(objectCenterY - otherCenter.y) < SNAP_THRESHOLD) {
          snappedY = otherCenter.y - objectHeight / 2;
          guides.push({
            type: 'horizontal',
            position: otherCenter.y,
            label: 'Align',
          });
        }
      }

      return { x: snappedX, y: snappedY, guides };
    }

    return { calculateSnap, wallCenterX, wallCenterY };
  }, [wall, objects, currentObjectId]);
}
