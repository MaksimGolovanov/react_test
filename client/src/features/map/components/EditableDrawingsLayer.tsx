import React, { useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useState } from 'react';
import { useMap, Polyline, Polygon, Rectangle, Circle } from 'react-leaflet';
import { theme } from 'antd';
import L from 'leaflet';
import 'leaflet-editable';
import { Drawing, EditMode } from '../types/map.types';

const { useToken } = theme;

interface EditableDrawingsLayerProps {
  drawings: Drawing[];
  editMode: EditMode;
  onDrawingChange: (drawingId: number, newCoordinates: any) => Promise<void>;
  onDrawingClick?: (drawing: Drawing) => void;
  onEditDrawingFromMap: (drawing: Drawing) => void;
  onEditSaved?: () => void;
}

export interface EditableDrawingsLayerRef {
  saveCurrentGeometry: (id: number) => Promise<void>;
  cancelEditing: (id: number) => void;
}

const EditableDrawingsLayer = forwardRef<EditableDrawingsLayerRef, EditableDrawingsLayerProps>(({
  drawings,
  editMode,
  onDrawingChange,
  onDrawingClick,
  onEditDrawingFromMap,
  onEditSaved,
}, ref) => {
  const { token } = useToken();
  const map = useMap();
  
  const layerRefs = useRef<Record<number, L.Layer>>({});
  const originalCoordinatesRef = useRef<Record<number, any>>({});
  
  // Флаг блокировки
  const isLockedRef = useRef<Record<number, boolean>>({});
  // Флаг, что сохранение завершено и нужно игнорировать следующие изменения editMode
  const justSavedRef = useRef<Record<number, boolean>>({});
  
  // Счетчик для принудительного пересоздания
  const [remountKeys, setRemountKeys] = useState<Record<number, number>>({});

  // УНИЧТОЖЕНИЕ маркеров leaflet-editable
  const destroyAllEditIcons = useCallback(() => {
    const container = map.getContainer();
    if (!container) return;
    
    const selectors = [
      '.leaflet-marker-icon.leaflet-editable-icon',
      '.leaflet-editable-vertex',
      '.leaflet-editable-marker',
      '.leaflet-div-icon',
      '.leaflet-vertex-icon',
      '.leaflet-move-icon',
      '.leaflet-editable-move',
    ];
    
    selectors.forEach(selector => {
      container.querySelectorAll(selector).forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    });
  }, [map]);

  // Функция принудительной перерисовки (без бесконечного цикла)
  const forceMapRedraw = useCallback(() => {
    if (!map) return;
    
    // Сохраняем состояние
    const center = map.getCenter();
    const zoom = map.getZoom();
    const bearing = typeof (map as any).getBearing === 'function' ? (map as any).getBearing() : 0;
    
    // Принудительная перерисовка
    map.invalidateSize({ animate: false });
    
    // Перерисовка только Path слоев
    map.eachLayer((layer) => {
      if (layer instanceof L.Path) {
        layer.redraw();
      }
    });
    
    // Восстанавливаем позицию БЕЗ триггера событий
    if (typeof (map as any).setBearing === 'function') {
      (map as any).setBearing(bearing, { animate: false });
    }
    map.setView(center, zoom, { animate: false });
  }, [map]);

  // Отключение редактирования
  const hardDisableEditing = useCallback((layer: L.Layer | null | undefined) => {
    if (!layer) return;
    
    try {
      if ((layer as any).editing) {
        (layer as any).editing.disable();
      }
    } catch (e) {
      // Игнорируем
    }
  }, []);

  const findLayerOnMap = useCallback((id: number): L.Layer | null => {
    let found: L.Layer | null = null;
    map.eachLayer((layer) => {
      if ((layer as any).drawingId === id) found = layer;
    });
    return found;
  }, [map]);

  const getCurrentCoordinates = useCallback((layer: L.Layer): any => {
    if (layer instanceof L.Rectangle) {
      const bounds = layer.getBounds();
      return [[bounds.getSouthWest().lng, bounds.getSouthWest().lat], [bounds.getNorthEast().lng, bounds.getNorthEast().lat]];
    }
    if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
      const latlngs = layer.getLatLngs();
      const points = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
      let coords = (points as L.LatLng[]).map(p => [p.lng, p.lat]);
      if (layer instanceof L.Polygon && coords.length > 1) {
        if (coords[0][0] !== coords[coords.length-1][0] || coords[0][1] !== coords[coords.length-1][1]) {
          coords.push([coords[0][0], coords[0][1]]);
        }
      }
      return coords;
    }
    if (layer instanceof L.Circle) {
      const center = layer.getLatLng();
      return { center: [center.lng, center.lat], radius: layer.getRadius() };
    }
    return null;
  }, []);

  // СОХРАНЕНИЕ - исправленный порядок
  const saveCurrentGeometry = useCallback(async (id: number) => {
    // Защита от повторного вызова
    if (isLockedRef.current[id]) {
      console.log('Save already in progress, skipping');
      return;
    }
    
    isLockedRef.current[id] = true;
    justSavedRef.current[id] = true;
    
    const layer = layerRefs.current[id] || findLayerOnMap(id);
    const newCoords = layer ? getCurrentCoordinates(layer) : null;
    
    // 1. Отключаем редактирование
    if (layer) {
      hardDisableEditing(layer);
    }
    
    // 2. Удаляем иконки
    destroyAllEditIcons();
    
    // 3. Сохраняем данные (ВАЖНО: до вызова onEditSaved)
    let saveError = null;
    if (layer && newCoords) {
      try {
        await onDrawingChange(id, newCoords);
      } catch (err) {
        console.error('Save failed', err);
        saveError = err;
      }
    }
    
    // 4. ТОЛЬКО после успешного сохранения выходим из режима
    if (!saveError && onEditSaved) {
      onEditSaved();
    }
    
    delete originalCoordinatesRef.current[id];
    
    // 5. Принудительно пересоздаем слой
    setRemountKeys(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    
    // 6. Перерисовываем карту с задержкой
    setTimeout(() => {
      forceMapRedraw();
      // Дополнительная очистка
      destroyAllEditIcons();
    }, 50);
    
    // 7. Снимаем блокировку через более длительную задержку
    setTimeout(() => {
      isLockedRef.current[id] = false;
      // Сбрасываем флаг justSaved через секунду
      setTimeout(() => {
        justSavedRef.current[id] = false;
      }, 1000);
    }, 200);
    
  }, [onDrawingChange, getCurrentCoordinates, hardDisableEditing, onEditSaved, findLayerOnMap, destroyAllEditIcons, forceMapRedraw]);

  const cancelEditing = useCallback((id: number) => {
    if (isLockedRef.current[id]) return;
    
    isLockedRef.current[id] = true;
    
    const layer = layerRefs.current[id] || findLayerOnMap(id);
    if (layer) {
      hardDisableEditing(layer);
    }
    
    destroyAllEditIcons();
    delete originalCoordinatesRef.current[id];
    
    if (onEditSaved) {
      onEditSaved();
    }
    
    setRemountKeys(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    
    setTimeout(() => {
      forceMapRedraw();
      destroyAllEditIcons();
    }, 50);
    
    setTimeout(() => {
      isLockedRef.current[id] = false;
    }, 200);
  }, [hardDisableEditing, onEditSaved, findLayerOnMap, destroyAllEditIcons, forceMapRedraw]);

  useImperativeHandle(ref, () => ({ saveCurrentGeometry, cancelEditing }), [saveCurrentGeometry, cancelEditing]);

  // Глобальный контроль режима редактирования - ИСПРАВЛЕН
  useEffect(() => {
    // Если режим не geometry - отключаем все
    if (editMode.kind !== 'geometry') {
      Object.values(layerRefs.current).forEach(layer => {
        hardDisableEditing(layer);
      });
      destroyAllEditIcons();
      return;
    }

    const id = editMode.drawingId;
    
    // ПРОВЕРКА: если недавно сохраняли - игнорируем
    if (justSavedRef.current[id]) {
      console.log('Just saved, ignoring edit mode enable');
      return;
    }
    
    if (isLockedRef.current[id]) {
      return;
    }

    const timer = setTimeout(() => {
      // Повторная проверка
      if (justSavedRef.current[id] || isLockedRef.current[id]) {
        return;
      }
      
      const layer = layerRefs.current[id] || findLayerOnMap(id);
      const drawing = drawings.find(d => d.id === id);

      if (layer && drawing) {
        if (!originalCoordinatesRef.current[id]) {
          originalCoordinatesRef.current[id] = JSON.parse(JSON.stringify(drawing.coordinates));
        }
        
        // Чистим перед включением
        destroyAllEditIcons();
        
        try {
          if (typeof (layer as any).enableEdit === 'function') {
            (layer as any).enableEdit();
          }
        } catch (e) {
          console.warn('Enable edit error:', e);
        }
      }
    }, 100); // Увеличенная задержка

    return () => clearTimeout(timer);
  }, [editMode, drawings, findLayerOnMap, hardDisableEditing, destroyAllEditIcons]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      Object.values(layerRefs.current).forEach(layer => hardDisableEditing(layer));
      destroyAllEditIcons();
    };
  }, [hardDisableEditing, destroyAllEditIcons]);

  const setLayerRef = useCallback((id: number) => (el: L.Layer | null) => {
    if (el) {
      (el as any).drawingId = id;
      layerRefs.current[id] = el;
    } else {
      delete layerRefs.current[id];
    }
  }, []);

  return (
    <>
      {drawings.map(drawing => {
        if (drawing.type === 'text') return null;
        const { type, style, id } = drawing;
        const isEditing = editMode.kind === 'geometry' && editMode.drawingId === id;
        
        const coords = drawing.coordinates;
        if (!coords) return null;
        
        const finalStyle = {
          ...style,
          color: isEditing ? token.colorPrimary : (style.color || token.colorPrimary),
          weight: isEditing ? (style.weight || 2) + 2 : (style.weight || 2),
          opacity: 1,
        };
        
        const eventHandlers = {
          click: () => onDrawingClick?.(drawing),
          contextmenu: (e: L.LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(e);
            e.originalEvent.preventDefault();
            onEditDrawingFromMap(drawing);
          },
        };
        
        const layerKey = `${id}-${remountKeys[id] || 0}`;
        
        switch (type) {
          case 'polyline':
            return <Polyline key={layerKey} positions={coords.map((p: [number, number]) => [p[1], p[0]])} pathOptions={finalStyle} eventHandlers={eventHandlers} ref={setLayerRef(id)} />;
          case 'polygon':
            return <Polygon key={layerKey} positions={coords.map((p: [number, number]) => [p[1], p[0]])} pathOptions={finalStyle} eventHandlers={eventHandlers} ref={setLayerRef(id)} />;
          case 'rectangle':
            return <Rectangle key={layerKey} bounds={[[coords[0][1], coords[0][0]], [coords[1][1], coords[1][0]]]} pathOptions={finalStyle} eventHandlers={eventHandlers} ref={setLayerRef(id)} />;
          case 'circle':
            return <Circle key={layerKey} center={[coords.center[1], coords.center[0]]} radius={coords.radius} pathOptions={finalStyle} eventHandlers={eventHandlers} ref={setLayerRef(id)} />;
          default: return null;
        }
      })}
    </>
  );
});

export default EditableDrawingsLayer;