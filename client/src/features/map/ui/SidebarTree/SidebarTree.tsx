// src/modules/Map/ui/SidebarTree/SidebarTree.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Input, Tree, Checkbox, Button, Tooltip, Space, Badge, theme } from 'antd';
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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Menu, Item, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import mapStore from '../../store/MapStore';
import type { Marker, Drawing, EditMode } from '../../types/map.types';
import './SidebarTree.css';

const { useToken } = theme;

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
  collapsed: boolean;
  onToggleCollapse: () => void;
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
  collapsed,
  onToggleCollapse,
}) => {
  const { token } = useToken();
  // Все хуки должны быть вызваны до любого раннего return
  const [searchText, setSearchText] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const { layers, markers, drawings } = mapStore;

  const { show: showLayerContext } = useContextMenu({ id: 'layer-context-menu' });
  const { show: showDrawingContext } = useContextMenu({ id: 'drawing-context-menu' });

  const getDrawingIcon = (type: string) => {
    switch (type) {
      case 'polyline': return '📏';
      case 'polygon': return '🔷';
      case 'rectangle': return '◻️';
      case 'circle': return '⚪';
      case 'text': return '🅃';
      default: return '📐';
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : part
    );
  };

  const visibleFilter = useCallback((layerId: number) => {
    if (filter === 'visible') return visibleLayers[layerId];
    return true;
  }, [filter, visibleLayers]);

  const typeFilter = useCallback((itemType: 'marker' | 'drawing') => {
    if (filter === 'markers') return itemType === 'marker';
    if (filter === 'drawings') return itemType === 'drawing';
    return true;
  }, [filter]);

  const expandAll = useCallback(() => {
    const allKeys = layers.map(layer => `layer-${layer.id}`);
    setExpandedKeys(allKeys);
  }, [layers]);

  const collapseAll = useCallback(() => {
    setExpandedKeys([]);
  }, []);

  const handleLayerContextMenu = useCallback((e: React.MouseEvent, layerId: number) => {
    e.preventDefault();
    showLayerContext({ event: e, props: { layerId } });
  }, [showLayerContext]);

  const handleDeleteLayer = async (layerId: number) => {
    await mapStore.deleteLayer(layerId);
    if (selectedLayerId === layerId) onSelectLayer(null);
  };

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

  // Эффект для авто-раскрытия при поиске
  useEffect(() => {
    const layersToExpand: string[] = [];
    if (filteredMarkersByLayer) layersToExpand.push(...Object.keys(filteredMarkersByLayer).map(id => `layer-${id}`));
    if (filteredDrawingsByLayer) layersToExpand.push(...Object.keys(filteredDrawingsByLayer).map(id => `layer-${id}`));
    if (layersToExpand.length) {
      setExpandedKeys(prev => Array.from(new Set([...prev, ...layersToExpand])));
    }
  }, [filteredMarkersByLayer, filteredDrawingsByLayer]);

  // Вычисляем treeData только для развёрнутого состояния, но хук useMemo должен быть вызван всегда
  const treeData = useMemo(() => {
    // Если свернуто, возвращаем пустой массив, но хук всё равно вызван
    if (collapsed) return [];

    const sortedLayers = [...layers].sort((a, b) => (a.order || 0) - (b.order || 0));
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
              <span className="marker-name" style={{ color: token.colorText }}>
                {highlightText(marker.name, searchText)}
              </span>
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
                style={{ color: token.colorText }}
              >
                <span className="drawing-icon">{getDrawingIcon(drawing.type)}</span>
                <span className="drawing-name" style={{ color: token.colorText }}>
                  {highlightText(drawing.name, searchText)}
                </span>
                <span className="drawing-type-badge" style={{ color: token.colorTextSecondary, background: token.colorBgLayout }}>
                  {drawing.type}
                </span>
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
          title: <span className="drawings-group-title" style={{ color: token.colorTextSecondary }}>📐 Объекты</span>,
          children: drawingChildren,
        });
      }

      const isLayerVisible = visibleLayers[layer.id] ?? false;
      const layerColor = layer.style?.color || token.colorPrimary;
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
              <span className={`layer-name ${selectedLayerId === layer.id ? 'selected' : ''}`} style={{ color: token.colorText }}>
                {highlightText(layer.name, searchText)}
              </span>
            </div>
            <Badge
              count={layerMarkers.length + layerDrawings.length}
              size="small"
              className="layer-badge"
              style={{ backgroundColor: token.colorBgLayout, color: token.colorTextSecondary }}
            />
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
  }, [
    collapsed, layers, markers, drawings, visibleLayers, selectedLayerId,
    filteredMarkersByLayer, filteredDrawingsByLayer,
    onToggleLayerVisibility, onSelectLayer, onSelectMarker, onSelectDrawing,
    editMode, searchText, typeFilter, visibleFilter, token,
    handleLayerContextMenu, showDrawingContext, highlightText, getDrawingIcon
  ]);

  const allChecked = layers.length > 0 && layers.every(layer => visibleLayers[layer.id] === true);
  const someChecked = layers.length > 0 && layers.some(layer => visibleLayers[layer.id] === true) && !allChecked;

  const baseSidebarStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderRight: `1px solid ${token.colorBorder}`,
    boxShadow: token.boxShadow,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    transition: 'width 0.2s ease',
  };

  const headerStyle: React.CSSProperties = {
    padding: '12px 16px',
    background: token.colorBgLayout,
    borderBottom: `1px solid ${token.colorBorder}`,
  };

  const filtersStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderBottom: `1px solid ${token.colorBorder}`,
    background: token.colorBgContainer,
  };

  const allCheckboxStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderBottom: `1px solid ${token.colorBorder}`,
    background: token.colorBgLayout,
  };

  // Ранний return только после вызова всех хуков
  if (collapsed) {
    return (
      <div className="sidebar-tree" style={{ ...baseSidebarStyle, width: 48, minWidth: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 16 }}>
          <Tooltip title="Развернуть боковую панель" placement="right">
            <Button type="text" icon={<MenuUnfoldOutlined />} onClick={onToggleCollapse} />
          </Tooltip>
        </div>
      </div>
    );
  }

  // Развёрнутое состояние
  return (
    <>
      <div className="sidebar-tree" style={{ ...baseSidebarStyle, width: 280, minWidth: 280 }}>
        <div className="sidebar-header" style={headerStyle}>
          <Tooltip title="Свернуть боковую панель" placement="right">
            <Button type="text" icon={<MenuFoldOutlined />} onClick={onToggleCollapse} style={{ marginRight: 8 }} />
          </Tooltip>
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

        <div className="sidebar-filters" style={filtersStyle}>
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

        <div className="sidebar-all-checkbox" style={allCheckboxStyle}>
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