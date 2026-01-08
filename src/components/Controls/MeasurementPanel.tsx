import { useMemo } from 'react';
import { useAppStore, useSelectedObject } from '../../store/useAppStore';
import { getNailDistances } from '../../utils/coordinates';
import { formatMeasurement } from '../../utils/units';

export function MeasurementPanel() {
  const wall = useAppStore((state) => state.wall);
  const unit = useAppStore((state) => state.unit);
  const objects = useAppStore((state) => state.objects);
  const selectedObject = useSelectedObject();

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

  if (measurements.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 bg-slate-800 text-white rounded-lg shadow-lg p-4 min-w-[200px]">
      <h3 className="text-sm font-medium mb-3 text-slate-300">
        Calculated Nail Positions
      </h3>

      <div className="space-y-2">
        {measurements.map((m) => (
          <div key={m.nailId} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            <span className="text-slate-200">
              Hole ({formatMeasurement(m.fromLeft, unit)}, {formatMeasurement(m.fromTop, unit)})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
