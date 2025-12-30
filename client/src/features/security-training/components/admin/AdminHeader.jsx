// src/features/security-training/components/admin/AdminHeader.jsx
import React from 'react';
import { Layout, Typography, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

const AdminHeader = ({ 
  selectedMenu, 
  onAddCourse,
  showAddCourseButton = false 
}) => {
  const getTitle = () => {
    switch (selectedMenu) {
      case 'dashboard': return 'Панель управления';
      case 'courses': return 'Управление курсами';
      case 'users': return 'Пользователи';
      case 'analytics': return 'Аналитика';
      default: return 'Администрирование';
    }
  };

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          {getTitle()}
        </Title>

        {showAddCourseButton && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddCourse}
          >
            Создать курс
          </Button>
        )}
      </div>
    </Header>
  );
};

export default AdminHeader;