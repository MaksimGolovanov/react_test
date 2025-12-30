import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  Card,
  Button,
  Typography,
  Steps,
  Tag,
  Alert,
  Row,
  Col,
  Divider,
  Modal,
  Progress,
  Space
} from 'antd';
import {
  PlayCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import trainingStore from '../store/SecurityTrainingStore';
import { courses } from '../data/coursesData';
import LessonViewer from '../components/LessonViewer';

const { Header, Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const CourseDetailPage = observer(() => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isTestModalVisible, setIsTestModalVisible] = useState(false);

  const course = courses.find(c => c.id === courseId);
  const progress = trainingStore.userProgress[courseId];
  const isCourseCompleted = progress?.completed || false;
  const canTakeTest = trainingStore.canTakeTest(courseId, course?.lessons?.length || 0);

  useEffect(() => {
    if (course?.lessons?.length > 0 && !selectedLesson) {
      setSelectedLesson(course.lessons[0]);
    }
  }, [course, selectedLesson]);

  if (!course) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Alert
          message="Курс не найден"
          description="Запрошенный курс не существует или был удален"
          type="error"
          showIcon
        />
        <Button 
          type="primary" 
          onClick={() => navigate('/security-training')}
          style={{ marginTop: '20px' }}
        >
          Вернуться к списку курсов
        </Button>
      </div>
    );
  }

  const handleCompleteLesson = (lessonId) => {
    trainingStore.completeLesson(courseId, lessonId);
  };

  const handleStartTest = () => {
    if (canTakeTest) {
      navigate(`/security-training/test/${courseId}`);
    } else {
      Modal.warning({
        title: 'Доступ к тесту ограничен',
        content: 'Для прохождения теста необходимо завершить все уроки курса.',
        okText: 'Понятно'
      });
    }
  };

  const getLessonStatus = (lessonId) => {
    if (!progress?.completedLessons) return 'pending';
    return progress.completedLessons.includes(lessonId) ? 'finish' : 'process';
  };

  const completedLessonsCount = progress?.completedLessons?.length || 0;
  const totalLessons = course.lessons?.length || 0;
  const progressPercentage = Math.round((completedLessonsCount / totalLessons) * 100);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={300}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          padding: '16px'
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/security-training')}
            type="text"
            style={{ marginBottom: '16px' }}
          >
            Назад к курсам
          </Button>
          
          <Title level={4} style={{ marginBottom: '8px' }}>
            {course.title}
          </Title>
          
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text type="secondary">Прогресс:</Text>
              <Progress percent={progressPercentage} size="small" />
            </div>
            
            <Row gutter={8}>
              <Col>
                <Tag color="blue">
                  {completedLessonsCount}/{totalLessons} уроков
                </Tag>
              </Col>
              <Col>
                <Tag color={course.level === 'Начальный' ? 'green' : 'orange'}>
                  {course.level}
                </Tag>
              </Col>
            </Row>
            
            {isCourseCompleted && (
              <Alert
                message="Курс пройден"
                description={`Результат теста: ${progress.testScore}%`}
                type="success"
                showIcon
                icon={<SafetyCertificateOutlined />}
              />
            )}
          </Space>
        </div>

        <Divider orientation="left">Уроки курса</Divider>
        
        <Menu
          mode="inline"
          selectedKeys={selectedLesson ? [selectedLesson.id] : []}
          style={{ borderRight: 0 }}
        >
          {course.lessons?.map((lesson, index) => (
            <Menu.Item
              key={lesson.id}
              icon={
                progress?.completedLessons?.includes(lesson.id) ? (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <FileTextOutlined />
                )
              }
              onClick={() => setSelectedLesson(lesson)}
              style={{ marginBottom: '8px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  Урок {index + 1}: {lesson.title}
                </span>
                <Tag size="small">{lesson.duration}</Tag>
              </div>
            </Menu.Item>
          ))}
        </Menu>

        <div style={{ marginTop: '24px', padding: '0 8px' }}>
          <Button
            type="primary"
            block
            size="large"
            onClick={handleStartTest}
            disabled={!canTakeTest && !isCourseCompleted}
          >
            {isCourseCompleted ? 'Пройти тест еще раз' : 'Пройти тест'}
          </Button>
          
          {!canTakeTest && !isCourseCompleted && (
            <Text type="secondary" style={{ display: 'block', marginTop: '8px', fontSize: '12px' }}>
              Для доступа к тесту необходимо завершить все уроки
            </Text>
          )}
        </div>
      </Sider>

      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Title level={4} style={{ margin: 0 }}>
            {selectedLesson?.title || 'Выберите урок'}
          </Title>
          
          {selectedLesson && (
            <Space>
              <Tag icon={<PlayCircleOutlined />} color="blue">
                {selectedLesson.duration}
              </Tag>
              {progress?.completedLessons?.includes(selectedLesson.id) && (
                <Tag icon={<CheckCircleOutlined />} color="green">
                  Завершено
                </Tag>
              )}
            </Space>
          )}
        </Header>

        <Content style={{ padding: '24px', overflow: 'auto' }}>
          {selectedLesson ? (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <LessonViewer
                lesson={selectedLesson}
                onComplete={() => handleCompleteLesson(selectedLesson.id)}
              />
              
              <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleCompleteLesson(selectedLesson.id)}
                  disabled={progress?.completedLessons?.includes(selectedLesson.id)}
                >
                  {progress?.completedLessons?.includes(selectedLesson.id)
                    ? 'Урок завершен'
                    : 'Завершить урок'}
                </Button>
              </div>
            </div>
          ) : (
            <Card style={{ textAlign: 'center', padding: '40px' }}>
              <FileTextOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={4}>Выберите урок для начала обучения</Title>
              <Text type="secondary">
                Начните с первого урока, чтобы освоить материал курса
              </Text>
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
});

export default CourseDetailPage;