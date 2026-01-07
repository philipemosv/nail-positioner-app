import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Input } from '../UI/Input';
import { fromCm, toCm } from '../../utils/units';

export function WallDimensions() {
  const wall = useAppStore((state) => state.wall);
  const unit = useAppStore((state) => state.unit);
  const setWallDimensions = useAppStore((state) => state.setWallDimensions);

  // Local state for input values (in display unit)
  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');

  // Sync local state with store when wall or unit changes
  useEffect(() => {
    setWidthInput(fromCm(wall.width, unit).toFixed(1));
    setHeightInput(fromCm(wall.height, unit).toFixed(1));
  }, [wall.width, wall.height, unit]);

  const handleWidthChange = (value: string) => {
    setWidthInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setWallDimensions(toCm(numValue, unit), wall.height);
    }
  };

  const handleHeightChange = (value: string) => {
    setHeightInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setWallDimensions(wall.width, toCm(numValue, unit));
    }
  };

  const unitSuffix = unit === 'cm' ? 'cm' : 'in';

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-800">Wall Dimensions</h3>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Width"
          type="number"
          value={widthInput}
          onChange={(e) => handleWidthChange(e.target.value)}
          suffix={unitSuffix}
          min="1"
          step="0.1"
        />
        <Input
          label="Height"
          type="number"
          value={heightInput}
          onChange={(e) => handleHeightChange(e.target.value)}
          suffix={unitSuffix}
          min="1"
          step="0.1"
        />
      </div>
    </div>
  );
}
