import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Alert, Button, Spin, message } from 'antd';
import { observer } from 'mobx-react-lite';
import trainingStore from '../store/SecurityTrainingStore';
import CourseService from '../api/CourseService';
import userStore from '../../admin/store/UserStore';

import CourseSidebar from '../components/сourse/course-detail/CourseSidebar';

import LessonContent from '../components/сourse/course-detail/LessonContent';

const { Content, Sider } = Layout;

const CourseDetailPage = observer(() => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProgress, setUserProgress] = useState(null);

  const isUserAuthenticated = userStore.isAuthenticated;
  const tabNumber = userStore.tabNumber || '';

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      const courseData = await CourseService.getCourseById(courseId);
      setCourse(courseData);

      const lessonsData = await CourseService.getCourseLessons(courseId);
      setLessons(lessonsData || []);

      const progressData = await loadUserProgress();
      setUserProgress(progressData);

      if (lessonsData && lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
      }
    } catch (error) {
      setError('Не удалось загрузить данные курса');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    let progressData = null;

    if (isUserAuthenticated && tabNumber) {
      try {
        progressData = await CourseService.getUserProgress(tabNumber, courseId);
      } catch (progressError) {
        // Используем localStorage как запасной вариант
      }
    }

    if (!progressData) {
      progressData = loadProgressFromLocalStorage();
    }

    if (!progressData) {
      progressData = getDefaultProgress();
    }

    return normalizeProgressData(progressData);
  };

  const loadProgressFromLocalStorage = () => {
    const localStorageKey = `userProgress_${courseId}_${
      tabNumber || 'anonymous'
    }`;
    const savedProgress = localStorage.getItem(localStorageKey);
    return savedProgress ? JSON.parse(savedProgress) : null;
  };

  const getDefaultProgress = () => ({
    completedLessons: [],
    testScore: 0,
    passed_test: false,
    totalTimeSpent: 0,
    completed: false,
    lessonTimeSpent: {},
  });

  const normalizeProgressData = (progressData) => ({
    completedLessons:
      progressData.completed_lessons || progressData.completedLessons || [],
    testScore: progressData.test_score || progressData.testScore || 0,
    passed_test: progressData.passed_test || progressData.completed || false,
    totalTimeSpent:
      progressData.total_time_spent || progressData.totalTimeSpent || 0,
    completed: progressData.passed_test || progressData.completed || false,
    lessonTimeSpent:
      progressData.lesson_time_spent || progressData.lessonTimeSpent || {},
  });

  const handleCompleteLesson = async (lessonId, timeSpent = 0) => {
    try {
      const updatedProgress = updateLocalProgress(lessonId, timeSpent);
      setUserProgress(updatedProgress);

      updateTrainingStore(lessonId, timeSpent);
      saveToLocalStorage(updatedProgress);
      await saveToDatabase(lessonId, timeSpent);

      message.success(getSuccessMessage());

      setTimeout(() => {
        loadCourseData();
      }, 1000);
    } catch (error) {
      message.error('Ошибка при завершении урока');
    }
  };

  const updateLocalProgress = (lessonId, timeSpent) => {
    const isAlreadyCompleted =
      userProgress?.completedLessons?.includes(lessonId);

    return {
      ...userProgress,
      completedLessons: isAlreadyCompleted
        ? userProgress.completedLessons
        : [...(userProgress?.completedLessons || []), lessonId],
      lessonTimeSpent: {
        ...(userProgress?.lessonTimeSpent || {}),
        [lessonId]: timeSpent,
      },
      totalTimeSpent: (userProgress?.totalTimeSpent || 0) + timeSpent,
    };
  };

  const updateTrainingStore = (lessonId, timeSpent) => {
    if (trainingStore) {
      trainingStore.completeLesson(courseId, lessonId, timeSpent);
    }
  };

  const saveToLocalStorage = (progressData) => {
    const localStorageKey = `userProgress_${courseId}_${tabNumber || 'anonymous'}`;
    localStorage.setItem(localStorageKey, JSON.stringify(progressData));

    // Очищаем временное время урока
    const savedTimes = JSON.parse(
      localStorage.getItem('lessonTimes') || '[]'
    ).filter((item) => item.lessonId !== selectedLesson?.id);
    localStorage.setItem('lessonTimes', JSON.stringify(savedTimes));
  };

  const saveToDatabase = async (lessonId, timeSpent) => {
    if (!tabNumber) return;

    console.log('Сохранение в БД:', {
      userId: tabNumber,
      courseId,
      lessonId,
      timeSpent: `${timeSpent} минут`,
      timestamp: new Date().toISOString(),
    });

    try {
      const result = await CourseService.completeLesson(
        tabNumber,
        courseId,
        lessonId,
        timeSpent
      );

      console.log('Результат сохранения:', result);
      return result;
    } catch (dbError) {
      console.error('Ошибка сохранения в БД:', dbError);
      throw new Error('Ошибка сохранения в БД');
    }
  };

  const getSuccessMessage = () => {
    return tabNumber
      ? 'Урок завершен и сохранен в БД!'
      : 'Урок завершен (локальное сохранение)';
  };

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  const handleBackToCourses = () => {
    navigate('..');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !course) {
    return <ErrorState error={error} onBack={handleBackToCourses} />;
  }

  return (
    <Layout style={{ height: 'calc(100vh - 64px)' }}>
      <Sider width={320} style={styles.sider}>
        <CourseSidebar
          course={course}
          lessons={lessons}
          userProgress={userProgress}
          selectedLesson={selectedLesson}
          onSelectLesson={handleSelectLesson}
          onBackToCourses={handleBackToCourses}
          courseId={courseId}
        />
      </Sider>

      <Layout>
        <Content style={styles.content}>
          <LessonContent
            selectedLesson={selectedLesson}
            userProgress={userProgress}
            onCompleteLesson={handleCompleteLesson}
          />
        </Content>
      </Layout>
    </Layout>
  );
});

const LoadingSpinner = () => (
  <div style={styles.loadingContainer}>
    <Spin size="large" tip="Загрузка курса..." />
  </div>
);

const ErrorState = ({ error, onBack }) => (
  <div style={styles.errorContainer}>
    <Alert
      message="Курс не найден"
      description={error || 'Запрошенный курс не существует или был удален'}
      type="error"
      showIcon
    />
    <Button type="primary" onClick={onBack} style={styles.backButton}>
      Вернуться к списку курсов
    </Button>
  </div>
);

const styles = {
  sider: {
    height: 'calc(100vh - 64px)',
    background: '#fff',
    borderRight: '1px solid #f0f0f0',
    padding: '16px',
    overflow: 'auto',
  },
  content: {
    overflow: 'auto',
    height: 'calc(100vh - 64px)',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  errorContainer: {
    padding: '50px',
    textAlign: 'center',
  },
  backButton: {
    marginTop: '20px',
  },
};

export default CourseDetailPage;
