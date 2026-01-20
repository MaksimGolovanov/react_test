// src/features/security-training/components/admin/DashboardContent.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Timeline,
  Button,
  Space,
  List,
  Tag,
  Typography,
  Skeleton,
  Progress,
  Alert,
} from 'antd';
import {
  TeamOutlined,
  TrophyOutlined,
  StarOutlined,
  ScheduleOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LineChartOutlined,
  UserOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import moment from 'moment';

import AdminService from '../../api/STService';
import CourseService from '../../api/CourseService';
import userStore from '../../store/UserStore';
import './DashboardContent.css';

const { Text, Title } = Typography;

const DashboardContent = ({
  loading = false,
  onNavigate,
  refreshDashboard,
}) => {
  // Состояния для данных
  const [dashboardData, setDashboardData] = useState({
    users: [],
    courses: [],
    stats: null,
    recentActivity: [],
    popularCourses: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  const fioCache = useMemo(() => {
    const cache = {};
    userStore.staff.forEach((staff) => {
      if (staff.tabNumber) {
        cache[staff.tabNumber] = staff.fio;
      }
    });
    return cache;
  }, [userStore.staff]);

  const getFioByTabNumber = useCallback(
    (tabNumber) => {
      if (!tabNumber) return null;
      return fioCache[tabNumber.toString()] || null;
    },
    [fioCache]
  );

  // Загрузка данных
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (loading) return;

      setIsLoading(true);
      try {
        // Параллельная загрузка данных
        const [usersResponse, coursesResponse] = await Promise.allSettled([
          AdminService.fetchSTUsers(),
          CourseService.getCourses({ limit: 50 }),
        ]);

        const users =
          usersResponse.status === 'fulfilled' ? usersResponse.value : [];
        const courses =
          coursesResponse.status === 'fulfilled'
            ? coursesResponse.value?.courses || []
            : [];

        console.log('Loaded users:', users);
        console.log('Loaded courses:', courses);

        // Для каждого пользователя загружаем его статистику
        const usersWithProgress = await Promise.all(
          users.map(async (user) => {
            try {
              // Пробуем разные форматы ID для совместимости с API
              let stats = null;

              // Попробуем получить статистику с ID пользователя как есть
              stats = await CourseService.getUserStats(user.user_id);
              console.log(
                `Stats for user ${user.user_id} (original ID):`,
                stats
              );

              // Если не получилось, попробуем с табельным номером
              if (!stats && user.tabNumber) {
                console.log(
                  `Trying with tabNumber ${user.tabNumber} for user ${user.user_id}`
                );
                stats = await CourseService.getUserStats(user.tabNumber);
              }

              // Если все еще нет, пробуем добавить ведущие нули (если ID короткий)
              if (!stats && user.id && user.id.toString().length < 8) {
                const paddedId = user.id.toString().padStart(8, '0');
                console.log(
                  `Trying with padded ID ${paddedId} for user ${user.id}`
                );
                stats = await CourseService.getUserStats(paddedId);
              }

              return {
                ...user,
                // Используем поля из вашего API ответа
                st_stats: stats?.st_stats || [],
                st_test: stats?.st_test || [],
                // Можно также сохранить другие данные из статистики
                userStats: stats || null,
              };
            } catch (error) {
              console.error(`Error fetching stats for user ${user.id}:`, error);
              return user;
            }
          })
        );

        // ВАЖНО: Отфильтруем пользователей, у которых есть данные
        const usersWithData = usersWithProgress.filter(
          (user) =>
            (user.st_stats && user.st_stats.length > 0) ||
            (user.st_test && user.st_test.length > 0)
        );

        console.log('Users with data:', usersWithData.length);
        console.log(
          'Users without data:',
          usersWithProgress.length - usersWithData.length
        );

        // Расчет статистики
        const stats = calculateStats(usersWithProgress, courses);
        const recentActivity = await fetchRecentActivity(
          usersWithProgress,
          courses
        );
        const popularCourses = calculatePopularCourses(
          courses,
          usersWithProgress
        );

        setDashboardData({
          users: usersWithProgress,
          courses,
          stats,
          recentActivity,
          popularCourses,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [loading, timeRange]);

  // Расчет статистики на основе данных API
  const calculateStats = (users, courses) => {
    const totalUsers = users.length;
    const totalCourses = courses.length;

    // Инициализируем агрегированные данные
    let totalCompletedCourses = 0;
    let totalScore = 0;
    let totalTests = 0;
    let activeUsers = 0;
    let totalTimeSpent = 0;

    // Для каждого пользователя агрегируем данные
    users.forEach((user) => {
      // Проверка активности пользователя (последний вход за последние 7 дней)
      if (user.last_login) {
        const daysSinceLastLogin = moment().diff(
          moment(user.last_login),
          'days'
        );
        if (daysSinceLastLogin <= 7) activeUsers++;
      }

      // Используем данные из userStats если они есть
      if (user.userStats) {
        // Из userStats мы можем получить completed_courses
        totalCompletedCourses += user.userStats.completed_courses || 0;

        // Суммируем время из userStats
        totalTimeSpent += user.userStats.total_time_spent || 0;

        // Если average_score не NaN, добавляем его
        if (
          user.userStats.average_score &&
          !isNaN(parseFloat(user.userStats.average_score))
        ) {
          totalScore += parseFloat(user.userStats.average_score);
          totalTests++;
        }
      }

      // Также проверяем st_stats для дополнительной информации
      if (user.st_stats && Array.isArray(user.st_stats)) {
        user.st_stats.forEach((stat) => {
          if (stat.test_score && !isNaN(parseFloat(stat.test_score))) {
            // Если не использовали из userStats, используем здесь
            if (
              !user.userStats?.average_score ||
              isNaN(parseFloat(user.userStats.average_score))
            ) {
              totalScore += parseFloat(stat.test_score);
              totalTests++;
            }
          }
        });
      }
    });

    // Расчет среднего балла
    const averageScore =
      totalTests > 0 ? Math.round(totalScore / totalTests) : 0;

    // Рассчитываем другие метрики
    const completionRate =
      totalUsers > 0 && totalCourses > 0
        ? Math.round(
            (totalCompletedCourses / (totalUsers * totalCourses)) * 100
          )
        : 0;

    // Конвертируем время в часы для удобства отображения
    const totalTimeSpentHours = Math.round((totalTimeSpent / 60) * 10) / 10;

    return {
      totalUsers,
      totalCourses,
      totalCompletedCourses,
      averageScore,
      activeUsers,
      completionRate,
      totalTimeSpent: totalTimeSpentHours, // в часах
      totalTests,
      totalPossibleCompletions: totalUsers * totalCourses,
    };
  };

  // Получение последней активности с фильтрацией по времени
  // Получение последней активности с фильтрацией по времени
  // Получение последней активности с фильтрацией по времени
  const fetchRecentActivity = async (users, courses) => {
    try {
      console.log('=== DEBUG: fetchRecentActivity called ===');
      console.log('Users count:', users.length);
      console.log('Courses count:', courses.length);

      // Собираем реальную активность из данных пользователей
      const activityItems = [];

      const now = moment();
      const timeFilterMap = {
        week: now.clone().subtract(7, 'days'),
        month: now.clone().subtract(1, 'month'),
        year: now.clone().subtract(1, 'year'),
      };

      const filterDate = timeFilterMap[timeRange] || timeFilterMap.week;

      users.forEach((user) => {
        // Проверяем st_stats для информации о конкретных курсах
        if (user.st_stats && Array.isArray(user.st_stats)) {
          user.st_stats.forEach((stat) => {
            console.log(`Processing stat for user ${user.id}:`, stat);

            const courseTitle = stat.course?.title || `Курс ${stat.course_id}`;

            // Фильтруем по времени - используем completed_at и last_accessed
            if (stat.completed_at) {
              const completedDate = moment(stat.completed_at);
              if (completedDate.isAfter(filterDate)) {
                activityItems.push({
                  id: `${user.id}-${stat.id}-completed`,
                  type: 'course_completed',
                  user:
                    user.login || user.tabNumber || `Пользователь ${user.id}`,
                  course: courseTitle,
                  score: parseFloat(stat.test_score) || 0,
                  date: stat.completed_at,
                  userId: user.id,
                  courseId: stat.course_id,
                  passed: stat.passed_test,
                  attemptsCount: stat.attempts_count,
                });
              }
            }

            if (stat.last_accessed) {
              const accessedDate = moment(stat.last_accessed);
              if (accessedDate.isAfter(filterDate)) {
                activityItems.push({
                  id: `${user.id}-${stat.id}-accessed`,
                  type: 'course_accessed',
                  user:
                    user.login || user.tabNumber || `Пользователь ${user.id}`,
                  course: courseTitle,
                  date: stat.last_accessed,
                  userId: user.id,
                  courseId: stat.course_id,
                });
              }
            }

            // Также учитываем created_at как начало курса
            if (stat.created_at && !stat.completed_at) {
              const createdDate = moment(stat.created_at);
              if (createdDate.isAfter(filterDate)) {
                activityItems.push({
                  id: `${user.id}-${stat.id}-started`,
                  type: 'course_started',
                  user:
                    user.login || user.tabNumber || `Пользователь ${user.id}`,
                  course: courseTitle,
                  date: stat.created_at,
                  userId: user.id,
                  courseId: stat.course_id,
                });
              }
            }
          });
        }

        // Проверяем st_test для попыток тестов
        if (user.st_test && Array.isArray(user.st_test)) {
          user.st_test.forEach((test) => {
            console.log(`Processing test for user ${user.id}:`, test);

            // Находим название курса
            const course = courses.find((c) => c.id === test.course_id);
            const stat = user.st_stats?.find(
              (s) => s.course_id === test.course_id
            );
            const courseTitle =
              course?.title || stat?.course?.title || `Курс ${test.course_id}`;

            if (test.created_at) {
              const testDate = moment(test.created_at);
              if (testDate.isAfter(filterDate)) {
                activityItems.push({
                  id: `${user.id}-test-${test.id}`,
                  type: 'test_attempt',
                  user:
                    user.login || user.tabNumber || `Пользователь ${user.id}`,
                  course: courseTitle,
                  score: parseFloat(test.score) || 0,
                  date: test.created_at,
                  userId: user.id,
                  courseId: test.course_id,
                  passed: test.passed,
                  attemptNumber: test.attempt_number,
                });
              }
            }
          });
        }
      });

      console.log('Total activity items found:', activityItems.length);

      // Сортируем по дате (сначала самые новые)
      const sortedItems = activityItems
        .sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())
        .slice(0, 10);

      console.log('Sorted activity items:', sortedItems);

      return sortedItems;
    } catch (error) {
      console.error('Error fetching activity:', error);
      return [];
    }
  };

  // Расчет популярных курсов на основе реальных данных
  const calculatePopularCourses = (courses, users) => {
    // Создаем мапу для агрегации данных по курсам
    const courseStats = {};

    // Инициализируем статистику для каждого курса
    courses.forEach((course) => {
      courseStats[course.id] = {
        id: course.id,
        title: course.title,
        completions: 0,
        totalScore: 0,
        participants: 0,
        attempts: 0,
        totalTimeSpent: 0,
      };
    });

    // Агрегируем данные из статистики пользователей
    users.forEach((user) => {
      if (user.st_stats && Array.isArray(user.st_stats)) {
        user.st_stats.forEach((stat) => {
          const courseId = stat.course_id;
          if (courseStats[courseId]) {
            // Увеличиваем количество участников
            if (!courseStats[courseId].participantsSet) {
              courseStats[courseId].participantsSet = new Set();
            }
            courseStats[courseId].participantsSet.add(user.id);

            // Подсчитываем завершения
            if (stat.completed_at && stat.passed_test) {
              courseStats[courseId].completions++;
            }

            // Суммируем баллы
            if (stat.test_score && !isNaN(parseFloat(stat.test_score))) {
              courseStats[courseId].totalScore += parseFloat(stat.test_score);
              courseStats[courseId].attempts++;
            }

            // Суммируем время
            if (stat.total_time_spent) {
              courseStats[courseId].totalTimeSpent += stat.total_time_spent;
            }
          }
        });
      }
    });

    // Преобразуем данные в массив и добавляем вычисляемые поля
    const popularCourses = Object.values(courseStats).map((course) => {
      // Конвертируем Set в количество
      const participants = course.participantsSet
        ? course.participantsSet.size
        : 0;

      // Рассчитываем средний балл
      const averageScore =
        course.attempts > 0
          ? Math.round(course.totalScore / course.attempts)
          : 0;

      return {
        ...course,
        participants,
        averageScore,
        // Удаляем временные поля
        participantsSet: undefined,
        totalScore: undefined,
        attempts: undefined,
      };
    });

    // Сортируем по популярности (количеству участников) и берем топ-5
    return popularCourses
      .sort((a, b) => b.participants - a.participants)
      .slice(0, 5);
  };

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = moment(dateString);
    return date.fromNow();
  };

  // Обновляем renderStatsCards
  const renderStatsCards = () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Card className="stat-card" hoverable>
          <Statistic
            title="Всего пользователей"
            value={dashboardData.stats?.totalUsers || 0}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="stat-card" hoverable>
          <Statistic
            title="Всего курсов"
            value={dashboardData.stats?.totalCourses || 0}
            prefix={<BookOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="stat-card" hoverable>
          <Statistic
            title="Пройдено курсов"
            value={dashboardData.stats?.totalCompletedCourses || 0}
            suffix={`/ ${dashboardData.stats?.totalPossibleCompletions || 0}`}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="stat-card" hoverable>
          <Statistic
            title="Средний балл"
            value={dashboardData.stats?.averageScore || 0}
            suffix="%"
            prefix={<StarOutlined />}
            valueStyle={{
              color:
                (dashboardData.stats?.averageScore || 0) >= 80
                  ? '#52c41a'
                  : (dashboardData.stats?.averageScore || 0) >= 60
                  ? '#faad14'
                  : '#ff4d4f',
            }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="stat-card" hoverable>
          <Statistic
            title="Активные пользователи"
            value={dashboardData.stats?.activeUsers || 0}
            suffix={`(${dashboardData.stats?.completionRate || 0}%)`}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="stat-card" hoverable>
          <Statistic
            title="Общее время обучения"
            value={dashboardData.stats?.totalTimeSpent || 0}
            suffix="ч."
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#13c2c2' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="stat-card" hoverable>
          <Statistic
            title="Всего тестов"
            value={dashboardData.stats?.totalTests || 0}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: '#eb2f96' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="stat-card" hoverable>
          <Statistic
            title="Процент завершения"
            value={dashboardData.stats?.completionRate || 0}
            suffix="%"
            prefix={<LineChartOutlined />}
            valueStyle={{
              color:
                (dashboardData.stats?.completionRate || 0) >= 50
                  ? '#52c41a'
                  : (dashboardData.stats?.completionRate || 0) >= 25
                  ? '#faad14'
                  : '#ff4d4f',
            }}
          />
        </Card>
      </Col>
    </Row>
  );

  // Список последних пользователей
  const renderRecentUsers = () => (
    <Card
      title={
        <Space>
          <UserOutlined />
          <span>Последние пользователи</span>
        </Space>
      }
      extra={
        <Button type="link" onClick={() => onNavigate('users')}>
          Все
        </Button>
      }
      className="dashboard-card"
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : dashboardData.users.length === 0 ? (
        <Alert message="Нет данных о пользователях" type="info" showIcon />
      ) : (
        <List
          dataSource={dashboardData.users.slice(0, 5)}
          renderItem={(user) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  size="small"
                  onClick={() => onNavigate('user-view', user.id)}
                >
                  Профиль
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<UserOutlined />}
                title={
                  <Space>
                    <Text strong>{getFioByTabNumber(user.tabNumber)}</Text>
                    {user.roles?.includes('ST-ADMIN') && (
                      <Tag color="red">Админ</Tag>
                    )}
                  </Space>
                }
                description={
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">Таб. №: {user.tabNumber}</Text>
                    {user.last_login && (
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Последний вход: {formatDate(user.last_login)}
                      </Text>
                    )}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );

  // Активность системы
  const renderSystemActivity = () => (
    <Card
      title={
        <Space>
          <ScheduleOutlined />
          <span>Последняя активность</span>
        </Space>
      }
      extra={
        <Space>
          <Button size="small" onClick={() => setTimeRange('week')}>
            Неделя
          </Button>
          <Button size="small" onClick={() => setTimeRange('month')}>
            Месяц
          </Button>
        </Space>
      }
      className="dashboard-card"
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : dashboardData.recentActivity.length === 0 ? (
        <Alert message="Нет данных об активности" type="info" showIcon />
      ) : (
        <Timeline>
          {dashboardData.recentActivity.map((activity) => (
            <Timeline.Item
              key={activity.id}
              color={
                activity.type === 'course_completed'
                  ? 'green'
                  : activity.type === 'test_attempt'
                  ? 'blue'
                  : activity.type === 'course_started'
                  ? 'orange'
                  : 'gray'
              }
              dot={
                activity.type === 'course_completed' ? (
                  <CheckCircleOutlined />
                ) : activity.type === 'test_attempt' ? (
                  <FileTextOutlined />
                ) : activity.type === 'course_started' ? (
                  <ClockCircleOutlined />
                ) : (
                  <ScheduleOutlined />
                )
              }
            >
              <Space direction="vertical" size={0}>
                <Text strong>{getFioByTabNumber(activity.user)}</Text>
                <Text>{activity.course}</Text>
                <Space>
                  {activity.score && (
                    <Tag color={activity.score >= 80 ? 'green' : 'orange'}>
                      {activity.score}%
                    </Tag>
                  )}
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {formatDate(activity.date)}
                  </Text>
                </Space>
              </Space>
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </Card>
  );

  // Прогресс по курсам
  const renderCoursesProgress = () => (
    <Card
      title={
        <Space>
          <TrophyOutlined />
          <span>Прогресс по курсам</span>
        </Space>
      }
      className="dashboard-card"
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : dashboardData.popularCourses.length === 0 ? (
        <Alert message="Нет данных по курсам" type="info" showIcon />
      ) : (
        <List
          dataSource={dashboardData.popularCourses}
          renderItem={(course) => (
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <Text strong>{course.title}</Text>
                  <Tag color="blue">{course.participants} участников</Tag>
                </Space>
                <Space
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <Progress
                    percent={course.averageScore}
                    size="small"
                    strokeColor={
                      course.averageScore >= 80
                        ? '#52c41a'
                        : course.averageScore >= 60
                        ? '#faad14'
                        : '#ff4d4f'
                    }
                    style={{ width: '60%' }}
                  />
                  <Text type="secondary">{course.completions} завершений</Text>
                </Space>
              </Space>
            </List.Item>
          )}
        />
      )}
    </Card>
  );

  if (loading && !dashboardData.stats) {
    return (
      <div style={{ padding: '24px' }}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Заголовок и обновление */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: '24px' }}
      >
        <Col>
          <Title level={2}>Панель управления обучением</Title>
          <Text type="secondary">
            Обновлено: {moment().format('DD.MM.YYYY HH:mm')}
          </Text>
        </Col>
        <Col>
          <Button
            icon={<DownloadOutlined />}
            onClick={refreshDashboard}
            loading={isLoading}
          >
            Обновить
          </Button>
        </Col>
      </Row>

      {/* Статистика */}
      {renderStatsCards()}

      {/* Основной контент */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={16}>
          <Row gutter={[24, 24]}>
            <Col span={24}>{renderSystemActivity()}</Col>
            <Col span={24}>{renderCoursesProgress()}</Col>
          </Row>
        </Col>

        <Col xs={24} lg={8}>
          <Row gutter={[24, 24]}>
            <Col span={24}>{renderRecentUsers()}</Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent;
