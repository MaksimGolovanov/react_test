// src/features/ius-pt/pages/IusSprav.jsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Tabs, Button, theme } from 'antd';
import { ArrowLeftOutlined, TeamOutlined, SignatureOutlined, StopOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SpravRole from '../components/SpravRole/SpravRole';
import IusAdm from '../components/IusAdm/IusAdm';
import StopRoles from '../components/StopRoles/StopRoles';
import SearchUserRoles from '../components/SearchUserRoles/SearchUserRoles';

const { useToken } = theme;

const IusSprav = observer(() => {
  const { token } = useToken();
  const navigate = useNavigate();

  const items = [
    { key: 'home', label: <span><TeamOutlined /> Справочник ролей</span>, children: <SpravRole /> },
    { key: 'role', label: <span><SignatureOutlined /> Справочник подписантов</span>, children: <IusAdm /> },
    { key: 'stoprole', label: <span><StopOutlined /> Стоп-Роли</span>, children: <StopRoles /> },
    { key: 'searchrole', label: <span><SearchOutlined /> Поиск по роли</span>, children: <SearchUserRoles /> },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate('/iuspt')}>
          Назад
        </Button>
        <h1 style={{ marginLeft: 16, fontSize: 24, color: token.colorText }}>Справочники</h1>
      </div>
      <Tabs defaultActiveKey="home" items={items} size="small" />
    </div>
  );
});

export default IusSprav;