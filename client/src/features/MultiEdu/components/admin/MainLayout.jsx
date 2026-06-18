// src/features/security-training/components/admin/MainLayout.jsx
import { Layout } from 'antd';
import AdminHeader from './AdminHeader';
import './MainLayout.css';

const { Content } = Layout;

const MainLayout = ({ children, selectedMenu, onMenuSelect }) => {
  return (
    <Layout className="admin-main-layout">
      <AdminHeader selectedMenu={selectedMenu} onMenuSelect={onMenuSelect} />
      <Content className="admin-main-content">
        {children}
      </Content>
    </Layout>
  );
};

export default MainLayout;