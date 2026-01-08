import { useState, useEffect } from 'react';
import { useAppStore, useSelectedObject } from '../../store/useAppStore';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { fromCm, toCm } from '../../utils/units';
import { constrainNailPosition } from '../../utils/nailDistribution';

export function NailPositionEditor() {
  const unit = useAppStore((state) => state.unit);
  const updateNail = useAppStore((state) => state.updateNail);
  const selectedNailId = useAppStore((state) => state.selectedNailId);
  const selectNail = useAppStore((state) => state.selectNail);
  const setNailCount = useAppStore((state) => state.setNailCount);
  const selectedObject = useSelectedObject();

  const [editingNailId, setEditingNailId] = useState<string | null>(null);
  const [offsetXInput, setOffsetXInput] = useState('');
  const [offsetYInput, setOffsetYInput] = useState('');

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

  // Reset editing state when object selection changes
  useEffect(() => {
    setEditingNailId(null);
  }, [selectedObject?.id]);

  if (!selectedObject) {
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

  const handleOffsetXBlur = () => {
    if (currentNail && selectedObject) {
      const numValue = parseFloat(offsetXInput);
      if (!isNaN(numValue)) {
        const cmValue = toCm(numValue, unit);
        const constrained = constrainNailPosition(
          cmValue,
          currentNail.offsetY,
          selectedObject.width,
          selectedObject.height
        );
        updateNail(selectedObject.id, currentNail.id, { offsetX: constrained.offsetX });
        setOffsetXInput(fromCm(constrained.offsetX, unit).toFixed(1));
      } else {
        setOffsetXInput(fromCm(currentNail.offsetX, unit).toFixed(1));
      }
    }
  };

  const handleOffsetYBlur = () => {
    if (currentNail && selectedObject) {
      const numValue = parseFloat(offsetYInput);
      if (!isNaN(numValue)) {
        const cmValue = toCm(numValue, unit);
        const constrained = constrainNailPosition(
          currentNail.offsetX,
          cmValue,
          selectedObject.width,
          selectedObject.height
        );
        updateNail(selectedObject.id, currentNail.id, { offsetY: constrained.offsetY });
        setOffsetYInput(fromCm(constrained.offsetY, unit).toFixed(1));
      } else {
        setOffsetYInput(fromCm(currentNail.offsetY, unit).toFixed(1));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'x' | 'y') => {
    if (e.key === 'Enter') {
      if (field === 'x') handleOffsetXBlur();
      else handleOffsetYBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleAddHole = () => {
    if (selectedObject) {
      setNailCount(selectedObject.id, selectedObject.nails.length + 1);
    }
  };

  const handleRemoveHole = () => {
    if (selectedObject && selectedObject.nails.length > 1) {
      setNailCount(selectedObject.id, selectedObject.nails.length - 1);
    }
  };

  const unitSuffix = unit === 'cm' ? 'cm' : 'in';
  const activeNailId = editingNailId || selectedNailId;

  const cardStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '16px',
    borderRadius: '8px',
    border: `2px solid ${isActive ? '#60a5fa' : '#e5e7eb'}`,
    backgroundColor: isActive ? '#eff6ff' : 'white',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Hole Position Header */}
      <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280' }}>
        Hole Position (From Frame Top-Left)
      </h3>

      {/* Nail/Hole list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {selectedObject.nails.map((nail, index) => (
          <div
            key={nail.id}
            style={cardStyle(activeNailId === nail.id)}
            onClick={() => handleNailSelect(nail.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Hole {index + 1}</span>
              {selectedObject.nails.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveHole();
                  }}
                  style={{ color: '#9ca3af', background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
                >
                  <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {activeNailId === nail.id && currentNail && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    label="X"
                    type="number"
                    value={offsetXInput}
                    onChange={(e) => setOffsetXInput(e.target.value)}
                    onBlur={handleOffsetXBlur}
                    onKeyDown={(e) => handleKeyDown(e, 'x')}
                    onClick={(e) => e.stopPropagation()}
                    suffix={unitSuffix}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Input
                    label="Y"
                    type="number"
                    value={offsetYInput}
                    onChange={(e) => setOffsetYInput(e.target.value)}
                    onBlur={handleOffsetYBlur}
                    onKeyDown={(e) => handleKeyDown(e, 'y')}
                    onClick={(e) => e.stopPropagation()}
                    suffix={unitSuffix}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Hole Button */}
      <Button variant="secondary" onClick={handleAddHole} style={{ width: '100%' }}>
        Add Hole
      </Button>
    </div>
  );
}
