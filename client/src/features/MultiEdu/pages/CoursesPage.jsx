// src/features/security-training/pages/CoursesPage.jsx

import { observer } from 'mobx-react-lite';
import { useState, useMemo, useCallback } from 'react';
import {
  Divider,
  Button,
  Row,
  Col,
  Card,
  Space,
  Tabs,
  message,
} from 'antd';
import { HomeOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import userStore from '../../admin/store/UserStore';
import { useCourses } from '../hooks/useCourses';
import PageHeader from '../components/сourse/PageHeader';
import CoursesTabContent from '../components/сourse/CoursesTabContent';
import DocumentsTab from '../components/documents/DocumentsTab';

const { TabPane } = Tabs;

const CoursesPage = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('courses');

  // Получаем фильтр категории из состояния навигации
  const categoryFilter = location.state?.filter?.category || null;

  // Передаем категорию в хук useCourses
  const { courses, loading, userProgress, handleRefresh } =
    useCourses(categoryFilter);

  const isUserAuthenticated = userStore.isAuthenticated;
  const completedCourses = useMemo(
    () =>
      Object.keys(userProgress).filter(
        (courseId) => userProgress[courseId]?.passed_test === true
      ).length,
    [userProgress]
  );

  const handleGoHome = () => {
    navigate('/multiedu');
  };

  // Функция для перехода к курсу
  const handleCourseNavigation = (courseId) => {
    navigate(`course/${courseId}`);
  };

  // Общая функция для открытия документа
  const handleOpenDocument = useCallback((record) => {
    let url = record.url || record.file_url || '';

    if (!url || url.trim() === '') {
      message.error('Ссылка на документ отсутствует');
      return;
    }

    // Если URL уже полный, открываем как есть
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Убедимся, что URL начинается со слеша
    if (!url.startsWith('/')) {
      url = `/${url}`;
    }

    // Формируем полный URL
    const apiBaseUrl = process.env.REACT_APP_API_URL || '';
    const baseUrl = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const fullUrl = `${baseUrl}${url}`;

    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  }, []);

  // Общая функция для скачивания документа
  const handleDownloadDocument = useCallback((record) => {
    let url = record.url || record.file_url || '';

    if (!url || url.trim() === '') {
      message.error('Ссылка на документ отсутствует');
      return;
    }

    // Формируем полный URL
    if (!url.startsWith('/')) {
      url = `/${url}`;
    }

    const apiBaseUrl = process.env.REACT_APP_API_URL || '';
    const baseUrl = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const fullUrl = `${baseUrl}${url}`;

    try {
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = record.title || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success('Документ начал скачиваться');
    } catch (error) {
      message.error('Ошибка при скачивании документа');
    }
  }, []);

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
              size="small"
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

        {/* Табы для переключения между курсами и документами */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginBottom: '24px' }}
        >
          <TabPane
            tab={
              <span>
                <HomeOutlined style={{ marginRight: '6px' }} />
                Курсы обучения
              </span>
            }
            key="courses"
          >
            <CoursesTabContent
              courses={courses}
              userProgress={userProgress}
              isUserAuthenticated={isUserAuthenticated}
              completedCourses={completedCourses}
              currentCategory={categoryFilter}
              onTestNavigation={handleCourseNavigation}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <FilePdfOutlined style={{ marginRight: '6px' }} />
                Документация
              </span>
            }
            key="documents"
          >
            <DocumentsTab
              onOpenDocument={handleOpenDocument}
              onDownloadDocument={handleDownloadDocument}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
});

export default CoursesPage;