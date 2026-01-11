// src/features/security-training/components/LoadingSkeleton.jsx
import React from 'react';
import { Row, Col, Card, Skeleton, Typography, Divider } from 'antd';

const { Title } = Typography;

const LoadingSkeleton = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Обучение по информационной безопасности</Title>
      <Divider />
      <Row gutter={[24, 24]}>
        {[1, 2, 3, 4].map(i => (
          <Col key={i} xs={24} sm={12} lg={8} xl={6}>
            <Card>
              <Skeleton active />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default LoadingSkeleton;