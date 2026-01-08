import { useAppStore } from '../../store/useAppStore';
import type { Unit } from '../../types';

export function UnitToggle() {
  const unit = useAppStore((state) => state.unit);
  const setUnit = useAppStore((state) => state.setUnit);

  const handleToggle = (newUnit: Unit) => {
    setUnit(newUnit);
  };

  const baseButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: '14px 24px',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  const activeStyle: React.CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: '#3b82f6',
    color: 'white',
  };

  const inactiveStyle: React.CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
  };

  return (
    <div>
      <span style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: '16px' }}>
        Unit
      </span>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => handleToggle('cm')}
          style={unit === 'cm' ? activeStyle : inactiveStyle}
        >
          cm
        </button>
        <button
          onClick={() => handleToggle('inch')}
          style={unit === 'inch' ? activeStyle : inactiveStyle}
        >
          inches
        </button>
      </div>
    </div>
  );
}
