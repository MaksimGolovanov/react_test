// src/modules/Map/services/MapService.ts

import axios from 'axios';
import { Layer, Marker, MarkerInput, LayerInput, MapSource, Drawing, DrawingInput } from '../types/map.types';

const API_URL = process.env.REACT_APP_API_URL;

class MapService {
  // ----- Слои -----
  static async fetchLayers(): Promise<Layer[]> {
    const response = await axios.get<Layer[]>(`${API_URL}api/map/layers`);
    return response.data;
  }

  static async createLayer(data: LayerInput): Promise<Layer> {
    const response = await axios.post<Layer>(`${API_URL}api/map/layers`, data);
    return response.data;
  }

  static async updateLayer(id: number, data: Partial<LayerInput>): Promise<Layer> {
    const response = await axios.put<Layer>(`${API_URL}api/map/layers/${id}`, data);
    return response.data;
  }

  static async deleteLayer(id: number): Promise<void> {
    await axios.delete(`${API_URL}api/map/layers/${id}`);
  }

  // ----- Метки -----
  static async fetchMarkers(layerId?: number): Promise<Marker[]> {
    const url = layerId ? `${API_URL}api/map/markers?layerId=${layerId}` : `${API_URL}api/map/markers`;
    const response = await axios.get<Marker[]>(url);
    return response.data;
  }

  static async createMarker(data: MarkerInput): Promise<Marker> {
    const response = await axios.post<Marker>(`${API_URL}api/map/markers`, data);
    return response.data;
  }

  static async updateMarker(id: number, data: Partial<MarkerInput>): Promise<Marker> {
    const response = await axios.put<Marker>(`${API_URL}api/map/markers/${id}`, data);
    return response.data;
  }

  static async deleteMarker(id: number): Promise<void> {
    await axios.delete(`${API_URL}api/map/markers/${id}`);
  }
  static async fetchMapSources(): Promise<MapSource[]> {
    const response = await axios.get<MapSource[]>(`${API_URL}api/maps`);
    return response.data;
  }

  static async fetchDrawings(layerId?: number): Promise<Drawing[]> {
    const url = layerId ? `${API_URL}api/map/drawings?layerId=${layerId}` : `${API_URL}api/map/drawings`;
    const response = await axios.get<Drawing[]>(url);
    return response.data;
  }

  static async createDrawing(data: DrawingInput): Promise<Drawing> {
    const response = await axios.post<Drawing>(`${API_URL}api/map/drawings`, data);
    return response.data;
  }

  static async updateDrawing(id: number, data: Partial<DrawingInput>): Promise<Drawing> {
    console.log('🔵 updateDrawing request:', data);
    const response = await axios.put<Drawing>(`${API_URL}api/map/drawings/${id}`, data);
    console.log('🟢 updateDrawing response:', response.data);
    return response.data;
  }

  static async deleteDrawing(id: number): Promise<void> {
    await axios.delete(`${API_URL}api/map/drawings/${id}`);
  }




}

export default MapService;