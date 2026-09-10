// src/features/plans/ui/PlanHeader/PlanHeader.jsx
import React from 'react';
import { Button, Input, Select, Space, theme } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileWordOutlined } from '@ant-design/icons';
import styles from './PlanHeader.module.css';

const { Option } = Select;
const { useToken } = theme;

const PlanHeader = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onAddNew,
  onEdit,
  onDelete,
  onDownload,
  selectedId,
}) => {
  const { token } = useToken();

  return (
    <div className={styles.header} style={{ background: token.colorBgContainer, borderColor: token.colorBorder }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div className={styles.actionsRow}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
              Создать план
            </Button>
            <Button icon={<EditOutlined />} onClick={onEdit} disabled={!selectedId}>
              Редактировать
            </Button>
            <Button icon={<DeleteOutlined />} danger disabled={!selectedId} onClick={onDelete}>
              Удалить
            </Button>
            <Button
              type="primary"
              ghost
              icon={<FileWordOutlined />}
              onClick={onDownload}
              disabled={!selectedId}
            >
              Скачать DOCX
            </Button>
          </Space>
        </div>
        <div className={styles.searchStatsRow} style={{ borderTopColor: token.colorBorder }}>
          <Space>
            <Input
              placeholder="Поиск по названию плана..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ width: 300 }}
            />
            <Select defaultValue="all" style={{ width: 200 }} onChange={onStatusChange} value={statusFilter}>
              <Option value="all">Все статусы</Option>
              <Option value="draft">Черновик</Option>
              <Option value="active">В работе</Option>
              <Option value="completed">Завершен</Option>
            </Select>
          </Space>
        </div>
      </Space>
    </div>
  );
};

export default PlanHeader;