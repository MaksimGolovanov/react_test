// src/modules/Map/ui/SidebarTree/SidebarTree.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Input, Tree, Checkbox, Button, Tooltip, Space, Badge, Typography } from 'antd';
import {
  SearchOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  EnvironmentOutlined,
  ExpandOutlined,
  CompressOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Menu, Item, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import mapStore from '../../store/MapStore';
import type { Marker, Drawing, EditMode } from '../../types/map.types';
import './SidebarTree.css';

const { Text } = Typography;

type FilterType = 'all' | 'markers' | 'drawings' | 'visible';

interface SidebarTreeProps {
  selectedLayerId: number | null;
  onSelectLayer: (id: number | null) => void;
  onSelectMarker: (marker: Marker) => void;
  onSelectDrawing: (drawing: Drawing) => void;
  visibleLayers: Record<number, boolean>;
  onToggleLayerVisibility: (layerId: number, visible: boolean) => void;
  onEditDrawing: (drawing: Drawing) => void;
  editMode: EditMode;
}

const SidebarTree: React.FC<SidebarTreeProps> = observer(({
  selectedLayerId,
  onSelectLayer,
  onSelectMarker,
  onSelectDrawing,
  visibleLayers,
  onToggleLayerVisibility,
  onEditDrawing,
  editMode,
}) => {
  const [searchText, setSearchText] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const { layers, markers, drawings } = mapStore;

  const { show: showLayerContext } = useContextMenu({ id: 'layer-context-menu' });
  const { show: showDrawingContext } = useContextMenu({ id: 'drawing-context-menu' });

  // Иконка типа drawing
  const getDrawingIcon = (type: string) => {
    switch(type) {
      case 'polyline': return '📏';
      case 'polygon': return '🔷';
      case 'rectangle': return '◻️';
      case 'circle': return '⚪';
      case 'text': return '🅃';
      default: return '📐';
    }
  };

  // Подсветка текста поиска
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : part
    );
  };

  // Фильтрация
  const visibleFilter = useCallback((layerId: number) => {
    if (filter === 'visible') return visibleLayers[layerId];
    return true;
  }, [filter, visibleLayers]);

  const typeFilter = useCallback((itemType: 'marker' | 'drawing') => {
    if (filter === 'markers') return itemType === 'marker';
    if (filter === 'drawings') return itemType === 'drawing';
    return true;
  }, [filter]);

  // Функции для разворачивания/сворачивания
  const expandAll = useCallback(() => {
    const allKeys = layers.map(layer => `layer-${layer.id}`);
    setExpandedKeys(allKeys);
  }, [layers]);

  const collapseAll = useCallback(() => {
    setExpandedKeys([]);
  }, []);

  // Обработка контекстного меню слоя
  const handleLayerContextMenu = (e: React.MouseEvent, layerId: number) => {
    e.preventDefault();
    showLayerContext({ event: e, props: { layerId } });
  };

  const handleDeleteLayer = async (layerId: number) => {
    await mapStore.deleteLayer(layerId);
    if (selectedLayerId === layerId) onSelectLayer(null);
  };

  // Фильтрация данных по поиску
  const filteredMarkersByLayer = useMemo(() => {
    if (!searchText.trim()) return null;
    const lowerSearch = searchText.toLowerCase();
    const result: Record<number, Marker[]> = {};
    markers.forEach(marker => {
      if (!typeFilter('marker')) return;
      if (marker.name.toLowerCase().includes(lowerSearch) ||
          (marker.description && marker.description.toLowerCase().includes(lowerSearch))) {
        if (!result[marker.layerId]) result[marker.layerId] = [];
        result[marker.layerId].push(marker);
      }
    });
    return result;
  }, [markers, searchText, typeFilter]);

  const filteredDrawingsByLayer = useMemo(() => {
    if (!searchText.trim()) return null;
    const lowerSearch = searchText.toLowerCase();
    const result: Record<number, Drawing[]> = {};
    drawings.forEach(drawing => {
      if (!typeFilter('drawing')) return;
      if (drawing.name.toLowerCase().includes(lowerSearch) ||
          (drawing.description && drawing.description.toLowerCase().includes(lowerSearch))) {
        if (!result[drawing.layerId]) result[drawing.layerId] = [];
        result[drawing.layerId].push(drawing);
      }
    });
    return result;
  }, [drawings, searchText, typeFilter]);

  // Автораскрытие при поиске
  useMemo(() => {
    const layersToExpand: string[] = [];
    if (filteredMarkersByLayer) layersToExpand.push(...Object.keys(filteredMarkersByLayer).map(id => `layer-${id}`));
    if (filteredDrawingsByLayer) layersToExpand.push(...Object.keys(filteredDrawingsByLayer).map(id => `layer-${id}`));
    if (layersToExpand.length) {
      setExpandedKeys(prev => Array.from(new Set([...prev, ...layersToExpand])));
    }
  }, [filteredMarkersByLayer, filteredDrawingsByLayer]);

  // Построение дерева
  const treeData = useMemo(() => {
    // Сортируем слои по order (если есть)
    const sortedLayers = [...layers].sort((a,b) => (a.order || 0) - (b.order || 0));
    return sortedLayers.map(layer => {
      if (!visibleFilter(layer.id)) return null;

      let layerMarkers = markers.filter(m => m.layerId === layer.id);
      if (filteredMarkersByLayer) layerMarkers = filteredMarkersByLayer[layer.id] || [];
      if (!typeFilter('marker')) layerMarkers = [];

      let layerDrawings = drawings.filter(d => d.layerId === layer.id);
      if (filteredDrawingsByLayer) layerDrawings = filteredDrawingsByLayer[layer.id] || [];
      if (!typeFilter('drawing')) layerDrawings = [];

      if (layerMarkers.length === 0 && layerDrawings.length === 0 && searchText) return null;

      const markerChildren = layerMarkers.map(marker => ({
        key: `marker-${marker.id}`,
        title: (
          <Tooltip title={marker.description || marker.name} placement="right" mouseEnterDelay={0.5}>
            <div className="tree-marker-title" onClick={() => onSelectMarker(marker)}>
              <EnvironmentOutlined style={{ color: '#ff4d4f', fontSize: 12 }} />
              <span className="marker-name">{highlightText(marker.name, searchText)}</span>
            </div>
          </Tooltip>
        ),
      }));

      const drawingChildren = layerDrawings.map(drawing => {
        const isEditing = editMode.kind !== 'none' && editMode.drawingId === drawing.id;
        return {
          key: `drawing-${drawing.id}`,
          title: (
            <Tooltip title={`${drawing.name} (${drawing.type})`} placement="right" mouseEnterDelay={0.5}>
              <div
                className={`tree-drawing-title ${isEditing ? 'editing' : ''}`}
                onClick={() => onSelectDrawing(drawing)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  showDrawingContext({ event: e, props: { drawing } });
                }}
              >
                <span className="drawing-icon">{getDrawingIcon(drawing.type)}</span>
                <span className="drawing-name">{highlightText(drawing.name, searchText)}</span>
                <span className="drawing-type-badge">{drawing.type}</span>
              </div>
            </Tooltip>
          ),
        };
      });

      const children: any[] = [];
      if (markerChildren.length) children.push(...markerChildren);
      if (drawingChildren.length) {
        children.push({
          key: `drawings-group-${layer.id}`,
          title: <span className="drawings-group-title"><span className="group-icon">📐</span> Объекты</span>,
          children: drawingChildren,
        });
      }

      const isLayerVisible = visibleLayers[layer.id] ?? false;
      const layerColor = layer.style?.color || '#1890ff';
      return {
        key: `layer-${layer.id}`,
        title: (
          <div
            className="tree-layer-title"
            onContextMenu={(e) => handleLayerContextMenu(e, layer.id)}
          >
            <Checkbox
              checked={isLayerVisible}
              onChange={(e) => onToggleLayerVisibility(layer.id, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
            />
            <div
              className="layer-name-wrapper"
              onClick={() => onSelectLayer(layer.id)}
            >
              {isLayerVisible ?
                <FolderOpenOutlined style={{ color: layerColor, marginRight: 6 }} /> :
                <FolderOutlined style={{ color: layerColor, marginRight: 6 }} />
              }
              <span className={`layer-name ${selectedLayerId === layer.id ? 'selected' : ''}`}>
                {highlightText(layer.name, searchText)}
              </span>
            </div>
            <Badge count={layerMarkers.length + layerDrawings.length} size="small" className="layer-badge" />
            <div className="layer-actions">
              <Tooltip title="Редактировать слой">
                <Button type="text" size="small" icon={<EditOutlined />} onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer(layer.id);
                }} />
              </Tooltip>
            </div>
          </div>
        ),
        children,
      };
    }).filter(Boolean);
  }, [layers, markers, drawings, visibleLayers, selectedLayerId, filteredMarkersByLayer, filteredDrawingsByLayer,
      onToggleLayerVisibility, onSelectLayer, onSelectMarker, onSelectDrawing, editMode, searchText, typeFilter, visibleFilter]);

  // Полный вид (всегда развёрнут)
  const allChecked = layers.length > 0 && layers.every(layer => visibleLayers[layer.id] === true);
  const someChecked = layers.length > 0 && layers.some(layer => visibleLayers[layer.id] === true) && !allChecked;

  return (
    <>
      <div className="sidebar-tree">
        <div className="sidebar-header">
          <Input
            placeholder="Поиск..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="middle"
          />
          <Space size="small" className="sidebar-actions">
            <Tooltip title="Развернуть всё">
              <Button icon={<ExpandOutlined />} size="small" onClick={expandAll} />
            </Tooltip>
            <Tooltip title="Свернуть всё">
              <Button icon={<CompressOutlined />} size="small" onClick={collapseAll} />
            </Tooltip>
          </Space>
        </div>

        <div className="sidebar-filters">
          <Space size={4}>
            <Tooltip title="Все">
              <Button
                size="small"
                type={filter === 'all' ? 'primary' : 'text'}
                onClick={() => setFilter('all')}
                icon={<AppstoreOutlined />}
              />
            </Tooltip>
            <Tooltip title="Только метки">
              <Button
                size="small"
                type={filter === 'markers' ? 'primary' : 'text'}
                onClick={() => setFilter('markers')}
                icon={<EnvironmentOutlined />}
              />
            </Tooltip>
            <Tooltip title="Только объекты">
              <Button
                size="small"
                type={filter === 'drawings' ? 'primary' : 'text'}
                onClick={() => setFilter('drawings')}
                icon={<FilterOutlined />}
              />
            </Tooltip>
            <Tooltip title="Только видимые слои">
              <Button
                size="small"
                type={filter === 'visible' ? 'primary' : 'text'}
                onClick={() => setFilter('visible')}
                icon={<EyeOutlined />}
              />
            </Tooltip>
          </Space>
        </div>

        <div className="sidebar-all-checkbox">
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked}
            onChange={(e) => {
              layers.forEach(layer => onToggleLayerVisibility(layer.id, e.target.checked));
            }}
          >
            <strong>Все слои</strong>
          </Checkbox>
        </div>

        <div className="sidebar-content">
          <Tree
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys as React.Key[])}
            treeData={treeData}
            blockNode
            showIcon={false}
          />
        </div>
      </div>

      {/* Контекстные меню */}
      <Menu id="layer-context-menu" animation="fade">
        <Item onClick={({ props }) => props?.layerId && onSelectLayer(props.layerId)}>
          <EyeOutlined /> Выбрать слой
        </Item>
        <Item onClick={({ props }) => props?.layerId && handleDeleteLayer(props.layerId)}>
          <DeleteOutlined /> Удалить слой
        </Item>
      </Menu>

      <Menu id="drawing-context-menu" animation="fade">
        <Item onClick={({ props }) => props?.drawing && onEditDrawing(props.drawing)}>
          <EditOutlined /> Редактировать
        </Item>
      </Menu>
    </>
  );
});

export default SidebarTree;