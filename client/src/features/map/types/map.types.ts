// src/modules/Map/types/map.types.ts

// Модель слоя
export interface Layer {
  id: number;
  name: string;
  description?: string;
  isVisible: boolean;
  order: number;
  style?: Record<string, any>;
  createdBy?: number;
}

// Модель метки (точки)
export interface Marker {
  id: number;
  name: string;
  description?: string;
  geojson: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties?: Record<string, any>;
  layerId: number;
  createdBy?: number;
}

// Тип для создания/обновления метки (без id, без geojson – используем lng/lat)
export interface MarkerInput {
  name: string;
  description?: string;
  lng: number;
  lat: number;
  layerId: number;
  properties?: Record<string, any>;
}

// Тип для создания/обновления слоя
export type LayerInput = Omit<Layer, 'id'>;

// Состояние сортировки (если понадобится для таблицы слоёв)
export interface SortConfig {
  key: keyof Layer | 'name';
  direction: 'ascending' | 'descending';
}

export interface MapSource {
  id: string;
  name: string;
}

export type DrawingType = 'polyline' | 'polygon' | 'rectangle' | 'circle' | 'text';

export type EditMode = 
  | { kind: 'none' }
  | { kind: 'geometry'; drawingId: number }
  | { kind: 'text'; drawingId: number };


export interface Drawing {
  id: number;
  name: string;
  description?: string;
  type: DrawingType;
  coordinates: any; // для text: [lng, lat]
  style: {
    color?: string;
    weight?: number;
    opacity?: number;
    fillColor?: string;
    fillOpacity?: number;
    fontSize?: number;
    fontFamily?: string;
    rotation?: number;           // угол поворота в градусах (для текста)
    anchorX?: number;
    anchorY?: number;
    backgroundColor?: string;
    backgroundPadding?: number;
    backgroundBorderRadius?: number;
  };
  text?: string;           // дополнительное поле для текстовой надписи
  layerId: number;
  createdBy?: number;
}



export type DrawingInput = Omit<Drawing, 'id'>;