// src/features/security-training/components/admin/MainLayout.jsx

import { Layout } from 'antd';
import AdminHeader from './AdminHeader';

const { Content } = Layout;

const MainLayout = ({ 
  children, 
  selectedMenu, 
  onMenuSelect,
  onAddCourse,
  showAddCourseButton = false 
}) => {
  return (
    <Layout style={{ minHeight: "calc(100vh - 64px)" }}>
      <AdminHeader 
        selectedMenu={selectedMenu}
        onMenuSelect={onMenuSelect}
        onAddCourse={onAddCourse}
        showAddButton={showAddCourseButton}
      />
      
      <Content style={{ 
        padding: "24px", 
        overflow: "auto" ,
        marginTop: 64,
        }}>
        {children}
      </Content>
    </Layout>
  );
};

export default MainLayout;