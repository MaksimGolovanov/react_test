// src/modules/Map/hooks/useDrawing.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

type DrawingType = 'polyline' | 'polygon' | 'rectangle' | 'circle' | 'text';

interface UseDrawingOptions {
  type: DrawingType | null;
  onComplete: (data: { coordinates: any; style?: any; text?: string }) => void;
}

export const useDrawing = ({ type, onComplete }: UseDrawingOptions) => {
  const map = useMap();
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<[number, number][]>([]);
  const [tempPoint, setTempPoint] = useState<[number, number] | null>(null);
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState<number | null>(null);

  // Флаг для подавления лишнего клика при двойном клике
  const dblClickFlag = useRef(false);

  const reset = useCallback(() => {
    setPoints([]);
    setTempPoint(null);
    setStartPoint(null);
    setRadius(null);
  }, []);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    map.dragging.enable();
    map.doubleClickZoom.enable();
    reset();
  }, [map, reset]);

  const startDrawing = useCallback(() => {
    if (isDrawing) return;
    // Сбрасываем флаг двойного клика при старте нового рисования
    dblClickFlag.current = false;
    setIsDrawing(true);
    map.dragging.disable();
    map.doubleClickZoom.disable();
    reset();
  }, [isDrawing, map, reset]);

  // Эффект для управления обработчиками событий
  useEffect(() => {
    if (!isDrawing) return;
    if (!type) return;

    const onMapClick = (e: L.LeafletMouseEvent) => {
      if (dblClickFlag.current) return;
      const { lng, lat } = e.latlng;
      if (type === 'text') {
        onComplete({ coordinates: [lng, lat] });
        stopDrawing();
        return;
      }
      if (type === 'rectangle') {
        if (!startPoint) {
          setStartPoint([lng, lat]);
        } else {
          const rectCoords = [startPoint, [lng, lat]];
          onComplete({ coordinates: rectCoords });
          stopDrawing();
        }
      } else if (type === 'circle') {
        if (!startPoint) {
          setStartPoint([lng, lat]);
        } else {
          const dist = map.distance([startPoint[1], startPoint[0]], [lat, lng]);
          onComplete({ coordinates: { center: startPoint, radius: dist } });
          stopDrawing();
        }
      } else {
        setPoints(prev => [...prev, [lng, lat]]);
      }
    };

    const onMouseMove = (e: L.LeafletMouseEvent) => {
      const { lng, lat } = e.latlng;
      if (type === 'rectangle' && startPoint) {
        setTempPoint([lng, lat]);
      } else if (type === 'circle' && startPoint) {
        const dist = map.distance([startPoint[1], startPoint[0]], [lat, lng]);
        setRadius(dist);
        setTempPoint([lng, lat]);
      } else if (type !== 'rectangle' && type !== 'circle') {
        setTempPoint([lng, lat]);
      }
    };

    const onDblClick = (e: L.LeafletMouseEvent) => {
      L.DomEvent.stopPropagation(e);
      dblClickFlag.current = true;
      setTimeout(() => { dblClickFlag.current = false; }, 200);

      if (type === 'polyline' || type === 'polygon') {
        if (points.length >= 2) {
          let finalCoords = points;
          if (type === 'polygon' && points.length >= 3) {
            finalCoords = [...points, points[0]];
          }
          onComplete({ coordinates: finalCoords });
          stopDrawing();
        }
      }
    };

    map.on('click', onMapClick);
    map.on('mousemove', onMouseMove);
    if (type === 'polyline' || type === 'polygon') {
      map.on('dblclick', onDblClick);
    }

    return () => {
      map.off('click', onMapClick);
      map.off('mousemove', onMouseMove);
      if (type === 'polyline' || type === 'polygon') {
        map.off('dblclick', onDblClick);
      }
    };
  }, [isDrawing, type, startPoint, points, radius, map, onComplete, stopDrawing]);

  useEffect(() => {
    if (!isDrawing) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopDrawing();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDrawing, stopDrawing]);

  useEffect(() => {
    return () => {
      if (isDrawing) stopDrawing();
    };
  }, [isDrawing, stopDrawing]);

  let tempFigure = null;
  if (isDrawing && type) {
    if (type === 'rectangle' && startPoint && tempPoint) {
      tempFigure = { type: 'rectangle', bounds: [startPoint, tempPoint] };
    } else if (type === 'circle' && startPoint && tempPoint && radius) {
      tempFigure = { type: 'circle', center: startPoint, radius };
    } else if ((type === 'polyline' || type === 'polygon') && points.length > 0) {
      const allPoints = [...points];
      if (tempPoint) allPoints.push(tempPoint);
      if (allPoints.length >= 2) {
        tempFigure = { type, points: allPoints };
      }
    }
  }

  const forceComplete = useCallback(() => {
    if (!type) return;
    try {
      if (type === 'polyline' && points.length >= 2) {
        onComplete({ coordinates: points });
        stopDrawing();
      } else if (type === 'polygon' && points.length >= 3) {
        const closedPoints = [...points, points[0]];
        onComplete({ coordinates: closedPoints });
        stopDrawing();
      }
    } catch (err) {
      console.error('forceComplete error', err);
      stopDrawing();
    }
  }, [type, points, onComplete, stopDrawing]);

  return {
    isDrawing,
    startDrawing,
    stopDrawing,
    tempFigure,
    points,
    tempPoint,
    startPoint,
    radius,
    forceComplete,
  };
};