// src/modules/Map/pages/map.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Alert, Skeleton, message, theme } from 'antd';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
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
import CompassControl from '../ui/CompassControl/CompassControl';
import { Drawing, EditMode, Layer } from '../types/map.types';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from '../lib/constants';
import styles from './style.module.css';

const { useToken } = theme;

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
  const { token } = useToken();
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

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('map_sidebar_collapsed');
    return saved === 'true';
  });

  const VISIBLE_LAYERS_KEY = 'map_visible_layers';

  const mapRef = useRef<L.Map | null>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const editableDrawingsLayerRef = useRef<EditableDrawingsLayerRef>(null);
  
  const isSavingRef = useRef<boolean>(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => {
      const newVal = !prev;
      localStorage.setItem('map_sidebar_collapsed', String(newVal));
      return newVal;
    });
  }, []);

  const forceMapRedraw = useCallback(() => {
    if (!mapRef.current) return;
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize({ animate: false });
      }
    }, 10);
  }, []);

  const loadVisibleLayersFromStorage = useCallback((layersList: Layer[]): Record<number, boolean> => {
    const saved = localStorage.getItem(VISIBLE_LAYERS_KEY);
    if (!saved) {
      return layersList.reduce((acc, layer) => {
        acc[layer.id] = false;
        return acc;
      }, {} as Record<number, boolean>);
    }
    try {
      const parsed = JSON.parse(saved) as Record<number, boolean>;
      const result: Record<number, boolean> = {};
      layersList.forEach(layer => {
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
    const root = document.documentElement;
    root.style.setProperty('--map-bg', token.colorBgContainer);
    root.style.setProperty('--map-sidebar-bg', token.colorBgElevated);
    root.style.setProperty('--map-border', token.colorBorder);
    root.style.setProperty('--map-text', token.colorText);
    root.style.setProperty('--map-primary', token.colorPrimary);
    root.style.setProperty('--map-primary-bg', token.colorPrimaryBg);
    root.style.setProperty('--map-hover-bg', token.controlItemBgHover);
    root.style.setProperty('--map-selected-bg', token.colorPrimaryBg);
    root.style.setProperty('--map-shadow', token.boxShadow);
    root.style.setProperty('--map-header-bg', token.colorBgElevated);
    root.style.setProperty('--map-control-bg', token.colorBgElevated);
    root.style.setProperty('--map-control-border', token.colorBorder);
  }, [token]);

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

  useEffect(() => {
    if (layers.length) {
      const initial = loadVisibleLayersFromStorage(layers);
      setVisibleLayers(initial);
    }
  }, [layers, loadVisibleLayersFromStorage]);

  useEffect(() => {
    if (Object.keys(visibleLayers).length > 0) {
      localStorage.setItem(VISIBLE_LAYERS_KEY, JSON.stringify(visibleLayers));
    }
  }, [visibleLayers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const initRotate = () => {
      if (typeof (map as any).setBearing === 'function') {
        (map as any).setBearing(0);
        console.log('Поворот карты инициализирован');
      }
    };
    map.whenReady(initRotate);
  }, []);

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
      message.success('Объект удалён');
      forceMapRedraw();
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

  const handleEditSaved = useCallback(() => {
    setEditMode({ kind: 'none' });
  }, []);

  const handleSaveEdit = async () => {
    if (isSavingRef.current) {
      console.log('Save already in progress');
      return;
    }
    
    if (editMode.kind === 'geometry') {
      isSavingRef.current = true;
      
      try {
        if (editableDrawingsLayerRef.current) {
          await editableDrawingsLayerRef.current.saveCurrentGeometry(editMode.drawingId);
        }
        message.success('Изменения сохранены');
        
        setTimeout(() => {
          forceMapRedraw();
        }, 100);
        
      } catch (err) {
        console.error('Save error:', err);
        message.error('Ошибка при сохранении');
      } finally {
        setTimeout(() => {
          isSavingRef.current = false;
        }, 500);
      }
      
    } else if (editMode.kind === 'text') {
      setEditMode({ kind: 'none' });
      message.success('Редактирование текста завершено');
    }
  };

  const handleCancelEdit = useCallback(() => {
    if (editMode.kind === 'geometry') {
      if (editableDrawingsLayerRef.current) {
        editableDrawingsLayerRef.current.cancelEditing(editMode.drawingId);
      }
      message.info('Изменения отменены');
      forceMapRedraw();
    } else if (editMode.kind === 'text') {
      setEditMode({ kind: 'none' });
    }
  }, [editMode, forceMapRedraw]);

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

  const handleDrawingChange = useCallback(async (drawingId: number, newCoordinates: any) => {
    try {
      await mapStore.updateDrawing(drawingId, { coordinates: newCoordinates } as any);
      message.success('Изменения сохранены');
    } catch (err) {
      message.error('Ошибка обновления фигуры');
      throw err;
    }
  }, []);

  const handleStartEditText = (id: number) => {
    const drawing = drawings.find(d => d.id === id);
    if (drawing) {
      mapStore.setSelectedLayerId(drawing.layerId);
    }
    setEditMode({ kind: 'text', drawingId: id });
    message.info('Режим редактирования текста: перетаскивайте маркеры');
  };

  const handleUpdateText = useCallback(async (id: number, newLngLat: [number, number], newRotation: number) => {
    const drawing = drawings.find(d => d.id === id);
    if (!drawing) return;
    try {
      await mapStore.updateDrawing(id, {
        coordinates: newLngLat,
        style: { ...drawing.style, rotation: newRotation },
      } as any);
      forceMapRedraw();
    } catch (err) {
      message.error('Ошибка обновления текста');
    }
  }, [drawings, forceMapRedraw]);

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
    forceMapRedraw();
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
    forceMapRedraw();
  };

  const onDrawingCancel = () => {
    setDrawingModalVisible(false);
    setEditingDrawing(null);
  };

  const handleSelectMarker = (marker: any) => {
    if (!marker?.geojson?.coordinates) return;
    const [lng, lat] = marker.geojson.coordinates;
    mapRef.current?.flyTo([lat, lng], 17, { duration: 1.0 });
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
        const lats = coords.map((p: number[]) => p[1]);
        const lngs = coords.map((p: number[]) => p[0]);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        center = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
      }
    } else if (drawing.type === 'text') {
      const [lng, lat] = drawing.coordinates as [number, number];
      center = [lat, lng];
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

  const handleEditDrawingFromSidebarOrMap = useCallback((drawing: Drawing) => {
    if (drawing.type !== 'text') {
      setEditMode({ kind: 'geometry', drawingId: drawing.id });
      message.info('Режим редактирования фигуры активирован');
    } else {
      setEditMode({ kind: 'text', drawingId: drawing.id });
      message.info('Режим редактирования текста активирован');
    }
  }, []);

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
            key={token.colorBgContainer}
            selectedLayerId={selectedLayerId}
            onSelectLayer={(id) => mapStore.setSelectedLayerId(id)}
            onSelectMarker={handleSelectMarker}
            onSelectDrawing={handleSelectDrawing}
            visibleLayers={visibleLayers}
            onToggleLayerVisibility={toggleLayerVisibility}
            onEditDrawing={handleEditDrawingFromSidebarOrMap}
            editMode={editMode}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </div>

        <div className={styles.mapWrapper} ref={mapWrapperRef}>
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
            style={{ height: '875px', width: '100%', backgroundColor: '#1a1a1a' }}
            ref={mapRef}
            className={isAddMarkerMode ? styles.addMarkerCursor : ''}
          >
            {tileUrl && (
              <TileLayer
                key={currentTileSourceId}
                url={tileUrl}
                maxNativeZoom={18}
                maxZoom={MAX_ZOOM}
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

            <UnifiedControls
              editMode={editMode}
              setEditMode={setEditMode}
              onDeleteCurrent={handleDeleteCurrent}
              onEditProperties={handleEditProperties}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              selectedLayerId={selectedLayerId}
              mapWrapperRef={mapWrapperRef}
            />
            <CoordinatesDisplay />
            <CompassControl />

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
                    ref={editableDrawingsLayerRef}
                    drawings={layerDrawings}
                    editMode={editMode}
                    onDrawingChange={handleDrawingChange}
                    onDrawingClick={handleDrawingClick}
                    onEditDrawingFromMap={handleEditDrawingFromSidebarOrMap}
                    onEditSaved={handleEditSaved}
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