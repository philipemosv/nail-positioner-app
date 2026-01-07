import { useAppStore } from '../../store/useAppStore';
import type { Unit } from '../../types';

export function UnitToggle() {
  const unit = useAppStore((state) => state.unit);
  const setUnit = useAppStore((state) => state.setUnit);

  const handleToggle = (newUnit: Unit) => {
    setUnit(newUnit);
  };

  return (
    <div className="flex rounded-lg bg-blue-700 p-1">
      <button
        onClick={() => handleToggle('cm')}
        className={`
          px-3 py-1.5 text-sm font-medium rounded-md transition-colors min-h-[36px]
          ${unit === 'cm'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-blue-100 hover:text-white'
          }
        `}
      >
        cm
      </button>
      <button
        onClick={() => handleToggle('inch')}
        className={`
          px-3 py-1.5 text-sm font-medium rounded-md transition-colors min-h-[36px]
          ${unit === 'inch'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-blue-100 hover:text-white'
          }
        `}
      >
        in
      </button>
    </div>
  );
}
