// src/pages/IusPt/pages/IusSprav.js
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Tabs, Button } from 'antd';
import { ArrowLeftOutlined, TeamOutlined, SignatureOutlined, StopOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SpravRole from '../components/SpravRole/SpravRole';
import IusAdm from '../components/IusAdm/IusAdm';
import StopRoles from '../components/StopRoles/StopRoles';
import SearchUserRoles from '../components/SearchUserRoles/SearchUserRoles';

const IusSprav = observer(() => {
    const navigate = useNavigate();

    const items = [
        {
            key: 'home',
            label: (
                <span>
                    <TeamOutlined />
                    <span style={{ marginLeft: 8 }}>Справочник ролей</span>
                </span>
            ),
            children: <SpravRole />,
        },
        {
            key: 'role',
            label: (
                <span>
                    <SignatureOutlined />
                    <span style={{ marginLeft: 8 }}>Справочник подписантов</span>
                </span>
            ),
            children: <IusAdm />,
        },
        {
            key: 'stoprole',
            label: (
                <span>
                    <StopOutlined />
                    <span style={{ marginLeft: 8 }}>Стоп-Роли</span>
                </span>
            ),
            children: <StopRoles />,
        },
        {
            key: 'searchrole',
            label: (
                <span>
                    <SearchOutlined />
                    <span style={{ marginLeft: 8 }}>Поиск по роли</span>
                </span>
            ),
            children: <SearchUserRoles />,
        },
    ];

    return (
        <div style={{ padding: '16px' }}>
            <div style={{  display: 'flex' }}>
                
                <Button type='primary' icon={<ArrowLeftOutlined />} onClick={() => navigate('/iuspt')}>
                    Назад
                </Button>
                <h1 style={{ marginLeft: 16, fontSize: '24px', color: '#364760' }}>Справочники</h1>
            </div>
            <Tabs
                defaultActiveKey="home"
                items={items}
                size="small"
                tabBarStyle={{
                    
                    borderBottom: '1px solid #f0f0f0',
                }}
            />
        </div>
    );
});

export default IusSprav;