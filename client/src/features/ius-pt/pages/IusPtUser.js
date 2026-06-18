// src/features/ius-pt/pages/IusPtUser.jsx
import React, { useEffect, useState } from 'react';
import { Tabs, Button, Spin, Alert, Space, theme } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import iusPtStore from '../store/IusPtStore';
import UserTable from '../components/UserTable/UserTable';
import UserRoles from '../components/UserRoles/UserRoles';
import UserRolesPage from '../components/UserRolesPage/UserRolesPage';
import AvatarWithFallback from '../components/AvatarWithFallback/AvatarWithFallback';

const { useToken } = theme;

const IusPtUser = observer(() => {
  const { token } = useToken();
  const { tabNumber } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await iusPtStore.fetchStaffByTabNumber(tabNumber);
        setUser(userData);
      } catch (err) {
        setError('Ошибка загрузки данных');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [tabNumber]);

  if (isLoading) return <Spin tip="Загрузка..." style={{ display: 'block', margin: '50px auto' }} />;
  if (error) return <Alert message="Ошибка" description={error} type="error" showIcon style={{ margin: 16 }} />;
  if (!user) return <Alert message="Данные не найдены" type="warning" showIcon style={{ margin: 16 }} />;

  const items = [
    { key: 'home', label: 'Карточка пользователя', children: <UserTable info={user} /> },
    { key: 'role', label: 'Роли', children: <UserRoles info={user} /> },
    { key: 'contact', label: 'Добавление ролей', children: <UserRolesPage info={user} /> },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/iuspt')}>Назад</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/iuspt/user-application/${tabNumber}`)}>
          Создать заявку
        </Button>
      </Space>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16}}>
        <AvatarWithFallback tabNumber={user.tabNumber} size={100} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 500, color: token.colorText }}>{user.fio}</div>
          <div style={{ color: token.colorTextSecondary }}>{user.IusUser?.name || '-'}</div>
          <div style={{ color: token.colorTextSecondary }}>{user.department?.slice(13) || '-'}</div>
        </div>
      </div>
      <Tabs defaultActiveKey="home" items={items} size="large" />
    </div>
  );
});

export default IusPtUser;