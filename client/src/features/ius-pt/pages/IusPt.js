// src/features/ius-pt/pages/IusPt.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Input, Button, Space, Typography, Spin, Alert, theme } from 'antd';
import { SettingOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import iusPtStore from '../store/IusPtStore';
import AvatarWithFallback from '../components/AvatarWithFallback/AvatarWithFallback';

const { useToken } = theme;
const { Title } = Typography;

const IusPt = observer(() => {
  const { token } = useToken();
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

  const filteredUsers = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return iusPtStore.staffWithIusUsersSimple.filter(staff =>
      staff.tabNumber?.toLowerCase().includes(searchLower) ||
      staff.fio?.toLowerCase().includes(searchLower) ||
      staff.post?.toLowerCase().includes(searchLower) ||
      staff.department?.toLowerCase().includes(searchLower) ||
      staff.email?.toLowerCase().includes(searchLower) ||
      staff.IusUser?.name?.toLowerCase().includes(searchLower)
    );
  }, [iusPtStore.staffWithIusUsersSimple, searchQuery]);

  const sortedUsers = useMemo(() => [...filteredUsers].sort((a, b) => a.fio?.localeCompare(b.fio)), [filteredUsers]);

  const columns = [
    {
      title: '',
      key: 'avatar',
      width: 60,
      render: (_, record) => (
        <AvatarWithFallback tabNumber={record.tabNumber} size={44} />
      ),
    },
    {
      title: 'ФИО',
      dataIndex: 'fio',
      sorter: (a, b) => (a.fio || '').localeCompare(b.fio || ''),
      render: (text, record) => (
        <a onClick={() => navigate(`/iuspt/user/${record.tabNumber}`)} style={{ cursor: 'pointer', color: token.colorPrimary }}>
          {text}
        </a>
      ),
    },
    {
      title: 'Имя для входа',
      dataIndex: ['IusUser', 'name'],
      render: name => name || '-',
    },
    { title: 'Электронная почта', dataIndex: 'email', render: email => email || '-' },
    { title: 'Табельный номер', dataIndex: 'tabNumber' },
    { title: 'Должность', dataIndex: 'post', render: post => post || '-' },
    {
      title: 'Подразделение',
      render: (_, record) => record.department?.length >= 13 ? record.department.slice(13) : record.department || '-',
    },
  ];

  if (isLoading) return <Spin tip="Загрузка..." style={{ display: 'block', margin: '50px auto' }} />;
  if (error) return <Alert message="Ошибка" description={error.message} type="error" showIcon />;

  return (
    <div style={{ padding: '16px' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Button type="primary" icon={<SettingOutlined />} onClick={() => navigate('/iuspt/sprav')}>
          Справочники
        </Button>
        <Input.Search
          placeholder="Поиск пользователей..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={setSearchQuery}
        />
        <Table
          columns={columns}
          dataSource={sortedUsers}
          rowKey="tabNumber"
          pagination={{ defaultPageSize: 20 }}
          bordered
          size="middle"
        />
      </Space>
    </div>
  );
});

export default IusPt;