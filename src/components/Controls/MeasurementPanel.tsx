import { useMemo, useState } from 'react';
import { useAppStore, useSelectedObject } from '../../store/useAppStore';
import { getNailDistances } from '../../utils/coordinates';
import { formatMeasurement } from '../../utils/units';
import { Button } from '../UI/Button';

export function MeasurementPanel() {
  const wall = useAppStore((state) => state.wall);
  const unit = useAppStore((state) => state.unit);
  const objects = useAppStore((state) => state.objects);
  const selectedObject = useSelectedObject();
  const [copied, setCopied] = useState(false);

  // Calculate measurements for selected object or all objects
  const measurements = useMemo(() => {
    const objectsToMeasure = selectedObject ? [selectedObject] : objects;

    return objectsToMeasure.flatMap((obj) =>
      obj.nails.map((nail, index) => {
        const distances = getNailDistances(obj, nail, wall);
        return {
          objectName: obj.name,
          nailIndex: index + 1,
          nailId: nail.id,
          fromTop: distances.fromTop,
          fromLeft: distances.fromLeft,
        };
      })
    );
  }, [selectedObject, objects, wall]);

  const handleCopyAll = async () => {
    const text = measurements
      .map(
        (m) =>
          `${m.objectName} - Nail ${m.nailIndex}:\n` +
          `  From Top: ${formatMeasurement(m.fromTop, unit)}\n` +
          `  From Left: ${formatMeasurement(m.fromLeft, unit)}`
      )
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (measurements.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800">Nail Measurements</h3>
        <p className="text-sm text-gray-500 italic">
          Add an object and nails to see measurements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          Nail Measurements
          {selectedObject && (
            <span className="text-gray-500 font-normal ml-1">
              ({selectedObject.name})
            </span>
          )}
        </h3>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCopyAll}
          className="text-xs"
        >
          {copied ? 'Copied!' : 'Copy All'}
        </Button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {measurements.map((m) => (
          <div
            key={m.nailId}
            className="bg-gray-50 rounded-lg p-3 border border-gray-200"
          >
            <div className="text-xs text-gray-500 mb-1">
              {selectedObject ? `Nail ${m.nailIndex}` : `${m.objectName} - Nail ${m.nailIndex}`}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">From Top:</span>
                <span className="font-mono font-medium ml-2 text-gray-900">
                  {formatMeasurement(m.fromTop, unit)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">From Left:</span>
                <span className="font-mono font-medium ml-2 text-gray-900">
                  {formatMeasurement(m.fromLeft, unit)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!selectedObject && objects.length > 1 && (
        <p className="text-xs text-gray-500">
          Select an object to see only its measurements.
        </p>
      )}
    </div>
  );
}
