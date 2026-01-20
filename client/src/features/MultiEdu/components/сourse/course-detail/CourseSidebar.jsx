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
    <div style={{ marginBottom: '16px' }}>
      <BackButton onBackToCourses={onBackToCourses} />
      
      <CourseTitle title={course.title} />
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <ProgressSection
          userProgress={userProgress}
          lessons={lessons}
          progressPercentage={progressPercentage}
          completedLessonsCount={completedLessonsCount}
          totalLessons={totalLessons}
          course={course}
          isCourseCompleted={isCourseCompleted}
        />
      </Space>

      <Divider orientation="left" style={styles.divider}>
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

const BackButton = ({ onBackToCourses }) => (
  <Button
    icon={<ArrowLeftOutlined />}
    onClick={onBackToCourses}
    type="text"
    style={styles.backButton}
  >
    Назад к курсам
  </Button>
);

const CourseTitle = ({ title }) => (
  <Title level={4} style={styles.courseTitle}>
    {title}
  </Title>
);

const ProgressSection = ({
  userProgress,
  lessons,
  progressPercentage,
  completedLessonsCount,
  totalLessons,
  course,
  isCourseCompleted,
}) => (
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
        totalTimeSpent={userProgress?.totalTimeSpent || 0}
        userProgress={userProgress}
      />
    </div>
  </div>
);

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

    if (minutes < 60) {
      return `${minutes} мин`;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
      return `${hours} ч`;
    }

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
      <Tag size="small" color="blue" style={styles.tag}>
        {getLevelLabel(course.level)}
      </Tag>

      {shouldShowTimeSpent ? (
        <Tag
          size="small"
          color="geekblue"
          icon={<ClockCircleOutlined style={styles.iconSmall} />}
          style={styles.tag}
        >
          {formatTimeFromMinutes(actualTotalTimeSpent)}
        </Tag>
      ) : course.duration && (
        <Tag size="small" style={styles.tag}>
          <ClockCircleOutlined style={styles.iconSmall} />
          {typeof course.duration === 'number'
            ? formatTimeFromMinutes(course.duration)
            : course.duration}
        </Tag>
      )}

      {isCourseCompleted && (
        <Tag
          size="small"
          color="success"
          icon={<SafetyCertificateOutlined />}
          style={styles.tag}
        >
          Пройден
        </Tag>
      )}
    </Space>
  );
};

const styles = {
  backButton: {
    marginBottom: '12px',
    padding: '4px 0',
  },
  courseTitle: {
    marginBottom: '6px',
    fontSize: '18px',
  },
  divider: {
    fontSize: '14px',
    margin: '16px 0',
  },
  tag: {
    fontSize: '11px',
    padding: '1px 6px',
  },
  iconSmall: {
    fontSize: '10px',
  },
};

export default CourseSidebar;