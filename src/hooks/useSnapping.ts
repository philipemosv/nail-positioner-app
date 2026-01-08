import { useMemo } from 'react';
import type { WallObject, Wall } from '../types';
import { SNAP_THRESHOLD } from '../constants';
import { getObjectCenter } from '../utils/coordinates';

export interface SnapGuide {
  type: 'vertical' | 'horizontal';
  position: number; // cm from left (vertical) or top (horizontal)
  label: string;
  distance?: number; // optional distance value to display
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

      // ============ WALL CENTER SNAPPING ============

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

      // ============ WALL EDGE SNAPPING ============

      // Snap to left wall edge
      if (Math.abs(x) < SNAP_THRESHOLD) {
        snappedX = 0;
        guides.push({
          type: 'vertical',
          position: 0,
          label: 'Edge',
        });
      }

      // Snap to right wall edge
      if (Math.abs(objectRight - wall.width) < SNAP_THRESHOLD) {
        snappedX = wall.width - objectWidth;
        guides.push({
          type: 'vertical',
          position: wall.width,
          label: 'Edge',
        });
      }

      // Snap to top wall edge
      if (Math.abs(y) < SNAP_THRESHOLD) {
        snappedY = 0;
        guides.push({
          type: 'horizontal',
          position: 0,
          label: 'Edge',
        });
      }

      // Snap to bottom wall edge
      if (Math.abs(objectBottom - wall.height) < SNAP_THRESHOLD) {
        snappedY = wall.height - objectHeight;
        guides.push({
          type: 'horizontal',
          position: wall.height,
          label: 'Edge',
        });
      }

      // ============ OTHER OBJECTS SNAPPING ============

      for (const other of otherObjects) {
        const otherCenter = getObjectCenter(other);
        const otherRight = other.x + other.width;
        const otherBottom = other.y + other.height;

        // --- Center alignment ---

        // Align center X with other object's center
        if (Math.abs(objectCenterX - otherCenter.x) < SNAP_THRESHOLD) {
          snappedX = otherCenter.x - objectWidth / 2;
          guides.push({
            type: 'vertical',
            position: otherCenter.x,
            label: 'Align',
          });
        }

        // Align center Y with other object's center
        if (Math.abs(objectCenterY - otherCenter.y) < SNAP_THRESHOLD) {
          snappedY = otherCenter.y - objectHeight / 2;
          guides.push({
            type: 'horizontal',
            position: otherCenter.y,
            label: 'Align',
          });
        }

        // --- Edge alignment ---

        // Align left edge with other's left edge
        if (Math.abs(x - other.x) < SNAP_THRESHOLD) {
          snappedX = other.x;
          guides.push({
            type: 'vertical',
            position: other.x,
            label: 'Align',
          });
        }

        // Align right edge with other's right edge
        if (Math.abs(objectRight - otherRight) < SNAP_THRESHOLD) {
          snappedX = otherRight - objectWidth;
          guides.push({
            type: 'vertical',
            position: otherRight,
            label: 'Align',
          });
        }

        // Align top edge with other's top edge
        if (Math.abs(y - other.y) < SNAP_THRESHOLD) {
          snappedY = other.y;
          guides.push({
            type: 'horizontal',
            position: other.y,
            label: 'Align',
          });
        }

        // Align bottom edge with other's bottom edge
        if (Math.abs(objectBottom - otherBottom) < SNAP_THRESHOLD) {
          snappedY = otherBottom - objectHeight;
          guides.push({
            type: 'horizontal',
            position: otherBottom,
            label: 'Align',
          });
        }

        // --- Gap snapping (snap when edges are close to each other) ---

        // Snap left edge of current to right edge of other (horizontal gap)
        if (Math.abs(x - otherRight) < SNAP_THRESHOLD) {
          snappedX = otherRight;
          guides.push({
            type: 'vertical',
            position: otherRight,
            label: 'Gap',
            distance: 0,
          });
        }

        // Snap right edge of current to left edge of other (horizontal gap)
        if (Math.abs(objectRight - other.x) < SNAP_THRESHOLD) {
          snappedX = other.x - objectWidth;
          guides.push({
            type: 'vertical',
            position: other.x,
            label: 'Gap',
            distance: 0,
          });
        }

        // Snap top edge of current to bottom edge of other (vertical gap)
        if (Math.abs(y - otherBottom) < SNAP_THRESHOLD) {
          snappedY = otherBottom;
          guides.push({
            type: 'horizontal',
            position: otherBottom,
            label: 'Gap',
            distance: 0,
          });
        }

        // Snap bottom edge of current to top edge of other (vertical gap)
        if (Math.abs(objectBottom - other.y) < SNAP_THRESHOLD) {
          snappedY = other.y - objectHeight;
          guides.push({
            type: 'horizontal',
            position: other.y,
            label: 'Gap',
            distance: 0,
          });
        }
      }

      return { x: snappedX, y: snappedY, guides };
    }

    return { calculateSnap, wallCenterX, wallCenterY };
  }, [wall, objects, currentObjectId]);
}
