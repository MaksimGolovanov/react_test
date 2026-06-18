// src/modules/Map/store/MapStore.ts
import { makeAutoObservable, runInAction } from 'mobx'; // убран неиспользуемый 'action'
import MapService from '../services/MapService';
import { Layer, Marker, MarkerInput, LayerInput, Drawing, DrawingInput } from '../types/map.types';

class MapStore {
  layers: Layer[] = [];
  markers: Marker[] = [];
  layersLoading = false;
  markersLoading = false;
  layersError: string | null = null;
  markersError: string | null = null;
  selectedLayerId: number | null = null;
  drawings: Drawing[] = [];
  drawingsLoading = false;
  drawingsError: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchLayers() {
    this.layersLoading = true;
    this.layersError = null;
    try {
      const data = await MapService.fetchLayers();
      runInAction(() => {
        this.layers = data;
      });
    } catch (err) {
      runInAction(() => {
        this.layersError = err instanceof Error ? err.message : 'Ошибка загрузки слоёв';
      });
    } finally {
      runInAction(() => {
        this.layersLoading = false;
      });
    }
  }

  async fetchMarkers(layerId?: number) {
    this.markersLoading = true;
    this.markersError = null;
    try {
      const data = await MapService.fetchMarkers(layerId);
      runInAction(() => {
        this.markers = data;
      });
    } catch (err) {
      runInAction(() => {
        this.markersError = err instanceof Error ? err.message : 'Ошибка загрузки меток';
      });
    } finally {
      runInAction(() => {
        this.markersLoading = false;
      });
    }
  }

  async createLayer(data: LayerInput) {
    try {
      const newLayer = await MapService.createLayer(data);
      runInAction(() => {
        this.layers = [...this.layers, newLayer];
      });
      return newLayer;
    } catch (err) {
      runInAction(() => {
        this.layersError = err instanceof Error ? err.message : 'Ошибка создания слоя';
      });
      throw err;
    }
  }

  async updateLayer(id: number, data: Partial<LayerInput>) {
    try {
      const updated = await MapService.updateLayer(id, data);
      runInAction(() => {
        this.layers = this.layers.map(l => l.id === id ? updated : l);
      });
      return updated;
    } catch (err) {
      runInAction(() => {
        this.layersError = err instanceof Error ? err.message : 'Ошибка обновления слоя';
      });
      throw err;
    }
  }

  async deleteLayer(id: number) {
    try {
      await MapService.deleteLayer(id);
      runInAction(() => {
        this.layers = this.layers.filter(l => l.id !== id);
        this.markers = this.markers.filter(m => m.layerId !== id);
        if (this.selectedLayerId === id) this.selectedLayerId = null;
      });
    } catch (err) {
      runInAction(() => {
        this.layersError = err instanceof Error ? err.message : 'Ошибка удаления слоя';
      });
      throw err;
    }
  }

  async createMarker(data: MarkerInput) {
    try {
      const newMarker = await MapService.createMarker(data);
      runInAction(() => {
        this.markers = [...this.markers, newMarker];
      });
      return newMarker;
    } catch (err) {
      runInAction(() => {
        this.markersError = err instanceof Error ? err.message : 'Ошибка создания метки';
      });
      throw err;
    }
  }

  async updateMarker(id: number, data: Partial<MarkerInput>) {
    try {
      const updated = await MapService.updateMarker(id, data);
      runInAction(() => {
        this.markers = this.markers.map(m => m.id === id ? updated : m);
      });
      return updated;
    } catch (err) {
      runInAction(() => {
        this.markersError = err instanceof Error ? err.message : 'Ошибка обновления метки';
      });
      throw err;
    }
  }

  async deleteMarker(id: number) {
    try {
      await MapService.deleteMarker(id);
      runInAction(() => {
        this.markers = this.markers.filter(m => m.id !== id);
      });
    } catch (err) {
      runInAction(() => {
        this.markersError = err instanceof Error ? err.message : 'Ошибка удаления метки';
      });
      throw err;
    }
  }

  setSelectedLayerId(id: number | null) {
    this.selectedLayerId = id;
  }

  async fetchDrawings(layerId?: number) {
    this.drawingsLoading = true;
    this.drawingsError = null;
    try {
      const data = await MapService.fetchDrawings(layerId);
      runInAction(() => { this.drawings = data; });
    } catch (err) {
      runInAction(() => { this.drawingsError = err instanceof Error ? err.message : 'Ошибка загрузки рисунков'; });
    } finally {
      runInAction(() => { this.drawingsLoading = false; });
    }
  }

  async createDrawing(data: DrawingInput) {
    try {
      const newDrawing = await MapService.createDrawing(data);
      runInAction(() => { this.drawings = [...this.drawings, newDrawing]; });
      return newDrawing;
    } catch (err) {
      runInAction(() => { this.drawingsError = err instanceof Error ? err.message : 'Ошибка создания рисунка'; });
      throw err;
    }
  }

  async updateDrawing(id: number, data: Partial<DrawingInput>) {
    try {
      const updated = await MapService.updateDrawing(id, data);
      runInAction(() => { this.drawings = this.drawings.map(d => d.id === id ? updated : d); });
      return updated;
    } catch (err) {
      runInAction(() => { this.drawingsError = err instanceof Error ? err.message : 'Ошибка обновления рисунка'; });
      throw err;
    }
  }

  async deleteDrawing(id: number) {
    try {
      await MapService.deleteDrawing(id);
      runInAction(() => { this.drawings = this.drawings.filter(d => d.id !== id); });
    } catch (err) {
      runInAction(() => { this.drawingsError = err instanceof Error ? err.message : 'Ошибка удаления рисунка'; });
      throw err;
    }
  }
}

// Создаём экземпляр и экспортируем его, чтобы избежать предупреждения import/no-anonymous-default-export
const mapStoreInstance = new MapStore();
export default mapStoreInstance;