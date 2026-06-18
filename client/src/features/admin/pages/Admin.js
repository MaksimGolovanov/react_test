// features/admin/pages/Admin.jsx
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import userStore from '../store/UserStore';
import { Card, Table, Tag, Space, Spin, Typography, Row, Col, Alert } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import '../styles/admin-common.css';

const { Text } = Typography;

const Admin = observer(() => {
  const navigate = useNavigate();

  // Вызываем fetchUsers только если данные ещё не загружены
  useEffect(() => {
    if (userStore.users.length === 0 && !userStore.loading && userStore.initialized) {
      userStore.fetchUsers();
    }
  }, []);

  const handleEditUser = (userId) => {
    navigate(`/admin/edit/${userId}`);
  };

  const columns = [
    {
      title: 'Логин',
      dataIndex: 'login',
      key: 'login',
      width: 150,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Таб Номер',
      dataIndex: 'tabNumber',
      key: 'tabNumber',
      width: 150,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Роли',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <Space size={[4, 4]} wrap>
          {roles?.map((role) => (
            <Tag key={role.id} color="blue" style={{ margin: 0 }}>
              {role.role}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <EditOutlined
          className="edit-icon"
          onClick={(e) => {
            e.stopPropagation();
            handleEditUser(record.id);
          }}
        />
      ),
    },
  ];

  return (
    <div className="admin-page-container">
      <Row justify="center">
        <Col xs={24} sm={24} md={22} lg={20} xl={18}>
          <Card title="Управление пользователями" className="admin-card">
            {userStore.error && (
              <Alert
                message="Ошибка загрузки"
                description={userStore.error}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
                closable
                onClose={() => (userStore.error = null)}
              />
            )}
            {userStore.loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin tip="Загрузка..." />
              </div>
            ) : (
              <Table
                className="users-table"
                columns={columns}
                dataSource={userStore.userRoles.map((user) => ({
                  ...user,
                  key: user.id,
                }))}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showTotal: (total) => `Всего пользователей: ${total}`,
                }}
                onRow={(record) => ({
                  onClick: () => handleEditUser(record.id),
                  style: { cursor: 'pointer' },
                })}
                locale={{ emptyText: 'Нет данных о пользователях' }}
                scroll={{ x: true }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default Admin;