import { describe, it, expect } from 'vitest';
import {
  getNailAbsolutePosition,
  getNailDistances,
  getObjectCenter,
  constrainToWall,
} from '../utils/coordinates';
import type { Wall, WallObject, Nail } from '../types';

describe('Coordinate Calculations', () => {
  const wall: Wall = { width: 300, height: 250 };

  const mockObject: WallObject = {
    id: 'obj-1',
    name: 'Test Object',
    width: 60,
    height: 40,
    x: 100,
    y: 80,
    nails: [],
  };

  const mockNail: Nail = {
    id: 'nail-1',
    offsetX: 30,
    offsetY: 10,
  };

  describe('getNailAbsolutePosition', () => {
    it('should calculate absolute nail position on wall', () => {
      const pos = getNailAbsolutePosition(mockObject, mockNail);
      expect(pos.fromLeft).toBe(130); // 100 + 30
      expect(pos.fromTop).toBe(90); // 80 + 10
    });
  });

  describe('getNailDistances', () => {
    it('should calculate distances from all wall edges', () => {
      const distances = getNailDistances(mockObject, mockNail, wall);
      expect(distances.fromLeft).toBe(130);
      expect(distances.fromRight).toBe(170); // 300 - 130
      expect(distances.fromTop).toBe(90);
      expect(distances.fromBottom).toBe(160); // 250 - 90
    });
  });

  describe('getObjectCenter', () => {
    it('should calculate object center point', () => {
      const center = getObjectCenter(mockObject);
      expect(center.x).toBe(130); // 100 + 60/2
      expect(center.y).toBe(100); // 80 + 40/2
    });
  });

  describe('constrainToWall', () => {
    it('should not modify position within bounds', () => {
      const constrained = constrainToWall(100, 80, 60, 40, wall);
      expect(constrained.x).toBe(100);
      expect(constrained.y).toBe(80);
    });

    it('should clamp negative positions to 0', () => {
      const constrained = constrainToWall(-20, -10, 60, 40, wall);
      expect(constrained.x).toBe(0);
      expect(constrained.y).toBe(0);
    });

    it('should clamp positions exceeding wall bounds', () => {
      const constrained = constrainToWall(280, 230, 60, 40, wall);
      expect(constrained.x).toBe(240); // 300 - 60
      expect(constrained.y).toBe(210); // 250 - 40
    });
  });
});
