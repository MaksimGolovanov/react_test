import React from 'react';
import { Button, Space } from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

const FloorPlanToolbar = ({
  onAddDevice,
  onEditDevice,
  onDeleteDevice,
  onAssignUser,
  onSavePlan,
  saving,
  hasSelectedDevice,
}) => {
  return (
    <Space wrap>
      <Button type="primary" icon={<PlusOutlined />} onClick={onAddDevice}>
        Добавить устройство
      </Button>
      <Button
        icon={<EditOutlined />}
        onClick={onEditDevice}
        disabled={!hasSelectedDevice}
      >
        Редактировать
      </Button>
      <Button
        icon={<UserAddOutlined />}
        onClick={onAssignUser}
        disabled={!hasSelectedDevice}
      >
        Назначить пользователя
      </Button>
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={onDeleteDevice}
        disabled={!hasSelectedDevice}
      >
        Удалить
      </Button>
      <Button
        type="primary"
        icon={<SaveOutlined />}
        onClick={onSavePlan}
        loading={saving}
      >
        Сохранить план
      </Button>
    </Space>
  );
};

export default FloorPlanToolbar;