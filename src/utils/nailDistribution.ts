import type { Nail } from '../types';
import { NAIL_MARGIN_PERCENT, NAIL_TOP_OFFSET_PERCENT } from '../constants';

/**
 * Generate a unique ID for nails
 */
export function generateNailId(): string {
  return `nail-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate auto-distributed nail positions for an object
 * @param objectWidth Object width in cm
 * @param objectHeight Object height in cm
 * @param count Number of nails to distribute
 * @returns Array of nail positions with auto-calculated offsets
 */
export function distributeNails(
  objectWidth: number,
  objectHeight: number,
  count: number
): Nail[] {
  if (count <= 0) return [];

  const topOffset = objectHeight * NAIL_TOP_OFFSET_PERCENT;

  if (count === 1) {
    // Single nail: center horizontally
    return [
      {
        id: generateNailId(),
        offsetX: objectWidth / 2,
        offsetY: topOffset,
      },
    ];
  }

  // Multiple nails: distribute with margins
  const margin = objectWidth * NAIL_MARGIN_PERCENT;
  const availableWidth = objectWidth - 2 * margin;
  const spacing = count > 1 ? availableWidth / (count - 1) : 0;

  return Array.from({ length: count }, (_, i) => ({
    id: generateNailId(),
    offsetX: margin + i * spacing,
    offsetY: topOffset,
  }));
}

/**
 * Constrain nail position within object bounds
 */
export function constrainNailPosition(
  offsetX: number,
  offsetY: number,
  objectWidth: number,
  objectHeight: number,
  nailRadius: number = 0
): { offsetX: number; offsetY: number } {
  return {
    offsetX: Math.max(nailRadius, Math.min(objectWidth - nailRadius, offsetX)),
    offsetY: Math.max(nailRadius, Math.min(objectHeight - nailRadius, offsetY)),
  };
}
