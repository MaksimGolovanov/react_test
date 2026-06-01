// src/modules/Map/ui/UnifiedControls/UnifiedControls.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useMap, Polyline, Polygon, Rectangle, Circle, CircleMarker } from 'react-leaflet';
import { Button, Tooltip, message, Popconfirm } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  MinusOutlined,
  CompassOutlined,
  RotateLeftOutlined,
} from '@ant-design/icons';
import { useMapMeasure } from '../../hooks/useMapMeasure';
import { useDrawing } from '../../hooks/useDrawing';
import DrawingModal from '../DrawingModal/DrawingModal';
import { DrawingType, EditMode } from '../../types/map.types';
import './UnifiedControls.css';

interface UnifiedControlsProps {
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;
  onDeleteCurrent?: () => void;
  onEditProperties?: () => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  selectedLayerId: number | null;
}

const UnifiedControls: React.FC<UnifiedControlsProps> = ({
  editMode,
  setEditMode,
  onDeleteCurrent,
  onEditProperties,
  onSaveEdit,
  onCancelEdit,
  selectedLayerId,
}) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const [rotationAngle, setRotationAngle] = useState<number>(() => {
    // Попытка получить угол через getAngle, если он есть
    return typeof (map as any).getAngle === 'function' ? (map as any).getAngle() : 0;
  });

  const { isMeasuring, totalDistance, polylinePoints, points: measurePoints, toggleMeasure } = useMapMeasure();

  const [drawingType, setDrawingType] = useState<DrawingType | null>(null);
  const [drawingModalVisible, setDrawingModalVisible] = useState(false);
  const [pendingDrawing, setPendingDrawing] = useState<{ type: DrawingType; coordinates: any } | null>(null);
  const isLayerSelected = selectedLayerId !== null;

  const {
    startDrawing,
    isDrawing,
    tempFigure,
    stopDrawing,
    points: drawingPoints,
    forceComplete,
  } = useDrawing({
    type: drawingType,
    onComplete: (data) => {
      setPendingDrawing({ type: drawingType!, coordinates: data.coordinates });
      setDrawingModalVisible(true);
      setDrawingType(null);
    },
  });

  // Подписываемся на события карты (zoomend и rotate)
  useEffect(() => {
    if (!map) return;

    const onZoomEnd = () => setZoom(map.getZoom());
    const onRotate = () => {
      if (typeof (map as any).getAngle === 'function') {
        setRotationAngle((map as any).getAngle());
      }
    };

    map.on('zoomend', onZoomEnd);
    map.on('rotate', onRotate);

    // Устанавливаем начальный угол
    if (typeof (map as any).getAngle === 'function') {
      setRotationAngle((map as any).getAngle());
    }

    return () => {
      map.off('zoomend', onZoomEnd);
      map.off('rotate', onRotate);
    };
  }, [map]);

  const zoomIn = () => map.zoomIn();
  const zoomOut = () => map.zoomOut();

  const resetRotation = () => {
    if (typeof (map as any).setAngle === 'function') {
      (map as any).setAngle(0);
      setRotationAngle(0);
      message.success('Поворот карты сброшен на Север');
    } else {
      message.warning('Поворот карты не поддерживается');
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(2)} км`;
    return `${Math.round(meters)} м`;
  };

  const handleStartDrawing = (type: DrawingType) => {
    if (!isLayerSelected) {
      message.warning('Сначала выберите слой');
      return;
    }
    if (isMeasuring) toggleMeasure();
    setDrawingType(type);
    startDrawing();
    if (type === 'polyline') {
      message.info('Рисование линии: кликайте для добавления точек, двойной клик или кнопка "Завершить" — окончание. Escape — отмена.');
    } else if (type === 'polygon') {
      message.info('Рисование полигона: кликайте для добавления точек, двойной клик или кнопка "Завершить" — окончание. Escape — отмена.');
    } else if (type === 'rectangle') {
      message.info('Рисование прямоугольника: первый клик — начало, второй клик — завершение. Escape — отмена.');
    } else if (type === 'circle') {
      message.info('Рисование круга: первый клик — центр, второй клик — радиус. Escape — отмена.');
    } else if (type === 'text') {
      message.info('Режим текста: кликните на карте, чтобы разместить надпись.');
    }
  };

  const handleDrawingModalSuccess = () => {
    setDrawingModalVisible(false);
    setPendingDrawing(null);
    if (isDrawing) stopDrawing();
  };

  const handleCancelEdit = () => {
    if (editMode.kind === 'geometry' && onCancelEdit) {
      onCancelEdit();
    } else if (editMode.kind === 'text') {
      setEditMode({ kind: 'none' });
      message.info('Режим редактирования текста отменён');
    } else {
      setEditMode({ kind: 'none' });
    }
  };

  const isEditModeActive = editMode.kind !== 'none';

  // --- Refs и позиционирование блока расстояния (оставляем без изменений) ---
  const panelRef = useRef<HTMLDivElement>(null);
  const [distanceBlockStyle, setDistanceBlockStyle] = useState<React.CSSProperties | null>(null);

  const updateDistanceBlockPosition = () => {
    if (panelRef.current && isMeasuring) {
      const rect = panelRef.current.getBoundingClientRect();
      const blockWidth = 130;
      const offset = 12;
      setDistanceBlockStyle({
        position: 'fixed',
        left: rect.left - blockWidth - offset,
        top: rect.top + 10,
        zIndex: 1001,
      });
    } else {
      setDistanceBlockStyle(null);
    }
  };

  useEffect(() => {
    updateDistanceBlockPosition();
    window.addEventListener('resize', updateDistanceBlockPosition);
    window.addEventListener('scroll', updateDistanceBlockPosition);
    return () => {
      window.removeEventListener('resize', updateDistanceBlockPosition);
      window.removeEventListener('scroll', updateDistanceBlockPosition);
    };
  }, [isMeasuring]);

  useEffect(() => {
    const observer = new ResizeObserver(() => updateDistanceBlockPosition());
    if (panelRef.current) observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, []);
  // --- конец блока расстояния ---

  return (
    <>
      <div className="unified-controls" ref={panelRef}>
        <Tooltip title="Приблизить" placement="left">
          <Button className="control-btn" icon={<PlusOutlined />} onClick={zoomIn} />
        </Tooltip>
        <div className="zoom-value">{zoom}</div>
        <Tooltip title="Отдалить" placement="left">
          <Button className="control-btn" icon={<MinusOutlined />} onClick={zoomOut} />
        </Tooltip>

        <div className="divider" />

        <Tooltip title="Линейка" placement="left">
          <Button
            className={`control-btn ${isMeasuring ? 'active' : ''}`}
            onClick={toggleMeasure}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M3.56 14.363 14.363 3.56a1.91 1.91 0 0 1 2.7 0l3.377 3.376a1.91 1.91 0 0 1 0 2.7L9.636 20.442a1.91 1.91 0 0 1-2.7 0l-3.377-3.377a1.91 1.91 0 0 1 0-2.7m4.12-.743 1.282-1.282 1.823 1.824a.764.764 0 1 0 1.08-1.082l-1.824-1.822 1.216-1.215 1.148 1.145a.763.763 0 0 0 1.318-.534.77.77 0 0 0-.237-.545l-1.148-1.147 1.282-1.283 1.824 1.824a.764.764 0 0 0 1.08-1.082l-1.825-1.824 1.014-1.012a.478.478 0 1 0-.676-.675L4.91 15.038a.478.478 0 0 0 .675.675l1.012-1.012 1.15 1.146a.764.764 0 1 0 1.08-1.079z" />
              </svg>
            }
          />
        </Tooltip>

        <div className="divider" />

        {/* Компас и сброс */}
        <div className="rotation-control">
          <Tooltip title={`Текущий угол: ${Math.round(rotationAngle)}°`} placement="left">
            <div className="rotation-angle">
              <CompassOutlined style={{ fontSize: 14, marginRight: 2 }} />
              {Math.round(rotationAngle)}°
            </div>
          </Tooltip>
          <Tooltip title="Сбросить поворот на Север" placement="left">
            <Button className="control-btn" onClick={resetRotation} icon={<RotateLeftOutlined />} />
          </Tooltip>
        </div>

        <div className="divider" />

        {/* Кнопки рисования (оставлены как в исходном коде) */}
        <Tooltip title="Линия (полилиния)" placement="left">
          <Button
            className={`control-btn ${drawingType === 'polyline' ? 'active' : ''}`}
            onClick={() => handleStartDrawing('polyline')}
            disabled={!isLayerSelected}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 4L4 7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 17L17 20" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
          />
        </Tooltip>

        <Tooltip title="Полигон" placement="left">
          <Button
            className={`control-btn ${drawingType === 'polygon' ? 'active' : ''}`}
            onClick={() => handleStartDrawing('polygon')}
            disabled={!isLayerSelected}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="12,3 22,8 22,16 12,21 2,16 2,8 12,3" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            }
          />
        </Tooltip>

        <Tooltip title="Прямоугольник" placement="left">
          <Button
            className={`control-btn ${drawingType === 'rectangle' ? 'active' : ''}`}
            onClick={() => handleStartDrawing('rectangle')}
            disabled={!isLayerSelected}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            }
          />
        </Tooltip>

        <Tooltip title="Круг" placement="left">
          <Button
            className={`control-btn ${drawingType === 'circle' ? 'active' : ''}`}
            onClick={() => handleStartDrawing('circle')}
            disabled={!isLayerSelected}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            }
          />
        </Tooltip>

        <Tooltip title="Текстовая надпись" placement="left">
          <Button
            className={`control-btn ${drawingType === 'text' ? 'active' : ''}`}
            onClick={() => handleStartDrawing('text')}
            disabled={!isLayerSelected}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
        </Tooltip>

        {isDrawing && (drawingType === 'polyline' || drawingType === 'polygon') && drawingPoints.length >= 2 && (
          <>
            <div className="divider" />
            <Tooltip title="Завершить рисование" placement="left">
              <Button className="control-btn complete-btn" onClick={forceComplete} icon={<CheckOutlined />} />
            </Tooltip>
          </>
        )}
      </div>

      {/* Блок расстояния (запасной вариант) */}
      {isMeasuring && totalDistance > 0 && (
        <div className="measure-distance-floating" style={{ position: 'absolute', bottom: 670, right: 80, zIndex: 1001 }}>
          📏 {formatDistance(totalDistance)}
        </div>
      )}

      {/* Панель редактирования */}
      {isEditModeActive && (
        <div className="edit-controls">
          <Tooltip title="Отменить редактирование" placement="right">
            <Button className="control-btn" onClick={handleCancelEdit} icon={<CloseOutlined />} />
          </Tooltip>
          <Tooltip title="Свойства" placement="right">
            <Button className="control-btn" onClick={onEditProperties} icon={<EditOutlined />} />
          </Tooltip>
          {onDeleteCurrent && (
            <Popconfirm
              title="Удалить объект?"
              description="Вы уверены, что хотите удалить этот объект?"
              onConfirm={onDeleteCurrent}
              okText="Да"
              cancelText="Нет"
              okType="danger"
            >
              <Tooltip title="Удалить" placement="right">
                <Button className="control-btn danger-btn" icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
          {editMode.kind === 'geometry' && (
            <>
              <Tooltip title="Сохранить изменения" placement="right">
                <Button className="control-btn success-btn" onClick={onSaveEdit} icon={<CheckOutlined />} />
              </Tooltip>
              <Tooltip title="Отменить изменения" placement="right">
                <Button className="control-btn danger-btn" onClick={onCancelEdit} icon={<CloseOutlined />} />
              </Tooltip>
            </>
          )}
        </div>
      )}

      {/* Линия измерения */}
      {isMeasuring && polylinePoints.length >= 2 && <Polyline positions={polylinePoints} color="#ff4d4f" weight={4} opacity={0.8} />}
      {isMeasuring && measurePoints.map((point, idx) => (
        <CircleMarker key={idx} center={[point[1], point[0]]} radius={5} pathOptions={{ color: '#ff4d4f', fillColor: '#ff4d4f', fillOpacity: 1 }} />
      ))}

      {/* Временная фигура */}
      {isDrawing && tempFigure && (
        <>
          {tempFigure.type === 'polyline' && tempFigure.points && tempFigure.points.length >= 2 && (
            <Polyline positions={tempFigure.points.map(p => [p[1], p[0]])} pathOptions={{ color: '#ff4d4f', weight: 3 }} />
          )}
          {tempFigure.type === 'polygon' && tempFigure.points && tempFigure.points.length >= 3 && (
            <Polygon positions={tempFigure.points.map(p => [p[1], p[0]])} pathOptions={{ color: '#ff4d4f', weight: 3, fillOpacity: 0.1 }} />
          )}
          {tempFigure.type === 'rectangle' && tempFigure.bounds && tempFigure.bounds.length === 2 && (
            <Rectangle bounds={[[tempFigure.bounds[0][1], tempFigure.bounds[0][0]], [tempFigure.bounds[1][1], tempFigure.bounds[1][0]]]} pathOptions={{ color: '#ff4d4f', weight: 3 }} />
          )}
          {tempFigure.type === 'circle' && tempFigure.center && tempFigure.radius && (
            <Circle center={[tempFigure.center[1], tempFigure.center[0]]} radius={tempFigure.radius} pathOptions={{ color: '#ff4d4f', weight: 3, fillOpacity: 0.1 }} />
          )}
        </>
      )}

      {/* Подсказка при рисовании */}
      {isDrawing && (
        <div className="drawing-hint">
          {drawingType === 'polyline' && '🔹 Линия: клик – точка, двойной клик или кнопка ✅ – завершить, ESC – отмена'}
          {drawingType === 'polygon' && '🔹 Полигон: клик – точка, двойной клик или кнопка ✅ – завершить, ESC – отмена'}
          {drawingType === 'rectangle' && '🔹 Прямоугольник: первый клик – угол, второй клик – завершить, ESC – отмена'}
          {drawingType === 'circle' && '🔹 Круг: первый клик – центр, второй клик – радиус, ESC – отмена'}
        </div>
      )}

      <DrawingModal
        visible={drawingModalVisible}
        drawing={null}
        initialData={pendingDrawing}
        onCancel={() => {
          setDrawingModalVisible(false);
          setPendingDrawing(null);
          if (isDrawing) stopDrawing();
        }}
        onSuccess={handleDrawingModalSuccess}
      />
    </>
  );
};

export default UnifiedControls;