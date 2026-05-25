// src/modules/Map/ui/UnifiedControls/UnifiedControls.tsx
import React, { useState } from 'react';
import { useMap, Polyline, Polygon, Rectangle, Circle, CircleMarker, useMapEvents } from 'react-leaflet';
import { Button, Tooltip, message, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
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

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  const zoomIn = () => map.zoomIn();
  const zoomOut = () => map.zoomOut();

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

  const panelStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    left: 'auto',
    zIndex: 1000,
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    width: '40px',
  };

  const editPanelStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 1000,
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    width: '40px',
  };

  const distanceStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '730px',
    left: '20px',
    background: 'white',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    pointerEvents: 'none',
    zIndex: 1001,
  };

  const hintStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    zIndex: 2000,
    background: 'rgba(0,0,0,0.75)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '12px',
    fontFamily: 'sans-serif',
    pointerEvents: 'none',
    backdropFilter: 'blur(4px)',
  };

  const isEditModeActive = editMode.kind !== 'none';

  return (
    <>
      {/* Основная панель инструментов (справа) */}
      <div className="unified-controls" style={panelStyle}>
        <Button className="control-btn" onClick={zoomIn}>+</Button>
        <div className="zoom-value">{zoom}</div>
        <Button className="control-btn" onClick={zoomOut}>−</Button>

        <Tooltip title="Линейка">
          <Button
            className={`control-btn ${isMeasuring ? 'active' : ''}`}
            onClick={toggleMeasure}
            
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path fill="currentColor" d="M3.56 14.363 14.363 3.56a1.91 1.91 0 0 1 2.7 0l3.377 3.376a1.91 1.91 0 0 1 0 2.7L9.636 20.442a1.91 1.91 0 0 1-2.7 0l-3.377-3.377a1.91 1.91 0 0 1 0-2.7m4.12-.743 1.282-1.282 1.823 1.824a.764.764 0 1 0 1.08-1.082l-1.824-1.822 1.216-1.215 1.148 1.145a.763.763 0 0 0 1.318-.534.77.77 0 0 0-.237-.545l-1.148-1.147 1.282-1.283 1.824 1.824a.764.764 0 0 0 1.08-1.082l-1.825-1.824 1.014-1.012a.478.478 0 1 0-.676-.675L4.91 15.038a.478.478 0 0 0 .675.675l1.012-1.012 1.15 1.146a.764.764 0 1 0 1.08-1.079z" />
            </svg>
          </Button>
        </Tooltip>

        <Tooltip title="Линия (полилиния)">
          <Button
            className={`control-btn ${drawingType === 'polyline' ? 'active' : ''}`}
            onClick={() => handleStartDrawing('polyline')}
            disabled={!isLayerSelected}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M7 4L4 7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 17L17 20" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Button>
        </Tooltip>

        <Tooltip title="Полигон">
          <Button
            className={`control-btn ${drawingType === 'polygon' ? 'active' : ''}`}
            onClick={() => handleStartDrawing('polygon')}
            disabled={!isLayerSelected}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="12,3 22,8 22,16 12,21 2,16 2,8 12,3" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </Button>
        </Tooltip>

        <Tooltip title="Прямоугольник">
          <Button
            className={`control-btn ${drawingType === 'rectangle' ? 'active' : ''}`}
            onClick={() => handleStartDrawing('rectangle')}
            disabled={!isLayerSelected}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </Button>
        </Tooltip>

        <Tooltip title="Круг">
          <Button
            className={`control-btn ${drawingType === 'circle' ? 'active' : ''}`}
            onClick={() => handleStartDrawing('circle')}
            disabled={!isLayerSelected}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </Button>
        </Tooltip>

        <Tooltip title="Текстовая надпись">
          <Button
            className={`control-btn ${drawingType === 'text' ? 'active' : ''}`}
            onClick={() => handleStartDrawing('text')}
            disabled={!isLayerSelected}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Button>
        </Tooltip>

        {/* Кнопка "Завершить" для полилинии/полигона */}
        {isDrawing && (drawingType === 'polyline' || drawingType === 'polygon') && drawingPoints.length >= 2 && (
          <Tooltip title="Завершить рисование">
            <Button
              className="control-btn"
              onClick={forceComplete}
              style={{ backgroundColor: '#52c41a', color: 'white' }}
            >
              <CheckOutlined />
            </Button>
          </Tooltip>
        )}
      </div>

      {/* Панель инструментов редактирования (слева, появляется при активном режиме) */}
      {isEditModeActive && (
        <div style={editPanelStyle}>
          <Tooltip title="Отменить редактирование">
            <Button
              className="control-btn"
              onClick={handleCancelEdit}
              style={{ color: '#ff4d4f' }}
            >
              <CloseOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Свойства">
            <Button
              className="control-btn"
              onClick={onEditProperties}
              style={{ color: '#1890ff' }}
            >
              <EditOutlined />
            </Button>
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
              <Tooltip title="Удалить">
                <Button className="control-btn" danger>
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </Popconfirm>
          )}
          {/* Кнопки Сохранить / Отменить для геометрии */}
          {editMode.kind === 'geometry' && (
            <>
              <Tooltip title="Сохранить изменения">
                <Button
                  className="control-btn"
                  onClick={onSaveEdit}
                  style={{ backgroundColor: '#52c41a', color: 'white' }}
                >
                  <CheckOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="Отменить изменения">
                <Button
                  className="control-btn"
                  onClick={onCancelEdit}
                  style={{ color: '#ff4d4f' }}
                >
                  <CloseOutlined />
                </Button>
              </Tooltip>
            </>
          )}
        </div>
      )}

      {/* Отображение расстояния при измерении */}
      {isMeasuring && (
        <div style={distanceStyle}>
          📏 {formatDistance(totalDistance)}
        </div>
      )}

      {/* Рисование временной линии измерения */}
      {isMeasuring && polylinePoints.length >= 2 && (
        <Polyline positions={polylinePoints} color="red" weight={4} opacity={0.7} />
      )}
      {isMeasuring && measurePoints.map((point, idx) => (
        <CircleMarker
          key={idx}
          center={[point[1], point[0]]}
          radius={5}
          pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 1 }}
        />
      ))}

      {/* Временный предпросмотр фигуры при рисовании */}
      {isDrawing && tempFigure && (
        <>
          {tempFigure.type === 'polyline' && tempFigure.points && tempFigure.points.length >= 2 && (
            <Polyline positions={tempFigure.points.map(p => [p[1], p[0]])} pathOptions={{ color: '#ff0000', weight: 3 }} />
          )}
          {tempFigure.type === 'polygon' && tempFigure.points && tempFigure.points.length >= 3 && (
            <Polygon positions={tempFigure.points.map(p => [p[1], p[0]])} pathOptions={{ color: '#ff0000', weight: 3, fillOpacity: 0.1 }} />
          )}
          {tempFigure.type === 'rectangle' && tempFigure.bounds && tempFigure.bounds.length === 2 && (
            <Rectangle bounds={[[tempFigure.bounds[0][1], tempFigure.bounds[0][0]], [tempFigure.bounds[1][1], tempFigure.bounds[1][0]]]} pathOptions={{ color: '#ff0000', weight: 3 }} />
          )}
          {tempFigure.type === 'circle' && tempFigure.center && tempFigure.radius && (
            <Circle center={[tempFigure.center[1], tempFigure.center[0]]} radius={tempFigure.radius} pathOptions={{ color: '#ff0000', weight: 3, fillOpacity: 0.1 }} />
          )}
        </>
      )}

      {/* Подсказка при рисовании */}
      {isDrawing && (
        <div style={hintStyle}>
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