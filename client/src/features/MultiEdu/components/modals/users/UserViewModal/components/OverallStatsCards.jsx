// components/OverallStatsCards.js
import React  from 'react';
import moment from 'moment';
import { Row, Col, Card, Statistic } from 'antd';
import {
  CheckCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { formatTimeFromMinutes } from '../utils/formatUtils';

export const OverallStatsCards = ({ overallStats, averageScore }) => (
  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
    <Col span={6}>
      <Card size="small">
        <Statistic
          title="Пройдено курсов"
          value={overallStats.completedCourses}
          suffix={`/ ${overallStats.totalCourses}`}
          prefix={<CheckCircleOutlined />}
          valueStyle={{ color: '#3f8600' }}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card size="small">
        <Statistic
          title="Средний балл"
          value={averageScore.toFixed(1)}
          suffix="%"
          prefix={<TrophyOutlined />}
          valueStyle={{
            color:
              averageScore >= 80
                ? '#3f8600'
                : averageScore >= 60
                ? '#faad14'
                : '#cf1322',
          }}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card size="small">
        <Statistic
          title="Время обучения"
          value={formatTimeFromMinutes(overallStats.totalTime)}
          prefix={<ClockCircleOutlined />}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card size="small">
        <Statistic
          title="Последняя активность"
          value={formatLastActivity(overallStats.lastActivity)}
          prefix={<CalendarOutlined />}
        />
      </Card>
    </Col>
  </Row>
);

const formatLastActivity = (date) => {
  if (!date) return 'Нет данных';
  return moment(date).format('DD.MM.YYYY HH:mm');
};