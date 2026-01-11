import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Alert, Button, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import trainingStore from '../store/SecurityTrainingStore';
import CourseService from '../api/CourseService';
import userStore from '../../admin/store/UserStore';

// Импорт компонентов
import CourseSidebar from '../components/сourse/course-detail/CourseSidebar';
import CourseHeader from '../components/сourse/course-detail/CourseHeader';
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

      let progressData = null;

      if (isUserAuthenticated && tabNumber) {
        try {
          progressData = await CourseService.getUserProgress(
            tabNumber,
            courseId
          );
          console.log('Progress data from API:', progressData);
        } catch (progressError) {
          console.error('Error loading progress:', progressError);
        }
      }

      if (!progressData) {
        progressData = trainingStore.userProgress[courseId] || {
          completedLessons: [],
          testScore: 0,
          passed_test: false,
          totalTimeSpent: 0,
          completed: false,
        };
      }

      const completedLessons =
        progressData.completed_lessons || progressData.completedLessons || [];
      const testScore = progressData.test_score || progressData.testScore || 0;
      const totalTimeSpent =
        progressData.total_time_spent || progressData.totalTimeSpent || 0;
      const isCompleted =
        progressData.passed_test || progressData.completed || false;

      setUserProgress({
        completedLessons,
        testScore,
        passed_test: isCompleted,
        totalTimeSpent,
        completed: isCompleted,
      });

      if (lessonsData && lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      setError('Не удалось загрузить данные курса');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async (lessonId, timeSpent = 0) => {
    try {
      console.log(
        '🚨 CourseDetailPage: Получены данные для завершения урока:',
        {
          lessonId,
          timeSpent,
          courseId,
          timestamp: new Date().toISOString(),
        }
      );

      console.log('📊 Текущий userProgress до обновления:', userProgress);
      console.log('👤 Текущий пользователь tabNumber:', tabNumber);

      // 1. Обновляем в локальном store с детальным логированием
      console.log('🔄 Обновляем в trainingStore...');
      if (!trainingStore) {
        console.error('❌ trainingStore не найден');
        message.error('Ошибка: хранилище не инициализировано');
        return;
      }

      // 1. Обновляем в локальном store
      trainingStore.completeLesson(courseId, lessonId, timeSpent);

      console.log('✅ Обновлено в trainingStore');

      // 2. Обновляем локальное состояние компонента
      if (userProgress && !userProgress.completedLessons.includes(lessonId)) {
        const updatedCompletedLessons = [
          ...userProgress.completedLessons,
          lessonId,
        ];
        const updatedProgress = {
          ...userProgress,
          completedLessons: updatedCompletedLessons,
          totalTimeSpent: (userProgress.totalTimeSpent || 0) + timeSpent,
        };
        setUserProgress(updatedProgress);
        console.log('✅ Local state updated:', updatedProgress);
      }

      // 3. Пытаемся сохранить в БД
      if (tabNumber) {
        try {
          console.log('📡 Trying to save to DB for user:', tabNumber);

          // Способ 1: Пробуем использовать метод completeLesson из CourseService
          try {
            await CourseService.completeLesson(tabNumber, courseId, lessonId);
            console.log('✅ Saved via completeLesson API');
          } catch (apiError1) {
            console.log('❌ Method 1 failed, trying method 2...');

            // Способ 2: Обновляем прогресс через updateUserProgress
            const currentProgress = userProgress || {
              completedLessons: [],
              testScore: 0,
              passed_test: false,
              totalTimeSpent: 0,
            };

            const completedLessons = [
              ...currentProgress.completedLessons,
              lessonId,
            ];
            const updatedData = {
              completed_lessons: completedLessons,
              test_score: currentProgress.testScore,
              passed_test: currentProgress.passed_test,
              total_time_spent:
                (currentProgress.totalTimeSpent || 0) + timeSpent,
            };

            await CourseService.updateUserProgress(
              tabNumber,
              courseId,
              updatedData
            );
            console.log('✅ Saved via updateUserProgress API');
          }

          message.success('Урок завершен и сохранен в БД!');
        } catch (dbError) {
          console.error('❌ DB save error:', dbError);
          message.warning('Урок завершен локально, но не сохранен в БД');
        }
      } else {
        message.success('Урок завершен (локальное сохранение)');
      }

      // 4. Перезагружаем данные через секунду для подтверждения
      setTimeout(() => {
        loadCourseData();
      }, 1000);
    } catch (error) {
      console.error('❌ Error in handleCompleteLesson:', error);
      message.error('Ошибка при завершении урока');
    }
  };

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  const handleBackToCourses = () => {
    navigate('..');
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip="Загрузка курса..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Alert
          message="Курс не найден"
          description={error || 'Запрошенный курс не существует или был удален'}
          type="error"
          showIcon
        />
        <Button
          type="primary"
          onClick={handleBackToCourses}
          style={{ marginTop: '20px' }}
        >
          Вернуться к списку курсов
        </Button>
      </div>
    );
  }

  return (
    <Layout style={{ height: 'calc(100vh - 64px)' }}>
      <Sider
        width={320}
        style={{
          height: 'calc(100vh - 64px)',
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          padding: '16px',
          overflow: 'auto',
        }}
      >
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
        <CourseHeader
          selectedLesson={selectedLesson}
          userProgress={userProgress}
        />

        <Content
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
          }}
        >
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

export default CourseDetailPage;
