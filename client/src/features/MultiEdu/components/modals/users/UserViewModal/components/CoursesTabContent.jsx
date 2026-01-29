// components/CoursesTabContent.js
import React from 'react';
import { CourseProgressList } from './CourseProgressList';
import { NotStartedCoursesList } from './NotStartedCoursesList';

export const CoursesTabContent = ({
  completedCourses,
  failedCourses,
  inProgressCourses,
  notStartedCourses,
  handleResetProgress
  
}) => (
  <div>
    <CourseProgressList
      courses={completedCourses}
      title="Пройдено"
      status="completed"
      onResetProgress={handleResetProgress}
    />
    <CourseProgressList
      courses={failedCourses}
      title="Не пройдены"
      status="failed"
      onResetProgress={handleResetProgress}
    />
    <CourseProgressList
      courses={inProgressCourses}
      title="В процессе"
      status="inProgress"
      onResetProgress={handleResetProgress}
    />
    
    <NotStartedCoursesList courses={notStartedCourses} />
  </div>
);