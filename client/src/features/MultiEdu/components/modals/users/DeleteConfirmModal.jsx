// src/features/security-training/components/admin/DeleteConfirmModal.jsx
import React from 'react';
import { Modal, Space, Alert, Typography } from 'antd';
import AvatarWithFallback from '../../../../../Components/AvatarWithFallback/AvatarWithFallback';

const { Text } = Typography;

const DeleteConfirmModal = ({ visible, userToDelete, loading, onCancel, onConfirm }) => {
  if (!userToDelete) return null;

  return (
    <Modal
      title="Подтверждение удаления"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Удалить"
      cancelText="Отмена"
      okType="danger"
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="Внимание!"
          description={`При удалении пользователя ${userToDelete.login} будут удалены все связанные данные, включая прогресс обучения и статистику.`}
          type="warning"
          showIcon
        />
        <div style={{ marginTop: 16 }}>
          <Text strong>Пользователь:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <AvatarWithFallback
                tabNumber={userToDelete.tabNumber}
                size={32}
                fallbackSrc={`${process.env.REACT_APP_API_URL}static/photo/no.jpg`}
              />
              <div>
                <Text strong>{userToDelete.login}</Text>
                <div>
                  <Text type="secondary">{userToDelete.tabNumber}</Text>
                </div>
              </div>
            </Space>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">
            Это действие нельзя отменить. Вы уверены, что хотите продолжить?
          </Text>
        </div>
      </Space>
    </Modal>
  );
};

export default DeleteConfirmModal;