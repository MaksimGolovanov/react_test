// src/features/security-training/pages/CoursesPage.jsx
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Empty,
  Divider,
  Button,
  Row,
  Col,
  Card,
  Space,
  Tag,
  Typography,
} from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import userStore from '../../admin/store/UserStore';
import { useCourses } from '../hooks/useCourses';
import PageHeader from '../components/сourse/PageHeader';
import CoursesTabContent from '../components/сourse/CoursesTabContent';
import LoadingSkeleton from '../components/сourse/LoadingSkeleton';

const { Title, Text } = Typography;

const CoursesPage = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем фильтр категории из состояния навигации
  const categoryFilter = location.state?.filter?.category || null;
  const categoryData = location.state?.category || null;

  // Добавьте отладку для location
  useEffect(() => {
    console.log('=== CoursesPage Location Debug ===');
    console.log('location.pathname:', location.pathname);
    console.log('location.state:', location.state);
    console.log('categoryFilter:', categoryFilter);
    console.log('categoryData:', categoryData);
    console.log('================================');
  }, [location, categoryFilter, categoryData]);

  // Передаем категорию в хук useCourses
  const { courses, loading, userProgress, handleRefresh, getCategoryName } =
    useCourses(categoryFilter);

  const isUserAuthenticated = userStore.isAuthenticated;
  const completedCourses = Object.keys(userProgress).filter(
    (courseId) => userProgress[courseId]?.passed_test === true
  ).length;

  const handleGoHome = () => {
    navigate('/multiedu');
  };

  const handleGoBack = () => {
    navigate('');
  };

  // Функция для проверки навигации (добавьте эту функцию)
  const testNavigation = (courseId) => {
    console.log('=== Test Navigation ===');
    console.log('Current path:', window.location.pathname);
    console.log('Trying to navigate to course:', courseId);
    console.log('Expected path: course/' + courseId);

    // Пробуем разные варианты навигации
    const options = [
      { path: `course/${courseId}`, desc: 'Относительный путь' },
      {
        path: `/multiedu/security-training/course/${courseId}`,
        desc: 'Абсолютный путь',
      },
      { path: `../course/${courseId}`, desc: 'Родительский путь' },
      { path: `./course/${courseId}`, desc: 'Текущий путь' },
    ];

    options.forEach((option) => {
      console.log(`Option "${option.desc}": ${option.path}`);
    });

    // Пробуем первый вариант
    navigate(`course/${courseId}`);
  };

  if (loading && courses.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div style={{ padding: '24px', margin: '0 auto' }}>
      {/* Хлебные крошки и кнопки навигации */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space size="middle">
            <Button
              type="primary"
              icon={<HomeOutlined />}
              onClick={handleGoHome}
              size="smile"
            >
            
              Главная обучения
            </Button>
          
          </Space>
        </Col>
      </Row>

      {/* Основной контент */}
      <Card
        style={{
          borderRadius: 8,
          boxShadow:
            '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        }}
      >
        <PageHeader loading={loading} onRefresh={handleRefresh} />
        <Divider style={{ margin: '24px 0' }} />

        {courses.length === 0 && !loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <Empty
              description={
                <div>
                  <div
                    style={{ fontSize: 16, marginBottom: 8, fontWeight: 500 }}
                  >
                    {categoryFilter
                      ? `Нет курсов по направлению "${getCategoryName(
                          categoryFilter
                        )}"`
                      : 'Курсы пока не добавлены'}
                  </div>
                  <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 14 }}>
                    {categoryFilter
                      ? 'Администратор еще не добавил курсы по этому направлению'
                      : 'Администратор еще не добавил учебные материалы'}
                  </div>
                  {categoryFilter && (
                    <Button
                      type="link"
                      onClick={handleGoBack}
                      style={{ marginTop: 16 }}
                    >
                      Вернуться к выбору направления
                    </Button>
                  )}
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <CoursesTabContent
            courses={courses}
            userProgress={userProgress}
            isUserAuthenticated={isUserAuthenticated}
            completedCourses={completedCourses}
            currentCategory={categoryFilter}
            onTestNavigation={testNavigation} // Передаем функцию теста
          />
        )}
      </Card>
    </div>
  );
});

export default CoursesPage;
