// src/modules/Map/ui/UnifiedControls/UnifiedControls.tsx
import React, { useState, useEffect } from 'react';
import { useMap, Polyline, Polygon, Rectangle, Circle, CircleMarker } from 'react-leaflet';
import { Button, Tooltip, message, Popconfirm, theme } from 'antd';
import { useMapMeasure } from '../../hooks/useMapMeasure';
import { useDrawing } from '../../hooks/useDrawing';
import { useMouseCoordinates } from '../../hooks/useMouseCoordinates';
import DrawingModal from '../DrawingModal/DrawingModal';
import MapToPDF from '../../components/MapToPDF';
import { DrawingType, EditMode } from '../../types/map.types';
import './UnifiedControls.css';

// Material Icons
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import StraightenIcon from '@mui/icons-material/Straighten';
import TimelineIcon from '@mui/icons-material/Timeline';
import PentagonIcon from '@mui/icons-material/Pentagon';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CircleIcon from '@mui/icons-material/Circle';
import TitleIcon from '@mui/icons-material/Title';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const { useToken } = theme;

interface UnifiedControlsProps {
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;
  onDeleteCurrent?: () => void;
  onEditProperties?: () => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  selectedLayerId: number | null;
  mapWrapperRef?: React.RefObject<HTMLDivElement>;
}

const UnifiedControls: React.FC<UnifiedControlsProps> = ({
  editMode,
  setEditMode,
  onDeleteCurrent,
  onEditProperties,
  onSaveEdit,
  onCancelEdit,
  selectedLayerId,
  mapWrapperRef,
}) => {
  const { token } = useToken();
  const map = useMap();
  const mouseLatLng = useMouseCoordinates();
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

  useEffect(() => {
    if (!map) return;
    const handleZoomEnd = () => setZoom(map.getZoom());
    map.on('zoomend', handleZoomEnd);
    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map]);

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

  const isEditModeActive = editMode.kind !== 'none';

  const panelStyle: React.CSSProperties = {
    background: `${token.colorBgElevated}cc`,
    backdropFilter: 'blur(20px)',
    border: `0.5px solid ${token.colorBorder}`,
    boxShadow: token.boxShadow,
  };

  const editPanelStyle: React.CSSProperties = {
    background: `${token.colorBgElevated}cc`,
    backdropFilter: 'blur(20px)',
    border: `0.5px solid ${token.colorBorder}`,
    boxShadow: token.boxShadow,
  };

  const getButtonClass = (active: boolean) => `control-btn ${active ? 'active' : ''}`;

  return (
    <>
      {/* Основная панель инструментов (справа) */}
      <div className="unified-controls" style={panelStyle}>
        <Tooltip title="Приблизить" placement="left">
          <Button className="control-btn" icon={<ZoomInIcon />} onClick={zoomIn} />
        </Tooltip>
        <div className="zoom-value" style={{ color: token.colorText, background: `${token.colorBgContainer}80` }}>
          {zoom}
        </div>
        <Tooltip title="Отдалить" placement="left">
          <Button className="control-btn" icon={<ZoomOutIcon />} onClick={zoomOut} />
        </Tooltip>

        <div className="divider" style={{ background: token.colorBorder }} />

        <Tooltip title="Линейка" placement="left">
          <Button
            className={getButtonClass(isMeasuring)}
            style={{
              backgroundColor: isMeasuring ? token.colorPrimary : 'transparent',
              color: isMeasuring ? '#fff' : token.colorText,
            }}
            onClick={toggleMeasure}
            icon={<StraightenIcon />}
          />
        </Tooltip>

        <div className="divider" style={{ background: token.colorBorder }} />

        <Tooltip title="Линия (полилиния)" placement="left">
          <Button
            className={getButtonClass(drawingType === 'polyline')}
            onClick={() => handleStartDrawing('polyline')}
            disabled={!isLayerSelected}
            icon={<TimelineIcon />}
          />
        </Tooltip>

        <Tooltip title="Полигон" placement="left">
          <Button
            className={getButtonClass(drawingType === 'polygon')}
            onClick={() => handleStartDrawing('polygon')}
            disabled={!isLayerSelected}
            icon={<PentagonIcon />}
          />
        </Tooltip>

        <Tooltip title="Прямоугольник" placement="left">
          <Button
            className={getButtonClass(drawingType === 'rectangle')}
            onClick={() => handleStartDrawing('rectangle')}
            disabled={!isLayerSelected}
            icon={<CropSquareIcon />}
          />
        </Tooltip>

        <Tooltip title="Круг" placement="left">
          <Button
            className={getButtonClass(drawingType === 'circle')}
            onClick={() => handleStartDrawing('circle')}
            disabled={!isLayerSelected}
            icon={<CircleIcon />}
          />
        </Tooltip>

        <Tooltip title="Текстовая надпись" placement="left">
          <Button
            className={getButtonClass(drawingType === 'text')}
            onClick={() => handleStartDrawing('text')}
            disabled={!isLayerSelected}
            icon={<TitleIcon />}
          />
        </Tooltip>

        {isDrawing && (drawingType === 'polyline' || drawingType === 'polygon') && drawingPoints.length >= 2 && (
          <>
            <div className="divider" style={{ background: token.colorBorder }} />
            <Tooltip title="Завершить рисование" placement="left">
              <Button
                className="control-btn complete-btn"
                onClick={forceComplete}
                icon={<SaveIcon style={{ color: '#fff' }} />}
                style={{ backgroundColor: token.colorSuccess, color: '#fff' }}
              />
            </Tooltip>
          </>
        )}

        <div className="divider" style={{ background: token.colorBorder }} />
        
        <MapToPDF mapWrapperRef={mapWrapperRef} />
      </div>

      {/* Плавающий блок расстояния (если активна линейка) */}
      {isMeasuring && totalDistance > 0 && (
        <div
          className="measure-distance-floating"
          style={{
            position: 'absolute',
            bottom: 670,
            right: 80,
            zIndex: 1001,
            background: `${token.colorBgElevated}cc`,
            backdropFilter: 'blur(8px)',
            color: token.colorText,
            border: `0.5px solid ${token.colorBorder}`,
            borderRadius: 20,
            padding: '6px 12px',
            fontSize: 12,
            fontFamily: 'monospace',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            boxShadow: token.boxShadow,
          }}
        >
          📏 {formatDistance(totalDistance)}
        </div>
      )}

      {/* Панель редактирования (слева) */}
      {isEditModeActive && (
        <div className="edit-controls" style={editPanelStyle}>
          <Tooltip title="Отменить редактирование" placement="right">
            <Button className="control-btn" onClick={handleCancelEdit} icon={<CloseIcon />} />
          </Tooltip>
          <Tooltip title="Свойства" placement="right">
            <Button className="control-btn" onClick={onEditProperties} icon={<EditIcon />} />
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
                <Button
                  className="control-btn danger-btn"
                  icon={<DeleteIcon style={{ color: '#fff' }} />}
                  style={{ backgroundColor: token.colorError }}
                />
              </Tooltip>
            </Popconfirm>
          )}
          {editMode.kind === 'geometry' && (
            <>
              <Tooltip title="Сохранить изменения" placement="right">
                <Button
                  className="control-btn success-btn"
                  onClick={onSaveEdit}
                  icon={<SaveIcon style={{ color: '#fff' }} />}
                  style={{ backgroundColor: token.colorSuccess }}
                />
              </Tooltip>
              <Tooltip title="Отменить изменения" placement="right">
                <Button
                  className="control-btn danger-btn"
                  onClick={onCancelEdit}
                  icon={<CancelIcon style={{ color: '#fff' }} />}
                  style={{ backgroundColor: token.colorError }}
                />
              </Tooltip>
            </>
          )}
        </div>
      )}

      {/* Временные фигуры при измерении */}
      {isMeasuring && polylinePoints.length >= 2 && (
        <Polyline positions={polylinePoints} color={token.colorError} weight={4} opacity={0.8} />
      )}
      {isMeasuring && measurePoints.map((point, idx) => (
        <CircleMarker
          key={idx}
          center={[point[1], point[0]]}
          radius={5}
          pathOptions={{ color: token.colorError, fillColor: token.colorError, fillOpacity: 1 }}
        />
      ))}

      {/* Временная фигура из хука useDrawing */}
      {isDrawing && tempFigure && (
        <>
          {tempFigure.type === 'polyline' && tempFigure.points && tempFigure.points.length >= 2 && (
            <Polyline
              positions={tempFigure.points.map((p: number[]) => [p[1], p[0]])}
              pathOptions={{ color: token.colorPrimary, weight: 3 }}
            />
          )}
          {tempFigure.type === 'polygon' && tempFigure.points && tempFigure.points.length >= 3 && (
            <Polygon
              positions={tempFigure.points.map((p: number[]) => [p[1], p[0]])}
              pathOptions={{ color: token.colorPrimary, weight: 3, fillOpacity: 0.1 }}
            />
          )}
          {tempFigure.type === 'rectangle' && tempFigure.bounds && tempFigure.bounds.length === 2 && (
            <Rectangle
              bounds={[[tempFigure.bounds[0][1], tempFigure.bounds[0][0]], [tempFigure.bounds[1][1], tempFigure.bounds[1][0]]]}
              pathOptions={{ color: token.colorPrimary, weight: 3 }}
            />
          )}
          {tempFigure.type === 'circle' && tempFigure.center && tempFigure.radius && (
            <Circle
              center={[tempFigure.center[1], tempFigure.center[0]]}
              radius={tempFigure.radius}
              pathOptions={{ color: token.colorPrimary, weight: 3, fillOpacity: 0.1 }}
            />
          )}
        </>
      )}

      {/* Резиновая линия для полилинии/полигона */}
      {isDrawing && (drawingType === 'polyline' || drawingType === 'polygon') && drawingPoints.length >= 1 && mouseLatLng && (
        <Polyline
          positions={[
            [drawingPoints[drawingPoints.length - 1][1], drawingPoints[drawingPoints.length - 1][0]],
            [mouseLatLng.lat, mouseLatLng.lng],
          ]}
          pathOptions={{ color: token.colorPrimary, weight: 3, opacity: 0.8 }}
        />
      )}

      {/* Подсказка внизу экрана во время рисования */}
      {isDrawing && (
        <div
          className="drawing-hint"
          style={{
            background: `${token.colorBgElevated}cc`,
            backdropFilter: 'blur(8px)',
            color: token.colorText,
            border: `0.5px solid ${token.colorBorder}`,
            borderRadius: 40,
            padding: '8px 16px',
            fontSize: 12,
            whiteSpace: 'nowrap',
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            pointerEvents: 'none',
          }}
        >
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