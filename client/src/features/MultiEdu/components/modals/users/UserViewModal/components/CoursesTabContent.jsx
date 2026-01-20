// components/CoursesTabContent.js
import React from 'react';
import { CourseProgressList } from './CourseProgressList';
import { NotStartedCoursesList } from './NotStartedCoursesList';

export const CoursesTabContent = ({
  completedCourses,
  failedCourses,
  inProgressCourses,
  notStartedCourses,
}) => (
  <div>
    <CourseProgressList
      courses={completedCourses}
      title="Пройдено"
      status="completed"
    />
    <CourseProgressList
      courses={failedCourses}
      title="Не пройдены"
      status="failed"
    />
    <CourseProgressList
      courses={inProgressCourses}
      title="В процессе"
      status="inProgress"
    />
    
    <NotStartedCoursesList courses={notStartedCourses} />
  </div>
);