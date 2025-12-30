// src/features/security-training/components/CourseCard.jsx
import React from 'react';
import { Card, Progress, Tag, Button, Row, Col } from 'antd';
import { 
  SafetyOutlined, 
  ClockCircleOutlined, 
  ArrowRightOutlined,
  WarningOutlined,
  LockOutlined,
  
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import trainingStore from '../store/SecurityTrainingStore';

const CourseCard = observer(({ course }) => {
  const navigate = useNavigate();
  const progress = trainingStore.getCourseProgress(course.id, course.lessons?.length || 0);
  const isCompleted = trainingStore.userProgress[course.id]?.completed || false;

  const getIcon = (iconName) => {
    const icons = {
      SafetyOutlined: <SafetyOutlined />,
      WarningOutlined: <WarningOutlined />,
      LockOutlined: <LockOutlined />,
      ShieldOutlined: <LockOutlined /> // Исправлено
    };
    return icons[iconName] || <SafetyOutlined />;
  };

  return (
    <Card
      hoverable
      style={{ height: '100%' }}
      cover={
        <div style={{ 
          backgroundColor: '#1890ff', 
          padding: '20px', 
          textAlign: 'center',
          color: 'white'
        }}>
          {getIcon(course.icon)}
          <h3 style={{ margin: '10px 0 0', color: 'white' }}>{course.title}</h3>
        </div>
      }
      actions={[
        <Button 
          type="primary" 
          onClick={() => navigate(`/security-training/course/${course.id}`)}
          key="start"
        >
          {isCompleted ? 'Повторить' : 'Начать обучение'} 
          <ArrowRightOutlined />
        </Button>
      ]}
    >
      <div style={{ minHeight: '150px' }}>
        <p>{course.description}</p>
        
        <Row gutter={[8, 8]} style={{ marginBottom: '16px' }}>
          <Col span={12}>
            <Tag icon={<ClockCircleOutlined />} color="blue">
              {course.duration}
            </Tag>
          </Col>
          <Col span={12}>
            <Tag color={course.level === 'Начальный' ? 'green' : 'orange'}>
              {course.level}
            </Tag>
          </Col>
        </Row>

        <div style={{ marginTop: '16px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '8px' 
          }}>
            <span>Прогресс:</span>
            <span>{progress}%</span>
          </div>
          <Progress percent={progress} size="small" />
        </div>

        {isCompleted && (
          <Tag color="success" style={{ marginTop: '10px' }}>
            Курс пройден
          </Tag>
        )}
      </div>
    </Card>
  );
});

export default CourseCard;