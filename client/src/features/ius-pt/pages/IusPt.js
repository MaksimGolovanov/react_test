import React, { useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Input, Button, Space, Typography, Spin, Alert } from 'antd';
import { SettingOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import iusPtStore from '../store/IusPtStore';
import AvatarWithFallback from '../components/AvatarWithFallback/AvatarWithFallback';
import styles from './style.module.css'; // оставляем для возможных глобальных стилей

const { Title } = Typography;

const IusPt = observer(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await iusPtStore.fetchStaffWithIusUserSimple();
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Фильтрация по поисковому запросу
  const filteredUsers = useMemo(() => {
    return iusPtStore.staffWithIusUsersSimple.filter((staffUser) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        staffUser.tabNumber?.toLowerCase().includes(searchLower) ||
        staffUser.fio?.toLowerCase().includes(searchLower) ||
        staffUser.post?.toLowerCase().includes(searchLower) ||
        staffUser.department?.toLowerCase().includes(searchLower) ||
        staffUser.email?.toLowerCase().includes(searchLower) ||
        (staffUser.IusUser &&
          staffUser.IusUser.name?.toLowerCase().includes(searchLower))
      );
    });
  }, [iusPtStore.staffWithIusUsersSimple, searchQuery]);

  // Сортировка по ФИО
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => a.fio?.localeCompare(b.fio));
  }, [filteredUsers]);

  const handleUserClick = (tabNumber) => {
    navigate(`/iuspt/user/${tabNumber}`);
  };

  const handleSpravClick = () => {
    navigate(`/iuspt/sprav`);
  };

  // Определение колонок таблицы
  const columns = [
    {
      title: '',
      key: 'avatar',
      width: 45,
      render: (_, record) => (
        <div className={styles.itemAvatar}>
          <AvatarWithFallback
            tabNumber={record.tabNumber}
            size={44}
            className={styles.userAvatar}
          />
        </div>
      ),
    },
    {
      title: 'ФИО',
      dataIndex: 'fio',
      key: 'fio',
      width: 250,
      sorter: (a, b) => (a.fio || '').localeCompare(b.fio || ''),
      render: (text, record) => (
        <a
          onClick={() => handleUserClick(record.tabNumber)}
          style={{ cursor: 'pointer' }}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Имя для входа',
      dataIndex: ['IusUser', 'name'],
      key: 'iusName',
      width: 150,
      render: (name) => name || '-',
    },
    {
      title: 'Электронная почта',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      render: (email) => email || '-',
    },
    {
      title: 'Табельный номер',
      dataIndex: 'tabNumber',
      key: 'tabNumber',
      width: 120,
    },
    {
      title: 'Должность',
      dataIndex: 'post',
      key: 'post',
      width: 300,
      render: (post) => post || '-',
    },
    {
      title: 'Подразделение',
      key: 'department',
      width: 'auto',
      render: (_, record) => {
        const dept = record.department;
        return dept?.length >= 13 ? dept.slice(13) : dept || '-';
      },
    },
  ];

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
        description={error?.message || 'Неизвестная ошибка'}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div style={{ padding: '16px 16px' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Button type="primary" icon={<SettingOutlined />} onClick={handleSpravClick}>
          Справочники
        </Button>
        <Input.Search
          placeholder="Поиск пользователей..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={(value) => setSearchQuery(value)}
        />
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <Table
            columns={columns}
            dataSource={sortedUsers}
            rowKey="tabNumber"
            pagination={true}
            bordered
            
            size="middle"
          />
        </div>
      </Space>
    </div>
  );
});

export default IusPt;
