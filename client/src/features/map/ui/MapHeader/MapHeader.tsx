// src/modules/Map/ui/MapHeader/MapHeader.tsx
import React from 'react';
import { Button, Space, message, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import mapStore from '../../store/MapStore';
import TileSourceSwitcher from '../TileSourceSwitcher/TileSourceSwitcher';
import styles from './MapHeader.module.css';

interface MapSource {
  id: string;
  name: string;
}

interface MapHeaderProps {
  onAddLayer: () => void;
  onEditLayer: () => void;
  onAddMarker: () => void;
  isAddMarkerMode: boolean;
  onCancelAddMarkerMode?: () => void;
  tileSources: MapSource[];
  currentTileSourceId: string;
  onSwitchTileSource: (sourceId: string) => void;
  selectedLayerId: number | null; // добавляем проп
}

const MapHeader: React.FC<MapHeaderProps> = observer(({
  onAddLayer,
  onEditLayer,
  onAddMarker,
  isAddMarkerMode,
  onCancelAddMarkerMode,
  tileSources,
  currentTileSourceId,
  onSwitchTileSource,
  selectedLayerId, // получаем из пропов
}) => {
  const { layers, setSelectedLayerId, deleteLayer } = mapStore; // убрали selectedLayerId из стора

  const handleDeleteLayer = () => {
    if (!selectedLayerId) {
      message.warning('Выберите слой');
      return;
    }
    Modal.confirm({
      title: 'Удалить слой?',
      content: 'Все метки этого слоя также будут удалены',
      okText: 'Удалить',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteLayer(selectedLayerId);
          message.success('Слой удалён');
        } catch {
          message.error('Ошибка удаления');
        }
      },
    });
  };

  const handleAddMarkerClick = () => {
    if (!selectedLayerId) {
      message.warning('Сначала выберите слой');
      return;
    }
    if (isAddMarkerMode && onCancelAddMarkerMode) {
      onCancelAddMarkerMode();
    } else {
      onAddMarker();
    }
  };

  return (
    <div className={styles.header}>
      <Space wrap>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddLayer}>Добавить слой</Button>
        <Button icon={<EditOutlined />} onClick={onEditLayer} disabled={!selectedLayerId}>Редактировать слой</Button>
        <Button danger icon={<DeleteOutlined />} onClick={handleDeleteLayer} disabled={!selectedLayerId}>Удалить слой</Button>
        
        <Button 
          type={isAddMarkerMode ? 'default' : 'primary'}
          icon={isAddMarkerMode ? <CloseOutlined /> : <PlusOutlined />}
          onClick={handleAddMarkerClick}
          disabled={!selectedLayerId}
          style={isAddMarkerMode ? { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white' } : {}}
        >
          {isAddMarkerMode ? 'Отменить' : 'Добавить метку'}
        </Button>

        <TileSourceSwitcher
          sources={tileSources}
          currentSourceId={currentTileSourceId}
          onSwitch={onSwitchTileSource}
        />
      </Space>
    </div>
  );
});

export default MapHeader;