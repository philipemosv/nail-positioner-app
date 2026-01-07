import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppStore, WallObject, Nail } from '../types';
import { DEFAULT_WALL, DEFAULT_UNIT } from '../constants';
import { generateObjectId } from '../utils/coordinates';
import { generateNailId, distributeNails } from '../utils/nailDistribution';

const initialState = {
  wall: DEFAULT_WALL,
  objects: [] as WallObject[],
  selectedObjectId: null as string | null,
  selectedNailId: null as string | null,
  unit: DEFAULT_UNIT,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Wall
      setWallDimensions: (width: number, height: number) =>
        set({ wall: { width, height } }),

      // Objects
      addObject: (objectData) => {
        const newObject: WallObject = {
          ...objectData,
          id: generateObjectId(),
        };
        set((state) => ({
          objects: [...state.objects, newObject],
          selectedObjectId: newObject.id,
        }));
      },

      updateObject: (id, updates) =>
        set((state) => ({
          objects: state.objects.map((obj) =>
            obj.id === id ? { ...obj, ...updates } : obj
          ),
        })),

      removeObject: (id) =>
        set((state) => ({
          objects: state.objects.filter((obj) => obj.id !== id),
          selectedObjectId:
            state.selectedObjectId === id ? null : state.selectedObjectId,
          selectedNailId: null,
        })),

      selectObject: (id) =>
        set({
          selectedObjectId: id,
          selectedNailId: null,
        }),

      // Nails
      addNail: (objectId, nailData) => {
        const newNail: Nail = {
          ...nailData,
          id: generateNailId(),
        };
        set((state) => ({
          objects: state.objects.map((obj) =>
            obj.id === objectId
              ? { ...obj, nails: [...obj.nails, newNail] }
              : obj
          ),
        }));
      },

      updateNail: (objectId, nailId, updates) =>
        set((state) => ({
          objects: state.objects.map((obj) =>
            obj.id === objectId
              ? {
                  ...obj,
                  nails: obj.nails.map((nail) =>
                    nail.id === nailId ? { ...nail, ...updates } : nail
                  ),
                }
              : obj
          ),
        })),

      removeNail: (objectId, nailId) =>
        set((state) => ({
          objects: state.objects.map((obj) =>
            obj.id === objectId
              ? { ...obj, nails: obj.nails.filter((nail) => nail.id !== nailId) }
              : obj
          ),
          selectedNailId:
            state.selectedNailId === nailId ? null : state.selectedNailId,
        })),

      selectNail: (id) => set({ selectedNailId: id }),

      setNailCount: (objectId, count) => {
        const state = get();
        const object = state.objects.find((obj) => obj.id === objectId);
        if (!object) return;

        const newNails = distributeNails(object.width, object.height, count);
        set((state) => ({
          objects: state.objects.map((obj) =>
            obj.id === objectId ? { ...obj, nails: newNails } : obj
          ),
          selectedNailId: null,
        }));
      },

      // Unit
      setUnit: (unit) => set({ unit }),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'nail-positioner-storage',
      partialize: (state) => ({
        wall: state.wall,
        objects: state.objects,
        unit: state.unit,
      }),
    }
  )
);

// Selectors
export const useSelectedObject = () => {
  const objects = useAppStore((state) => state.objects);
  const selectedObjectId = useAppStore((state) => state.selectedObjectId);
  return objects.find((obj) => obj.id === selectedObjectId) ?? null;
};

export const useSelectedNail = () => {
  const selectedObject = useSelectedObject();
  const selectedNailId = useAppStore((state) => state.selectedNailId);
  if (!selectedObject) return null;
  return selectedObject.nails.find((nail) => nail.id === selectedNailId) ?? null;
};
