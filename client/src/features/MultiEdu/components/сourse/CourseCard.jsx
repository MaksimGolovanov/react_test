// src/features/security-training/components/CourseCard.jsx
import React from 'react';
import { Card, Tag, Progress, Button, Typography } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  RightOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const CourseCard = ({
  course,
  progress,
  isUserAuthenticated,
  showProgress = true,
}) => {
  const navigate = useNavigate();

  // Вспомогательные функции
  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return '#52c41a';
      case 'intermediate':
        return '#fa8c16';
      case 'advanced':
        return '#f5222d';
      default:
        return '#d9d9d9';
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
    return Math.round(
      (progress.completed_lessons.length / course.lessons.length) * 100
    );
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

  // Обработчик клика
  const handleCardClick = () => {
 
    navigate(`/multiedu/course/${course.id}`);
  };

  // Получаем цвет и иконку статуса
  const getStatusInfo = () => {
    switch (status) {
      case 'completed':
        return { color: '#52c41a', icon: <CheckCircleOutlined />, text: '✓' };
      case 'in-progress':
        return { color: '#1890ff', icon: <PlayCircleOutlined />, text: '▶' };
      default:
        return { color: '#8c8c8c', icon: null, text: '○' };
    }
  };

  const statusInfo = getStatusInfo();

  // Миниатюрное изображение
  const getThumbnail = () => {
    if (course.cover_image) {
      return (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 6,
            overflow: 'hidden',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <img
            alt={course.title}
            src={course.cover_image}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Индикатор статуса */}
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: statusInfo.color,
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 8,
              color: '#fff',
              fontWeight: 'bold',
            }}
          >
            {statusInfo.text}
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 6,
          background: statusInfo.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: statusInfo.color,
            border: '2px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 8,
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          {statusInfo.text}
        </div>
      </div>
    );
  };

  // Прогресс бар
  const getProgressBar = () => {
    if (!showProgress || !isUserAuthenticated) return null;

    if (status === 'completed') {
      return (
        <div style={{ width: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Progress
              percent={100}
              size="small"
              status="success"
              strokeWidth={4}
              style={{ width: 40 }}
              showInfo={false}
            />
            <TrophyOutlined style={{ fontSize: 10, color: '#faad14' }} />
          </div>
        </div>
      );
    }

    if (status === 'in-progress') {
      return (
        <div style={{ width: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Progress
              percent={progressPercent}
              size="small"
              status="active"
              strokeWidth={4}
              style={{ width: 40 }}
              showInfo={false}
            />
            <Text type="secondary" style={{ fontSize: 11 }}>
              {progressPercent}%
            </Text>
          </div>
        </div>
      );
    }

    return null;
  };

  // Кнопка действия
  const getActionButton = () => {
    if (status === 'completed') {
      return (
        <Button
          type="text"
          size="small"
          style={{
            padding: '0 4px',
            height: 22,
            fontSize: 11,
            color: statusInfo.color,
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          ✓
        </Button>
      );
    }

    if (status === 'in-progress') {
      return (
        <Button
          type="primary"
          size="small"
          style={{
            padding: '0 4px',
            height: 22,
            fontSize: 11,
            background: statusInfo.color,
            borderColor: statusInfo.color,
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          ▶
        </Button>
      );
    }

    return (
      <Button
        type="text"
        size="small"
        style={{
          padding: '0 4px',
          height: 22,
          fontSize: 11,
          color: statusInfo.color,
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
      >
        →
      </Button>
    );
  };

  return (
    <Card
      size="small"
      hoverable
      onClick={handleCardClick}
      bodyStyle={{
        padding: 8,
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
      }}
      style={{
        borderRadius: 6,
        border: '1px solid #f0f0f0',
        height: '100%',
      }}
    >
      {/* Миниатюра */}
      {getThumbnail()}

      {/* Основной контент */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Верхняя строка: заголовок и кнопка */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 4,
          }}
        >
          <Text
            strong
            style={{
              fontSize: 13,
              lineHeight: 1.3,
              flex: 1,
              minWidth: 0,
              wordBreak: 'break-word',
            }}
          >
            {course.title}
          </Text>
          {getActionButton()}
        </div>

        {/* Теги */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            marginBottom: 4,
            flexWrap: 'wrap',
          }}
        >
          <Tag
            color={getLevelColor(course.level)}
            style={{
              margin: 0,
              padding: '0 4px',
              fontSize: 9,
              height: 16,
              lineHeight: '16px',
              borderRadius: 3,
              border: 'none',
            }}
          >
            {course.level === 'beginner'
              ? 'Н'
              : course.level === 'intermediate'
              ? 'С'
              : 'П'}
          </Tag>
          <Tag
            style={{
              margin: 0,
              padding: '0 4px',
              fontSize: 9,
              height: 16,
              lineHeight: '16px',
              borderRadius: 3,
              background: '#f5f5f5',
              color: '#595959',
              border: 'none',
            }}
          >
            {getCategoryName(course.category)}
          </Tag>
        </div>

        {/* Описание */}
        <Text
          type="secondary"
          style={{
            fontSize: 11,
            lineHeight: 1.3,
            display: 'block',
            marginBottom: 4,
          }}
        >
          {course.short_description?.substring(0, 50)}
          {course.short_description?.length > 50 ? '...' : ''}
        </Text>

        {/* Нижняя строка: время и прогресс */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
          }}
        >
          {/* Время */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ClockCircleOutlined style={{ fontSize: 10, color: '#bfbfbf' }} />
            <Text type="secondary" style={{ fontSize: 10 }}>
              {course.duration || '15м'}
            </Text>
          </div>

          {/* Прогресс */}
          {getProgressBar()}
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
