import { makeAutoObservable, action, runInAction } from 'mobx';
import PhotoService from '../services/PhotoService';
import { CropArea, FaceDetection } from '../types/photo.types';
import {
  BRIGHTNESS_DEFAULT,
  CONTRAST_DEFAULT,
  HIGHLIGHTS_DEFAULT,
  SHADOWS_DEFAULT,
  FACE_HEIGHT_RATIO_DEFAULT,
  FACE_TOP_OFFSET_DEFAULT,
  CROP_PRESETS,
  CropPreset,
  STORAGE_KEY,
} from '../lib/constants';

type SettingsMap = {
  [key in CropPreset]: {
    faceHeightRatio: number;
    faceTopOffset: number;
  };
};

class PhotoStore {
  originalImage: string | null = null;
  editedImage: string | null = null;
  private loadedOriginalImage: string | null = null;
  private loadedOriginalCanvas: HTMLCanvasElement | null = null;

  brightness: number = BRIGHTNESS_DEFAULT;
  contrast: number = CONTRAST_DEFAULT;
  highlights: number = HIGHLIGHTS_DEFAULT;
  shadows: number = SHADOWS_DEFAULT;
  crop: CropArea | null = null;
  faceDetection: FaceDetection | null = null;
  isLoading: boolean = false;
  error: Error | null = null;
  modelsLoaded: boolean = false;

  cropPreset: CropPreset = '320x200';
  faceHeightRatio: number = FACE_HEIGHT_RATIO_DEFAULT;
  faceTopOffset: number = FACE_TOP_OFFSET_DEFAULT;
  isCropped: boolean = false;

  private workingCanvas: HTMLCanvasElement | null = null;
  private originalCanvas: HTMLCanvasElement | null = null;
  private applyTimeout: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadSettingsFromStorage(); // загружаем настройки при создании
    this.loadModels();
  }

  // Загрузка настроек из localStorage
  private loadSettingsFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const settings: SettingsMap = JSON.parse(saved);
        // Применяем сохранённые настройки для текущего пресета
        const current = settings[this.cropPreset];
        if (current) {
          this.faceHeightRatio = current.faceHeightRatio;
          this.faceTopOffset = current.faceTopOffset;
        }
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
    }
  }

  // Сохранение настроек в localStorage
  private saveSettingsToStorage() {
    try {
      // Получаем текущие сохранённые настройки
      let settings: SettingsMap = {};
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        settings = JSON.parse(saved);
      }
      // Обновляем для текущего пресета
      settings[this.cropPreset] = {
        faceHeightRatio: this.faceHeightRatio,
        faceTopOffset: this.faceTopOffset,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
  }

  loadModels = action(async () => {
    try {
      await PhotoService.loadModels();
      runInAction(() => {
        this.modelsLoaded = true;
      });
      console.log('Модели face-api загружены');
    } catch (err) {
      runInAction(() => {
        this.error = new Error('Не удалось загрузить модели распознавания лиц');
        this.modelsLoaded = false;
      });
      console.error('Ошибка загрузки моделей:', err);
    }
  });

  loadImage = action(async (file: File) => {
    this.isLoading = true;
    this.error = null;
    try {
      const dataUrl = await PhotoService.fileToDataURL(file);
      const canvas = await PhotoService.loadImageToCanvas(dataUrl);
      runInAction(() => {
        this.loadedOriginalImage = dataUrl;
        this.loadedOriginalCanvas = canvas;
        this.originalImage = dataUrl;
        this.originalCanvas = canvas;
        this.editedImage = dataUrl;
        this.brightness = BRIGHTNESS_DEFAULT;
        this.contrast = CONTRAST_DEFAULT;
        this.highlights = HIGHLIGHTS_DEFAULT;
        this.shadows = SHADOWS_DEFAULT;
        // Загружаем сохранённые настройки для текущего пресета
        this.loadSettingsFromStorage();
        this.crop = null;
        this.faceDetection = null;
        this.workingCanvas = canvas;
        this.isCropped = false;
      });
    } catch (err) {
      runInAction(() => (this.error = err as Error));
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  });

  setCropPreset = action((preset: CropPreset) => {
    if (this.isCropped) return;
    this.cropPreset = preset;
    // Загружаем сохранённые настройки для выбранного пресета (или дефолтные)
    const savedSettings = this.getSettingsForPreset(preset);
    this.faceHeightRatio = savedSettings.faceHeightRatio;
    this.faceTopOffset = savedSettings.faceTopOffset;
    this.reapplyCropIfNeeded();
  });

  // Получить настройки для пресета (из localStorage или из констант)
  private getSettingsForPreset(preset: CropPreset): {
    faceHeightRatio: number;
    faceTopOffset: number;
  } {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const settings: SettingsMap = JSON.parse(saved);
        if (settings[preset]) {
          return settings[preset];
        }
      }
    } catch (e) {}
    // Если нет сохранённых, берём из дефолтов пресета
    const presetData = CROP_PRESETS[preset];
    return {
      faceHeightRatio: presetData.faceHeightRatio,
      faceTopOffset: presetData.faceTopOffset,
    };
  }

  setFaceHeightRatio = action((val: number) => {
    if (this.isCropped) return;
    this.faceHeightRatio = val;
    this.saveSettingsToStorage(); // сохраняем при изменении
    this.reapplyCropIfNeeded();
  });

  setFaceTopOffset = action((val: number) => {
    if (this.isCropped) return;
    this.faceTopOffset = val;
    this.saveSettingsToStorage();
    this.reapplyCropIfNeeded();
  });

  private reapplyCropIfNeeded = action(async () => {
    if (this.isCropped) return;
    if (this.faceDetection && this.originalCanvas && this.modelsLoaded) {
      await this.applyAutoCropInternal();
    }
  });

  // Внутренний метод применения всех фильтров (без debounce)
  private applyFiltersInternal = action(async () => {
    if (!this.originalCanvas) return;
    this.isLoading = true;
    try {
      let canvas = this.originalCanvas;
      canvas = PhotoService.applyBrightnessContrast(
        canvas,
        this.brightness,
        this.contrast
      );
      canvas = PhotoService.applyHighlightsShadows(
        canvas,
        this.highlights,
        this.shadows
      );
      if (this.crop) {
        canvas = PhotoService.cropImage(canvas, this.crop);
      }
      const dataUrl = PhotoService.canvasToDataURL(canvas);
      runInAction(() => {
        this.editedImage = dataUrl;
        this.workingCanvas = canvas;
      });
    } catch (err) {
      runInAction(() => (this.error = err as Error));
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  });

  applyFilters = action(() => {
    if (this.applyTimeout) {
      clearTimeout(this.applyTimeout);
      this.applyTimeout = null;
    }
    this.applyTimeout = setTimeout(() => {
      this.applyFiltersInternal();
      this.applyTimeout = null;
    }, 150);
  });

  // Setters для слайдеров яркости и т.д.
  setBrightness = action((val: number) => {
    this.brightness = val;
    this.applyFilters();
  });

  setContrast = action((val: number) => {
    this.contrast = val;
    this.applyFilters();
  });

  setHighlights = action((val: number) => {
    this.highlights = val;
    this.applyFilters();
  });

  setShadows = action((val: number) => {
    this.shadows = val;
    this.applyFilters();
  });

  setCrop = action((crop: CropArea | null) => {
    this.crop = crop;
    this.applyFilters();
  });

  autoAdjust = action(async () => {
    if (!this.workingCanvas) return;
    this.isLoading = true;
    try {
      let canvas = this.workingCanvas;
      canvas = PhotoService.autoLevels(canvas);
      const dataUrl = PhotoService.canvasToDataURL(canvas);
      runInAction(() => {
        this.editedImage = dataUrl;
        this.workingCanvas = canvas;
        this.brightness = BRIGHTNESS_DEFAULT;
        this.contrast = CONTRAST_DEFAULT;
        this.highlights = HIGHLIGHTS_DEFAULT;
        this.shadows = SHADOWS_DEFAULT;
        this.originalImage = dataUrl;
        this.originalCanvas = canvas;
      });
    } catch (err) {
      runInAction(() => (this.error = err as Error));
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  });

  private applyAutoCropInternal = action(async () => {
    if (!this.originalImage || !this.faceDetection) return;
    this.isLoading = true;
    try {
      let canvas = this.originalCanvas!;
      canvas = PhotoService.applyBrightnessContrast(
        canvas,
        this.brightness,
        this.contrast
      );
      canvas = PhotoService.applyHighlightsShadows(
        canvas,
        this.highlights,
        this.shadows
      );
      canvas = PhotoService.autoCropFace(
        canvas,
        this.faceDetection,
        this.cropPreset,
        this.faceHeightRatio,
        this.faceTopOffset
      );
      const dataUrl = PhotoService.canvasToDataURL(canvas);
      runInAction(() => {
        this.originalImage = dataUrl;
        this.originalCanvas = canvas;
        this.editedImage = dataUrl;
        this.workingCanvas = canvas;
        this.crop = null;
        this.brightness = BRIGHTNESS_DEFAULT;
        this.contrast = CONTRAST_DEFAULT;
        this.highlights = HIGHLIGHTS_DEFAULT;
        this.shadows = SHADOWS_DEFAULT;
        this.isCropped = true;
      });
    } catch (err) {
      runInAction(() => (this.error = err as Error));
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  });

  autoCrop = action(async () => {
    if (!this.originalImage) {
      this.error = new Error('Нет изображения');
      return;
    }
    if (!this.modelsLoaded) {
      this.error = new Error(
        'Модели распознавания лиц еще не загружены, попробуйте позже'
      );
      return;
    }
    this.isLoading = true;
    try {
      const face = await PhotoService.detectFace(this.originalImage);
      if (!face) {
        runInAction(() => {
          this.error = new Error('Лицо не найдено');
        });
        return;
      }
      runInAction(() => {
        this.faceDetection = face;
      });
      await this.applyAutoCropInternal();
    } catch (err) {
      runInAction(() => (this.error = err as Error));
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  });

  reset = action(() => {
    if (!this.loadedOriginalCanvas) return;
    this.originalImage = this.loadedOriginalImage;
    this.originalCanvas = this.loadedOriginalCanvas;
    this.editedImage = this.loadedOriginalImage;
    this.workingCanvas = this.loadedOriginalCanvas;
    this.brightness = BRIGHTNESS_DEFAULT;
    this.contrast = CONTRAST_DEFAULT;
    this.highlights = HIGHLIGHTS_DEFAULT;
    this.shadows = SHADOWS_DEFAULT;
    // Восстанавливаем сохранённые настройки для текущего пресета
    const saved = this.getSettingsForPreset(this.cropPreset);
    this.faceHeightRatio = saved.faceHeightRatio;
    this.faceTopOffset = saved.faceTopOffset;
    this.crop = null;
    this.faceDetection = null;
    this.isCropped = false;
  });

  save = action(() => {
    if (!this.editedImage) return;
    const link = document.createElement('a');
    link.download = 'edited_image.jpg';
    link.href = this.editedImage;
    link.click();
  });

  clear = action(() => {
    this.originalImage = null;
    this.editedImage = null;
    this.loadedOriginalImage = null;
    this.loadedOriginalCanvas = null;
    this.originalCanvas = null;
    this.workingCanvas = null;
    this.brightness = BRIGHTNESS_DEFAULT;
    this.contrast = CONTRAST_DEFAULT;
    this.highlights = HIGHLIGHTS_DEFAULT;
    this.shadows = SHADOWS_DEFAULT;
    // Удалять из localStorage не будем, но сбросим на дефолты пресета
    const defaults = CROP_PRESETS[this.cropPreset];
    this.faceHeightRatio = defaults.faceHeightRatio;
    this.faceTopOffset = defaults.faceTopOffset;
    this.crop = null;
    this.faceDetection = null;
    this.error = null;
    this.modelsLoaded = false;
    this.cropPreset = '320x200';
    this.isCropped = false;
    // Можно также удалить все настройки из localStorage, если нужно:
    // localStorage.removeItem(STORAGE_KEY);
  });
}

const photoStore = new PhotoStore();
export default photoStore;
