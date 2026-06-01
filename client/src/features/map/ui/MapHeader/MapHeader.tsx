// src/modules/Map/ui/MapHeader/MapHeader.tsx
import React from 'react';
import { Button, Tooltip, Space, message, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CloseOutlined, EnvironmentOutlined, AppstoreOutlined } from '@ant-design/icons';
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
  selectedLayerId: number | null;
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
  selectedLayerId,
}) => {
  const { deleteLayer } = mapStore;

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
      <Space size="small">
        {/* Группа управления слоями */}
        <Button.Group>
          <Tooltip title="Добавить слой" placement="bottom">
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddLayer} />
          </Tooltip>
          <Tooltip title="Редактировать слой" placement="bottom">
            <Button icon={<EditOutlined />} onClick={onEditLayer} disabled={!selectedLayerId} />
          </Tooltip>
          <Tooltip title="Удалить слой" placement="bottom">
            <Button danger icon={<DeleteOutlined />} onClick={handleDeleteLayer} disabled={!selectedLayerId} />
          </Tooltip>
        </Button.Group>

        {/* Группа работы с маркерами */}
        <Tooltip title={isAddMarkerMode ? "Отменить добавление метки" : "Добавить метку"} placement="bottom">
          <Button
            type={isAddMarkerMode ? 'default' : 'primary'}
            icon={isAddMarkerMode ? <CloseOutlined /> : <EnvironmentOutlined />}
            onClick={handleAddMarkerClick}
            disabled={!selectedLayerId}
            className={isAddMarkerMode ? styles.activeMarkerMode : ''}
          />
        </Tooltip>

        {/* Группа переключения подложек */}
        <div className={styles.tileGroup}>
          <TileSourceSwitcher
            sources={tileSources}
            currentSourceId={currentTileSourceId}
            onSwitch={onSwitchTileSource}
          />
        </div>
      </Space>
    </div>
  );
});

export default MapHeader;