// shared/ui/PageContainer/PageContainer.tsx
import React from 'react';
import { Card, Row, Col } from 'antd';

interface PageContainerProps {
  title?: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export const PageContainer: React.FC<PageContainerProps> = ({ title, children, maxWidth = 1200 }) => {
  return (
    <Row justify="center" style={{ padding: 20 }}>
      <Col xs={24} sm={24} md={22} lg={20} xl={18} style={{ maxWidth }}>
        {title ? (
          <Card title={title} style={{ borderRadius: 8 }}>
            {children}
          </Card>
        ) : (
          children
        )}
      </Col>
    </Row>
  );
};