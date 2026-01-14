import { useState } from 'react';
import { useAppStore, useSelectedObject } from '../../store/useAppStore';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { fromCm, toCm } from '../../utils/units';
import { DEFAULT_OBJECT_WIDTH, DEFAULT_OBJECT_HEIGHT } from '../../constants';
import { distributeNails } from '../../utils/nailDistribution';
import { NailPositionEditor } from './NailPositionEditor';

export function ObjectConfig() {
  const unit = useAppStore((state) => state.unit);
  const wall = useAppStore((state) => state.wall);
  const objects = useAppStore((state) => state.objects);
  const addObject = useAppStore((state) => state.addObject);
  const updateObject = useAppStore((state) => state.updateObject);
  const removeObject = useAppStore((state) => state.removeObject);
  const selectedObject = useSelectedObject();

  // Track which field is being edited
  const [editingField, setEditingField] = useState<'name' | 'width' | 'height' | null>(null);
  const [editValue, setEditValue] = useState('');

  // Derive display values from store
  const displayName = selectedObject?.name ?? '';
  const displayWidth = selectedObject ? fromCm(selectedObject.width, unit).toFixed(0) : '';
  const displayHeight = selectedObject ? fromCm(selectedObject.height, unit).toFixed(0) : '';

  const handleAddObject = () => {
    const defaultWidth = DEFAULT_OBJECT_WIDTH;
    const defaultHeight = DEFAULT_OBJECT_HEIGHT;

    const x = (wall.width - defaultWidth) / 2;
    const y = (wall.height - defaultHeight) / 2;

    const nails = distributeNails(defaultWidth, defaultHeight, 2);

    addObject({
      name: `My Frame`,
      width: defaultWidth,
      height: defaultHeight,
      x,
      y,
      nails,
    });
  };

  const handleFocus = (field: 'name' | 'width' | 'height') => {
    setEditingField(field);
    if (field === 'name') setEditValue(displayName);
    else if (field === 'width') setEditValue(displayWidth);
    else setEditValue(displayHeight);
  };

  const handleChange = (value: string) => {
    setEditValue(value);
    // Update name immediately as user types
    if (editingField === 'name' && selectedObject) {
      updateObject(selectedObject.id, { name: value });
    }
  };

  const handleBlur = (field: 'width' | 'height') => {
    if (selectedObject) {
      const numValue = parseFloat(editValue);
      if (!isNaN(numValue) && numValue > 0) {
        if (field === 'width') {
          updateObject(selectedObject.id, { width: toCm(numValue, unit) });
        } else {
          updateObject(selectedObject.id, { height: toCm(numValue, unit) });
        }
      }
    }
    setEditingField(null);
  };

  const handleNameBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'width' | 'height') => {
    if (e.key === 'Enter') {
      handleBlur(field);
      (e.target as HTMLInputElement).blur();
    }
  };

  // Get current input values
  const nameInput = editingField === 'name' ? editValue : displayName;
  const widthInput = editingField === 'width' ? editValue : displayWidth;
  const heightInput = editingField === 'height' ? editValue : displayHeight;

  const handleDelete = () => {
    if (selectedObject) {
      removeObject(selectedObject.id);
    }
  };

  const unitSuffix = unit === 'cm' ? 'cm' : 'in';

  if (objects.length === 0) {
    return (
      <div>
        <Button onClick={handleAddObject} style={{ width: '100%' }}>
          Add Frame
        </Button>
      </div>
    );
  }

  if (!selectedObject) {
    return (
      <div>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
          Click on a frame to edit it
        </p>
        <Button onClick={handleAddObject} variant="secondary" style={{ width: '100%' }}>
          Add Another Frame
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Frame Name */}
      <div>
        <Input
          label="Frame Name"
          value={nameInput}
          onFocus={() => handleFocus('name')}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleNameBlur}
        />
      </div>

      {/* Frame Size */}
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280', marginBottom: '12px' }}>
          Frame Size (W x H {unitSuffix})
        </h3>
        <div style={{ display: 'flex', gap: '12px' }}>
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
              step="1"
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
              step="1"
            />
          </div>
        </div>
      </div>

      {/* Nail Position Editor */}
      <NailPositionEditor />

      {/* Actions */}
      <div style={{ paddingTop: '8px' }}>
        <Button variant="danger" onClick={handleDelete} style={{ width: '100%' }}>
          Delete Frame
        </Button>
      </div>
    </div>
  );
}
