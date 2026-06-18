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
import './CourseSidebar.css';

const { Title } = Typography;

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
  const progressPercentage = totalLessons > 0
    ? Math.round((completedLessonsCount / totalLessons) * 100)
    : 0;

  const isCourseCompleted = userProgress?.completed || false;

  return (
    <div className="course-sidebar">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={onBackToCourses}
        type="text"
        className="back-button"
      >
        Назад к курсам
      </Button>
      
      <Title level={4} className="course-title">
        {course.title}
      </Title>
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <div className="progress-section">
          <ProgressStats
            userProgress={userProgress}
            lessons={lessons}
            progressPercentage={progressPercentage}
            completedLessonsCount={completedLessonsCount}
            totalLessons={totalLessons}
            compact
          />

          <div className="course-tags-wrapper">
            <CourseTags
              course={course}
              isCourseCompleted={isCourseCompleted}
              totalTimeSpent={userProgress?.totalTimeSpent || 0}
              userProgress={userProgress}
            />
          </div>
        </div>
      </Space>

      <Divider orientation="left" className="lessons-divider">
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

const CourseTags = ({ course, isCourseCompleted, totalTimeSpent, userProgress }) => {
  const calculateTotalTimeFromLessons = () => {
    if (!userProgress?.lessonTimeSpent) return totalTimeSpent;
    const totalMinutes = Object.values(userProgress.lessonTimeSpent || {})
      .reduce((sum, minutes) => sum + (minutes || 0), 0);
    return Math.max(totalMinutes, totalTimeSpent || 0);
  };

  const actualTotalTimeSpent = calculateTotalTimeFromLessons();
  const shouldShowTimeSpent = actualTotalTimeSpent > 0;

  const formatTimeFromMinutes = (minutes) => {
    if (!minutes || minutes === 0) return '0 мин';
    if (minutes < 60) return `${minutes} мин`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} ч`;
    return `${hours} ч ${mins} мин`;
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 'beginner': return 'Начальный';
      case 'intermediate': return 'Средний';
      default: return 'Продвинутый';
    }
  };

  return (
    <Space wrap size={[6, 6]}>
      <Tag color="blue" className="course-tag">
        {getLevelLabel(course.level)}
      </Tag>

      {shouldShowTimeSpent ? (
        <Tag
          color="geekblue"
          icon={<ClockCircleOutlined className="tag-icon" />}
          className="course-tag"
        >
          {formatTimeFromMinutes(actualTotalTimeSpent)}
        </Tag>
      ) : course.duration && (
        <Tag className="course-tag">
          <ClockCircleOutlined className="tag-icon" />
          {typeof course.duration === 'number'
            ? formatTimeFromMinutes(course.duration)
            : course.duration}
        </Tag>
      )}

      {isCourseCompleted && (
        <Tag
          color="success"
          icon={<SafetyCertificateOutlined />}
          className="course-tag"
        >
          Пройден
        </Tag>
      )}
    </Space>
  );
};

export default CourseSidebar;