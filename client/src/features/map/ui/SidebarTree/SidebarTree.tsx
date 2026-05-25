// src/modules/Map/ui/SidebarTree/SidebarTree.tsx
import React, { useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Input, Tree, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Menu, Item, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import mapStore from '../../store/MapStore';
import type { Marker, Drawing, EditMode } from '../../types/map.types';
import './SidebarTree.css';

interface SidebarTreeProps {
  selectedLayerId: number | null;
  onSelectLayer: (id: number | null) => void;
  onSelectMarker: (marker: Marker) => void;
  onSelectDrawing: (drawing: Drawing) => void;
  visibleLayers: Record<number, boolean>;
  onToggleLayerVisibility: (layerId: number, visible: boolean) => void;
  onEditDrawing: (drawing: Drawing) => void;
  editMode: EditMode; // добавлен проп
}

const SidebarTree: React.FC<SidebarTreeProps> = observer(({
  selectedLayerId,
  onSelectLayer,
  onSelectMarker,
  onSelectDrawing,
  visibleLayers,
  onToggleLayerVisibility,
  onEditDrawing,
  editMode, // деструктурируем
}) => {
  const [searchText, setSearchText] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const { layers, markers, drawings } = mapStore;

  const { show } = useContextMenu({ id: 'drawing-context-menu' });

  const handleDrawingContextMenu = (e: React.MouseEvent, drawing: Drawing) => {
    e.preventDefault();
    show({ event: e, props: { drawing } });
  };

  const allChecked = layers.length > 0 && layers.every(layer => visibleLayers[layer.id] === true);
  const someChecked = layers.length > 0 && layers.some(layer => visibleLayers[layer.id] === true) && !allChecked;

  const toggleAllLayers = (checked: boolean) => {
    layers.forEach(layer => onToggleLayerVisibility(layer.id, checked));
  };

  const filteredMarkersByLayer = useMemo(() => {
    if (!searchText.trim()) return null;
    const lowerSearch = searchText.toLowerCase();
    const result: Record<number, Marker[]> = {};
    markers.forEach(marker => {
      if (marker.name.toLowerCase().includes(lowerSearch) ||
          (marker.description && marker.description.toLowerCase().includes(lowerSearch))) {
        if (!result[marker.layerId]) result[marker.layerId] = [];
        result[marker.layerId].push(marker);
      }
    });
    return result;
  }, [markers, searchText]);

  const filteredDrawingsByLayer = useMemo(() => {
    if (!searchText.trim()) return null;
    const lowerSearch = searchText.toLowerCase();
    const result: Record<number, Drawing[]> = {};
    drawings.forEach(drawing => {
      if (drawing.name.toLowerCase().includes(lowerSearch) ||
          (drawing.description && drawing.description.toLowerCase().includes(lowerSearch))) {
        if (!result[drawing.layerId]) result[drawing.layerId] = [];
        result[drawing.layerId].push(drawing);
      }
    });
    return result;
  }, [drawings, searchText]);

  useMemo(() => {
    const layersToExpand: string[] = [];
    if (filteredMarkersByLayer) layersToExpand.push(...Object.keys(filteredMarkersByLayer).map(id => `layer-${id}`));
    if (filteredDrawingsByLayer) layersToExpand.push(...Object.keys(filteredDrawingsByLayer).map(id => `layer-${id}`));
    if (layersToExpand.length) setExpandedKeys(prev => Array.from(new Set([...prev, ...layersToExpand])));
  }, [filteredMarkersByLayer, filteredDrawingsByLayer]);

  const treeData = useMemo(() => {
    return layers.map(layer => {
      let layerMarkers = markers.filter(m => m.layerId === layer.id);
      if (filteredMarkersByLayer) layerMarkers = filteredMarkersByLayer[layer.id] || [];
      const markerChildren = layerMarkers.map(marker => ({
        key: `marker-${marker.id}`,
        title: (
          <div className="tree-marker-title" onClick={() => onSelectMarker(marker)}>
            <span>{marker.name}</span>
            
          </div>
        ),
      }));

      let layerDrawings = drawings.filter(d => d.layerId === layer.id);
      if (filteredDrawingsByLayer) layerDrawings = filteredDrawingsByLayer[layer.id] || [];
      const drawingChildren = layerDrawings.map(drawing => {
        const isEditing = editMode.kind !== 'none' && editMode.drawingId === drawing.id;
        return {
          key: `drawing-${drawing.id}`,
          title: (
            <div
              className="tree-marker-title"
              onClick={() => onSelectDrawing(drawing)}
              onContextMenu={(e) => handleDrawingContextMenu(e, drawing)}
              style={{
                fontWeight: isEditing ? 'bold' : 'normal',
                backgroundColor: isEditing ? '#fff3e0' : 'transparent',
                borderRadius: '4px',
                padding: '2px 4px',
              }}
            >
              <span>{drawing.name}</span>
              <span className="marker-description"> ({drawing.type})</span>
            </div>
          ),
        };
      });

      const children: any[] = [...markerChildren];
      if (drawingChildren.length) {
        children.push({
          key: `drawings-group-${layer.id}`,
          title: <span style={{ fontWeight: 'normal' }}>📐 Объекты</span>,
          children: drawingChildren,
        });
      }

      return {
        key: `layer-${layer.id}`,
        title: (
          <div className="tree-layer-title">
            <Checkbox
              checked={visibleLayers[layer.id] ?? false}
              onChange={(e) => onToggleLayerVisibility(layer.id, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
            />
            <span
              className="layer-name"
              onClick={() => onSelectLayer(layer.id)}
              style={{ fontWeight: selectedLayerId === layer.id ? 'bold' : 'normal' }}
            >
              {layer.name}
            </span>
            <span className="layer-count">({layerMarkers.length + layerDrawings.length})</span>
          </div>
        ),
        children,
      };
    });
  }, [layers, markers, drawings, visibleLayers, selectedLayerId, filteredMarkersByLayer, filteredDrawingsByLayer, onToggleLayerVisibility, onSelectLayer, onSelectMarker, onSelectDrawing, editMode]);

  return (
    <>
      <div className="sidebar-tree">
        <div className="sidebar-search">
          <Input
            placeholder="Поиск меток и объектов..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>
        <div className="sidebar-all-checkbox">
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked}
            onChange={(e) => toggleAllLayers(e.target.checked)}
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
          />
        </div>
      </div>
      <Menu id="drawing-context-menu">
        <Item onClick={({ props }) => props?.drawing && onEditDrawing(props.drawing)}>
          ✏️ Редактировать
        </Item>
      </Menu>
    </>
  );
});

export default SidebarTree;