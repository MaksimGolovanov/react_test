// src/features/security-training/components/admin/MainLayout.jsx
import React from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
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
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar 
        selectedMenu={selectedMenu} 
        onSelect={onMenuSelect} 
      />
      
      <Layout>
        <AdminHeader 
          selectedMenu={selectedMenu}
          onAddCourse={onAddCourse}
          showAddCourseButton={showAddCourseButton}
        />
        
        <Content style={{ padding: "24px", overflow: "auto" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;