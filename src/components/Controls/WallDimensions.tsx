import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Input } from '../UI/Input';
import { fromCm, toCm } from '../../utils/units';

export function WallDimensions() {
  const wall = useAppStore((state) => state.wall);
  const unit = useAppStore((state) => state.unit);
  const setWallDimensions = useAppStore((state) => state.setWallDimensions);

  // Track which input is currently being edited
  const [editingField, setEditingField] = useState<'width' | 'height' | null>(null);
  const [editValue, setEditValue] = useState('');

  // Derive display values from store
  const displayWidth = fromCm(wall.width, unit).toFixed(1);
  const displayHeight = fromCm(wall.height, unit).toFixed(1);

  const handleFocus = (field: 'width' | 'height') => {
    setEditingField(field);
    setEditValue(field === 'width' ? displayWidth : displayHeight);
  };

  const handleChange = (value: string) => {
    setEditValue(value);
  };

  const handleBlur = (field: 'width' | 'height') => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue) && numValue > 0) {
      if (field === 'width') {
        setWallDimensions(toCm(numValue, unit), wall.height);
      } else {
        setWallDimensions(wall.width, toCm(numValue, unit));
      }
    }
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'width' | 'height') => {
    if (e.key === 'Enter') {
      handleBlur(field);
      (e.target as HTMLInputElement).blur();
    }
  };

  // Get current input value (edit value if editing, otherwise display value)
  const widthInput = editingField === 'width' ? editValue : displayWidth;
  const heightInput = editingField === 'height' ? editValue : displayHeight;

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
            onFocus={() => handleFocus('width')}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => handleBlur('width')}
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
            onFocus={() => handleFocus('height')}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => handleBlur('height')}
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
