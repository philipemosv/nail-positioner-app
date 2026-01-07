import { describe, it, expect } from 'vitest';
import { cmToInch, inchToCm, fromCm, toCm, formatMeasurement } from '../utils/units';

describe('Unit Conversions', () => {
  describe('cmToInch', () => {
    it('should convert 2.54 cm to 1 inch', () => {
      expect(cmToInch(2.54)).toBeCloseTo(1);
    });

    it('should convert 10 cm to ~3.94 inches', () => {
      expect(cmToInch(10)).toBeCloseTo(3.937, 2);
    });

    it('should handle 0', () => {
      expect(cmToInch(0)).toBe(0);
    });
  });

  describe('inchToCm', () => {
    it('should convert 1 inch to 2.54 cm', () => {
      expect(inchToCm(1)).toBeCloseTo(2.54);
    });

    it('should convert 10 inches to 25.4 cm', () => {
      expect(inchToCm(10)).toBeCloseTo(25.4);
    });
  });

  describe('fromCm', () => {
    it('should return same value for cm unit', () => {
      expect(fromCm(100, 'cm')).toBe(100);
    });

    it('should convert to inches for inch unit', () => {
      expect(fromCm(2.54, 'inch')).toBeCloseTo(1);
    });
  });

  describe('toCm', () => {
    it('should return same value for cm unit', () => {
      expect(toCm(100, 'cm')).toBe(100);
    });

    it('should convert from inches to cm', () => {
      expect(toCm(1, 'inch')).toBeCloseTo(2.54);
    });
  });

  describe('formatMeasurement', () => {
    it('should format cm with suffix', () => {
      expect(formatMeasurement(100, 'cm')).toBe('100.0cm');
    });

    it('should format inches with quote suffix', () => {
      expect(formatMeasurement(2.54, 'inch')).toBe('1.0"');
    });

    it('should respect decimal places', () => {
      expect(formatMeasurement(100.567, 'cm', 2)).toBe('100.57cm');
    });
  });
});
