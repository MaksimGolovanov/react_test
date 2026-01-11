// src/features/security-training/components/admin/StatsCards.jsx
import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  TeamOutlined,
  UserAddOutlined,
  StarOutlined,
  BookOutlined,
} from '@ant-design/icons';

const StatsCards = ({ statsData }) => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Всего пользователей"
            value={statsData.totalUsers}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Активных (7 дней)"
            value={statsData.activeUsers}
            prefix={<UserAddOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Средний балл"
            value={statsData.avgScore}
            suffix="%"
            prefix={<StarOutlined />}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Всего пройдено курсов"
            value={statsData.totalCourses}
            prefix={<BookOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards;