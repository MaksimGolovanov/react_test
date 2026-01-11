import React from 'react';
import { Button, Typography, Divider, Space, Tag } from 'antd';
import {
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import ProgressStats from './ProgressStats';
import LessonsList from './LessonsList';
import TestButton from './TestButton';

const { Title, Paragraph, Text } = Typography;

const CourseSidebar = ({
  course,
  lessons,
  userProgress,
  selectedLesson,
  onSelectLesson,
  onBackToCourses,
  courseId,
}) => {
  const completedLessonsCount = userProgress?.completedLessons?.length || 0;
  const totalLessons = lessons.length || 0;
  const progressPercentage =
    totalLessons > 0
      ? Math.round((completedLessonsCount / totalLessons) * 100)
      : 0;

  const isCourseCompleted = userProgress?.completed || false;
  const totalTimeSpent = userProgress?.totalTimeSpent || 0;

  return (
    <div style={{ marginBottom: '16px' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={onBackToCourses}
        type="text"
        style={{ marginBottom: '12px', padding: '4px 0' }}
      >
        Назад к курсам
      </Button>

      <Title level={4} style={{ marginBottom: '6px', fontSize: '18px' }}>
        {course.title}
      </Title>

      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ marginBottom: '12px' }}>
          <ProgressStats
            userProgress={userProgress}
            lessons={lessons}
            progressPercentage={progressPercentage}
            completedLessonsCount={completedLessonsCount}
            totalLessons={totalLessons}
            compact
          />

          <div style={{ marginTop: '8px' }}>
            <CourseTags
              course={course}
              isCourseCompleted={isCourseCompleted}
              totalTimeSpent={totalTimeSpent}
            />
          </div>
        </div>
      </Space>

      <Divider
        orientation="left"
        style={{ fontSize: '14px', margin: '16px 0' }}
      >
        Уроки курса
      </Divider>

      <LessonsList
        lessons={lessons}
        userProgress={userProgress}
        selectedLesson={selectedLesson}
        onSelectLesson={onSelectLesson}
      />

      <TestButton
        courseId={courseId}
        lessons={lessons}
        userProgress={userProgress}
        isCourseCompleted={isCourseCompleted}
      />
    </div>
  );
};

const CourseTags = ({ course, isCourseCompleted, totalTimeSpent }) => {
  // Функция форматирования времени
  const formatTime = (minutes) => {
    if (!minutes || minutes === 0) return '0 мин';
    if (minutes < 60) return `${minutes} мин`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} ч ${mins} мин`;
  };

  return (
    <Space wrap size={[6, 6]}>
      <Tag
        size="small"
        color="blue"
        style={{ fontSize: '11px', padding: '1px 6px' }}
      >
        {course.level === 'beginner'
          ? 'Начальный'
          : course.level === 'intermediate'
          ? 'Средний'
          : 'Продвинутый'}
      </Tag>
      <Tag size="small" style={{ fontSize: '11px', padding: '1px 6px' }}>
        <ClockCircleOutlined style={{ fontSize: '10px' }} />
        {course.duration || '~'}
      </Tag>
      <Tag
        size="small"
        style={{
          fontSize: '11px',
          padding: '1px 6px',
          background: '#e6f7ff',
          borderColor: '#91d5ff',
          color: '#1890ff',
        }}
      >
        <ClockCircleOutlined style={{ fontSize: '10px' }} />
        {formatTime(totalTimeSpent)}
      </Tag>
      {isCourseCompleted && (
        <Tag
          size="small"
          color="success"
          icon={<SafetyCertificateOutlined />}
          style={{ fontSize: '11px', padding: '1px 6px' }}
        >
          Пройден
        </Tag>
      )}
    </Space>
  );
};

export default CourseSidebar;
