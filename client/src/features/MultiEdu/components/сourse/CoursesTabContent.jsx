// src/features/security-training/components/CoursesTabContent.jsx
import React from 'react';
import { Row, Col, Empty, Tabs } from 'antd';
import CourseCard from './CourseCard';

const { TabPane } = Tabs;

const CoursesTabContent = ({
  courses,
  userProgress,
  isUserAuthenticated,
  completedCourses,
}) => {
  // Функции для фильтрации
  const isCourseInProgress = (course, progress) => {
    const totalLessons = course?.lessons?.length || 0;
    const hasCompletedLessons = progress?.completed_lessons?.length > 0;
    const allLessonsCompleted = progress?.completed_lessons?.length >= totalLessons;
    const testPassed = progress?.passed_test;

    return hasCompletedLessons && !allLessonsCompleted && !testPassed;
  };

  const isCourseCompleted = (courseId) => {
    const progress = userProgress[courseId];
    return progress?.passed_test === true;
  };

  const getInProgressCourses = () => {
    return courses.filter(course => 
      isCourseInProgress(course, userProgress[course.id])
    );
  };

  const getCompletedCourses = () => {
    return courses.filter(course => 
      isCourseCompleted(course.id)
    );
  };

  // Рендер табов
  return (
    <Tabs defaultActiveKey="all">
      <TabPane tab={`Все курсы (${courses.length})`} key="all">
        <CoursesGrid
          courses={courses}
          userProgress={userProgress}
          isUserAuthenticated={isUserAuthenticated}
          cardType="default"
          emptyMessage="Нет доступных курсов"
        />
      </TabPane>
      
      <TabPane tab="В процессе" key="in-progress">
        <CoursesGrid
          courses={getInProgressCourses()}
          userProgress={userProgress}
          isUserAuthenticated={isUserAuthenticated}
          cardType="in-progress"
          emptyMessage="Нет курсов в процессе обучения"
        />
      </TabPane>
      
      <TabPane tab={`Завершенные (${completedCourses})`} key="completed">
        <CoursesGrid
          courses={getCompletedCourses()}
          userProgress={userProgress}
          isUserAuthenticated={isUserAuthenticated}
          cardType="completed"
          emptyMessage="Нет завершенных курсов"
        />
      </TabPane>
    </Tabs>
  );
};

// Вспомогательный компонент для грида курсов
const CoursesGrid = ({ 
  courses, 
  userProgress, 
  isUserAuthenticated, 
  cardType, 
  emptyMessage 
}) => {
  if (courses.length === 0) {
    return (
      <Row>
        <Col span={24}>
          <Empty
            description={emptyMessage}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Col>
      </Row>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      {courses.map(course => (
        <Col key={course.id} xs={24} sm={12} lg={8} xl={6}>
          <CourseCard
            course={course}
            progress={userProgress[course.id]}
            isUserAuthenticated={isUserAuthenticated}
            showProgress={cardType !== 'completed'}
            cardType={cardType}
          />
        </Col>
      ))}
    </Row>
  );
};

export default CoursesTabContent;