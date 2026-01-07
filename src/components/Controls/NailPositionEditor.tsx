import { useState, useEffect } from 'react';
import { useAppStore, useSelectedObject } from '../../store/useAppStore';
import { Input } from '../UI/Input';
import { fromCm, toCm } from '../../utils/units';
import { constrainNailPosition } from '../../utils/nailDistribution';

export function NailPositionEditor() {
  const unit = useAppStore((state) => state.unit);
  const updateNail = useAppStore((state) => state.updateNail);
  const selectedNailId = useAppStore((state) => state.selectedNailId);
  const selectNail = useAppStore((state) => state.selectNail);
  const selectedObject = useSelectedObject();

  const [editingNailId, setEditingNailId] = useState<string | null>(null);
  const [offsetXInput, setOffsetXInput] = useState('');
  const [offsetYInput, setOffsetYInput] = useState('');

  // Find the currently selected or editing nail
  const currentNail = selectedObject?.nails.find(
    (n) => n.id === (editingNailId || selectedNailId)
  );

  // Sync inputs when nail selection changes
  useEffect(() => {
    if (currentNail) {
      setOffsetXInput(fromCm(currentNail.offsetX, unit).toFixed(1));
      setOffsetYInput(fromCm(currentNail.offsetY, unit).toFixed(1));
    }
  }, [currentNail, unit]);

  if (!selectedObject || selectedObject.nails.length === 0) {
    return null;
  }

  const handleNailSelect = (nailId: string) => {
    setEditingNailId(nailId);
    selectNail(nailId);
    const nail = selectedObject.nails.find((n) => n.id === nailId);
    if (nail) {
      setOffsetXInput(fromCm(nail.offsetX, unit).toFixed(1));
      setOffsetYInput(fromCm(nail.offsetY, unit).toFixed(1));
    }
  };

  const handleOffsetXChange = (value: string) => {
    setOffsetXInput(value);
    if (currentNail && selectedObject) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const cmValue = toCm(numValue, unit);
        const constrained = constrainNailPosition(
          cmValue,
          currentNail.offsetY,
          selectedObject.width,
          selectedObject.height
        );
        updateNail(selectedObject.id, currentNail.id, { offsetX: constrained.offsetX });
      }
    }
  };

  const handleOffsetYChange = (value: string) => {
    setOffsetYInput(value);
    if (currentNail && selectedObject) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const cmValue = toCm(numValue, unit);
        const constrained = constrainNailPosition(
          currentNail.offsetX,
          cmValue,
          selectedObject.width,
          selectedObject.height
        );
        updateNail(selectedObject.id, currentNail.id, { offsetY: constrained.offsetY });
      }
    }
  };

  const unitSuffix = unit === 'cm' ? 'cm' : 'in';
  const activeNailId = editingNailId || selectedNailId;

  return (
    <div className="space-y-2 mt-3 pt-3 border-t border-blue-200">
      <label className="text-sm font-medium text-gray-700">
        Nail Position (from object edge)
      </label>

      {/* Nail selector */}
      <div className="flex gap-1 flex-wrap">
        {selectedObject.nails.map((nail, index) => (
          <button
            key={nail.id}
            onClick={() => handleNailSelect(nail.id)}
            className={`
              px-3 py-1.5 rounded text-xs font-medium transition-colors min-h-[32px]
              ${activeNailId === nail.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            Nail {index + 1}
          </button>
        ))}
      </div>

      {/* Position inputs */}
      {currentNail && (
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="From Left"
            type="number"
            value={offsetXInput}
            onChange={(e) => handleOffsetXChange(e.target.value)}
            suffix={unitSuffix}
            min="0"
            max={fromCm(selectedObject.width, unit).toString()}
            step="0.1"
          />
          <Input
            label="From Top"
            type="number"
            value={offsetYInput}
            onChange={(e) => handleOffsetYChange(e.target.value)}
            suffix={unitSuffix}
            min="0"
            max={fromCm(selectedObject.height, unit).toString()}
            step="0.1"
          />
        </div>
      )}

      <p className="text-xs text-gray-500">
        Position relative to object's top-left corner
      </p>
    </div>
  );
}
