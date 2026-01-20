// components/TestStatsSummary.js
import React from 'react';
import { Row, Col, Statistic, Card } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { formatTimeFromMinutes } from '../utils/formatUtils';

export const TestStatsSummary = ({ testResults }) => {
  const getPassedTestsCount = () => {
    return testResults.filter((result) => result.passed).length;
  };

  const getAverageTestScore = () => {
    if (testResults.length === 0) return 0;
    const totalScore = testResults.reduce((sum, result) => sum + (result.score || 0), 0);
    return (totalScore / testResults.length).toFixed(1);
  };

  const getTotalTimeSpent = () => {
    return testResults.reduce((total, result) => total + (result.timeSpent || 0), 0);
  };

  return (
    <Card title="Общая статистика по тестам" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Statistic
            title="Всего тестов"
            value={testResults.length}
            prefix={<BarChartOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Пройдено тестов"
            value={getPassedTestsCount()}
            suffix={`/${testResults.length}`}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Средний балл"
            value={getAverageTestScore()}
            suffix="%"
            prefix={<TrophyOutlined />}
            valueStyle={{
              color:
                parseFloat(getAverageTestScore()) >= 80
                  ? '#3f8600'
                  : parseFloat(getAverageTestScore()) >= 60
                  ? '#faad14'
                  : '#cf1322',
            }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Общее время"
            value={formatTimeFromMinutes(getTotalTimeSpent())}
            prefix={<ClockCircleOutlined />}
          />
        </Col>
      </Row>
    </Card>
  );
};