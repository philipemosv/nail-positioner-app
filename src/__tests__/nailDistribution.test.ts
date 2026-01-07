import { describe, it, expect } from 'vitest';
import { distributeNails, constrainNailPosition } from '../utils/nailDistribution';

describe('Nail Distribution', () => {
  describe('distributeNails', () => {
    it('should return empty array for 0 nails', () => {
      const nails = distributeNails(60, 40, 0);
      expect(nails).toHaveLength(0);
    });

    it('should center single nail horizontally', () => {
      const nails = distributeNails(60, 40, 1);
      expect(nails).toHaveLength(1);
      expect(nails[0].offsetX).toBe(30); // Center of 60cm
      expect(nails[0].offsetY).toBe(4); // 10% of 40cm
    });

    it('should distribute 2 nails with margins', () => {
      const nails = distributeNails(100, 40, 2);
      expect(nails).toHaveLength(2);
      // 15% margin = 15cm from each edge for 100cm width
      expect(nails[0].offsetX).toBe(15);
      expect(nails[1].offsetX).toBe(85);
    });

    it('should give each nail a unique id', () => {
      const nails = distributeNails(60, 40, 3);
      const ids = nails.map((n) => n.id);
      expect(new Set(ids).size).toBe(3);
    });
  });

  describe('constrainNailPosition', () => {
    it('should keep position within bounds', () => {
      const result = constrainNailPosition(30, 20, 60, 40);
      expect(result.offsetX).toBe(30);
      expect(result.offsetY).toBe(20);
    });

    it('should clamp negative x to 0', () => {
      const result = constrainNailPosition(-10, 20, 60, 40);
      expect(result.offsetX).toBe(0);
    });

    it('should clamp x beyond width', () => {
      const result = constrainNailPosition(70, 20, 60, 40);
      expect(result.offsetX).toBe(60);
    });

    it('should clamp negative y to 0', () => {
      const result = constrainNailPosition(30, -10, 60, 40);
      expect(result.offsetY).toBe(0);
    });

    it('should clamp y beyond height', () => {
      const result = constrainNailPosition(30, 50, 60, 40);
      expect(result.offsetY).toBe(40);
    });

    it('should account for nail radius', () => {
      const result = constrainNailPosition(0, 0, 60, 40, 5);
      expect(result.offsetX).toBe(5);
      expect(result.offsetY).toBe(5);
    });
  });
});
