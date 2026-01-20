import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { 
  TrophyOutlined, 
  ClockCircleOutlined, 
  BookOutlined, 
  SafetyCertificateOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const ProgressStats = ({ 
  userProgress, 
  completedLessonsCount,
  totalLessons,
  compact = true 
}) => {
  const formatTime = (minutes) => {
    if (!minutes || minutes === 0) return '0 мин';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} мин`;
    } else if (mins === 0) {
      return `${hours} ч`;
    } else {
      return `${hours} ч ${mins} мин`;
    }
  };

  const calculateTotalTime = () => {
    if (userProgress?.totalTimeSpent) {
      return userProgress.totalTimeSpent;
    }
    
    if (userProgress?.lessonTimeSpent) {
      return Object.values(userProgress.lessonTimeSpent || {})
        .reduce((sum, minutes) => sum + (minutes || 0), 0);
    }
    
    return 0;
  };

  const isCourseCompleted = userProgress?.completed || false;
  const testScore = userProgress?.testScore || 0;
  const totalTimeSpent = calculateTotalTime();

  if (!compact) return null;

  return (
    <Card size="small" style={styles.card}>
      <CardHeader />
      
      <Row gutter={[8, 12]} style={{ marginBottom: '8px' }}>
        <Col span={8}>
          <TimeStat totalTimeSpent={totalTimeSpent} />
        </Col>
        <Col span={8}>
          <LessonsStat 
            completedLessonsCount={completedLessonsCount} 
            totalLessons={totalLessons} 
          />
        </Col>
        <Col span={8}>
          <TestStat 
            testScore={testScore} 
            isCourseCompleted={isCourseCompleted} 
          />
        </Col>
      </Row>
    </Card>
  );
};

const CardHeader = () => (
  <div style={styles.header}>
    <TrophyOutlined style={styles.headerIcon} />
    <Text strong style={styles.headerText}>Статистика курса</Text>
  </div>
);

const TimeStat = ({ totalTimeSpent }) => (
  <StatItem
    icon={<ClockCircleOutlined style={styles.timeIcon} />}
    value={formatTime(totalTimeSpent)}
    label="Всего времени"
    valueColor="#1890ff"
  />
);

const LessonsStat = ({ completedLessonsCount, totalLessons }) => (
  <StatItem
    icon={<BookOutlined style={styles.lessonsIcon} />}
    value={`${completedLessonsCount}/${totalLessons}`}
    label="Уроки"
    valueColor="#52c41a"
  />
);

const TestStat = ({ testScore, isCourseCompleted }) => {
  const getTestScoreColor = () => {
    if (testScore >= 80) return '#52c41a';
    if (testScore >= 60) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <StatItem
      icon={
        <SafetyCertificateOutlined 
          style={{ 
            color: isCourseCompleted ? '#52c41a' : '#fa8c16', 
            fontSize: '16px' 
          }} 
        />
      }
      value={`${testScore}%`}
      label="Тест"
      valueColor={getTestScoreColor()}
    />
  );
};

const StatItem = ({ icon, value, label, valueColor }) => (
  <div style={styles.statItem}>
    <div style={styles.statIcon}>{icon}</div>
    <div style={styles.statValue}>
      <Text strong style={{ ...styles.statValueText, color: valueColor }}>
        {value}
      </Text>
    </div>
    <Text type="secondary" style={styles.statLabel}>{label}</Text>
  </div>
);

const formatTime = (minutes) => {
  if (!minutes || minutes === 0) return '0 мин';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} мин`;
  } else if (mins === 0) {
    return `${hours} ч`;
  } else {
    return `${hours} ч ${mins} мин`;
  }
};

const styles = {
  card: {
    marginBottom: '16px', 
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
  },
  header: {
    display: 'flex', 
    alignItems: 'center', 
    marginBottom: '12px'
  },
  headerIcon: {
    color: '#faad14', 
    marginRight: '8px', 
    fontSize: '16px'
  },
  headerText: {
    fontSize: '14px'
  },
  timeIcon: {
    color: '#1890ff', 
    fontSize: '16px'
  },
  lessonsIcon: {
    color: '#52c41a', 
    fontSize: '16px'
  },
  statItem: {
    textAlign: 'center'
  },
  statIcon: {
    marginBottom: '4px', 
    height: '24px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  statValue: {
    marginBottom: '2px'
  },
  statValueText: {
    fontSize: '14px', 
    lineHeight: '1.2'
  },
  statLabel: {
    fontSize: '11px', 
    lineHeight: '1.2'
  }
};

export default ProgressStats;