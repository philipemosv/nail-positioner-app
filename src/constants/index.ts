import type { Wall, Unit } from '../types';

// Default wall dimensions (cm)
export const DEFAULT_WALL: Wall = {
  width: 300,  // 3 meters
  height: 250, // 2.5 meters
};

// Default object dimensions (cm)
export const DEFAULT_OBJECT_WIDTH = 60;
export const DEFAULT_OBJECT_HEIGHT = 40;

// Nail distribution settings
export const NAIL_MARGIN_PERCENT = 0.15; // 15% from edges for 2+ nails
export const NAIL_TOP_OFFSET_PERCENT = 0.1; // 10% from top of object

// Snapping threshold (cm)
export const SNAP_THRESHOLD = 5;

// Unit conversion
export const CM_PER_INCH = 2.54;

// Default unit
export const DEFAULT_UNIT: Unit = 'cm';

// Canvas settings
export const CANVAS_PADDING = 20; // px
export const GRID_STEP_CM = 10; // cm between grid lines

// Touch target minimum size (px)
export const MIN_TOUCH_TARGET = 44;
