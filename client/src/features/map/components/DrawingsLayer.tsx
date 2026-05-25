// src/modules/Map/components/DrawingsLayer.tsx
import React, { useEffect, useRef } from 'react';
import { Polyline, Polygon, Rectangle, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Drawing } from '../types/map.types';

interface DrawingsLayerProps {
  drawings: Drawing[];
  onDrawingClick: (drawing: Drawing) => void;
}

// Функция создания иконки с учётом текущего зума
const createTextIcon = (drawing: Drawing, zoom: number) => {
  const { style, text, name } = drawing;
  const baseZoom = 16;
  let scale = zoom / baseZoom;
  scale = Math.min(3, Math.max(0.5, scale));
  const fontSize = Math.round((style.fontSize || 14) * scale);
  const color = style.color || '#000';
  const fontFamily = style.fontFamily || 'Arial';
  const opacity = style.opacity ?? 1;

  const divStyle = {
    color,
    fontSize: `${fontSize}px`,
    fontFamily,
    fontWeight: 'bold',
    background: 'rgba(255,255,255,0.7)',
    padding: '2px 6px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    border: '1px solid rgba(0,0,0,0.2)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    opacity,
  };
  const styleString = Object.entries(divStyle).map(([k, v]) => `${k}:${v}`).join(';');
  const html = `<div style="${styleString}">${text || name}</div>`;
  return L.divIcon({
    html,
    iconSize: [fontSize * ((text || name).length) + 20, fontSize + 10],
    className: 'text-label-icon',
  });
};

const DrawingsLayer: React.FC<DrawingsLayerProps> = ({ drawings, onDrawingClick }) => {
  const map = useMap();
  const markersRef = useRef<L.Marker[]>([]);
  const currentZoomRef = useRef(map.getZoom());

  // Функция полного пересоздания текстовых маркеров
  const rebuildTextMarkers = () => {
    const zoom = map.getZoom();
    currentZoomRef.current = zoom;
    // Удаляем старые маркеры
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    // Создаём новые маркеры для текстовых рисунков
    drawings.forEach(drawing => {
      if (drawing.type !== 'text') return;
      if (!drawing.coordinates || drawing.coordinates.length !== 2) return;
      const [lng, lat] = drawing.coordinates;
      const icon = createTextIcon(drawing, zoom);
      const marker = L.marker([lat, lng], { icon });
      marker.on('click', () => onDrawingClick(drawing));
      marker.bindTooltip(drawing.text || drawing.name, { sticky: true, direction: 'top' });
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  };

  // При изменении зума – пересоздаём маркеры
  useEffect(() => {
    if (!map) return;
    const onZoomEnd = () => {
      rebuildTextMarkers();
    };
    map.on('zoomend', onZoomEnd);
    // Первоначальное создание
    rebuildTextMarkers();

    return () => {
      map.off('zoomend', onZoomEnd);
      markersRef.current.forEach(marker => map.removeLayer(marker));
      markersRef.current = [];
    };
  }, [map, drawings]); // Зависимость от drawings – пересоздаём, если изменился список

  // Рендер обычных фигур (нетекстовые рисунки)
  return (
    <>
      {drawings.map(drawing => {
        const { type, coordinates, style, id } = drawing;
        if (type === 'text') return null; // текст уже обработан выше
        const eventHandlers = { click: () => onDrawingClick(drawing) };
        if (!coordinates) return null;

        switch (type) {
          case 'polyline':
            if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
            return (
              <Polyline
                key={id}
                positions={coordinates.map(p => [p[1], p[0]])}
                pathOptions={{ color: style.color, weight: style.weight, opacity: style.opacity }}
                eventHandlers={eventHandlers}
              />
            );
          case 'polygon':
            if (!Array.isArray(coordinates) || coordinates.length < 3) return null;
            return (
              <Polygon
                key={id}
                positions={coordinates.map(p => [p[1], p[0]])}
                pathOptions={{ ...style }}
                eventHandlers={eventHandlers}
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
                pathOptions={{ ...style }}
                eventHandlers={eventHandlers}
              />
            );
          case 'circle':
            if (!coordinates.center || typeof coordinates.radius !== 'number') return null;
            return (
              <Circle
                key={id}
                center={[coordinates.center[1], coordinates.center[0]]}
                radius={coordinates.radius}
                pathOptions={{ ...style }}
                eventHandlers={eventHandlers}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default React.memo(DrawingsLayer);