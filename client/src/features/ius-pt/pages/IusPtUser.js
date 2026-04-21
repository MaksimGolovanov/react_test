import React, { useEffect, useState } from 'react';
import { Tabs, Button, Spin, Alert, Avatar, Space } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import iusPtStore from '../store/IusPtStore';
import UserTable from '../components/UserTable/UserTable';
import UserRoles from '../components/UserRoles/UserRoles';
import UserRolesPage from '../components/UserRolesPage/UserRolesPage';
import AvatarWithFallback from '../components/AvatarWithFallback/AvatarWithFallback';
import styles from './style.module.css'; // для сохранения кастомных стилей (если нужны)

const IusPtUser = observer(() => {
  const { tabNumber } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await iusPtStore.fetchStaffByTabNumber(tabNumber);
        if (
          userData &&
          typeof userData === 'object' &&
          !Array.isArray(userData)
        ) {
          setUser(userData);
        } else {
          setError('Пользователь не найден');
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [tabNumber]);

  if (isLoading) {
    return (
      <Spin
        tip="Загрузка..."
        style={{ display: 'block', margin: '50px auto' }}
      />
    );
  }

  if (error) {
    return (
      <Alert
        message="Ошибка"
        description={error}
        type="error"
        showIcon
        style={{ margin: 16 }}
      />
    );
  }

  if (!user) {
    return (
      <Alert
        message="Данные пользователя не загружены"
        type="warning"
        showIcon
        style={{ margin: 16 }}
      />
    );
  }

  const getInitials = (fio) => {
    if (!fio) return '?';
    const parts = fio.split(' ');
    return parts
      .map((p) => p[0])
      .join('')
      .toUpperCase();
  };

  const items = [
    {
      key: 'home',
      label: 'Карточка пользователя',
      children: <UserTable info={user} />,
    },
    {
      key: 'role',
      label: 'Роли',
      children: <UserRoles info={user} />,
    },
    {
      key: 'contact',
      label: 'Добавление ролей',
      children: <UserRolesPage info={user} />,
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate('/iuspt')}>
          Назад
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(`/iuspt/user-application/${tabNumber}`)}
        >
          Создать заявку
        </Button>
      </Space>

      <div
        className={styles.userContainer}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className={styles.itemAvatar}>
          <AvatarWithFallback
            tabNumber={user.tabNumber}
            size={100}
            className={styles.userAvatar}
          />
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 500 }}>{user.fio}</div>
          <div style={{ color: 'gray' }}>{user.IusUser?.name || '-'}</div>
          <div>
            {user.department?.length > 13
              ? user.department.slice(13)
              : user.department || '-'}
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="home" items={items} size="large" />
    </div>
  );
});

export default IusPtUser;
