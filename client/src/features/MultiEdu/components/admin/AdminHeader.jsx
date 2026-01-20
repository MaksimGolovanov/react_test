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
}) => {
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
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed", 
        zIndex: 1000,
        height: 64,
        width: "100%",
      }}
    >
      {/* Левая часть: Название и меню */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        flex: 1,
        minWidth: 0, // Важно для flex контейнера
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px",
          flexShrink: 0, // Не сжимать заголовок
          marginRight: "32px", // Отступ перед меню
        }}>
          <SettingOutlined style={{ fontSize: "18px", color: "#1890ff" }} />
          <Title level={4} style={{ margin: 0, whiteSpace: "nowrap" }}>
            Администрирование
          </Title>
        </div>

        {/* Горизонтальное меню - занимает все доступное пространство */}
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <Menu
            mode="horizontal"
            selectedKeys={[selectedMenu]}
            onSelect={({ key }) => onMenuSelect(key)}
            style={{
              borderBottom: "none",
              lineHeight: "64px",
              background: "transparent",
              width: "100%", // Занимает всю ширину
              minWidth: "auto", // Отключаем авто-минимальную ширину
              flex: 1,
              display: "flex", // Используем flex для меню
            }}
            // Отключаем автоматическое сворачивание
            overflowedIndicator={null}
            // Форсируем горизонтальное отображение
            inlineCollapsed={false}
            // Отключаем адаптивность
            triggerSubMenuAction="click"
          >
            <Menu.Item key="dashboard" icon={<DashboardOutlined />} style={{ flexShrink: 0 }}>
              Панель управления
            </Menu.Item>
            <Menu.Item key="courses" icon={<BookOutlined />} style={{ flexShrink: 0 }}>
              Управление курсами
            </Menu.Item>
            <Menu.Item key="users" icon={<UserOutlined />} style={{ flexShrink: 0 }}>
              Пользователи
            </Menu.Item>
            <Menu.Item key="documents" icon={<BarChartOutlined />} style={{ flexShrink: 0 }}>
              Документы
            </Menu.Item>
          </Menu>
        </div>
      </div>

      {/* Правая часть: Заголовок текущего раздела */}
      <div style={{ 
        flexShrink: 0, 
        marginLeft: "24px",
        minWidth: "200px", // Резервируем место для заголовка
        textAlign: "right"
      }}>
        <Title 
          level={5} 
          style={{ 
            margin: 0, 
            fontWeight: "normal",
            whiteSpace: "nowrap",
          }}
        >
          {getTitle()}
        </Title>
      </div>
    </Header>
  );
};

export default AdminHeader;