import React from 'react';
import { Card, Row, Col, Progress, Typography } from 'antd';
import { 
  TrophyOutlined, 
  ClockCircleOutlined, 
  BookOutlined, 
  SafetyCertificateOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const ProgressStats = ({ 
  userProgress, 
  lessons, 
  progressPercentage,
  completedLessonsCount,
  totalLessons,
  compact = true 
}) => {
  
  // Функция форматирования времени
  const formatTime = (minutes) => {
    if (!minutes || minutes === 0) return '0 мин';
    if (minutes < 60) return `${minutes} мин`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} ч ${mins} мин`;
  };

  const isCourseCompleted = userProgress?.completed || false;
  const testScore = userProgress?.testScore || 0;
  const totalTimeSpent = userProgress?.totalTimeSpent || 0;

  // Рассчитываем среднее время на урок
  const calculateAverageTime = () => {
    if (completedLessonsCount === 0 || totalTimeSpent === 0) return 0;
    return Math.round(totalTimeSpent / completedLessonsCount);
  };

  const averageTimePerLesson = calculateAverageTime();

  if (compact) {
    return (
      <Card 
        size="small" 
        style={{ 
          marginBottom: '16px', 
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          border: '1px solid #e0e0e0',
        }}
        bodyStyle={{ padding: '12px 16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <TrophyOutlined style={{ color: '#faad14', marginRight: '8px', fontSize: '16px' }} />
          <Text strong style={{ fontSize: '14px' }}>Статистика курса</Text>
        </div>
        
        <Row gutter={[8, 8]} style={{ marginBottom: '4px' }}>
          <Col span={8}>
            <StatItem
              icon={<ClockCircleOutlined style={{ color: '#1890ff', fontSize: '18px' }} />}
              value={formatTime(totalTimeSpent)}
              label="Общее время"
              valueColor="#1890ff"
            />
          </Col>
          <Col span={8}>
            <StatItem
              icon={<BookOutlined style={{ color: '#52c41a', fontSize: '18px' }} />}
              value={`${completedLessonsCount}/${totalLessons}`}
              label="Уроки"
              valueColor="#52c41a"
            />
          </Col>
          <Col span={8}>
            <StatItem
              icon={<SafetyCertificateOutlined style={{ 
                color: isCourseCompleted ? '#52c41a' : '#fa8c16', 
                fontSize: '18px' 
              }} />}
              value={`${testScore}%`}
              label="Тест"
              valueColor={testScore >= 80 ? '#52c41a' : testScore >= 60 ? '#faad14' : '#ff4d4f'}
            />
          </Col>
        </Row>
        
        {/* Дополнительная строка с детальной статистикой времени */}
        {completedLessonsCount > 0 && totalTimeSpent > 0 && (
          <Row gutter={[8, 8]} style={{ marginTop: '8px', marginBottom: '4px' }}>
            <Col span={12}>
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: '10px' }}>Среднее время на урок:</Text>
                <div>
                  <Text strong style={{ fontSize: '11px', color: '#722ed1' }}>
                    {formatTime(averageTimePerLesson)}
                  </Text>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: '10px' }}>Всего времени:</Text>
                <div>
                  <Text strong style={{ fontSize: '11px', color: '#13c2c2' }}>
                    {formatTime(totalTimeSpent)}
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        )}
        
        <div style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>Прогресс:</Text>
            <Text strong style={{ fontSize: '12px' }}>{progressPercentage}%</Text>
          </div>
          <Progress 
            percent={progressPercentage} 
            size="small" 
            showInfo={false}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
      </Card>
    );
  }

  return null;
};

const StatItem = ({ icon, value, label, valueColor }) => (
  <div style={{ textAlign: 'center' }}>
    {icon}
    <div>
      <Text strong style={{ fontSize: '13px', color: valueColor }}>
        {value}
      </Text>
    </div>
    <Text type="secondary" style={{ fontSize: '11px' }}>{label}</Text>
  </div>
);

export default ProgressStats;