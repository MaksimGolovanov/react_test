// src/modules/Map/pages/map.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Alert, Skeleton, message } from 'antd';
import { MapContainer, TileLayer, ScaleControl, useMapEvents } from 'react-leaflet';
import 'leaflet-rotate';
import 'leaflet/dist/leaflet.css';
import 'leaflet-editable';
import L from 'leaflet';
import mapStore from '../store/MapStore';
import MapService from '../services/MapService';
import MapHeader from '../ui/MapHeader/MapHeader';
import LayerModal from '../ui/LayerModal/LayerModal';
import MarkerModal from '../ui/MarkerModal/MarkerModal';
import DrawingModal from '../ui/DrawingModal/DrawingModal';
import UnifiedControls from '../ui/UnifiedControls/UnifiedControls';
import CoordinatesDisplay from '../ui/CoordinatesDisplay/CoordinatesDisplay';
import SidebarTree from '../ui/SidebarTree/SidebarTree';
import MarkersLayer from '../components/MarkersLayer';
import EditableDrawingsLayer, { EditableDrawingsLayerRef } from '../components/EditableDrawingsLayer';
import CanvasTextLayer from '../components/CanvasTextLayer';
import { Drawing, EditMode, Layer } from '../types/map.types';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from '../lib/constants';
import styles from './style.module.css';

interface MapSource {
  id: string;
  name: string;
}

const AddMarkerClickHandler: React.FC<{
  isActive: boolean;
  onAddMarker: (coords: { lng: number; lat: number }) => void;
}> = ({ isActive, onAddMarker }) => {
  useMapEvents({
    click: (e) => {
      if (isActive) {
        onAddMarker({ lng: e.latlng.lng, lat: e.latlng.lat });
      }
    },
  });
  return null;
};

const MapPage: React.FC = observer(() => {
  const { layers, markers, drawings, layersLoading, layersError, markersError, selectedLayerId } = mapStore;

  const [layerModalVisible, setLayerModalVisible] = useState(false);
  const [editingLayer, setEditingLayer] = useState<any>(null);
  const [markerModalVisible, setMarkerModalVisible] = useState(false);
  const [editingMarker, setEditingMarker] = useState<any>(null);
  const [drawingModalVisible, setDrawingModalVisible] = useState(false);
  const [editingDrawing, setEditingDrawing] = useState<Drawing | null>(null);

  const [visibleLayers, setVisibleLayers] = useState<Record<number, boolean>>({});
  const [isAddMarkerMode, setIsAddMarkerMode] = useState(false);
  const [pendingMarkerCoords, setPendingMarkerCoords] = useState<{ lng: number; lat: number } | null>(null);

  const [tileSources, setTileSources] = useState<MapSource[]>([]);
  const [currentTileSourceId, setCurrentTileSourceId] = useState<string>('');

  const [editMode, setEditMode] = useState<EditMode>({ kind: 'none' });
  const [originalGeometry, setOriginalGeometry] = useState<any>(null);

  const VISIBLE_LAYERS_KEY = 'map_visible_layers';

  const mapRef = useRef<L.Map | null>(null);
  const editableDrawingsLayerRef = useRef<EditableDrawingsLayerRef>(null);

  // Загрузка сохранённых настроек видимости слоёв
  const loadVisibleLayersFromStorage = useCallback((layersList: Layer[]): Record<number, boolean> => {
    const saved = localStorage.getItem(VISIBLE_LAYERS_KEY);
    if (!saved) {
      // По умолчанию все слои невидимы
      return layersList.reduce((acc, layer) => {
        acc[layer.id] = false;
        return acc;
      }, {} as Record<number, boolean>);
    }
    try {
      const parsed = JSON.parse(saved) as Record<number, boolean>;
      const result: Record<number, boolean> = {};
      layersList.forEach(layer => {
        // Если есть сохранённое значение – используем его, иначе false
        result[layer.id] = parsed[layer.id] !== undefined ? parsed[layer.id] : false;
      });
      return result;
    } catch {
      return layersList.reduce((acc, layer) => {
        acc[layer.id] = false;
        return acc;
      }, {} as Record<number, boolean>);
    }
  }, []);

  useEffect(() => {
    mapStore.fetchLayers();
    mapStore.fetchMarkers();
    mapStore.fetchDrawings();
  }, []);

  useEffect(() => {
    MapService.fetchMapSources()
      .then(sources => {
        setTileSources(sources);
        if (sources.length > 0) {
          const saved = localStorage.getItem('preferredTileSourceId');
          const exists = sources.some(s => s.id === saved);
          const initialId = exists ? saved! : sources[0].id;
          setCurrentTileSourceId(initialId);
        }
      })
      .catch(err => {
        console.error('Ошибка загрузки списка карт:', err);
        message.error('Не удалось загрузить список карт');
      });
  }, []);

  // Инициализация visibleLayers с учётом сохранённых настроек
  useEffect(() => {
    if (layers.length) {
      const initial = loadVisibleLayersFromStorage(layers);
      setVisibleLayers(initial);
    }
  }, [layers, loadVisibleLayersFromStorage]);

  // Сохранение настроек при изменении
  useEffect(() => {
    if (Object.keys(visibleLayers).length > 0) {
      localStorage.setItem(VISIBLE_LAYERS_KEY, JSON.stringify(visibleLayers));
    }
  }, [visibleLayers]);

  // Инициализация leaflet-editable
  useEffect(() => {
    if (mapRef.current && !(mapRef.current as any).editTools) {
      try {
        (mapRef.current as any).editTools = new L.Editable(mapRef.current, {});
      } catch (err) {
        console.warn('L.Editable already initialized or error:', err);
      }
    }
  }, [mapRef.current]);

  const toggleLayerVisibility = (layerId: number, visible: boolean) => {
    setVisibleLayers(prev => ({ ...prev, [layerId]: visible }));
  };

  const handleAddLayer = () => {
    setEditingLayer(null);
    setLayerModalVisible(true);
  };

  const handleEditLayer = () => {
    const layer = layers.find(l => l.id === selectedLayerId);
    if (layer) {
      setEditingLayer(layer);
      setLayerModalVisible(true);
    } else {
      message.warning('Слой не найден');
    }
  };

  const handleDeleteCurrent = async () => {
    if (editMode.kind === 'none') return;
    const drawingId = editMode.drawingId;
    try {
      await mapStore.deleteDrawing(drawingId);
      setEditMode({ kind: 'none' });
      setOriginalGeometry(null);
      message.success('Объект удалён');
    } catch (err) {
      message.error('Ошибка удаления');
    }
  };

  const handleEditProperties = () => {
    if (editMode.kind === 'none') return;
    const drawing = drawings.find(d => d.id === editMode.drawingId);
    if (drawing) {
      setEditingDrawing(drawing);
      setDrawingModalVisible(true);
    }
  };

  const handleSaveEdit = async () => {
    if (editMode.kind === 'geometry') {
      if (editableDrawingsLayerRef.current) {
        await editableDrawingsLayerRef.current.saveCurrentGeometry(editMode.drawingId);
      }
      setOriginalGeometry(null);
      message.success('Изменения сохранены');
    } else if (editMode.kind === 'text') {
      setEditMode({ kind: 'none' });
      message.success('Редактирование текста завершено');
    }
  };

  const handleCancelEdit = async () => {
    if (editMode.kind === 'geometry') {
      if (editableDrawingsLayerRef.current) {
        editableDrawingsLayerRef.current.cancelEditing(editMode.drawingId);
      }
      setEditMode({ kind: 'none' });
      setOriginalGeometry(null);
      message.info('Изменения отменены');
    } else if (editMode.kind === 'text') {
      setEditMode({ kind: 'none' });
    }
  };

  const onLayerSuccess = () => {
    setLayerModalVisible(false);
    setEditingLayer(null);
    mapStore.fetchLayers();
  };

  const handleMarkerClick = (marker: any) => {
    setEditingMarker(marker);
    setMarkerModalVisible(true);
  };

  const handleDrawingClick = (drawing: Drawing) => {
    setEditingDrawing(drawing);
    setDrawingModalVisible(true);
  };

  const handleDrawingChange = async (drawingId: number, newCoordinates: any) => {
    try {
      await mapStore.updateDrawing(drawingId, { coordinates: newCoordinates } as any);
      message.success('Изменения сохранены');
    } catch (err) {
      message.error('Ошибка обновления фигуры');
    }
  };

  const handleStartEditText = (id: number) => {
    const drawing = drawings.find(d => d.id === id);
    if (drawing) {
      mapStore.setSelectedLayerId(drawing.layerId);
    }
    setEditMode({ kind: 'text', drawingId: id });
    message.info('Режим редактирования текста: перетаскивайте маркеры');
  };

  const handleUpdateText = async (id: number, newLngLat: [number, number], newRotation: number) => {
    const drawing = drawings.find(d => d.id === id);
    if (!drawing) return;
    try {
      await mapStore.updateDrawing(id, {
        coordinates: newLngLat,
        style: { ...drawing.style, rotation: newRotation },
      } as any);
      await mapStore.fetchDrawings();
    } catch (err) {
      message.error('Ошибка обновления текста');
    }
  };

  const handleStopEditText = () => {
    setEditMode({ kind: 'none' });
  };

  const handleDoubleClickText = (drawing: Drawing) => {
    mapStore.setSelectedLayerId(drawing.layerId);
    setEditingDrawing(drawing);
    setDrawingModalVisible(true);
  };

  const handleMapClickForAddMarker = useCallback((coords: { lng: number; lat: number }) => {
    if (!selectedLayerId) {
      message.warning('Сначала выберите слой для добавления меток');
      setIsAddMarkerMode(false);
      return;
    }
    setPendingMarkerCoords(coords);
    setMarkerModalVisible(true);
    setIsAddMarkerMode(false);
  }, [selectedLayerId]);

  const onMarkerSuccess = () => {
    setMarkerModalVisible(false);
    setEditingMarker(null);
    setPendingMarkerCoords(null);
    setIsAddMarkerMode(false);
    mapStore.fetchMarkers();
  };

  const onMarkerCancel = () => {
    setMarkerModalVisible(false);
    setEditingMarker(null);
    setPendingMarkerCoords(null);
    setIsAddMarkerMode(false);
  };

  const onDrawingSuccess = () => {
    setDrawingModalVisible(false);
    setEditingDrawing(null);
    mapStore.fetchDrawings();
  };

  const onDrawingCancel = () => {
    setDrawingModalVisible(false);
    setEditingDrawing(null);
  };

  const handleSelectMarker = (marker: any) => {
    if (!marker?.geojson?.coordinates) return;
    const [lng, lat] = marker.geojson.coordinates;
    mapRef.current?.flyTo([lat, lng], 16, { duration: 1.0 });
  };

  const handleSelectDrawing = (drawing: Drawing) => {
    if (!mapRef.current) return;
    let center: [number, number] | null = null;
    if (drawing.type === 'circle') {
      const [lng, lat] = drawing.coordinates.center;
      center = [lat, lng];
    } else if (drawing.type === 'rectangle') {
      const [[lng1, lat1], [lng2, lat2]] = drawing.coordinates;
      center = [(lat1 + lat2) / 2, (lng1 + lng2) / 2];
    } else if (drawing.type === 'polyline' || drawing.type === 'polygon') {
      const coords = drawing.coordinates;
      if (coords.length) {
        const sumLat = coords.reduce((s: number, p: number[]) => s + p[1], 0);
        const sumLng = coords.reduce((s: number, p: number[]) => s + p[0], 0);
        center = [sumLat / coords.length, sumLng / coords.length];
      }
    }
    if (center) {
      mapRef.current.flyTo(center, 17, { duration: 1.0 });
    }
  };

  const enableAddMarkerMode = () => {
    if (!selectedLayerId) {
      message.warning('Сначала выберите слой для добавления меток');
      return;
    }
    setIsAddMarkerMode(true);
    message.info('Режим добавления меток активирован. Кликните по карте для установки метки.');
  };

  const handleEditDrawingFromSidebarOrMap = (drawing: Drawing) => {
    if (drawing.type !== 'text') {
      setOriginalGeometry(JSON.parse(JSON.stringify(drawing.coordinates)));
      setEditMode({ kind: 'geometry', drawingId: drawing.id });
      message.info('Режим редактирования фигуры активирован');
    } else {
      setEditMode({ kind: 'text', drawingId: drawing.id });
      message.info('Режим редактирования текста активирован');
    }
  };

  const disableAddMarkerMode = () => {
    setIsAddMarkerMode(false);
  };

  const handleSwitchTileSource = (sourceId: string) => {
    setCurrentTileSourceId(sourceId);
    localStorage.setItem('preferredTileSourceId', sourceId);
  };

  if (layersError || markersError) {
    return <Alert message="Ошибка загрузки" description={layersError || markersError} type="error" showIcon />;
  }

  if (layersLoading && !layers.length) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  const tileUrl = currentTileSourceId ? `/tiles/${currentTileSourceId}/{z}/{x}/{y}.png` : '';

  return (
    <div className={styles.container}>
      <MapHeader
        onAddLayer={handleAddLayer}
        onEditLayer={handleEditLayer}
        onAddMarker={enableAddMarkerMode}
        isAddMarkerMode={isAddMarkerMode}
        onCancelAddMarkerMode={disableAddMarkerMode}
        tileSources={tileSources}
        currentTileSourceId={currentTileSourceId}
        onSwitchTileSource={handleSwitchTileSource}
        selectedLayerId={selectedLayerId}
      />
      <div className={styles.mapLayout}>
        <div className={styles.userListScroll}>
          <SidebarTree
            selectedLayerId={selectedLayerId}
            onSelectLayer={(id) => mapStore.setSelectedLayerId(id)}
            onSelectMarker={handleSelectMarker}
            onSelectDrawing={handleSelectDrawing}
            visibleLayers={visibleLayers}
            onToggleLayerVisibility={toggleLayerVisibility}
            onEditDrawing={handleEditDrawingFromSidebarOrMap}
            editMode={editMode}
          />
        </div>

        <div className={styles.mapWrapper}>
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            zoomControl={false}
            attributionControl={false}
            zoomAnimation={false}
            editable={true}
            rotate={true}
            rotateControl={false}
            style={{ height: '800px', width: '100%', backgroundColor: '#1a1a1a' }}
            ref={mapRef}
            className={isAddMarkerMode ? styles.addMarkerCursor : ''}
          >
            {tileUrl && (
              <TileLayer
                key={currentTileSourceId}
                url={tileUrl}
              />
            )}
            <CanvasTextLayer
              drawings={drawings.filter(d => d.type === 'text' && visibleLayers[d.layerId])}
              editMode={editMode}
              onStartEditText={handleStartEditText}
              onUpdateText={handleUpdateText}
              onStopEdit={handleStopEditText}
              onEditTextProperties={handleDoubleClickText}
            />
            <ScaleControl position="bottomleft" />
            <UnifiedControls
              editMode={editMode}
              setEditMode={setEditMode}
              onDeleteCurrent={handleDeleteCurrent}
              onEditProperties={handleEditProperties}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              selectedLayerId={selectedLayerId}
            />
            <CoordinatesDisplay />

            <AddMarkerClickHandler
              isActive={isAddMarkerMode}
              onAddMarker={handleMapClickForAddMarker}
            />

            {layers.map(layer => {
              if (!visibleLayers[layer.id]) return null;
              const layerMarkers = markers.filter(m => m.layerId === layer.id);
              const layerDrawings = drawings.filter(d => d.layerId === layer.id && d.type !== 'text');
              return (
                <React.Fragment key={layer.id}>
                  <MarkersLayer markers={layerMarkers} onMarkerClick={handleMarkerClick} />
                  <EditableDrawingsLayer
                    key={editMode.kind === 'geometry' ? `editing-${editMode.drawingId}` : 'none'}
                    ref={editableDrawingsLayerRef}
                    drawings={layerDrawings}
                    editMode={editMode}
                    onDrawingChange={handleDrawingChange}
                    onDrawingClick={handleDrawingClick}
                    onEditDrawingFromMap={handleEditDrawingFromSidebarOrMap}
                    onEditSaved={() => setEditMode({ kind: 'none' })}
                  />
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>
      </div>

      <LayerModal visible={layerModalVisible} layer={editingLayer} onCancel={() => setLayerModalVisible(false)} onSuccess={onLayerSuccess} />
      <MarkerModal
        visible={markerModalVisible}
        marker={editingMarker}
        defaultLngLat={pendingMarkerCoords}
        onCancel={onMarkerCancel}
        onSuccess={onMarkerSuccess}
      />
      <DrawingModal
        visible={drawingModalVisible}
        drawing={editingDrawing}
        initialData={null}
        onCancel={onDrawingCancel}
        onSuccess={onDrawingSuccess}
      />
    </div>
  );
});

export default MapPage;