import type { WallObject, Nail, Wall } from '../types';

/**
 * Calculate the absolute position of a nail on the wall
 * @param object The wall object containing the nail
 * @param nail The nail with offset positions
 * @returns Absolute coordinates from wall edges
 */
export function getNailAbsolutePosition(
  object: WallObject,
  nail: Nail
): { fromLeft: number; fromTop: number } {
  return {
    fromLeft: object.x + nail.offsetX,
    fromTop: object.y + nail.offsetY,
  };
}

/**
 * Calculate distance from wall edges for a nail
 * @param object The wall object containing the nail
 * @param nail The nail with offset positions
 * @param wall The wall dimensions
 * @returns Distances from all wall edges
 */
export function getNailDistances(
  object: WallObject,
  nail: Nail,
  wall: Wall
): {
  fromLeft: number;
  fromRight: number;
  fromTop: number;
  fromBottom: number;
} {
  const absolute = getNailAbsolutePosition(object, nail);

  return {
    fromLeft: absolute.fromLeft,
    fromRight: wall.width - absolute.fromLeft,
    fromTop: absolute.fromTop,
    fromBottom: wall.height - absolute.fromTop,
  };
}

/**
 * Calculate the center position of an object
 */
export function getObjectCenter(object: WallObject): { x: number; y: number } {
  return {
    x: object.x + object.width / 2,
    y: object.y + object.height / 2,
  };
}

/**
 * Check if a position is within wall bounds
 */
export function isWithinWall(
  x: number,
  y: number,
  width: number,
  height: number,
  wall: Wall
): boolean {
  return x >= 0 && y >= 0 && x + width <= wall.width && y + height <= wall.height;
}

/**
 * Constrain object position to stay within wall bounds
 */
export function constrainToWall(
  x: number,
  y: number,
  objectWidth: number,
  objectHeight: number,
  wall: Wall
): { x: number; y: number } {
  return {
    x: Math.max(0, Math.min(wall.width - objectWidth, x)),
    y: Math.max(0, Math.min(wall.height - objectHeight, y)),
  };
}

/**
 * Generate a unique ID for objects
 */
export function generateObjectId(): string {
  return `obj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
