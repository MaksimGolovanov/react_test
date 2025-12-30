// src/features/security-training/components/admin/Sidebar.jsx
import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = ({ selectedMenu, onSelect }) => {
  return (
    <Sider
      width={250}
      style={{
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <div style={{ padding: "24px" }}>
        <Title level={4} style={{ marginBottom: "24px" }}>
          <SettingOutlined /> Администрирование
        </Title>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedMenu]}
        onSelect={({ key }) => onSelect(key)}
        style={{ borderRight: 0 }}
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
    </Sider>
  );
};

export default Sidebar;