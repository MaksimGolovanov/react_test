// shared/ui/ActionBar/ActionBar.tsx
import React from 'react';
import { Space, Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

export interface ActionBarProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  disableEdit?: boolean;
  disableDelete?: boolean;
  extraButtons?: React.ReactNode;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onAdd,
  onEdit,
  onDelete,
  onSearch,
  searchPlaceholder = 'Поиск...',
  disableEdit = false,
  disableDelete = false,
  extraButtons,
}) => {
  return (
    <Space wrap style={{ marginBottom: 16 }}>
      {onAdd && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Добавить
        </Button>
      )}
      {onEdit && (
        <Button icon={<EditOutlined />} onClick={onEdit} disabled={disableEdit}>
          Редактировать
        </Button>
      )}
      {onDelete && (
        <Button danger icon={<DeleteOutlined />} onClick={onDelete} disabled={disableDelete}>
          Удалить
        </Button>
      )}
      {extraButtons}
      {onSearch && (
        <Input
          placeholder={searchPlaceholder}
          prefix={<SearchOutlined />}
          onChange={(e) => onSearch(e.target.value)}
          style={{ width: 250, borderRadius: 40 }}
          allowClear
        />
      )}
    </Space>
  );
};