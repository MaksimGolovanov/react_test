// src/features/security-training/components/admin/CourseCard.jsx
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
import trainingStore from '../../store/SecurityTrainingStore';
import './CourseCard.css';

const CourseCard = observer(({ course }) => {
  const navigate = useNavigate();
  const progress = trainingStore.getCourseProgress(course.id, course.lessons?.length || 0);
  const isCompleted = trainingStore.userProgress[course.id]?.completed || false;

  const getIcon = (iconName) => {
    const icons = {
      SafetyOutlined: <SafetyOutlined />,
      WarningOutlined: <WarningOutlined />,
      LockOutlined: <LockOutlined />,
      ShieldOutlined: <LockOutlined />
    };
    return icons[iconName] || <SafetyOutlined />;
  };

  return (
    <Card
      hoverable
      className="admin-course-card"
      cover={
        <div className="course-cover">
          {getIcon(course.icon)}
          <h3 className="course-cover-title">{course.title}</h3>
        </div>
      }
      actions={[
        <Button 
          type="primary" 
          onClick={() => navigate(`/security-training/course/${course.id}`)}
          key="start"
          className="course-action-btn"
        >
          {isCompleted ? 'Повторить' : 'Начать обучение'} 
          <ArrowRightOutlined />
        </Button>
      ]}
    >
      <div className="course-card-body">
        <p className="course-description">{course.description}</p>
        <Row gutter={[8, 8]} className="course-tags-row">
          <Col span={12}>
            <Tag icon={<ClockCircleOutlined />} color="blue">{course.duration}</Tag>
          </Col>
          <Col span={12}>
            <Tag color={course.level === 'Начальный' ? 'green' : 'orange'}>{course.level}</Tag>
          </Col>
        </Row>
        <div className="course-progress">
          <div className="progress-label">Прогресс: <span>{progress}%</span></div>
          <Progress percent={progress} size="small" />
        </div>
        {isCompleted && <Tag color="success" className="completed-tag">Курс пройден</Tag>}
      </div>
    </Card>
  );
});

export default CourseCard;