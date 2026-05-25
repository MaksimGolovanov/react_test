// src/modules/Map/components/CanvasTextLayer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Drawing, EditMode } from '../types/map.types';

declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, w: number, h: number, r: number): CanvasRenderingContext2D;
  }
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    return this;
  };
}

interface Props {
  drawings: Drawing[];
  editMode: EditMode;
  onStartEditText: (id: number) => void;
  onUpdateText: (id: number, newLngLat: [number, number], newRotation: number) => void;
  onStopEdit: () => void;
  onEditTextProperties: (drawing: Drawing) => void;
}

const CanvasTextLayer: React.FC<Props> = ({
  drawings,
  editMode,
  onStartEditText,
  onUpdateText,
  onStopEdit,
  onEditTextProperties,
}) => {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const [dragState, setDragState] = useState<{
    type: 'move' | 'rotate';
    startCanvasPoint: { x: number; y: number };
    initialLngLat: [number, number];
    initialRotation: number;
  } | null>(null);
  // Локальные временные значения для оптимизации вызовов API
  const [tempLngLat, setTempLngLat] = useState<[number, number] | null>(null);
  const [tempRotation, setTempRotation] = useState<number | null>(null);

  const textHitAreasRef = useRef<Array<{ id: number; center: { x: number; y: number }; radius: number }>>([]);
  const editMarkerAreasRef = useRef<{ center: { x: number; y: number }; rotPoint: { x: number; y: number }; editPoint: { x: number; y: number } } | null>(null);

  const getZoomFactor = () => {
    const currentZoom = map.getZoom();
    const baseZoom = 17;
    const baseFontSizeAtZoom = 10;
    const stepPerZoom = 5;
    let factor = 1 + (currentZoom - baseZoom) * (stepPerZoom / baseFontSizeAtZoom);
    return Math.min(3.0, Math.max(0.3, factor));
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !map) return;
    const size = map.getSize();
    canvas.width = size.x;
    canvas.height = size.y;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const angleRad = (map.options as any).angle ? (map.options as any).angle * Math.PI / 180 : 0;
    let isRotated = angleRad !== 0;
    if (isRotated) {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angleRad);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    const globalZoomFactor = getZoomFactor();
    const newHitAreas: Array<{ id: number; center: { x: number; y: number }; radius: number }> = [];

    drawings.forEach(drawing => {
      if (drawing.type !== 'text') return;
      // Определяем координаты для отображения (временные или из хранилища)
      let [lng, lat] = drawing.coordinates as [number, number];
      if (editMode.kind === 'text' && editMode.drawingId === drawing.id && tempLngLat) {
        [lng, lat] = tempLngLat;
      }
      const point = map.latLngToContainerPoint([lat, lng]);

      let {
        color = '#000000',
        fontSize: baseFontSize = 14,
        fontFamily = 'Arial',
        rotation = 0,
        opacity = 1,
        backgroundColor = 'rgba(255, 255, 255, 0.7)',
        backgroundPadding: baseBackgroundPadding = 6,
        backgroundBorderRadius: baseBackgroundBorderRadius = 4,
      } = drawing.style;

      // Используем временный угол вращения, если есть
      let finalRotation = rotation;
      if (editMode.kind === 'text' && editMode.drawingId === drawing.id && tempRotation !== null) {
        finalRotation = tempRotation;
      }

      let fontSizePx = baseFontSize * globalZoomFactor;
      fontSizePx = Math.min(48, Math.max(6, fontSizePx));
      let backgroundPadding = baseBackgroundPadding * globalZoomFactor;
      let backgroundBorderRadius = baseBackgroundBorderRadius * globalZoomFactor;

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.font = `${fontSizePx}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.shadowBlur = 0;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const text = drawing.text || drawing.name;
      const textWidth = ctx.measureText(text).width;
      const textHeight = fontSizePx * 1.2;

      ctx.translate(point.x, point.y);
      ctx.rotate(finalRotation * Math.PI / 180);

      // Рисуем фон
      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        const x = -textWidth / 2 - backgroundPadding;
        const y = -textHeight / 2;
        const w = textWidth + backgroundPadding * 2;
        const h = textHeight;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, backgroundBorderRadius);
        ctx.fill();
      }

      // Подсветка, если объект редактируется
      const isEditing = (editMode.kind === 'text' && editMode.drawingId === drawing.id);
      if (isEditing) {
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'gold';
        ctx.fillStyle = color;
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
      ctx.fillStyle = color;
      ctx.fillText(text, 0, 0);
      ctx.restore();

      newHitAreas.push({
        id: drawing.id,
        center: { x: point.x, y: point.y },
        radius: Math.max(20, fontSizePx * 0.8),
      });
    });

    textHitAreasRef.current = newHitAreas;

    // Маркеры редактирования для выбранного текста
    if (editMode.kind === 'text') {
      const editingDrawing = drawings.find(d => d.id === editMode.drawingId && d.type === 'text');
      if (editingDrawing) {
        let [lng, lat] = editingDrawing.coordinates as [number, number];
        if (tempLngLat) [lng, lat] = tempLngLat;
        const center = map.latLngToContainerPoint([lat, lng]);
        const zoomFactor = getZoomFactor();
        const markerRadius = 10 * zoomFactor;
        const smallRadius = 8 * zoomFactor;
        const offset = 40 * zoomFactor;

        ctx.save();
        ctx.shadowBlur = 0;

        // Перемещение
        ctx.beginPath();
        ctx.arc(center.x, center.y, markerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffaa00';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.font = `bold ${Math.max(12, 14 * zoomFactor)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⇄', center.x, center.y);

        // Вращение
        const rotPoint = { x: center.x, y: center.y - offset };
        ctx.beginPath();
        ctx.arc(rotPoint.x, rotPoint.y, smallRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#00aaff';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.fillText('↻', rotPoint.x, rotPoint.y);
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(rotPoint.x, rotPoint.y);
        ctx.strokeStyle = '#00aaff';
        ctx.setLineDash([5, 5]);
        ctx.stroke();

        // Редактирование свойств
        const editPoint = { x: center.x, y: center.y + offset };
        ctx.beginPath();
        ctx.arc(editPoint.x, editPoint.y, smallRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#44cc44';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.fillText('✎', editPoint.x, editPoint.y);
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(editPoint.x, editPoint.y);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.restore();

        editMarkerAreasRef.current = { center, rotPoint, editPoint };
      } else {
        editMarkerAreasRef.current = null;
      }
    } else {
      editMarkerAreasRef.current = null;
    }

    if (isRotated) {
      ctx.restore();
    }
  };

  const scheduleRedraw = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      redraw();
      rafRef.current = null;
    });
  };

  // Выбор текста по правому клику
  useEffect(() => {
    if (!map) return;
    const onContextMenu = (e: L.LeafletMouseEvent) => {
      if (editMode.kind !== 'none') return;
      const clickPoint = map.latLngToContainerPoint(e.latlng);
      const hit = textHitAreasRef.current.find(area => {
        const dx = clickPoint.x - area.center.x;
        const dy = clickPoint.y - area.center.y;
        return Math.hypot(dx, dy) <= area.radius;
      });
      if (hit) {
        e.originalEvent.preventDefault();
        onStartEditText(hit.id);
      }
    };
    map.on('contextmenu', onContextMenu);
    return () => {
      map.off('contextmenu', onContextMenu);
    };
  }, [map, editMode, onStartEditText]);

  // Левый клик – завершает редактирование, если клик не по маркерам
  useEffect(() => {
    if (!map) return;
    const onClick = (e: L.LeafletMouseEvent) => {
      if (editMode.kind !== 'text') return;
      const clickPoint = map.latLngToContainerPoint(e.latlng);
      let hitEditMarker = false;
      if (editMarkerAreasRef.current) {
        const { center, rotPoint, editPoint } = editMarkerAreasRef.current;
        const zoomFactor = getZoomFactor();
        const radiusMove = 12 * zoomFactor;
        const radiusSmall = 10 * zoomFactor;
        const distCenter = Math.hypot(clickPoint.x - center.x, clickPoint.y - center.y);
        const distRot = Math.hypot(clickPoint.x - rotPoint.x, clickPoint.y - rotPoint.y);
        const distEdit = Math.hypot(clickPoint.x - editPoint.x, clickPoint.y - editPoint.y);
        if (distCenter <= radiusMove || distRot <= radiusSmall || distEdit <= radiusSmall) {
          hitEditMarker = true;
        }
      }
      if (!hitEditMarker) {
        onStopEdit();
      }
    };
    map.on('click', onClick);
    return () => {
      map.off('click', onClick);
    };
  }, [map, editMode, onStopEdit]);

  // Двойной клик – модалка свойств
  useEffect(() => {
    if (!map) return;
    const onDoubleClick = (e: L.LeafletMouseEvent) => {
      if (editMode.kind !== 'none') return;
      const clickPoint = map.latLngToContainerPoint(e.latlng);
      const hit = textHitAreasRef.current.find(area => {
        const dx = clickPoint.x - area.center.x;
        const dy = clickPoint.y - area.center.y;
        return Math.hypot(dx, dy) <= area.radius;
      });
      if (hit) {
        const drawing = drawings.find(d => d.id === hit.id);
        if (drawing) onEditTextProperties(drawing);
      }
    };
    map.on('dblclick', onDoubleClick);
    return () => {
      map.off('dblclick', onDoubleClick);
    };
  }, [map, editMode, drawings, onEditTextProperties]);

  // Блокировка/разблокировка карты при редактировании
  useEffect(() => {
    if (!map) return;
    if (editMode.kind === 'text') {
      map.dragging.disable();
      map.doubleClickZoom.disable();
    } else {
      map.dragging.enable();
      map.doubleClickZoom.enable();
    }
    return () => {
      map.dragging.enable();
      map.doubleClickZoom.enable();
    };
  }, [map, editMode]);

  // Перетаскивание маркеров (оптимизированное)
  useEffect(() => {
    if (editMode.kind !== 'text') {
      setDragState(null);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseCanvasX = (e.clientX - rect.left) * scaleX;
      const mouseCanvasY = (e.clientY - rect.top) * scaleY;

      const editingDrawing = drawings.find(d => d.id === editMode.drawingId && d.type === 'text');
      if (!editingDrawing) return;
      let [lng, lat] = editingDrawing.coordinates as [number, number];
      if (tempLngLat) [lng, lat] = tempLngLat;
      const center = map.latLngToContainerPoint([lat, lng]);
      const zoomFactor = getZoomFactor();
      const radiusMove = 12 * zoomFactor;
      const radiusSmall = 10 * zoomFactor;

      const distMove = Math.hypot(mouseCanvasX - center.x, mouseCanvasY - center.y);
      if (distMove <= radiusMove) {
        setDragState({
          type: 'move',
          startCanvasPoint: { x: mouseCanvasX, y: mouseCanvasY },
          initialLngLat: [lng, lat],
          initialRotation: editingDrawing.style.rotation || 0,
        });
        e.preventDefault();
        return;
      }

      const offset = 40 * zoomFactor;
      const rotPoint = { x: center.x, y: center.y - offset };
      const distRotate = Math.hypot(mouseCanvasX - rotPoint.x, mouseCanvasY - rotPoint.y);
      if (distRotate <= radiusSmall) {
        setDragState({
          type: 'rotate',
          startCanvasPoint: { x: mouseCanvasX, y: mouseCanvasY },
          initialLngLat: [lng, lat],
          initialRotation: editingDrawing.style.rotation || 0,
        });
        e.preventDefault();
        return;
      }

      const editPoint = { x: center.x, y: center.y + offset };
      const distEdit = Math.hypot(mouseCanvasX - editPoint.x, mouseCanvasY - editPoint.y);
      if (distEdit <= radiusSmall) {
        onEditTextProperties(editingDrawing);
        e.preventDefault();
        return;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const currentCanvasX = (e.clientX - rect.left) * scaleX;
      const currentCanvasY = (e.clientY - rect.top) * scaleY;

      if (dragState.type === 'move') {
        const startLatLng = map.containerPointToLatLng([dragState.startCanvasPoint.x, dragState.startCanvasPoint.y]);
        const currentLatLng = map.containerPointToLatLng([currentCanvasX, currentCanvasY]);
        const newLng = dragState.initialLngLat[0] + (currentLatLng.lng - startLatLng.lng);
        const newLat = dragState.initialLngLat[1] + (currentLatLng.lat - startLatLng.lat);
        setTempLngLat([newLng, newLat]);
        scheduleRedraw();
        // Обновляем начальную точку для следующего шага
        setDragState(prev => prev ? { ...prev, startCanvasPoint: { x: currentCanvasX, y: currentCanvasY }, initialLngLat: [newLng, newLat] } : null);
      } else if (dragState.type === 'rotate') {
        const editingDrawing = drawings.find(d => d.id === editMode.drawingId && d.type === 'text');
        if (!editingDrawing) return;
        let [lng, lat] = editingDrawing.coordinates as [number, number];
        if (tempLngLat) [lng, lat] = tempLngLat;
        const center = map.latLngToContainerPoint([lat, lng]);
        const angleStart = Math.atan2(dragState.startCanvasPoint.y - center.y, dragState.startCanvasPoint.x - center.x);
        const angleCurrent = Math.atan2(currentCanvasY - center.y, currentCanvasX - center.x);
        let deltaAngle = (angleCurrent - angleStart) * 180 / Math.PI;
        let newRotation = (dragState.initialRotation + deltaAngle) % 360;
        if (newRotation < 0) newRotation += 360;
        setTempRotation(newRotation);
        scheduleRedraw();
        setDragState(prev => prev ? { ...prev, startCanvasPoint: { x: currentCanvasX, y: currentCanvasY }, initialRotation: newRotation } : null);
      }
    };

    const handleMouseUp = () => {
      if (dragState) {
        // Отправляем финальные изменения на сервер
        if (dragState.type === 'move' && tempLngLat) {
          onUpdateText(editMode.drawingId, tempLngLat, dragState.initialRotation);
        } else if (dragState.type === 'rotate' && tempRotation !== null) {
          let finalLngLat = dragState.initialLngLat;
          if (tempLngLat) finalLngLat = tempLngLat;
          onUpdateText(editMode.drawingId, finalLngLat, tempRotation);
        }
        setTempLngLat(null);
        setTempRotation(null);
        setDragState(null);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [map, editMode, drawings, dragState, onUpdateText, onEditTextProperties, scheduleRedraw, tempLngLat, tempRotation]);

  // Перерисовка при событиях карты
  useEffect(() => {
    if (!map) return;
    map.on('move', scheduleRedraw);
    map.on('moveend', scheduleRedraw);
    map.on('zoom', scheduleRedraw);
    map.on('zoomend', scheduleRedraw);
    map.on('viewreset', scheduleRedraw);
    map.on('rotate', scheduleRedraw);
    scheduleRedraw();
    return () => {
      map.off('move', scheduleRedraw);
      map.off('moveend', scheduleRedraw);
      map.off('zoom', scheduleRedraw);
      map.off('zoomend', scheduleRedraw);
      map.off('viewreset', scheduleRedraw);
      map.off('rotate', scheduleRedraw);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [map, drawings]);

  useEffect(() => {
    const observer = new ResizeObserver(() => scheduleRedraw());
    const container = map.getContainer();
    if (container) observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  const canvasStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: editMode.kind === 'text' ? 'auto' : 'none',
    zIndex: 500,
  };

  return <canvas ref={canvasRef} style={canvasStyle} />;
};

export default CanvasTextLayer;