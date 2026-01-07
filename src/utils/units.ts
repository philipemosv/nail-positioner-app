import type { Unit } from '../types';
import { CM_PER_INCH } from '../constants';

/**
 * Convert centimeters to inches
 */
export function cmToInch(cm: number): number {
  return cm / CM_PER_INCH;
}

/**
 * Convert inches to centimeters
 */
export function inchToCm(inch: number): number {
  return inch * CM_PER_INCH;
}

/**
 * Convert a value from centimeters to the target unit
 */
export function fromCm(cm: number, targetUnit: Unit): number {
  if (targetUnit === 'inch') {
    return cmToInch(cm);
  }
  return cm;
}

/**
 * Convert a value from the source unit to centimeters
 */
export function toCm(value: number, sourceUnit: Unit): number {
  if (sourceUnit === 'inch') {
    return inchToCm(value);
  }
  return value;
}

/**
 * Format a measurement value for display
 */
export function formatMeasurement(cm: number, unit: Unit, decimals: number = 1): string {
  const value = fromCm(cm, unit);
  const formatted = value.toFixed(decimals);
  const suffix = unit === 'cm' ? 'cm' : '"';
  return `${formatted}${suffix}`;
}

/**
 * Get unit label for display
 */
export function getUnitLabel(unit: Unit): string {
  return unit === 'cm' ? 'cm' : 'inches';
}
