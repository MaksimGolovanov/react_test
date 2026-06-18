import React from 'react';
import { Card, Tag, Progress, Button, Typography } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './CourseCard.css';

const { Text } = Typography;

const CourseCard = ({ course, progress, isUserAuthenticated, showProgress = true }) => {
  const navigate = useNavigate();

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return '#52c41a';
      case 'intermediate': return '#fa8c16';
      case 'advanced': return '#f5222d';
      default: return '#d9d9d9';
    }
  };

  const getCategoryName = (category) => {
    const categories = {
      basics: 'Основы',
      phishing: 'Фишинг',
      passwords: 'Пароли',
      social_engineering: 'Соц.',
      malware: 'Вред. ПО',
      data_protection: 'Данные',
      network_security: 'Сеть',
    };
    return categories[category] || category;
  };

  const calculateProgressPercentage = () => {
    if (!course?.lessons?.length || !progress?.completed_lessons) return 0;
    return Math.round((progress.completed_lessons.length / course.lessons.length) * 100);
  };

  const getStatus = () => {
    if (!progress) return 'not-started';
    if (progress.passed_test) return 'completed';
    const completedLessons = progress?.completed_lessons?.length || 0;
    if (completedLessons > 0) return 'in-progress';
    return 'not-started';
  };

  const status = getStatus();
  const progressPercent = calculateProgressPercentage();

  const handleCardClick = () => {
    navigate(`/multiedu/course/${course.id}`);
  };

  const statusInfo = {
    completed: { color: '#52c41a', icon: <CheckCircleOutlined />, text: '✓' },
    'in-progress': { color: '#1890ff', icon: <PlayCircleOutlined />, text: '▶' },
    'not-started': { color: '#8c8c8c', icon: null, text: '○' },
  }[status];

  const getThumbnail = () => {
    const indicator = (
      <div className="status-indicator" style={{ background: statusInfo.color }}>
        {statusInfo.text}
      </div>
    );

    if (course.cover_image) {
      return (
        <div className="thumbnail-wrapper">
          <img alt={course.title} src={course.cover_image} className="thumbnail-img" />
          {indicator}
        </div>
      );
    }

    return (
      <div className="thumbnail-placeholder" style={{ background: statusInfo.color }}>
        {indicator}
      </div>
    );
  };

  const getProgressBar = () => {
    if (!showProgress || !isUserAuthenticated) return null;
    if (status === 'completed') {
      return (
        <div className="progress-completed">
          <Progress percent={100} size="small" status="success" strokeWidth={4} showInfo={false} />
          <TrophyOutlined className="trophy-icon" />
        </div>
      );
    }
    if (status === 'in-progress') {
      return (
        <div className="progress-inprogress">
          <Progress percent={progressPercent} size="small" status="active" strokeWidth={4} showInfo={false} />
          <Text type="secondary" className="progress-percent">{progressPercent}%</Text>
        </div>
      );
    }
    return null;
  };

  const getActionButton = () => {
    const btnClass = `action-btn action-${status}`;
    if (status === 'completed') {
      return (
        <Button type="text" size="small" className={btnClass} onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
          ✓
        </Button>
      );
    }
    if (status === 'in-progress') {
      return (
        <Button type="primary" size="small" className={btnClass} style={{ background: statusInfo.color, borderColor: statusInfo.color }} onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
          ▶
        </Button>
      );
    }
    return (
      <Button type="text" size="small" className={btnClass} onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
        →
      </Button>
    );
  };

  const levelShort = course.level === 'beginner' ? 'Н' : course.level === 'intermediate' ? 'С' : 'П';

  return (
    <Card size="small" hoverable onClick={handleCardClick} className="course-card">
      {getThumbnail()}
      <div className="course-card-content">
        <div className="course-card-header">
          <Text strong className="course-card-title">{course.title}</Text>
          {getActionButton()}
        </div>
        <div className="course-card-tags">
          <Tag color={getLevelColor(course.level)} className="tag-level">{levelShort}</Tag>
          <Tag className="tag-category">{getCategoryName(course.category)}</Tag>
        </div>
        <Text type="secondary" className="course-card-description">
          {course.short_description?.substring(0, 50)}{course.short_description?.length > 50 ? '...' : ''}
        </Text>
        <div className="course-card-footer">
          <div className="course-duration">
            <ClockCircleOutlined className="duration-icon" />
            <Text type="secondary" className="duration-text">{course.duration || '15м'}</Text>
          </div>
          {getProgressBar()}
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;