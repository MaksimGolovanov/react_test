import { useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Table,
  Input,
  Button,
  Spin,
  Alert,
  Card,
} from 'antd';
import {
  SettingOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import styles from './style.module.css';
import iusPtStore from '../store/IusPtStore';
import AvatarWithFallback from '../../../Components/AvatarWithFallback/AvatarWithFallback.jsx';
import { useNavigate } from 'react-router-dom';
const IusPt = observer(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await iusPtStore.fetchStaffWithUsers();
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!iusPtStore.staffWithIusUsers) return [];

    return iusPtStore.staffWithIusUsers.filter((staffUser) => {
      if (!staffUser) return false;

      const searchLower = searchQuery.toLowerCase();
      const fio = staffUser.fio?.toLowerCase() || '';
      const post = staffUser.post?.toLowerCase() || '';
      const department = staffUser.department?.toLowerCase() || '';
      const email = staffUser.email?.toLowerCase() || '';
      const tabNumber = staffUser.tabNumber?.toLowerCase() || '';
      const iusUserName = staffUser.IusUser?.name?.toLowerCase() || '';

      return (
        tabNumber.includes(searchLower) ||
        fio.includes(searchLower) ||
        post.includes(searchLower) ||
        department.includes(searchLower) ||
        email.includes(searchLower) ||
        iusUserName.includes(searchLower)
      );
    });
  }, [searchQuery, iusPtStore.staffWithIusUsers]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const fioA = a.fio || '';
      const fioB = b.fio || '';
      if (fioA < fioB) return -1;
      if (fioA > fioB) return 1;
      return 0;
    });
  }, [filteredUsers]);

  const handleUserClick = (tabNumber) => {
    navigate(`/iuspt/user/${tabNumber}`);
  };

  const handleSpravClick = () => {
    navigate(`/iuspt/sprav`);
  };

  // Конфигурация колонок таблицы
  const columns = [
    {
      title: '',
      key: 'avatar',
      width: 70,
      render: (_, record) => (
        <AvatarWithFallback
          tabNumber={record.tabNumber}
          size={45}
          className={styles.userAvatar}
        />
      ),
    },
    {
      title: 'ФИО',
      dataIndex: 'fio',
      key: 'fio',
      width: 250,
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => handleUserClick(record.tabNumber)}
          className={styles.fioLink}
        >
          {text}
        </Button>
      ),
      sorter: (a, b) => (a.fio || '').localeCompare(b.fio || ''),
    },
    {
      title: 'Имя для входа',
      key: 'iusUserName',
      width: 150,
      render: (_, record) => record.IusUser?.name || '-',
    },
    {
      title: 'Электронная почта',
      dataIndex: 'email',
      key: 'email',
      width: 250,
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
    },
    {
      title: 'Подразделение',
      key: 'department',
      render: (_, record) => {
        const department = record.department || '';
        return department.length >= 13 ? department.slice(13) : department;
      },
    },
  ];

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip="Загрузка..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Ошибка"
        description={error?.message || 'Неизвестная ошибка'}
        type="error"
        showIcon
        style={{ margin: 20 }}
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Заголовок страницы */}

      {/* Панель поиска */}
      <Card style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            
            gap: 10,
          }}
        >
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={handleSpravClick}
            size="smile"
          >
            Справочники
          </Button>
          <Input
            placeholder="Поиск пользователей..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="smile"
            allowClear
          />
        </div>
      </Card>

      {/* Таблица */}
      <Card>
        <Table
          dataSource={sortedUsers}
          columns={columns}
          rowKey="tabNumber"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Всего ${total} пользователей`,
          }}
          scroll={{ x: 1300 }}
          locale={{
            emptyText: 'Пользователи не найдены',
          }}
        />
      </Card>
    </div>
  );
});

export default IusPt;
