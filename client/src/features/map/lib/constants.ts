// src/modules/Map/lib/constants.ts

export const DEFAULT_CENTER: [number, number] = [63.68486758859899, 57.350907325744636]; // центр вашего тайла (Вуктыл)
export const DEFAULT_ZOOM = 17;
export const MIN_ZOOM = 10;
export const MAX_ZOOM = 20;

// Цвета маркеров для разных типов (можно расширить)
export const MARKER_COLORS = {
  default: 'blue',
  important: 'red',
  info: 'green',
};

// Стили слоёв по умолчанию (можно использовать для кастомизации)
export const DEFAULT_LAYER_STYLE = {
  color: '#3388ff',
  weight: 2,
  opacity: 0.7,
};

export const LAYER_PRESETS = [
  { name: 'Объекты', color: '#3388ff' },
  { name: 'Дороги', color: '#ff6633' },
];

export const MAP_ICONS: Record<string, string> = {
  'ks3': '/icons/google.png',      // пример: иконка для карты ks3-2
  'ks3-2': '/icons/arcgis.png',    // иконка для другой карты
  // добавьте другие соответствия

};