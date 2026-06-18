// src/features/security-training/components/admin/AdminHeader.jsx
import { Layout, Typography, Menu } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import './AdminHeader.css';

const { Header } = Layout;
const { Title } = Typography;

const AdminHeader = ({ selectedMenu, onMenuSelect }) => {
  const getTitle = () => {
    switch (selectedMenu) {
      case 'dashboard': return 'Панель управления';
      case 'courses': return 'Управление курсами';
      case 'users': return 'Пользователи';
      case 'documents': return 'Управление документами';
      default: return 'Администрирование';
    }
  };

  return (
    <Header className="admin-header">
      <div className="admin-header-left">
        <div className="logo-area">
          <SettingOutlined className="logo-icon" />
          <Title level={4} className="logo-title">Администрирование</Title>
        </div>
        <div className="menu-wrapper">
          <Menu
            mode="horizontal"
            selectedKeys={[selectedMenu]}
            onSelect={({ key }) => onMenuSelect(key)}
            className="admin-menu"
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
            <Menu.Item key="documents" icon={<BarChartOutlined />}>
              Документы
            </Menu.Item>
          </Menu>
        </div>
      </div>
      <div className="admin-header-right">
        <Title level={5} className="current-title">{getTitle()}</Title>
      </div>
    </Header>
  );
};

export default AdminHeader;