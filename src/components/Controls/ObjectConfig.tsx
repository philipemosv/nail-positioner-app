import { useState, useEffect } from 'react';
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
  const selectObject = useAppStore((state) => state.selectObject);
  const selectedObject = useSelectedObject();

  const [nameInput, setNameInput] = useState('');
  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');

  useEffect(() => {
    if (selectedObject) {
      setNameInput(selectedObject.name);
      setWidthInput(fromCm(selectedObject.width, unit).toFixed(0));
      setHeightInput(fromCm(selectedObject.height, unit).toFixed(0));
    } else {
      setNameInput('');
      setWidthInput('');
      setHeightInput('');
    }
  }, [selectedObject, unit]);

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

  const handleNameChange = (value: string) => {
    setNameInput(value);
    if (selectedObject) {
      updateObject(selectedObject.id, { name: value });
    }
  };

  const handleWidthBlur = () => {
    if (selectedObject) {
      const numValue = parseFloat(widthInput);
      if (!isNaN(numValue) && numValue > 0) {
        updateObject(selectedObject.id, { width: toCm(numValue, unit) });
      } else {
        setWidthInput(fromCm(selectedObject.width, unit).toFixed(0));
      }
    }
  };

  const handleHeightBlur = () => {
    if (selectedObject) {
      const numValue = parseFloat(heightInput);
      if (!isNaN(numValue) && numValue > 0) {
        updateObject(selectedObject.id, { height: toCm(numValue, unit) });
      } else {
        setHeightInput(fromCm(selectedObject.height, unit).toFixed(0));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'width' | 'height') => {
    if (e.key === 'Enter') {
      if (field === 'width') handleWidthBlur();
      else handleHeightBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Frame Name */}
      <div>
        <Input
          label="Frame Name"
          value={nameInput}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>

      {/* Frame Size */}
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280', marginBottom: '16px' }}>
          Frame Size (W x H {unitSuffix})
        </h3>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <Input
              type="number"
              value={widthInput}
              onChange={(e) => setWidthInput(e.target.value)}
              onBlur={handleWidthBlur}
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
              onChange={(e) => setHeightInput(e.target.value)}
              onBlur={handleHeightBlur}
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
      <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
        <Button variant="secondary" onClick={() => selectObject(null)} style={{ flex: 1 }}>
          Deselect
        </Button>
        <Button variant="danger" onClick={handleDelete} style={{ flex: 1 }}>
          Delete
        </Button>
      </div>
    </div>
  );
}
