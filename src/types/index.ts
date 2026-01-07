export type Unit = 'cm' | 'inch';

export interface Nail {
  id: string;
  offsetX: number; // Distance from object's left edge (cm)
  offsetY: number; // Distance from object's top edge (cm)
}

export interface WallObject {
  id: string;
  name: string;
  width: number;  // cm
  height: number; // cm
  x: number;      // Position from wall's left edge (cm)
  y: number;      // Position from wall's top edge (cm)
  nails: Nail[];
}

export interface Wall {
  width: number;  // cm
  height: number; // cm
}

export interface AppState {
  wall: Wall;
  objects: WallObject[];
  selectedObjectId: string | null;
  selectedNailId: string | null;
  unit: Unit;
}

export interface AppActions {
  // Wall
  setWallDimensions: (width: number, height: number) => void;

  // Objects
  addObject: (object: Omit<WallObject, 'id'>) => void;
  updateObject: (id: string, updates: Partial<Omit<WallObject, 'id'>>) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;

  // Nails
  addNail: (objectId: string, nail: Omit<Nail, 'id'>) => void;
  updateNail: (objectId: string, nailId: string, updates: Partial<Omit<Nail, 'id'>>) => void;
  removeNail: (objectId: string, nailId: string) => void;
  selectNail: (id: string | null) => void;
  setNailCount: (objectId: string, count: number) => void;

  // Unit
  setUnit: (unit: Unit) => void;

  // Reset
  reset: () => void;
}

export type AppStore = AppState & AppActions;
