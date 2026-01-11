// src/features/security-training/components/PageHeader.jsx
import React from 'react';
import { Typography, Space, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PageHeader = ({ loading, onRefresh }) => {
  return (
    <Space
      style={{
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <Title level={2}>Обучение по информационной безопасности</Title>
      </div>
      <Button
        type="primary"
        size="smail"
        icon={<ReloadOutlined />}
        onClick={onRefresh}
        loading={loading}
      >
        Обновить
      </Button>
    </Space>
  );
};

export default PageHeader;
