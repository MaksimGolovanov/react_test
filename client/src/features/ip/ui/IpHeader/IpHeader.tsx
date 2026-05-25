// src/modules/IpAddress/ui/IpHeader/IpHeader.tsx
import React from 'react';
import { Button, Input, Space, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import IpStore from '../../store/IpStore';
import { IpHeaderProps } from '../../types/ip.types';
import styles from './IpHeader.module.css';

const IpHeader: React.FC<IpHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onAddNew,
  selectedRow,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    if (!selectedRow) {
      message.warning('Выберите IP-адрес для удаления');
      return;
    }
    Modal.confirm({
      title: 'Удаление IP-адреса',
      content: `Удалить ${selectedRow.ip}?`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await IpStore.deleteIp(selectedRow.id);
          message.success('IP-адрес удалён');
          onDelete();
        } catch {
          message.error('Ошибка при удалении');
        }
      },
    });
  };

  return (
    <div className={styles.header}>
      <Space wrap>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>Добавить</Button>
        <Button
          icon={<EditOutlined />}
          onClick={() => selectedRow ? onEdit(selectedRow) : message.warning('Выберите IP-адрес')}
          disabled={!selectedRow}
        >Редактировать</Button>
        <Button danger icon={<DeleteOutlined />} onClick={handleDelete} disabled={!selectedRow}>Удалить</Button>
        <Input
          placeholder="Поиск IP..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          style={{ width: 250 }}
        />
      </Space>
    </div>
  );
};

export default IpHeader;