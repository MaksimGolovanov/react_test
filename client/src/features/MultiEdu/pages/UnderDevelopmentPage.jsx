// src/features/security-training/pages/UnderDevelopmentPage.jsx
import React from 'react';
import { Card, Typography, Button, Result, Space } from 'antd';
import {
  SecurityScanOutlined,
  SafetyOutlined,
  FireOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

// Функция для получения иконки по типу
const getIconByType = (iconType) => {
  switch (iconType) {
    case 'SecurityScanOutlined':
      return <SecurityScanOutlined />;
    case 'SafetyOutlined':
      return <SafetyOutlined />;
    case 'FireOutlined':
      return <FireOutlined />;
    case 'MedicineBoxOutlined':
      return <MedicineBoxOutlined />;
    default:
      return <ClockCircleOutlined />;
  }
};

const UnderDevelopmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category;

  // Создаем React-элемент иконки, если есть категория
  const categoryIcon = category ? (
    getIconByType(category.iconType)
  ) : (
    <ClockCircleOutlined />
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '24px',
      }}
    >
      <Card
        style={{
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <Result
          icon={React.cloneElement(categoryIcon, {
            style: { color: category?.color || '#faad14', fontSize: 64 },
          })}
          title={
            <Title level={3}>
              {category ? `"${category.title}"` : 'Данный раздел'} в разработке
            </Title>
          }
          subTitle={
            <Text type="secondary">
              {category?.developmentText ||
                'Мы активно работаем над созданием этого раздела. Скоро здесь появятся интересные курсы!'}
            </Text>
          }
          extra={[
            <Space key="actions" size="middle">
              <Button
                type="primary"
                icon={<HomeOutlined />}
                onClick={() => navigate('/multiedu')}
              >
                На главную обучения
              </Button>

            </Space>,
          ]}
        />

        {/* Дополнительная информация */}
        <div style={{ marginTop: 32, textAlign: 'left' }}>
          
          <Text type="secondary" style={{ textAlign: 'center', display: 'block', marginTop: 16 }}>
            Ожидаемая дата запуска: <strong>конец 2026 года</strong>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default UnderDevelopmentPage;
