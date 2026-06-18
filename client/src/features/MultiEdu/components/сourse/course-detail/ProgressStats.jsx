import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { TrophyOutlined, ClockCircleOutlined, BookOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import './ProgressStats.css';

const { Text } = Typography;

const ProgressStats = ({ userProgress, completedLessonsCount, totalLessons, compact = true }) => {
  const formatTime = (minutes) => {
    if (!minutes || minutes === 0) return '0 мин';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} мин`;
    if (mins === 0) return `${hours} ч`;
    return `${hours} ч ${mins} мин`;
  };

  const calculateTotalTime = () => {
    if (userProgress?.totalTimeSpent) return userProgress.totalTimeSpent;
    if (userProgress?.lessonTimeSpent) {
      return Object.values(userProgress.lessonTimeSpent).reduce((sum, minutes) => sum + (minutes || 0), 0);
    }
    return 0;
  };

  const isCourseCompleted = userProgress?.completed || false;
  const testScore = userProgress?.testScore || 0;
  const totalTimeSpent = calculateTotalTime();

  if (!compact) return null;

  const getTestScoreColor = () => {
    if (testScore >= 80) return '#52c41a';
    if (testScore >= 60) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <Card size="small" className="progress-stats-card">
      <div className="progress-header">
        <TrophyOutlined className="progress-header-icon" />
        <Text strong className="progress-header-text">Статистика курса</Text>
      </div>
      <Row gutter={[8, 12]} className="progress-stats-row">
        <Col span={8}>
          <div className="stat-item">
            <div className="stat-icon"><ClockCircleOutlined className="icon-time" /></div>
            <div className="stat-value"><Text strong style={{ color: '#1890ff' }}>{formatTime(totalTimeSpent)}</Text></div>
            <Text type="secondary" className="stat-label">Всего времени</Text>
          </div>
        </Col>
        <Col span={8}>
          <div className="stat-item">
            <div className="stat-icon"><BookOutlined className="icon-lessons" /></div>
            <div className="stat-value"><Text strong style={{ color: '#52c41a' }}>{completedLessonsCount}/{totalLessons}</Text></div>
            <Text type="secondary" className="stat-label">Уроки</Text>
          </div>
        </Col>
        <Col span={8}>
          <div className="stat-item">
            <div className="stat-icon">
              <SafetyCertificateOutlined className={isCourseCompleted ? 'icon-cert-success' : 'icon-cert-warning'} />
            </div>
            <div className="stat-value"><Text strong style={{ color: getTestScoreColor() }}>{testScore}%</Text></div>
            <Text type="secondary" className="stat-label">Тест</Text>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ProgressStats;