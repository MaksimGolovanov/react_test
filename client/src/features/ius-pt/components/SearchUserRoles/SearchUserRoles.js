// src/pages/IusPt/components/SearchUserRoles/SearchUserRoles.js
import React, { useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Select, Table, Typography, Space, Tag } from 'antd';
import iusPtStore from '../../store/IusPtStore';
import styles from './style.module.css';

const { Option } = Select;
const { Title } = Typography;

const SearchUserRoles = observer(() => {
  const [loading, setLoading] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [usersWithRole, setUsersWithRole] = useState([]);

  // Загружаем роли, если их нет
  useEffect(() => {
    if (iusPtStore.roles.length === 0) {
      iusPtStore.fetchRoles();
    }
    if (iusPtStore.staffWithIusUsers.length === 0) {
      iusPtStore.fetchStaffWithIusUsers();
    }
  }, []);

  // При изменении выбранной роли фильтруем пользователей
  useEffect(() => {
    if (!selectedRoleId) {
      setUsersWithRole([]);
      return;
    }

    // Находим выбранную роль
    const selectedRole = iusPtStore.roles.find((r) => r.id === selectedRoleId);
    if (!selectedRole) return;

    // Собираем пользователей, у которых есть эта роль
    const users = iusPtStore.staffWithIusUsers.filter((staff) => {
      const userRoles = staff.IusUser?.IusSpravRoles || [];
      return userRoles.some((role) => role.id === selectedRoleId);
    });

    // Формируем данные для таблицы
    const tableData = users.map((user) => ({
      key: user.tabNumber,
      fio: user.fio,
      tabNumber: user.tabNumber,
      department: user.department?.slice(13) || user.department || '-',
      post: user.post || '-',
      email: user.email,
      iusName: user.IusUser?.name || '-',
    }));
    setUsersWithRole(tableData);
  }, [selectedRoleId, iusPtStore.roles, iusPtStore.staffWithIusUsers]);

  // Опции для выбора роли (сгруппированы по typename)
  const roleOptions = useMemo(() => {
    const groups = {};
    iusPtStore.roles.forEach((role) => {
      const group = role.typename || 'Без системы';
      if (!groups[group]) groups[group] = [];
      groups[group].push(role);
    });
    return groups;
  }, [iusPtStore.roles]);

  const columns = [
    {
      title: 'ФИО',
      dataIndex: 'fio',
      key: 'fio',
      sorter: (a, b) => a.fio.localeCompare(b.fio),
    },
    {
      title: 'Табельный номер',
      dataIndex: 'tabNumber',
      key: 'tabNumber',
    },
    {
      title: 'Подразделение',
      dataIndex: 'department',
      key: 'department',
      ellipsis: true,
    },
    {
      title: 'Должность',
      dataIndex: 'post',
      key: 'post',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Имя входа',
      dataIndex: 'iusName',
      key: 'iusName',
    },
  ];

  return (
    <div className={styles.container}>
      <Title level={4} style={{ marginBottom: 16 }}>
        Поиск пользователей по роли
      </Title>
      <Space direction="vertical" size="small" style={{ width: 'calc(100% - 10px)' }}>
        <div>
          <span style={{ marginRight: 8 }}>Выберите роль:</span>
          <Select
            showSearch
            placeholder="Поиск роли по коду или названию"
            style={{ width: 800 }}
            optionFilterProp="children"
            onChange={setSelectedRoleId}
            value={selectedRoleId}
            allowClear
            filterOption={(input, option) => {
              const role = option?.role;
              if (!role) return false;
              const code = role.code || '';
              const name = role.name || '';
              return (
                code.toLowerCase().includes(input.toLowerCase()) ||
                name.toLowerCase().includes(input.toLowerCase())
              );
            }}
          >
            {Object.entries(roleOptions).map(([groupName, roles]) => (
              <Select.OptGroup key={groupName} label={groupName}>
                {roles.map((role) => (
                  <Option key={role.id} value={role.id} role={role}>
                    <Space>
                      <span style={{color:'#1677ff'}}>{role.code}</span>
                      <span>{role.name}</span>
                    </Space>
                  </Option>
                ))}
              </Select.OptGroup>
            ))}
          </Select>
        </div>

        {selectedRoleId && (
          <Table
            columns={columns}
            dataSource={usersWithRole}
            loading={loading}
            pagination={false}  // Отключаем пагинацию
            scroll={{ x: 700, y: 550 }} // Добавляем вертикальный скролл при необходимости
            bordered
          />
        )}
      </Space>
    </div>
  );
});

export default SearchUserRoles;