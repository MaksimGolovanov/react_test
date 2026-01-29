// UserViewModal.js
import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Spin, Space, Button, Tabs, Badge, message } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';

// Хуки
import { useUserData } from './UserViewModal/hooks/useUserData';

// Компоненты
import { UserInfoHeader } from './UserViewModal/components/UserInfoHeader';
import { UserBasicInfo } from './UserViewModal/components/UserBasicInfo';
import { OverviewTab } from './UserViewModal/components/OverviewTab';
import { CoursesTabContent } from './UserViewModal/components/CoursesTabContent';
import { StatsTabContent } from './UserViewModal/components/StatsTabContent';
import { ActivityTabContent } from './UserViewModal/components/ActivityTabContent';
import { TestAnswersTab } from './UserViewModal/tabs/TestAnswersTab';

// MobX store
import userStore from '../../../store/UserStore';
import CourseService from '../../../api/CourseService'; // Добавьте этот импорт

const { TabPane } = Tabs;

const UserViewModal = observer(({ visible, user, onCancel }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Использование хуков
  const {
    userStats,
    userProgress,
    loading: userDataLoading,
    refreshData, // Добавьте эту функцию в хук useUserData если её нет
  } = useUserData(user, visible);

  // Получение ФИО пользователя
  const getFioByTabNumber = useCallback(
    (tabNumber) => {
      if (!tabNumber) return null;
      const staff = userStore.staff.find(
        (s) => s.tabNumber && s.tabNumber.toString() === tabNumber.toString()
      );
      return staff ? staff.fio : null;
    },
    [userStore.staff]
  );

  const userFio = user ? getFioByTabNumber(user.tabNumber) : null;

  // Функция сброса прогресса курса
  const handleResetProgress = async (courseId) => {
    if (!user) {
      message.error('Пользователь не найден');
      return;
    }

    try {
      // Используем табельный номер для сброса
      if (user.tabNumber) {
        console.log('Сбрасываем прогресс курса по табельному номеру:', {
          tabNumber: user.tabNumber,
          courseId,
        });

        // Отправляем запрос на сброс прогресса
        const result = await CourseService.resetProgressByTabNumber(
          user.tabNumber,
          courseId
        );

        message.success('Статистика курса и тестов успешно сброшена');

        // Обновляем данные в модальном окне
        if (refreshData) {
          refreshData();
        }

        return result;
      } else if (user.id) {
        // Если нет табельного номера, используем ID
        console.log('Сбрасываем прогресс курса по ID:', {
          userId: user.id,
          courseId,
        });

        const result = await CourseService.resetProgressByUserId(
          user.id,
          courseId
        );

        message.success('Статистика курса и тестов успешно сброшена');

        if (refreshData) {
          refreshData();
        }

        return result;
      } else {
        message.error(
          'Невозможно сбросить прогресс: отсутствует табельный номер или ID пользователя'
        );
        return;
      }
    } catch (error) {
      console.error('Ошибка при сбросе статистики курса:', error);
      message.error(
        error.response?.data?.message || 'Не удалось сбросить статистику курса'
      );
      throw error;
    }
  };

  // Фильтрация курсов по статусу на основе полученных данных
  const filterCourses = () => {
    const completedCourses = [];
    const failedCourses = [];
    const inProgressCourses = [];
    const notStartedCourses = [];

    userProgress.forEach((item) => {
      const progress = item.progress;

      // Проверяем, есть ли информация о курсе в userStats
      const statsEntry = userStats?.st_stats?.find(
        (stat) => stat.course_id === item.id
      );

      if (statsEntry) {
        // Используем данные из userStats (они более надежные)
        if (statsEntry.passed_test === true) {
          completedCourses.push({
            ...item,
            progress: {
              ...progress,
              score: parseFloat(statsEntry.test_score) || 0,
              passed: true,
              time_spent: statsEntry.total_time_spent || 0,
              created_at: statsEntry.completed_at,
              updated_at: statsEntry.last_accessed,
            },
          });
        } else if (statsEntry.passed_test === false) {
          failedCourses.push({
            ...item,
            progress: {
              ...progress,
              score: parseFloat(statsEntry.test_score) || 0,
              passed: false,
              time_spent: statsEntry.total_time_spent || 0,
              updated_at: statsEntry.last_accessed,
            },
          });
        } else if (
          statsEntry.completed_lessons?.length > 0 ||
          statsEntry.total_time_spent > 0
        ) {
          inProgressCourses.push({
            ...item,
            progress: {
              ...progress,
              score: parseFloat(statsEntry.test_score) || 0,
              passed: false,
              time_spent: statsEntry.total_time_spent || 0,
              updated_at: statsEntry.last_accessed,
            },
          });
        } else {
          notStartedCourses.push(item);
        }
      } else {
        // Если нет данных в userStats, используем данные из progress
        if (progress.passed_test === true) {
          completedCourses.push(item);
        } else if (progress.passed_test === false) {
          failedCourses.push(item);
        } else if (
          progress.completed_lessons?.length > 0 ||
          progress.time_spent > 0
        ) {
          inProgressCourses.push(item);
        } else {
          notStartedCourses.push(item);
        }
      }
    });

    return {
      completedCourses,
      failedCourses,
      inProgressCourses,
      notStartedCourses,
    };
  };

  const {
    completedCourses,
    failedCourses,
    inProgressCourses,
    notStartedCourses,
  } = filterCourses();

  // Рассчет общей статистики
  const calculateOverallStats = () => {
    const stats = {
      totalCourses: 0,
      completedCourses: 0,
      totalTime: 0,
      lastActivity: null,
    };

    if (userStats) {
      stats.totalCourses = userStats.total_courses || 0;
      stats.completedCourses = userStats.completed_courses || 0;
      stats.totalTime = userStats.total_time_spent || 0;

      if (userStats.st_stats && userStats.st_stats.length > 0) {
        const lastStat = userStats.st_stats.reduce((latest, current) => {
          const currentDate = new Date(current.last_accessed || 0);
          const latestDate = new Date(latest.last_accessed || 0);
          return currentDate > latestDate ? current : latest;
        });
        stats.lastActivity = lastStat.last_accessed;
      }
    } else {
      stats.totalCourses = userProgress.length;
      stats.completedCourses = completedCourses.length;

      stats.totalTime = userProgress.reduce((sum, item) => {
        return sum + (item.progress?.time_spent || 0);
      }, 0);

      if (userProgress.length > 0) {
        const lastProgress = userProgress.reduce((latest, current) => {
          const currentDate = new Date(current.progress?.updated_at || 0);
          const latestDate = new Date(latest.progress?.updated_at || 0);
          return currentDate > latestDate ? current : latest;
        });
        stats.lastActivity = lastProgress.progress?.updated_at;
      }
    }

    return stats;
  };

  const overallStats = calculateOverallStats();

  // Рассчет среднего балла
  const calculateAverageScore = () => {
    if (
      userStats &&
      userStats.average_score &&
      userStats.average_score !== 'NaN'
    ) {
      const avg = parseFloat(userStats.average_score);
      return isNaN(avg) ? 0 : avg;
    }

    if (completedCourses.length === 0) return 0;

    const totalScore = completedCourses.reduce((sum, course) => {
      const score = parseFloat(course.progress?.score) || 0;
      return sum + score;
    }, 0);

    const avg = totalScore / completedCourses.length;
    return isNaN(avg) ? 0 : avg;
  };

  const averageScore = calculateAverageScore();

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Получение последнего пройденного курса
  const getLastCompletedCourse = () => {
    if (completedCourses.length === 0) return null;

    const sorted = [...completedCourses].sort((a, b) => {
      const dateA = a.progress?.created_at
        ? new Date(a.progress.created_at)
        : new Date(0);
      const dateB = b.progress?.created_at
        ? new Date(b.progress.created_at)
        : new Date(0);
      return dateB - dateA;
    });

    return sorted[0];
  };

  const lastCompletedCourse = getLastCompletedCourse();

  // Рендер содержимого табов
  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <CoursesTabContent
            completedCourses={completedCourses}
            failedCourses={failedCourses}
            inProgressCourses={inProgressCourses}
            notStartedCourses={notStartedCourses}
            handleResetProgress={handleResetProgress} // Передаем функцию!
          />
        );

      case 'stats':
        return (
          <StatsTabContent
            overallStats={overallStats}
            completedCourses={completedCourses}
            failedCourses={failedCourses}
            inProgressCourses={inProgressCourses}
            averageScore={averageScore}
          />
        );

      case 'activity':
        return <ActivityTabContent userProgress={userProgress} />;

      case 'testAnswers':
        return <TestAnswersTab user={user} userStats={userStats} />;

      default: // overview
        return (
          <OverviewTab
            overallStats={overallStats}
            averageScore={averageScore}
            completedCourses={completedCourses}
            failedCourses={failedCourses}
            inProgressCourses={inProgressCourses}
            notStartedCourses={notStartedCourses}
            lastCompletedCourse={lastCompletedCourse}
          />
        );
    }
  };

  return (
    <Modal
      title={<UserInfoHeader user={user} userFio={userFio} />}
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="close" onClick={onCancel}>
          Закрыть
        </Button>,
      ]}
      loading={userDataLoading}
    >
      <Spin spinning={userDataLoading}>
        <UserBasicInfo user={user} userFio={userFio} />

        {/* Табы для навигации */}
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          style={{ marginBottom: 16 }}
        >
          <TabPane tab="Обзор" key="overview" />
          <TabPane tab={`Курсы (${userProgress.length})`} key="courses" />
          <TabPane tab="Статистика" key="stats" />
          <TabPane tab="Активность" key="activity" />
          <TabPane
            tab={
              <Space>
                <BarChartOutlined />
                <span>
                  Ответы на тесты
                  {completedCourses.length > 0 && (
                    <Badge
                      count={completedCourses.length}
                      style={{
                        marginLeft: 8,
                        backgroundColor: '#52c41a',
                      }}
                    />
                  )}
                </span>
              </Space>
            }
            key="testAnswers"
          />
        </Tabs>

        {/* Содержимое таба */}
        {renderTabContent()}
      </Spin>
    </Modal>
  );
});

export default UserViewModal;
