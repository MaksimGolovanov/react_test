// src/features/security-training/components/admin/UsersContent.jsx
import  { useState, } from 'react';
import { observer } from 'mobx-react-lite';
import { Space, Card, Typography, Button, message } from 'antd';
import {
  PlusOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import securityTrainingStore from '../../store/SecurityTrainingStore';
import UsersTable from './users/UsersTable';
import UserModal from '../modals/users/UserModal';
import DeleteConfirmModal from '../modals/users/DeleteConfirmModal';
import StatsCards from './users/StatsCards';
import { useUsers } from '../../hooks/useUsers';

const { Title } = Typography;

const UsersContent = observer(() => {
  const { users, loading, statsData, loadUsers } = useUsers();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleCreateUser = () => {
    setModalMode('create');
    setCurrentUser(null);
    setModalVisible(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setCurrentUser(user);
    setModalVisible(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteConfirmVisible(true);
  };

  const handleViewUser = (user) => {
    // Перемещено в UsersTable
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await securityTrainingStore.deleteSTUser(userToDelete.id);
      message.success('Пользователь успешно удален');
      await loadUsers();
    } catch (error) {
      message.error('Ошибка при удалении пользователя');
    } finally {
      setDeleteConfirmVisible(false);
      setUserToDelete(null);
    }
  };

  const handleModalSubmitSuccess = () => {
    setModalVisible(false);
    loadUsers();
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <StatsCards statsData={statsData} />
      
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            Пользователи обучения ({users.length})
          </Title>
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={handleCreateUser}
              loading={loading}
            >
              Добавить пользователя
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => message.info('Экспорт данных в разработке')}
            >
              Экспорт
            </Button>
          </Space>
        </div>

        <UsersTable
          users={users}
          loading={loading}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onViewUser={handleViewUser}
        />
      </Card>

      <UserModal
        visible={modalVisible}
        mode={modalMode}
        currentUser={currentUser}
        loading={loading}
        onCancel={() => setModalVisible(false)}
        onSubmitSuccess={handleModalSubmitSuccess}
      />

      <DeleteConfirmModal
        visible={deleteConfirmVisible}
        userToDelete={userToDelete}
        loading={loading}
        onCancel={() => setDeleteConfirmVisible(false)}
        onConfirm={confirmDeleteUser}
      />
    </Space>
  );
});

export default UsersContent;