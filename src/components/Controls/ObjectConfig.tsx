import { useState, useEffect } from 'react';
import { useAppStore, useSelectedObject } from '../../store/useAppStore';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { fromCm, toCm } from '../../utils/units';
import { DEFAULT_OBJECT_WIDTH, DEFAULT_OBJECT_HEIGHT } from '../../constants';
import { distributeNails } from '../../utils/nailDistribution';

export function ObjectConfig() {
  const unit = useAppStore((state) => state.unit);
  const wall = useAppStore((state) => state.wall);
  const addObject = useAppStore((state) => state.addObject);
  const updateObject = useAppStore((state) => state.updateObject);
  const removeObject = useAppStore((state) => state.removeObject);
  const selectObject = useAppStore((state) => state.selectObject);
  const setNailCount = useAppStore((state) => state.setNailCount);
  const selectedObject = useSelectedObject();

  const [nameInput, setNameInput] = useState('');
  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');

  // Sync inputs when selected object changes
  useEffect(() => {
    if (selectedObject) {
      setNameInput(selectedObject.name);
      setWidthInput(fromCm(selectedObject.width, unit).toFixed(1));
      setHeightInput(fromCm(selectedObject.height, unit).toFixed(1));
    } else {
      setNameInput('');
      setWidthInput('');
      setHeightInput('');
    }
  }, [selectedObject, unit]);

  const handleAddObject = () => {
    const defaultWidth = DEFAULT_OBJECT_WIDTH;
    const defaultHeight = DEFAULT_OBJECT_HEIGHT;

    // Center the new object on the wall
    const x = (wall.width - defaultWidth) / 2;
    const y = (wall.height - defaultHeight) / 2;

    // Create with 2 nails by default
    const nails = distributeNails(defaultWidth, defaultHeight, 2);

    addObject({
      name: `Object ${Date.now() % 1000}`,
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

  const handleWidthChange = (value: string) => {
    setWidthInput(value);
    if (selectedObject) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue > 0) {
        updateObject(selectedObject.id, { width: toCm(numValue, unit) });
      }
    }
  };

  const handleHeightChange = (value: string) => {
    setHeightInput(value);
    if (selectedObject) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue > 0) {
        updateObject(selectedObject.id, { height: toCm(numValue, unit) });
      }
    }
  };

  const handleNailCountChange = (count: number) => {
    if (selectedObject && count >= 0 && count <= 10) {
      setNailCount(selectedObject.id, count);
    }
  };

  const handleDelete = () => {
    if (selectedObject) {
      removeObject(selectedObject.id);
    }
  };

  const handleDeselect = () => {
    selectObject(null);
  };

  const unitSuffix = unit === 'cm' ? 'cm' : 'in';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Objects</h3>
        <Button size="sm" onClick={handleAddObject}>
          + Add Object
        </Button>
      </div>

      {selectedObject ? (
        <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">Selected Object</span>
            <button
              onClick={handleDeselect}
              className="text-blue-600 text-sm hover:underline"
            >
              Deselect
            </button>
          </div>

          <Input
            label="Name"
            value={nameInput}
            onChange={(e) => handleNameChange(e.target.value)}
          />

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

          {/* Nail configuration */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nail Count</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => handleNailCountChange(count)}
                  className={`
                    flex-1 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px]
                    ${selectedObject?.nails.length === count
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {count}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Drag nails on canvas to adjust positions
            </p>
          </div>

          <Button variant="danger" size="sm" onClick={handleDelete} className="w-full">
            Delete Object
          </Button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Tap an object to select it, or add a new one.
        </p>
      )}
    </div>
  );
}
