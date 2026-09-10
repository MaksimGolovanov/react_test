// Диапазоны и целевые размеры
export const BRIGHTNESS_MIN = 0;
export const BRIGHTNESS_MAX = 200;
export const BRIGHTNESS_DEFAULT = 100;

export const CONTRAST_MIN = 0;
export const CONTRAST_MAX = 200;
export const CONTRAST_DEFAULT = 100;

export const HIGHLIGHTS_MIN = 0;
export const HIGHLIGHTS_MAX = 200;
export const HIGHLIGHTS_DEFAULT = 100;

export const SHADOWS_MIN = 0;
export const SHADOWS_MAX = 200;
export const SHADOWS_DEFAULT = 100;

// Размеры пресетов
export const TARGET_WIDTH_320 = 320;
export const TARGET_HEIGHT_200 = 200;
export const TARGET_WIDTH_146 = 146;
export const TARGET_HEIGHT_194 = 194;

// Диапазоны для ручной настройки обрезки
export const FACE_HEIGHT_RATIO_MIN = 0.3;
export const FACE_HEIGHT_RATIO_MAX = 0.8;
export const FACE_HEIGHT_RATIO_DEFAULT = 0.6;

export const FACE_TOP_OFFSET_MIN = 0.1;
export const FACE_TOP_OFFSET_MAX = 0.4;
export const FACE_TOP_OFFSET_DEFAULT = 0.25;

// Тип данных для пресета
export interface CropPresetData {
  width: number;
  height: number;
  faceHeightRatio: number;
  faceTopOffset: number;
}

// Пресеты для автообрезки
export const CROP_PRESETS: Record<string, CropPresetData> = {
  '320x200': {
    width: TARGET_WIDTH_320,
    height: TARGET_HEIGHT_200,
    faceHeightRatio: 0.6,
    faceTopOffset: 0.25,
  },
  '146x194': {
    width: TARGET_WIDTH_146,
    height: TARGET_HEIGHT_194,
    faceHeightRatio: 0.7,
    faceTopOffset: 0.2,
  },
};

export type CropPreset = keyof typeof CROP_PRESETS;

// Ключ для localStorage
export const STORAGE_KEY = 'photoEditorSettings';

// Сообщения
export const MSG = {
  UPLOAD_SUCCESS: 'Изображение загружено',
  SAVE_SUCCESS: 'Изображение сохранено',
  FACE_DETECTED: 'Лицо обнаружено, автообрезка выполнена',
  FACE_NOT_FOUND: 'Лицо не найдено, попробуйте другую фотографию',
  PROCESSING: 'Обработка...',
};