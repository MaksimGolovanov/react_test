// src/modules/Map/components/EditableDrawingsLayer.tsx
import React, { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useMap, Polyline, Polygon, Rectangle, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-editable';
import { Drawing, EditMode } from '../types/map.types';

interface EditableDrawingsLayerProps {
  drawings: Drawing[];
  editMode: EditMode;
  onDrawingChange: (drawingId: number, newCoordinates: any) => void;
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
  const map = useMap();
  const layerRefs = useRef<Record<number, L.Layer>>({});
  const editCommitHandlersRef = useRef<Record<number, (e: any) => void>>({});
  const originalCoordinatesRef = useRef<Record<number, any>>({});
  const cleanupRef = useRef<(() => void) | null>(null);
  const retryTimersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  // Для кастомного перетаскивания
  const dragMarkerRef = useRef<L.Marker | null>(null);
  const dragCleanupRefs = useRef<Record<number, () => void>>({});
  const dragStateRef = useRef<{
    startLatLng: L.LatLng;
    startBoundsOrCenter: any;
    type: 'rectangle' | 'circle';
    drawingId: number;
  } | null>(null);

  const updateLayerCoordinates = useCallback((layer: L.Layer, newCoordinates: any) => {
    if (layer instanceof L.Polyline || layer instanceof L.Polygon) {
      const latlngs = newCoordinates.map((p: [number, number]) => [p[1], p[0]]);
      layer.setLatLngs(latlngs);
      layer.redraw();
    } else if (layer instanceof L.Rectangle) {
      const bounds = L.latLngBounds(
        [newCoordinates[0][1], newCoordinates[0][0]],
        [newCoordinates[1][1], newCoordinates[1][0]]
      );
      layer.setBounds(bounds);
      layer.redraw();
    } else if (layer instanceof L.Circle) {
      layer.setLatLng([newCoordinates.center[1], newCoordinates.center[0]]);
      layer.setRadius(newCoordinates.radius);
      layer.redraw();
    }
  }, []);

  const getCurrentCoordinates = useCallback((layer: L.Layer): any => {
    if (layer instanceof L.Rectangle) {
      const bounds = (layer as L.Rectangle).getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      return [[sw.lng, sw.lat], [ne.lng, ne.lat]];
    }
    if (layer instanceof L.Polygon) {
      const latlngs = (layer as L.Polygon).getLatLngs();
      const points = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
      let coords = (points as L.LatLng[]).map(p => [p.lng, p.lat]);
      if (coords.length > 1 && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
        coords.push([coords[0][0], coords[0][1]]);
      }
      return coords;
    }
    if (layer instanceof L.Polyline) {
      const latlngs = (layer as L.Polyline).getLatLngs();
      const points = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
      return (points as L.LatLng[]).map(p => [p.lng, p.lat]);
    }
    if (layer instanceof L.Circle) {
      const center = (layer as L.Circle).getLatLng();
      const radius = (layer as L.Circle).getRadius();
      return { center: [center.lng, center.lat], radius };
    }
    return null;
  }, []);

  const createDragMarker = useCallback((id: number, layer: L.Layer) => {
    if (dragMarkerRef.current) {
      dragMarkerRef.current.remove();
      dragMarkerRef.current = null;
    }

    let centerLatLng: L.LatLng | null = null;
    let shapeType: 'rectangle' | 'circle' | null = null;

    if (layer instanceof L.Rectangle) {
      centerLatLng = layer.getBounds().getCenter();
      shapeType = 'rectangle';
    } else if (layer instanceof L.Circle) {
      centerLatLng = layer.getLatLng();
      shapeType = 'circle';
    } else {
      return null;
    }

    const dragIcon = L.divIcon({
      className: 'custom-drag-marker',
      html: '<div style="background-color:#ffaa00; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow:0 0 4px black; cursor:move;"></div>',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
    const marker = L.marker(centerLatLng, { icon: dragIcon, interactive: true, zIndexOffset: 1000 });
    marker.addTo(map);
    dragMarkerRef.current = marker;

    let isDragging = false;

    const onMouseDown = (e: L.LeafletMouseEvent) => {
      L.DomEvent.stopPropagation(e);
      isDragging = true;
      dragStateRef.current = {
        startLatLng: e.latlng,
        startBoundsOrCenter: layer instanceof L.Rectangle ? layer.getBounds() : layer.getLatLng(),
        type: shapeType!,
        drawingId: id,
      };
      map.dragging.disable();
      map.doubleClickZoom.disable();
    };

    const onMouseMove = (e: L.LeafletMouseEvent) => {
      if (!isDragging || !dragStateRef.current) return;
      const deltaLat = e.latlng.lat - dragStateRef.current.startLatLng.lat;
      const deltaLng = e.latlng.lng - dragStateRef.current.startLatLng.lng;
      const { type, startBoundsOrCenter } = dragStateRef.current;

      if (type === 'rectangle') {
        const bounds = startBoundsOrCenter as L.LatLngBounds;
        const newSouthWest = L.latLng(bounds.getSouthWest().lat + deltaLat, bounds.getSouthWest().lng + deltaLng);
        const newNorthEast = L.latLng(bounds.getNorthEast().lat + deltaLat, bounds.getNorthEast().lng + deltaLng);
        const newBounds = L.latLngBounds(newSouthWest, newNorthEast);
        (layer as L.Rectangle).setBounds(newBounds);
        marker.setLatLng(newBounds.getCenter());
      } else if (type === 'circle') {
        const center = startBoundsOrCenter as L.LatLng;
        const newCenter = L.latLng(center.lat + deltaLat, center.lng + deltaLng);
        (layer as L.Circle).setLatLng(newCenter);
        marker.setLatLng(newCenter);
      }
      layer.redraw();
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      dragStateRef.current = null;
      map.dragging.enable();
      map.doubleClickZoom.enable();
    };

    marker.on('mousedown', onMouseDown);
    map.on('mousemove', onMouseMove);
    map.on('mouseup', onMouseUp);

    const cleanup = () => {
      marker.off('mousedown', onMouseDown);
      map.off('mousemove', onMouseMove);
      map.off('mouseup', onMouseUp);
      if (dragMarkerRef.current) dragMarkerRef.current.remove();
      dragMarkerRef.current = null;
    };
    return cleanup;
  }, [map]);

  const disableEditingForLayer = useCallback((id: number, layer?: L.Layer) => {
    if (retryTimersRef.current[id]) {
      clearTimeout(retryTimersRef.current[id]);
      delete retryTimersRef.current[id];
    }
    const targetLayer = layer || layerRefs.current[id];
    // Удаляем кастомный маркер перетаскивания
    if (dragCleanupRefs.current[id]) {
      dragCleanupRefs.current[id]();
      delete dragCleanupRefs.current[id];
    }
    if (targetLayer && (targetLayer as any).editing) {
      try { (targetLayer as any).editing.disable(); } catch (err) { }
    }
    if (editCommitHandlersRef.current[id]) {
      const handler = editCommitHandlersRef.current[id];
      if (targetLayer) targetLayer.off('editable:drawing:commit', handler);
      delete editCommitHandlersRef.current[id];
    }
  }, []);

  const saveCurrentGeometry = useCallback(async (id: number) => {
    let targetLayer: L.Layer | null = null;
    map.eachLayer((layer) => {
      if ((layer as any).drawingId === id) targetLayer = layer;
    });
    if (!targetLayer) {
      console.error(`Layer ${id} not found`);
      return;
    }
    const newCoords = getCurrentCoordinates(targetLayer);
    if (newCoords) {
      // Выходим из режима редактирования (сбрасываем editMode)
      onEditSaved?.();

      // Принудительно удаляем все маркеры перетаскивания с карты
      const container = map.getContainer();
      // Удаляем кастомные маркеры
      document.querySelectorAll('.custom-drag-marker').forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
      // Удаляем стандартные маркеры leaflet-editable-move (если есть)
      document.querySelectorAll('.leaflet-editable-move').forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });

      // Сохраняем координаты на сервер
      await onDrawingChange(id, newCoords);
    }
  }, [map, onDrawingChange, getCurrentCoordinates, onEditSaved]);

  const cancelEditing = useCallback((id: number) => {
    let targetLayer: L.Layer | null = layerRefs.current[id];
    if (!targetLayer) {
      map.eachLayer((layer) => {
        if ((layer as any).drawingId === id) targetLayer = layer;
      });
    }
    if (originalCoordinatesRef.current[id]) {
      if (targetLayer) updateLayerCoordinates(targetLayer, originalCoordinatesRef.current[id]);
      delete originalCoordinatesRef.current[id];
    }
    disableEditingForLayer(id, targetLayer);
  }, [map, updateLayerCoordinates, disableEditingForLayer]);

  const enableEditingForLayer = useCallback((id: number, layer: L.Layer, retryCount = 0) => {
    if (!layer || typeof (layer as any).enableEdit !== 'function') return false;
    if ((layer as any).editing) return true;

    const drawing = drawings.find(d => d.id === id);
    if (drawing && !originalCoordinatesRef.current[id]) {
      originalCoordinatesRef.current[id] = JSON.parse(JSON.stringify(drawing.coordinates));
    }

    try {
      (layer as any).enableEdit();
      // Для прямоугольников и кругов добавляем кастомный маркер перетаскивания
      if (layer instanceof L.Rectangle || layer instanceof L.Circle) {
        const cleanup = createDragMarker(id, layer);
        if (cleanup) dragCleanupRefs.current[id] = cleanup;
      }
      return true;
    } catch (err) {
      console.error(err);
      if (retryCount < 5) {
        const timer = setTimeout(() => {
          enableEditingForLayer(id, layer, retryCount + 1);
        }, 200);
        retryTimersRef.current[id] = timer;
      }
      return false;
    }
  }, [drawings, createDragMarker]);

  useImperativeHandle(ref, () => ({
    saveCurrentGeometry,
    cancelEditing,
  }), [saveCurrentGeometry, cancelEditing]);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
      Object.entries(layerRefs.current).forEach(([idStr, layer]) => {
        const id = parseInt(idStr);
        disableEditingForLayer(id, layer);
      });
    };
  }, [disableEditingForLayer]);

  useEffect(() => {
    Object.entries(layerRefs.current).forEach(([idStr, layer]) => {
      const id = parseInt(idStr);
      disableEditingForLayer(id, layer);
    });
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    if (editMode.kind === 'geometry') {
      const id = editMode.drawingId;
      const layer = layerRefs.current[id];
      if (layer) {
        const waitForLayer = () => {
          if (map.hasLayer(layer)) {
            enableEditingForLayer(id, layer);
          } else {
            const onAdd = (e: L.LayerEvent) => {
              if (e.layer === layer) {
                map.off('layeradd', onAdd);
                enableEditingForLayer(id, layer);
              }
            };
            map.on('layeradd', onAdd);
            cleanupRef.current = () => map.off('layeradd', onAdd);
          }
        };
        waitForLayer();
      }
    }
  }, [editMode, map, enableEditingForLayer, disableEditingForLayer]);

  const setLayerRef = useCallback((id: number) => (el: L.Layer | null) => {
    if (el) {
      (el as any).drawingId = id;
      layerRefs.current[id] = el;
      if (editMode.kind === 'geometry' && editMode.drawingId === id && map.hasLayer(el)) {
        enableEditingForLayer(id, el);
      }
    } else {
      delete layerRefs.current[id];
    }
  }, [editMode, map, enableEditingForLayer]);

  return (
    <>
      {drawings.map(drawing => {
        if (drawing.type === 'text') return null;
        const { type, coordinates, style, id } = drawing;
        const isEditing = editMode.kind === 'geometry' && editMode.drawingId === id;
        const finalStyle = {
          ...style,
          color: isEditing ? '#ffaa00' : style.color,
          weight: isEditing ? (style.weight || 2) + 2 : style.weight,
          opacity: 1,
        };
        const eventHandlers = {
          click: () => onDrawingClick?.(drawing),
          contextmenu: (e: L.LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(e);
            onEditDrawingFromMap(drawing);
          },
        };
        if (!coordinates) return null;

        switch (type) {
          case 'polyline':
            if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
            return (
              <Polyline
                key={id}
                positions={coordinates.map(p => [p[1], p[0]])}
                pathOptions={finalStyle}
                eventHandlers={eventHandlers}
                ref={setLayerRef(id)}
              />
            );
          case 'polygon':
            if (!Array.isArray(coordinates) || coordinates.length < 3) return null;
            return (
              <Polygon
                key={id}
                positions={coordinates.map(p => [p[1], p[0]])}
                pathOptions={finalStyle}
                eventHandlers={eventHandlers}
                ref={setLayerRef(id)}
              />
            );
          case 'rectangle':
            if (!Array.isArray(coordinates) || coordinates.length !== 2) return null;
            const bounds: [[number, number], [number, number]] = [
              [coordinates[0][1], coordinates[0][0]],
              [coordinates[1][1], coordinates[1][0]],
            ];
            return (
              <Rectangle
                key={id}
                bounds={bounds}
                pathOptions={finalStyle}
                eventHandlers={eventHandlers}
                ref={setLayerRef(id)}
              />
            );
          case 'circle':
            if (!coordinates.center || typeof coordinates.radius !== 'number') return null;
            return (
              <Circle
                key={id}
                center={[coordinates.center[1], coordinates.center[0]]}
                radius={coordinates.radius}
                pathOptions={finalStyle}
                eventHandlers={eventHandlers}
                ref={setLayerRef(id)}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
});

export default EditableDrawingsLayer;