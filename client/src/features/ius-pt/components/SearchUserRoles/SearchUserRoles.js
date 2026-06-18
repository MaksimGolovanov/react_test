// src/features/ius-pt/components/SearchUserRoles/SearchUserRoles.jsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Select, Table, Typography, Space, theme, message } from 'antd';
import iusPtStore from '../../store/IusPtStore';

const { useToken } = theme;
const { Title } = Typography;

const SearchUserRoles = observer(() => {
  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [usersWithRole, setUsersWithRole] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const containerRef = useRef(null);

  // Загрузка справочников
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          iusPtStore.fetchRoles(),
          iusPtStore.fetchStaffWithIusUsers(),
        ]);
      } catch (err) {
        console.error(err);
        message.error('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Отслеживание изменения размера контейнера
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setTableKey(prev => prev + 1);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Фильтрация пользователей по выбранной роли
  useEffect(() => {
    if (!selectedRoleId) {
      setUsersWithRole([]);
      return;
    }
    const selectedRole = iusPtStore.roles.find(r => r.id === selectedRoleId);
    if (!selectedRole) return;

    const allUsers = iusPtStore.staffWithIusUsers || [];
    const users = allUsers.filter(staff => {
      const userRoles = staff.IusUser?.IusSpravRoles || [];
      return userRoles.some(role => role.id === selectedRoleId);
    });

    const tableData = users.map(user => ({
      key: user.tabNumber,
      fio: user.fio,
      tabNumber: user.tabNumber,
      department: user.department?.slice(13) || user.department || '-',
      post: user.post || '-',
      email: user.email,
      iusName: user.IusUser?.name || '-',
    }));
    setUsersWithRole(tableData);
    setTableKey(prev => prev + 1);
  }, [selectedRoleId, iusPtStore.roles, iusPtStore.staffWithIusUsers]);

  const roleOptions = useMemo(() => {
    const groups = {};
    (iusPtStore.roles || []).forEach(role => {
      if (!role) return;
      const group = role.typename || 'Без системы';
      if (!groups[group]) groups[group] = [];
      groups[group].push(role);
    });
    return groups;
  }, [iusPtStore.roles]);

  const columns = [
    { title: 'ФИО', dataIndex: 'fio', sorter: (a, b) => a.fio.localeCompare(b.fio) },
    { title: 'Табельный номер', dataIndex: 'tabNumber' },
    { title: 'Подразделение', dataIndex: 'department', ellipsis: true },
    { title: 'Должность', dataIndex: 'post' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Имя входа', dataIndex: 'iusName' },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        padding: 16,
        background: token.colorBgContainer,
        borderRadius: 8,
        width: '100%',
      }}
    >
      <Title level={4} style={{ color: token.colorText, marginBottom: 16 }}>
        Поиск пользователей по роли
      </Title>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Select
          showSearch
          placeholder="Выберите роль"
          style={{ width: '100%', maxWidth: 800 }}
          onChange={setSelectedRoleId}
          value={selectedRoleId}
          allowClear
          loading={loading}
          filterOption={(input, option) => {
            const role = option?.role;
            if (!role) return false;
            const searchString = `${role.code || ''} ${role.name || ''}`.toLowerCase();
            return searchString.includes(input.toLowerCase());
          }}
        >
          {Object.entries(roleOptions).map(([groupName, roles]) => (
            <Select.OptGroup key={groupName} label={groupName}>
              {roles.map(role => (
                <Select.Option key={role.id} value={role.id} role={role}>
                  <Space>
                    <span style={{ color: token.colorPrimary }}>{role.code}</span>
                    <span>{role.name}</span>
                  </Space>
                </Select.Option>
              ))}
            </Select.OptGroup>
          ))}
        </Select>

        {selectedRoleId && (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <Table
              key={tableKey}
              columns={columns}
              dataSource={usersWithRole}
              loading={loading}
              pagination={false}
              scroll={{ y: 550 }}
              bordered
              style={{ width: '100%' }}
              tableLayout="auto"
            />
          </div>
        )}
      </Space>
    </div>
  );
});

export default SearchUserRoles;