// src/features/ius-pt/components/SearchTransaction/SearchTransaction.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Table,
  Input,
  Typography,
  Space,
  theme,
  message,
  Select,
  Row,
  Col,
  Spin,
} from 'antd';
import iusPtStore from '../../store/IusPtStore';

const { useToken } = theme;
const { Title } = Typography;

// ----- Компонент для раскрытой строки (ленивая загрузка сотрудников) -----
const ExpandedRowContent = observer(({ record }) => {
  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!record.roleCode) return;

    const loadUsers = async () => {
      setLoading(true);
      try {
        // Находим роль по коду
        const role = iusPtStore.roles.find((r) => r.code === record.roleCode);
        if (!role) {
          setUsers([]);
          return;
        }
        // Загружаем сотрудников по ID роли
        const staff = await iusPtStore.fetchStaffByRole(role.id);
        const tableData = staff.map((u) => ({
          key: u.tabNumber,
          fio: u.fio,
          tabNumber: u.tabNumber,
          email: u.email,
          department: iusPtStore.getDepartmentNameByCode(u.department) || '-',
        }));
        setUsers(tableData);
      } catch (err) {
        setError(err.message || 'Ошибка загрузки');
        message.error('Не удалось загрузить пользователей');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [record.roleCode]);

  if (loading) return <Spin size="small" style={{ margin: 8 }} />;
  if (error)
    return <div style={{ color: token.colorError }}>Ошибка: {error}</div>;
  if (users.length === 0) {
    return (
      <div style={{ color: token.colorTextSecondary }}>
        Нет пользователей с этой ролью
      </div>
    );
  }

  return (
    <Table
      columns={[
        { title: 'ФИО', dataIndex: 'fio' },
        { title: 'Табельный номер', dataIndex: 'tabNumber' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Подразделение', dataIndex: 'department' },
      ]}
      dataSource={users}
      pagination={false}
      size="small"
      rowKey="key"
      bordered
    />
  );
});

// ----- Основной компонент -----
const SearchTransaction = observer(() => {
  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  const [transactionsFlat, setTransactionsFlat] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSystem, setFilterSystem] = useState(null);
  const [filterRoleCode, setFilterRoleCode] = useState(null);
  const [systems, setSystems] = useState([]);
  const [roleCodes, setRoleCodes] = useState([]);

  // Загружаем только транзакции и роли (без сотрудников)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Параллельно загружаем транзакции и роли
        await Promise.all([
          iusPtStore.fetchTransactions({ limit: 99999 }), // можно передать пагинацию
          iusPtStore.fetchRoles(),
        ]);

        // Преобразуем в плоский список (как было ранее)
        const transactions = iusPtStore.transactions || [];
        const flat = [];
        transactions.forEach((tx) => {
          const roles = tx.IusSpravRoles || [];
          if (roles.length > 0) {
            roles.forEach((role) => {
              flat.push({
                id: tx.id,
                system: tx.system,
                roleCode: role.code || tx.roleCode,
                roleName: role.name || '',
                transactionCode: tx.transactionCode,
                description: tx.description,
                roleId: role.id,
              });
            });
          } else if (tx.roleCode) {
            const role = iusPtStore.roles.find((r) => r.code === tx.roleCode);
            flat.push({
              id: tx.id,
              system: tx.system,
              roleCode: tx.roleCode,
              roleName: role ? role.name : '',
              transactionCode: tx.transactionCode,
              description: tx.description,
              roleId: role ? role.id : null,
            });
          } else {
            flat.push({
              id: tx.id,
              system: tx.system,
              roleCode: null,
              roleName: null,
              transactionCode: tx.transactionCode,
              description: tx.description,
              roleId: null,
            });
          }
        });
        setTransactionsFlat(flat);

        // Уникальные системы и коды ролей для фильтров
        const uniqueSystems = [
          ...new Set(flat.map((item) => item.system).filter(Boolean)),
        ];
        setSystems(uniqueSystems);
        const uniqueRoleCodes = [
          ...new Set(flat.map((item) => item.roleCode).filter(Boolean)),
        ];
        setRoleCodes(uniqueRoleCodes);
      } catch (err) {
        console.error(err);
        message.error('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Фильтрация на клиенте (можно позже перенести на сервер)
  const filteredData = useMemo(() => {
    let result = transactionsFlat;
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          (item.system && item.system.toLowerCase().includes(lower)) ||
          (item.roleCode && item.roleCode.toLowerCase().includes(lower)) ||
          (item.roleName && item.roleName.toLowerCase().includes(lower)) ||
          (item.transactionCode &&
            item.transactionCode.toLowerCase().includes(lower)) ||
          (item.description && item.description.toLowerCase().includes(lower))
      );
    }
    if (filterSystem) {
      result = result.filter((item) => item.system === filterSystem);
    }
    if (filterRoleCode) {
      result = result.filter((item) => item.roleCode === filterRoleCode);
    }
    return result;
  }, [transactionsFlat, searchQuery, filterSystem, filterRoleCode]);

  const columns = [
    { title: 'Система', dataIndex: 'system', key: 'system' },
    {
      title: 'Код роли',
      dataIndex: 'roleCode',
      key: 'roleCode',
      render: (val) => val || '—',
    },
    {
      title: 'Название роли',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (val) => val || '—',
    },
    {
      title: 'Код транзакции',
      dataIndex: 'transactionCode',
      key: 'transactionCode',
    },
    {
      title: 'Описание транзакции',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <div
      style={{
        padding: 16,
        background: token.colorBgContainer,
        borderRadius: 8,
        width: '100%',
      }}
    >
      <Title level={4} style={{ color: token.colorText, marginBottom: 16 }}>
        Поиск по транзакции
      </Title>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Input.Search
              placeholder="Поиск по тексту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Фильтр по системе"
              style={{ width: '100%' }}
              value={filterSystem}
              onChange={setFilterSystem}
              allowClear
              options={systems.map((sys) => ({ label: sys, value: sys }))}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Фильтр по коду роли"
              style={{ width: '100%' }}
              value={filterRoleCode}
              onChange={setFilterRoleCode}
              allowClear
              options={roleCodes.map((code) => ({ label: code, value: code }))}
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={(record, index) => `${record.id}-${record.roleCode || index}`}
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          expandable={{
            expandedRowRender: (record) => (
              <ExpandedRowContent record={record} />
            ),
            expandRowByClick: true,
          }}
          style={{ width: '100%' }}
        />
      </Space>
    </div>
  );
});

export default SearchTransaction;
