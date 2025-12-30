// src/features/security-training/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Card,
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Space,
  Tag,
  Statistic,
  Row,
  Col,
  Alert,
  Tabs,
  Upload,
  message,
  Progress,
  Steps,
  InputNumber,
  Collapse,
  Divider,
  Empty,
  Tooltip
} from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  SaveOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  DragOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  LinkOutlined,
  OrderedListOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import trainingStore from '../store/SecurityTrainingStore';
import { courses } from '../data/coursesData';
import EditorComponent from '../components/EditorComponent';

const { Header, Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;
const { Panel } = Collapse;

const AdminPage = observer(() => {
  const [selectedMenu, setSelectedMenu] = useState('courses');
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false);
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  
  const [courseForm] = Form.useForm();
  const [lessonForm] = Form.useForm();
  const [questionForm] = Form.useForm();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [lessonContent, setLessonContent] = useState('');
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const [uploadingImage, setUploadingImage] = useState(false);

  // Статистика
  const totalUsers = Object.keys(trainingStore.userProgress).length;
  const totalCompletedCourses = Object.values(trainingStore.userProgress)
    .filter(progress => progress.completed).length;
  const averageScore = Object.values(trainingStore.userProgress)
    .reduce((acc, progress) => acc + (progress.testScore || 0), 0) / totalUsers || 0;

  // Полные колонки для таблицы курсов
  const courseColumns = [
    {
      title: 'Курс',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description?.substring(0, 60)}...
          </Text>
        </Space>
      )
    },
    {
      title: 'Уровень',
      dataIndex: 'level',
      key: 'level',
      render: (level) => (
        <Tag color={level === 'Начальный' ? 'green' : level === 'Средний' ? 'orange' : 'red'}>
          {level}
        </Tag>
      )
    },
    {
      title: 'Уроков',
      key: 'lessons',
      render: (_, record) => record.lessons?.length || 0
    },
    {
      title: 'Тестов',
      key: 'tests',
      render: (_, record) => record.test?.questions?.length || 0
    },
    {
      title: 'Статус',
      key: 'active',
      render: (_, record) => (
        <Tag color={record.active ? 'green' : 'red'}>
          {record.active ? 'Активен' : 'Неактивен'}
        </Tag>
      )
    },
    {
      title: 'Действия',
      key: 'actions',
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
              type="primary"
              size="small"
              onClick={() => handleManageLessons(record)}
            >
              Уроки
            </Button>
          </Tooltip>
          <Tooltip title="Управление тестом">
            <Button
              type="primary"
              size="small"
              onClick={() => handleManageTest(record)}
            >
              Тест
            </Button>
          </Tooltip>
          <Tooltip title="Удалить">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => handleDeleteCourse(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // Обработчики
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setLessons(course.lessons || []);
    setQuestions(course.test?.questions || []);
    courseForm.setFieldsValue({
      title: course.title,
      description: course.description,
      level: course.level,
      duration: course.duration,
      icon: course.icon,
      active: course.active !== false
    });
    setCurrentStep(0);
    setIsCourseModalVisible(true);
  };

  const handleManageLessons = (course) => {
    setSelectedCourse(course);
    setLessons(course.lessons || []);
    setCurrentStep(1);
    setIsCourseModalVisible(true);
    setEditingCourse(course);
  };

  const handleManageTest = (course) => {
    setSelectedCourse(course);
    setQuestions(course.test?.questions || []);
    setCurrentStep(2);
    setIsCourseModalVisible(true);
    setEditingCourse(course);
  };

  const handlePreviewCourse = (course) => {
    Modal.info({
      title: course.title,
      width: 800,
      content: (
        <div>
          <Paragraph strong>Описание:</Paragraph>
          <Paragraph>{course.description}</Paragraph>
          
          <Paragraph strong>Уровень:</Paragraph>
          <Tag color={course.level === 'Начальный' ? 'green' : 'orange'}>{course.level}</Tag>
          
          <Paragraph strong>Продолжительность:</Paragraph>
          <Paragraph>{course.duration}</Paragraph>
          
          <Paragraph strong>Уроки:</Paragraph>
          <ul>
            {course.lessons?.map((lesson, index) => (
              <li key={index}>{lesson.title} ({lesson.duration})</li>
            ))}
          </ul>
          
          <Paragraph strong>Тест:</Paragraph>
          <Paragraph>Вопросов: {course.test?.questions?.length || 0}</Paragraph>
          <Paragraph>Проходной балл: {course.test?.passingScore || 70}%</Paragraph>
        </div>
      )
    });
  };

  const handleDeleteCourse = (courseId) => {
    Modal.confirm({
      title: 'Удалить курс?',
      content: 'Все данные о прохождении этого курса также будут удалены.',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => {
        // Здесь будет удаление курса
        message.success('Курс удален');
      }
    });
  };

  const handleAddLesson = () => {
    setEditingLesson(null);
    lessonForm.resetFields();
    setLessonContent('');
    setIsLessonModalVisible(true);
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    lessonForm.setFieldsValue({
      title: lesson.title,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl
    });
    setLessonContent(lesson.content || '');
    setIsLessonModalVisible(true);
  };

  const handleDeleteLesson = (index) => {
    Modal.confirm({
      title: 'Удалить урок?',
      content: 'Это действие нельзя отменить.',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => {
        const newLessons = [...lessons];
        newLessons.splice(index, 1);
        setLessons(newLessons);
        message.success('Урок удален');
      }
    });
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    questionForm.resetFields();
    setIsQuestionModalVisible(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    questionForm.setFieldsValue({
      question: question.question,
      type: question.type,
      explanation: question.explanation
    });
    setIsQuestionModalVisible(true);
  };

  const handleDeleteQuestion = (index) => {
    Modal.confirm({
      title: 'Удалить вопрос?',
      content: 'Это действие нельзя отменить.',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
        message.success('Вопрос удален');
      }
    });
  };

  const handleSaveLesson = (values) => {
    const lesson = {
      id: editingLesson?.id || `lesson-${Date.now()}`,
      title: values.title,
      content: lessonContent,
      duration: values.duration,
      videoUrl: values.videoUrl || null,
      order: lessons.length + 1
    };

    if (editingLesson) {
      const index = lessons.findIndex(l => l.id === editingLesson.id);
      const newLessons = [...lessons];
      newLessons[index] = lesson;
      setLessons(newLessons);
      message.success('Урок обновлен');
    } else {
      setLessons([...lessons, lesson]);
      message.success('Урок добавлен');
    }

    setIsLessonModalVisible(false);
    setEditingLesson(null);
    lessonForm.resetFields();
    setLessonContent('');
  };

  const handleSaveQuestion = (values) => {
    const question = {
      id: editingQuestion?.id || `q-${Date.now()}`,
      question: values.question,
      type: values.type,
      options: editingQuestion?.options || [],
      explanation: values.explanation
    };

    if (editingQuestion) {
      const index = questions.findIndex(q => q.id === editingQuestion.id);
      const newQuestions = [...questions];
      newQuestions[index] = question;
      setQuestions(newQuestions);
      message.success('Вопрос обновлен');
    } else {
      setQuestions([...questions, question]);
      message.success('Вопрос добавлен');
    }

    setIsQuestionModalVisible(false);
    setEditingQuestion(null);
    questionForm.resetFields();
  };

  const handleSaveCourse = (values) => {
    const courseData = {
      id: editingCourse?.id || `course-${Date.now()}`,
      title: values.title,
      description: values.description,
      level: values.level,
      duration: values.duration,
      icon: values.icon || 'SafetyOutlined',
      lessons: lessons,
      test: {
        id: editingCourse?.test?.id || `test-${Date.now()}`,
        title: `${values.title} - Тест`,
        passingScore: 70,
        questions: questions
      },
      active: values.active,
      createdAt: editingCourse?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingCourse) {
      // Обновление существующего курса
      message.success('Курс обновлен');
    } else {
      // Создание нового курса
      message.success('Курс создан');
    }

    // Здесь будет сохранение в БД/стор
    setIsCourseModalVisible(false);
    setEditingCourse(null);
    courseForm.resetFields();
    setLessons([]);
    setQuestions([]);
    setCurrentStep(0);
  };

  const steps = [
    {
      title: 'Основная информация',
      content: (
        <Form form={courseForm} layout="vertical">
          <Form.Item
            name="title"
            label="Название курса"
            rules={[{ required: true, message: 'Введите название курса' }]}
          >
            <Input placeholder="Основы информационной безопасности" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Краткое описание"
            rules={[{ required: true, message: 'Введите описание курса' }]}
          >
            <TextArea
              placeholder="Краткое описание курса..."
              rows={3}
              showCount
              maxLength={500}
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Уровень сложности"
                rules={[{ required: true, message: 'Выберите уровень' }]}
              >
                <Select placeholder="Выберите уровень">
                  <Option value="Начальный">Начальный</Option>
                  <Option value="Средний">Средний</Option>
                  <Option value="Продвинутый">Продвинутый</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Продолжительность"
                rules={[{ required: true, message: 'Укажите продолжительность' }]}
              >
                <Input placeholder="2 часа" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="icon"
                label="Иконка курса"
              >
                <Select placeholder="Выберите иконку">
                  <Option value="SafetyOutlined">Щит</Option>
                  <Option value="WarningOutlined">Предупреждение</Option>
                  <Option value="LockOutlined">Замок</Option>
                  <Option value="ShieldOutlined">Щит</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="active"
                label="Статус курса"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Активен" unCheckedChildren="Неактивен" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )
    },
    {
      title: 'Управление уроками',
      content: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Title level={5}>Уроки курса ({lessons.length})</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddLesson}
            >
              Добавить урок
            </Button>
          </div>
          
          {lessons.length === 0 ? (
            <Empty
              description="Нет добавленных уроков"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={handleAddLesson}>
                Добавить первый урок
              </Button>
            </Empty>
          ) : (
            <Collapse>
              {lessons.map((lesson, index) => (
                <Panel
                  key={lesson.id}
                  header={
                    <Space>
                      <Text strong>Урок {index + 1}: {lesson.title}</Text>
                      <Tag>{lesson.duration}</Tag>
                      {lesson.videoUrl && <Tag icon={<VideoCameraOutlined />} color="blue">Видео</Tag>}
                    </Space>
                  }
                  extra={
                    <Space>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditLesson(lesson);
                        }}
                      />
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLesson(index);
                        }}
                      />
                    </Space>
                  }
                >
                  <div dangerouslySetInnerHTML={{ __html: lesson.content.substring(0, 200) + '...' }} />
                </Panel>
              ))}
            </Collapse>
          )}
        </Space>
      )
    },
    {
      title: 'Тестирование',
      content: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Title level={5}>Вопросы теста ({questions.length})</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddQuestion}
            >
              Добавить вопрос
            </Button>
          </div>
          
          {questions.length === 0 ? (
            <Empty
              description="Нет добавленных вопросов"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={handleAddQuestion}>
                Добавить первый вопрос
              </Button>
            </Empty>
          ) : (
            <Collapse>
              {questions.map((question, index) => (
                <Panel
                  key={question.id}
                  header={
                    <Space>
                      <Text strong>Вопрос {index + 1}: {question.question.substring(0, 50)}...</Text>
                      <Tag>{question.type === 'single' ? 'Один ответ' : 'Несколько ответов'}</Tag>
                      <Tag color="blue">Вариантов: {question.options?.length || 0}</Tag>
                    </Space>
                  }
                  extra={
                    <Space>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditQuestion(question);
                        }}
                      />
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(index);
                        }}
                      />
                    </Space>
                  }
                >
                  <div>
                    <Paragraph strong>Вопрос:</Paragraph>
                    <Paragraph>{question.question}</Paragraph>
                    
                    <Paragraph strong>Варианты ответов:</Paragraph>
                    <ul>
                      {question.options?.map((option, optIndex) => (
                        <li key={optIndex}>
                          {option.text} {option.correct && <Tag color="green">Правильный</Tag>}
                        </li>
                      ))}
                    </ul>
                    
                    {question.explanation && (
                      <>
                        <Paragraph strong>Объяснение:</Paragraph>
                        <Paragraph>{question.explanation}</Paragraph>
                      </>
                    )}
                  </div>
                </Panel>
              ))}
            </Collapse>
          )}
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={250}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0'
        }}
      >
        <div style={{ padding: '24px' }}>
          <Title level={4} style={{ marginBottom: '24px' }}>
            <SettingOutlined /> Администрирование
          </Title>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          onSelect={({ key }) => setSelectedMenu(key)}
          style={{ borderRight: 0 }}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Панель управления
          </Menu.Item>
          <Menu.Item key="courses" icon={<BookOutlined />}>
            Управление курсами
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            Пользователи
          </Menu.Item>
          <Menu.Item key="analytics" icon={<BarChartOutlined />}>
            Аналитика
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>
              {selectedMenu === 'dashboard' && 'Панель управления'}
              {selectedMenu === 'courses' && 'Управление курсами'}
              {selectedMenu === 'users' && 'Пользователи'}
              {selectedMenu === 'analytics' && 'Аналитика'}
            </Title>
            
            {selectedMenu === 'courses' && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingCourse(null);
                  setLessons([]);
                  setQuestions([]);
                  setCurrentStep(0);
                  courseForm.resetFields();
                  setIsCourseModalVisible(true);
                }}
              >
                Создать курс
              </Button>
            )}
          </div>
        </Header>

        <Content style={{ padding: '24px', overflow: 'auto' }}>
          {selectedMenu === 'courses' && (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert
                message="Управление обучающими материалами"
                description="Создавайте, редактируйте и управляйте курсами по информационной безопасности"
                type="info"
                showIcon
              />
              
              <Card>
                <Table
                  columns={courseColumns}
                  dataSource={courses.map(c => ({ ...c, key: c.id }))}
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </Space>
          )}
          
          {/* Остальные вкладки (dashboard, users, analytics) остаются без изменений */}
        </Content>
      </Layout>

      {/* Модальное окно создания/редактирования курса */}
      <Modal
        title={editingCourse ? 'Редактирование курса' : 'Создание нового курса'}
        open={isCourseModalVisible}
        onCancel={() => {
          setIsCourseModalVisible(false);
          setEditingCourse(null);
          setLessons([]);
          setQuestions([]);
          setCurrentStep(0);
          courseForm.resetFields();
        }}
        onOk={() => {
          if (currentStep === 0) {
            courseForm.submit();
          } else {
            handleSaveCourse(courseForm.getFieldsValue());
          }
        }}
        width={800}
        okText={currentStep === 2 ? 'Сохранить курс' : 'Далее'}
        cancelText={currentStep === 0 ? 'Отмена' : 'Назад'}
        onCancelButtonClick={() => {
          if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
          } else {
            setIsCourseModalVisible(false);
            setEditingCourse(null);
            setLessons([]);
            setQuestions([]);
            courseForm.resetFields();
          }
        }}
      >
        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          <Step title="Основное" />
          <Step title="Уроки" />
          <Step title="Тест" />
        </Steps>
        
        <div style={{ minHeight: '400px' }}>
          {steps[currentStep].content}
        </div>
      </Modal>

      {/* Модальное окно урока */}
      <Modal
        title={editingLesson ? 'Редактирование урока' : 'Создание урока'}
        open={isLessonModalVisible}
        onCancel={() => {
          setIsLessonModalVisible(false);
          setEditingLesson(null);
          lessonForm.resetFields();
          setLessonContent('');
        }}
        onOk={() => lessonForm.submit()}
        width={900}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form
          form={lessonForm}
          layout="vertical"
          onFinish={handleSaveLesson}
        >
          <Form.Item
            name="title"
            label="Название урока"
            rules={[{ required: true, message: 'Введите название урока' }]}
          >
            <Input placeholder="Введение в информационную безопасность" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Продолжительность"
                rules={[{ required: true, message: 'Укажите продолжительность' }]}
              >
                <Input placeholder="15 минут" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="videoUrl"
                label="Ссылка на видео (YouTube)"
              >
                <Input placeholder="https://www.youtube.com/embed/..." />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="Содержание урока"
            required
          >
            <EditorComponent
              value={lessonContent}
              onChange={setLessonContent}
              placeholder="Введите содержание урока..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Модальное окно вопроса */}
      <Modal
        title={editingQuestion ? 'Редактирование вопроса' : 'Создание вопроса'}
        open={isQuestionModalVisible}
        onCancel={() => {
          setIsQuestionModalVisible(false);
          setEditingQuestion(null);
          questionForm.resetFields();
        }}
        onOk={() => questionForm.submit()}
        width={700}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form
          form={questionForm}
          layout="vertical"
          onFinish={handleSaveQuestion}
        >
          <Form.Item
            name="question"
            label="Текст вопроса"
            rules={[{ required: true, message: 'Введите текст вопроса' }]}
          >
            <TextArea
              placeholder="Что означает принцип 'конфиденциальность' в информационной безопасности?"
              rows={3}
            />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Тип вопроса"
            rules={[{ required: true, message: 'Выберите тип вопроса' }]}
          >
            <Select placeholder="Выберите тип">
              <Option value="single">Один правильный ответ</Option>
              <Option value="multiple">Несколько правильных ответов</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="explanation"
            label="Объяснение (по желанию)"
          >
            <TextArea
              placeholder="Объяснение правильного ответа..."
              rows={2}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
});

export default AdminPage;