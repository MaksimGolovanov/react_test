// src/modules/Map/hooks/useMapMeasure.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const useMapMeasure = () => {
  const map = useMap();
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [points, setPoints] = useState<[number, number][]>([]);
  const [tempPoint, setTempPoint] = useState<[number, number] | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);

  const handlersRef = useRef<{
    click: ((e: L.LeafletMouseEvent) => void) | null;
    mousemove: ((e: L.LeafletMouseEvent) => void) | null;
    contextmenu: ((e: L.LeafletMouseEvent) => void) | null;
  }>({ click: null, mousemove: null, contextmenu: null });

  const updateDistance = useCallback(() => {
    if (!map) return;
    if (points.length < 1) {
      setTotalDistance(0);
      return;
    }
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dist = map.distance([p1[1], p1[0]], [p2[1], p2[0]]);
      if (!isNaN(dist)) total += dist;
    }
    if (tempPoint && points.length > 0) {
      const last = points[points.length - 1];
      const dist = map.distance([last[1], last[0]], [tempPoint[1], tempPoint[0]]);
      if (!isNaN(dist)) total += dist;
    }
    setTotalDistance(total);
  }, [points, tempPoint, map]);

  useEffect(() => {
    updateDistance();
  }, [updateDistance]);

  // Остановка измерения
  const stopMeasure = useCallback(() => {
    if (handlersRef.current.click) map.off('click', handlersRef.current.click);
    if (handlersRef.current.mousemove) map.off('mousemove', handlersRef.current.mousemove);
    if (handlersRef.current.contextmenu) map.off('contextmenu', handlersRef.current.contextmenu);
    map.dragging.enable();
    map.doubleClickZoom.enable();
    setIsMeasuring(false);
    setPoints([]);
    setTempPoint(null);
    setTotalDistance(0);
    handlersRef.current = { click: null, mousemove: null, contextmenu: null };
  }, [map]);

  // Обработчик Escape
  useEffect(() => {
    if (!isMeasuring) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopMeasure();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMeasuring, stopMeasure]);

  const startMeasure = useCallback(() => {
    map.dragging.disable();
    map.doubleClickZoom.disable();
    setIsMeasuring(true);
    setPoints([]);
    setTempPoint(null);
    setTotalDistance(0);

    const onMapClick = (e: L.LeafletMouseEvent) => {
      // При левом клике добавляем точку
      setPoints(prev => [...prev, [e.latlng.lng, e.latlng.lat]]);
    };
    const onMouseMove = (e: L.LeafletMouseEvent) => {
      setTempPoint([e.latlng.lng, e.latlng.lat]);
    };
    const onContextMenu = (e: L.LeafletMouseEvent) => {
      e.originalEvent.preventDefault();
      stopMeasure();
    };

    handlersRef.current = { click: onMapClick, mousemove: onMouseMove, contextmenu: onContextMenu };
    map.on('click', onMapClick);
    map.on('mousemove', onMouseMove);
    map.on('contextmenu', onContextMenu);
  }, [map, stopMeasure]);

  const toggleMeasure = () => {
    if (isMeasuring) stopMeasure();
    else startMeasure();
  };

  const linePositions = [...points];
  if (tempPoint) linePositions.push(tempPoint);
  const polylinePoints: [number, number][] = linePositions.map(p => [p[1], p[0]]);

  return {
    isMeasuring,
    totalDistance,
    polylinePoints,
    points,
    toggleMeasure,
  };
};