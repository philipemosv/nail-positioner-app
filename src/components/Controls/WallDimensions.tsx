import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Input } from '../UI/Input';
import { fromCm, toCm } from '../../utils/units';

export function WallDimensions() {
  const wall = useAppStore((state) => state.wall);
  const unit = useAppStore((state) => state.unit);
  const setWallDimensions = useAppStore((state) => state.setWallDimensions);

  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');

  useEffect(() => {
    setWidthInput(fromCm(wall.width, unit).toFixed(1));
    setHeightInput(fromCm(wall.height, unit).toFixed(1));
  }, [wall.width, wall.height, unit]);

  const handleWidthChange = (value: string) => {
    setWidthInput(value);
  };

  const handleHeightChange = (value: string) => {
    setHeightInput(value);
  };

  const handleWidthBlur = () => {
    const numValue = parseFloat(widthInput);
    if (!isNaN(numValue) && numValue > 0) {
      setWallDimensions(toCm(numValue, unit), wall.height);
    } else {
      setWidthInput(fromCm(wall.width, unit).toFixed(1));
    }
  };

  const handleHeightBlur = () => {
    const numValue = parseFloat(heightInput);
    if (!isNaN(numValue) && numValue > 0) {
      setWallDimensions(wall.width, toCm(numValue, unit));
    } else {
      setHeightInput(fromCm(wall.height, unit).toFixed(1));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'width' | 'height') => {
    if (e.key === 'Enter') {
      if (field === 'width') handleWidthBlur();
      else handleHeightBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  const unitSuffix = unit === 'cm' ? 'cm' : 'in';

  return (
    <div>
      <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280', marginBottom: '16px' }}>
        Wall Dimensions (W x H {unitSuffix})
      </h3>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <Input
            type="number"
            value={widthInput}
            onChange={(e) => handleWidthChange(e.target.value)}
            onBlur={handleWidthBlur}
            onKeyDown={(e) => handleKeyDown(e, 'width')}
            suffix={unitSuffix}
            min="1"
            step="0.1"
          />
        </div>
        <div style={{ flex: 1 }}>
          <Input
            type="number"
            value={heightInput}
            onChange={(e) => handleHeightChange(e.target.value)}
            onBlur={handleHeightBlur}
            onKeyDown={(e) => handleKeyDown(e, 'height')}
            suffix={unitSuffix}
            min="1"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
}
