// src/features/security-training/components/admin/CoursesContent.jsx
import React, { useState, useEffect, moment } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Alert,
  Card,
  Table,
  Space,
  Typography,
  Tag,
  Tooltip,
  Button,
  Input,
  Select,
  Row,
  Col,
  Modal,
  message,
  Popconfirm,
  Statistic,
  Badge,
} from 'antd';
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  BarChartOutlined,
  BookOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  TeamOutlined,
  StarOutlined,
  RocketOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import CourseService from '../../api/CourseService';
import CourseModal from '../modals/course/CourseModal';

const { Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const CoursesContent = observer(() => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    level: '',
    category: '',
    page: 1,
    limit: 10,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [selectedCourseStats, setSelectedCourseStats] = useState(null);

  useEffect(() => {
    loadCourses();
  }, [filters]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await CourseService.getCourses(filters);
      setCourses(response.courses);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Ошибка загрузки курсов:', error);
      message.error('Не удалось загрузить курсы');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = async (course) => {
    try {
      console.log('Editing course:', course);
      setEditingCourse(course);

      // Загружаем уроки и вопросы если курс уже сохранен
      if (course.id) {
        try {
          const [lessonsData, questionsData] = await Promise.all([
            CourseService.getCourseLessons(course.id),
            CourseService.getCourseQuestions(course.id),
          ]);
          setLessons(lessonsData || []);
          setQuestions(questionsData || []);
        } catch (error) {
          console.error('Error loading course details:', error);
          // Если ошибка, оставляем пустые массивы
          setLessons([]);
          setQuestions([]);
        }
      } else {
        // Если курс новый, сбрасываем данные
        setLessons([]);
        setQuestions([]);
      }

      setCurrentStep(0);
      setModalVisible(true);
    } catch (error) {
      console.error('Error in handleEditCourse:', error);
      message.error('Ошибка загрузки данных курса');
    }
  };

  const handleViewStats = async (course) => {
    try {
      const stats = await CourseService.getCourseStats(course.id);
      setSelectedCourseStats(stats);
      setStatsModalVisible(true);
    } catch (error) {
      console.error('Error loading course stats:', error);
      message.error('Ошибка загрузки статистики');
    }
  };

  const handlePreviewCourse = (course) => {
    Modal.info({
      title: course.title,
      width: 800,
      content: (
        <div>
          <p>
            <strong>Описание:</strong> {course.description}
          </p>
          <p>
            <strong>Уровень:</strong>{' '}
            {course.level === 'beginner'
              ? 'Начальный'
              : course.level === 'intermediate'
              ? 'Средний'
              : 'Продвинутый'}
          </p>
          <p>
            <strong>Категория:</strong> {getCategoryName(course.category)}
          </p>
          <p>
            <strong>Продолжительность:</strong> {course.duration}
          </p>
          <p>
            <strong>Уроков:</strong> {course.lessons?.length || 0}
          </p>
          <p>
            <strong>Вопросов теста:</strong> {course.questions?.length || 0}
          </p>
          <p>
            <strong>Проходной балл:</strong> {course.passing_score}%
          </p>
          {course.tags && course.tags.length > 0 && (
            <p>
              <strong>Теги:</strong> {course.tags.join(', ')}
            </p>
          )}
        </div>
      ),
    });
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await CourseService.deleteCourse(courseId);
      message.success('Курс успешно удален');
      loadCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      message.error(error.response?.data?.message || 'Ошибка удаления курса');
    }
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setLessons([]);
    setQuestions([]);
    setCurrentStep(0);
    setModalVisible(true);
  };

  const handleModalSubmit = async (courseData) => {
    try {
      if (editingCourse) {
        await CourseService.updateCourse(editingCourse.id, courseData);
        message.success('Курс успешно обновлен');
      } else {
        await CourseService.createCourse(courseData);
        message.success('Курс успешно создан');
      }
      setModalVisible(false);
      loadCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      message.error(error.response?.data?.message || 'Ошибка сохранения курса');
      throw error;
    }
  };

  const handleManageLessons = async (course) => {
    // Проверяем, есть ли у курса ID
    if (!course.id) {
      // Если курс новый, сначала нужно его сохранить
      Modal.confirm({
        title: 'Сначала сохраните курс',
        content:
          'Для управления уроками необходимо сначала сохранить курс. Сохранить сейчас?',
        okText: 'Сохранить курс',
        cancelText: 'Отмена',
        onOk: async () => {
          try {
            // Открываем модальное окно для сохранения курса
            setEditingCourse(course);
            setCurrentStep(0);
            setModalVisible(true);
          } catch (error) {
            console.error('Error:', error);
          }
        },
      });
      return;
    }

    // Если курс сохранен, загружаем уроки
    try {
      const lessonsData = await CourseService.getCourseLessons(course.id);
      setLessons(lessonsData);
      setEditingCourse(course);
      setCurrentStep(1); // Переходим к шагу управления уроками
      setModalVisible(true);
    } catch (error) {
      console.error('Error loading lessons:', error);
      message.error('Ошибка загрузки уроков');
    }
  };

  const handleManageTest = async (course) => {
    if (!course.id) {
      Modal.confirm({
        title: 'Сначала сохраните курс',
        content:
          'Для управления тестом необходимо сначала сохранить курс. Сохранить сейчас?',
        okText: 'Сохранить курс',
        cancelText: 'Отмена',
        onOk: async () => {
          try {
            setEditingCourse(course);
            setCurrentStep(0);
            setModalVisible(true);
          } catch (error) {
            console.error('Error:', error);
          }
        },
      });
      return;
    }

    try {
      const questionsData = await CourseService.getCourseQuestions(course.id);
      setQuestions(questionsData);
      setEditingCourse(course);
      setCurrentStep(2);
      setModalVisible(true);
    } catch (error) {
      console.error('Error loading questions:', error);
      message.error('Ошибка загрузки вопросов');
    }
  };

  const getLevelName = (level) => {
    switch (level) {
      case 'beginner':
        return 'Начальный';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return level;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'green';
      case 'intermediate':
        return 'orange';
      case 'advanced':
        return 'red';
      default:
        return 'default';
    }
  };

  const getCategoryName = (category) => {
    const categories = {
      it: 'Информационная безопасность',
      ot: 'Охрана труда',
      pb: 'Пожарная безопасность',
      med: 'Первая помощь',
    };
    return categories[category] || category;
  };

  const handleCourseSaved = (savedCourse) => {
    console.log('Course saved, updating state:', savedCourse);

    // Если savedCourse имеет структуру { course: {...} }
    if (savedCourse && savedCourse.course) {
      const courseData = savedCourse.course;
      // Обновляем editingCourse с ID
      if (editingCourse) {
        const updatedCourse = {
          ...editingCourse,
          ...courseData,
          id: courseData.id || editingCourse.id,
        };
        setEditingCourse(updatedCourse);

        // Если мы находимся на шаге уроков, загружаем их
        if (currentStep === 1 && courseData.id) {
          loadCourseLessons(courseData.id);
        }
      }
    }
    // Если savedCourse - это сам курс
    else if (savedCourse && typeof savedCourse === 'object') {
      // Обновляем editingCourse с ID
      if (editingCourse) {
        const updatedCourse = {
          ...editingCourse,
          ...savedCourse,
          id: savedCourse.id || editingCourse.id,
        };
        setEditingCourse(updatedCourse);

        // Если мы находимся на шаге уроков, загружаем их
        if (currentStep === 1 && savedCourse.id) {
          loadCourseLessons(savedCourse.id);
        }
      }
    } else {
      console.error('Invalid savedCourse format:', savedCourse);
    }
  };

  const loadCourseLessons = async (courseId) => {
    try {
      const lessonsData = await CourseService.getCourseLessons(courseId);
      setLessons(lessonsData);
    } catch (error) {
      console.error('Error loading lessons:', error);
      message.error('Ошибка загрузки уроков');
    }
  };

  const loadCourseQuestions = async (courseId) => {
    try {
      const questionsData = await CourseService.getCourseQuestions(courseId);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error loading questions:', error);
      message.error('Ошибка загрузки вопросов');
    }
  };

  const getContentTypeIcon = (lessons) => {
    const types = {
      video: 0,
      interactive: 0,
      presentation: 0,
      text: 0,
    };

    lessons?.forEach((lesson) => {
      if (types[lesson.content_type] !== undefined) {
        types[lesson.content_type]++;
      }
    });

    const icons = [];
    if (types.video > 0) icons.push(<VideoCameraOutlined key="video" />);
    if (types.interactive > 0) icons.push(<BookOutlined key="interactive" />);
    if (types.presentation > 0)
      icons.push(<FileTextOutlined key="presentation" />);

    return icons;
  };

  const courseColumns = [
    {
      title: 'Курс',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text, record) => (
        <Space direction="vertical" size={4}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.short_description?.substring(0, 80)}...
          </Text>
          <Space size={4}>{getContentTypeIcon(record.lessons)}</Space>
        </Space>
      ),
    },
    {
      title: 'Уровень',
      dataIndex: 'level',
      key: 'level',
      width: 120,
      render: (level) => (
        <Tag color={getLevelColor(level)}>{getLevelName(level)}</Tag>
      ),
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category) => getCategoryName(category),
    },
    {
      title: 'Контент',
      key: 'content',
      width: 120,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <div>
            <Badge
              count={record.lessons?.length || 0}
              style={{ backgroundColor: '#52c41a' }}
            />
            <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
              уроков
            </Text>
          </div>
          <div>
            <Badge
              count={record.questions?.length || 0}
              style={{ backgroundColor: '#1890ff' }}
            />
            <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
              вопросов
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Статус',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Tag color={record.is_active ? 'green' : 'red'}>
          {record.is_active ? 'Активен' : 'Неактивен'}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Редактировать">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditCourse(record)}
            />
          </Tooltip>
          <Tooltip title="Просмотр">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handlePreviewCourse(record)}
            />
          </Tooltip>
          <Tooltip title="Управление уроками">
            <Button
              type="dashed"
              size="small"
              onClick={() => handleManageLessons(record)}
            >
              Уроки
            </Button>
          </Tooltip>
          <Tooltip title="Управление тестом">
            <Button
              type="dashed"
              size="small"
              onClick={() => handleManageTest(record)}
            >
              Тест
            </Button>
          </Tooltip>
          <Tooltip title="Статистика">
            <Button
              icon={<BarChartOutlined />}
              size="small"
              onClick={() => handleViewStats(record)}
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Popconfirm
              title="Удалить курс?"
              description="Все связанные уроки и вопросы также будут удалены."
              onConfirm={() => handleDeleteCourse(record.id)}
              okText="Да"
              cancelText="Нет"
              okType="danger"
            >
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* Панель фильтров и поиска */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Search
              placeholder="Поиск по названию или описанию..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
              style={{ width: 300 }}
            />
          </Col>
          <Col>
            <Select
              placeholder="Уровень"
              style={{ width: 120 }}
              value={filters.level || undefined}
              onChange={(value) =>
                setFilters({ ...filters, level: value, page: 1 })
              }
              allowClear
            >
              <Option value="beginner">Начальный</Option>
              <Option value="intermediate">Средний</Option>
              <Option value="advanced">Продвинутый</Option>
            </Select>
          </Col>
          <Col>
            <Select
              placeholder="Категория"
              style={{ width: 180 }}
              value={filters.category || undefined}
              onChange={(value) =>
                setFilters({ ...filters, category: value, page: 1 })
              }
              allowClear
            >
              <Option value="it">Информационная безопасность</Option>
              <Option value="ot">Охрана труда</Option>
              <Option value="pb">Пожарная безопасность</Option>
              <Option value="med">Первая помощь</Option>
            </Select>
          </Col>
          <Col>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={handleAddCourse}
            >
              Новый курс
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Таблица курсов */}
      <Card>
        <Table
          columns={courseColumns}
          dataSource={courses}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Всего ${total} курсов`,
            onChange: (page, pageSize) =>
              setFilters({ ...filters, page, limit: pageSize }),
          }}
          rowKey="id"
          scroll={{ x: 1200 }}
          bordered
        />
      </Card>

      {/* Модальное окно создания/редактирования курса */}
      <CourseModal
        visible={modalVisible}
        editingCourse={editingCourse}
        lessons={lessons}
        questions={questions}
        currentStep={currentStep}
        onClose={() => {
          setModalVisible(false);
          setEditingCourse(null);
          setLessons([]);
          setQuestions([]);
          setCurrentStep(0);
        }}
        onStepChange={setCurrentStep}
        onLessonsChange={setLessons}
        onQuestionsChange={setQuestions}
        onSubmit={handleModalSubmit}
        onCourseSaved={handleCourseSaved} // Добавьте этот пропс
        onReloadLessons={() =>
          editingCourse && CourseService.getCourseLessons(editingCourse.id)
        }
        onReloadQuestions={() =>
          editingCourse && CourseService.getCourseQuestions(editingCourse.id)
        }
      />

      {/* Модальное окно статистики */}
      <Modal
        title="Статистика курса"
        open={statsModalVisible}
        onCancel={() => setStatsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedCourseStats && (
          <div>
            <h3>{selectedCourseStats.course.title}</h3>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Завершили курс"
                    value={selectedCourseStats.stats.total_completed}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Средний балл"
                    value={selectedCourseStats.stats.avg_score}
                    suffix="%"
                    precision={1}
                    prefix={<StarOutlined />}
                  />
                </Card>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Всего попыток"
                    value={selectedCourseStats.stats.total_attempts}
                    prefix={<RocketOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Процент сдачи"
                    value={selectedCourseStats.stats.passing_rate}
                    suffix="%"
                    precision={1}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            {selectedCourseStats.recent_results &&
              selectedCourseStats.recent_results.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h4>Последние результаты:</h4>
                  <Table
                    size="small"
                    dataSource={selectedCourseStats.recent_results}
                    columns={[
                      {
                        title: 'Пользователь',
                        dataIndex: ['User', 'login'],
                        key: 'user',
                      },
                      {
                        title: 'Балл',
                        dataIndex: 'score',
                        key: 'score',
                        render: (score) => `${score}%`,
                      },
                      {
                        title: 'Статус',
                        dataIndex: 'passed',
                        key: 'passed',
                        render: (passed) => (
                          <Tag color={passed ? 'green' : 'red'}>
                            {passed ? 'Сдал' : 'Не сдал'}
                          </Tag>
                        ),
                      },
                      {
                        title: 'Дата',
                        dataIndex: 'created_at',
                        key: 'date',
                        render: (date) =>
                          moment(date).format('DD.MM.YYYY HH:mm'),
                      },
                    ]}
                    pagination={false}
                  />
                </div>
              )}
          </div>
        )}
      </Modal>
    </Space>
  );
});

export default CoursesContent;
