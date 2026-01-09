import { useAppStore, useSelectedObject } from '../../store/useAppStore';
import { fromCm } from '../../utils/units';
import { getNailDistances } from '../../utils/coordinates';

export function HoleInfoPanel() {
  const wall = useAppStore((state) => state.wall);
  const unit = useAppStore((state) => state.unit);
  const selectedNailId = useAppStore((state) => state.selectedNailId);
  const selectedObject = useSelectedObject();

  if (!selectedObject) {
    return null;
  }

  const unitSuffix = unit === 'cm' ? 'cm' : '"';

  const formatValue = (cm: number) => {
    return fromCm(cm, unit).toFixed(1);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '200px',
        fontSize: '13px',
      }}
    >
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '12px' }}>
        {selectedObject.name}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {selectedObject.nails.map((nail, index) => {
          const isSelected = selectedNailId === nail.id;
          const distances = getNailDistances(selectedObject, nail, wall);

          return (
            <div
              key={nail.id}
              style={{
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: isSelected ? '#eff6ff' : '#f9fafb',
                border: isSelected ? '1px solid #60a5fa' : '1px solid #e5e7eb',
              }}
            >
              <div style={{ fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                Hole {index + 1}
              </div>
              <div style={{ color: '#6b7280', display: 'flex', gap: '12px' }}>
                <span>L: {formatValue(distances.fromLeft)}{unitSuffix}</span>
                <span>T: {formatValue(distances.fromTop)}{unitSuffix}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
