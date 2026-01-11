// src/features/security-training/components/admin/AdminHeader.jsx

import { Layout, Typography, Menu } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

const AdminHeader = ({ 
  selectedMenu,
  onMenuSelect,
  onAddCourse,
  showAddCourseButton
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
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Левая часть: Название и меню */}
      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SettingOutlined style={{ fontSize: "18px", color: "#1890ff" }} />
          <Title level={4} style={{ margin: 0 }}>
            Администрирование
          </Title>
        </div>

        {/* Горизонтальное меню */}
        <Menu
          mode="horizontal"
          selectedKeys={[selectedMenu]}
          onSelect={({ key }) => onMenuSelect(key)}
          style={{
            borderBottom: "none",
            lineHeight: "64px",
            background: "transparent",
          }}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Панель управления
          </Menu.Item>
          <Menu.Item key="courses" icon={<BookOutlined />}>
            Управление курсами
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            Пользователи
          </Menu.Item>
          <Menu.Item key="analytics" icon={<BarChartOutlined />}>
            Аналитика
          </Menu.Item>
        </Menu>
      </div>

      {/* Правая часть: Заголовок текущего раздела */}
      <Title level={5} style={{ margin: 0, fontWeight: "normal" }}>
        {getTitle()}
      </Title>
    </Header>
  );
};

export default AdminHeader;