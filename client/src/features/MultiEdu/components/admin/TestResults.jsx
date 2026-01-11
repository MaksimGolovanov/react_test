// src/features/security-training/components/TestResults.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Table,
  Tag,
  Progress,
  Row,
  Col,
  Statistic,
  Button,
  Collapse,
  Space,
  Alert,
  Timeline,
  Modal,
  Spin
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import trainingStore from '../store/SecurityTrainingStore';
import CourseService from '../services/CourseService';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const TestResultsPage = observer(() => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [detailedResults, setDetailedResults] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    loadResultsData();
  }, [courseId]);

  const loadResultsData = async () => {
    try {
      setLoading(true);
      
      // Загружаем курс
      const courseData = await CourseService.getCourseById(courseId);
      setCourse(courseData);
      
      // Загружаем вопросы
      const questions = await CourseService.getCourseQuestions(courseId);
      
      // Загружаем историю тестов
      const userId = trainingStore.currentUserTabNumber;
      if (userId) {
        const history = await CourseService.getUserTestResults(userId, courseId);
        setTestHistory(Array.isArray(history) ? history : []);
      }
      
      // Используем последний тест из store
      const storeHistory = trainingStore.testResults.filter(r => r.courseId === courseId);
      const latestTest = storeHistory.length > 0 ? storeHistory[storeHistory.length - 1] : null;
      
      if (latestTest && questions) {
        const detailed = questions.map((question, index) => {
          const userAnswer = latestTest.answers[question.id];
          let isCorrect = false;
          
          // Проверяем правильность ответа
          if (question.question_type === 'single') {
            const correctOption = question.options?.find(opt => opt.correct);
            isCorrect = correctOption && correctOption.id === userAnswer;
          } else if (question.question_type === 'multiple') {
            const correctOptions = question.options?.filter(opt => opt.correct).map(opt => opt.id);
            isCorrect = Array.isArray(userAnswer) &&
              userAnswer.length === correctOptions?.length &&
              userAnswer.every(ans => correctOptions?.includes(ans));
          } else if (question.question_type === 'text') {
            isCorrect = question.correct_answer &&
              question.correct_answer.toLowerCase() === userAnswer?.toLowerCase()?.trim();
          }
          
          return {
            key: index,
            question: question.question_text,
            type: question.question_type === 'single' ? 'Один ответ' : 
                  question.question_type === 'multiple' ? 'Несколько ответов' : 'Текстовый ответ',
            yourAnswer: formatAnswer(question, userAnswer),
            correctAnswer: formatCorrectAnswer(question),
            isCorrect: isCorrect,
            explanation: question.explanation || 'Объяснение отсутствует'
          };
        });
        
        setDetailedResults(detailed);
      }
      
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAnswer = (question, userAnswer) => {
    if (!userAnswer) return 'Нет ответа';
    
    if (question.question_type === 'single') {
      const option = question.options?.find(opt => opt.id === userAnswer);
      return option ? option.text : 'Неизвестный ответ';
    } else if (question.question_type === 'multiple') {
      if (!Array.isArray(userAnswer)) return 'Нет ответа';
      return question.options
        ?.filter(opt => userAnswer.includes(opt.id))
        .map(opt => opt.text)
        .join(', ') || 'Нет ответа';
    } else {
      return userAnswer;
    }
  };

  const formatCorrectAnswer = (question) => {
    if (question.question_type === 'single') {
      const correctOption = question.options?.find(opt => opt.correct);
      return correctOption ? correctOption.text : 'Нет правильного ответа';
    } else if (question.question_type === 'multiple') {
      return question.options
        ?.filter(opt => opt.correct)
        .map(opt => opt.text)
        .join(', ') || 'Нет правильных ответов';
    } else {
      return question.correct_answer || 'Нет правильного ответа';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Загрузка результатов..." />
      </div>
    );
  }

  const progress = trainingStore.userProgress[courseId] || {};
  const passingScore = course?.passing_score || 70;

  const columns = [
    {
      title: 'Вопрос',
      dataIndex: 'question',
      key: 'question',
      width: '40%',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <div>
            <Tag size="small" color="blue">{record.type}</Tag>
          </div>
        </div>
      )
    },
    {
      title: 'Ваш ответ',
      dataIndex: 'yourAnswer',
      key: 'yourAnswer',
      width: '25%'
    },
    {
      title: 'Правильный ответ',
      dataIndex: 'correctAnswer',
      key: 'correctAnswer',
      width: '25%'
    },
    {
      title: 'Результат',
      dataIndex: 'isCorrect',
      key: 'isCorrect',
      width: '10%',
      align: 'center',
      render: (isCorrect) => (
        isCorrect ? 
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} /> :
          <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
      )
    }
  ];

  const historyColumns = [
    {
      title: 'Дата прохождения',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    },
    {
      title: 'Результат',
      dataIndex: 'score',
      key: 'score',
      render: (score) => (
        <Tag color={score >= passingScore ? 'green' : 'red'}>
          {score}%
        </Tag>
      )
    },
    {
      title: 'Статус',
      key: 'status',
      render: (_, record) => (
        record.score >= passingScore ? 'Сдан' : 'Не сдан'
      )
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/security-training/${courseId}`)}
          >
            Вернуться к курсу
          </Button>
          
          <Title level={3} style={{ margin: 0, textAlign: 'center' }}>
            Результаты тестирования по курсу "{course?.title}"
          </Title>
          
          <Space>
            <Button
              type="primary"
              onClick={() => navigate(`/security-training/test/${courseId}`)}
            >
              Пройти тест еще раз
            </Button>
          </Space>
        </div>

        <Card>
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Statistic
                title="Курс"
                value={course?.title || 'Неизвестный курс'}
                prefix={<BarChartOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Лучший результат"
                value={progress.testScore || 0}
                suffix="%"
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Количество попыток"
                value={testHistory.length}
                prefix={<HistoryOutlined />}
              />
            </Col>
          </Row>

          <div style={{ marginTop: '32px' }}>
            <Title level={5}>Общая статистика</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>Прогресс курса</Text>
                    <Text strong>{progress.testScore || 0}%</Text>
                  </div>
                  <Progress percent={progress.testScore || 0} status="active" />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>Текущий статус</Text>
                    <Tag color={(progress.testScore || 0) >= passingScore ? 'green' : 'red'}>
                      {(progress.testScore || 0) >= passingScore ? 'Сдан' : 'Не сдан'}
                    </Tag>
                  </div>
                  <Text type="secondary">
                    Минимальный проходной балл: {passingScore}%
                  </Text>
                </Card>
              </Col>
            </Row>
          </div>
        </Card>

        <Collapse defaultActiveKey={['1']}>
          <Panel header="Детальные результаты последнего теста" key="1">
            {detailedResults.length > 0 ? (
              <Table
                columns={columns}
                dataSource={detailedResults}
                pagination={false}
                expandable={{
                  expandedRowRender: (record) => (
                    <Card size="small" title="Объяснение">
                      <Paragraph>{record.explanation}</Paragraph>
                      {!record.isCorrect && (
                        <Alert
                          message="Рекомендация"
                          description="Рекомендуем повторить материал по этой теме"
                          type="warning"
                          showIcon
                        />
                      )}
                    </Card>
                  ),
                  rowExpandable: (record) => true
                }}
              />
            ) : (
              <Alert
                message="Нет данных о результатах"
                description="Пройдите тест, чтобы увидеть результаты"
                type="info"
                showIcon
              />
            )}
          </Panel>

          <Panel header="История прохождения тестов" key="2">
            {testHistory.length > 0 ? (
              <Table
                columns={historyColumns}
                dataSource={testHistory.map((r, i) => ({ ...r, key: i }))}
                pagination={false}
              />
            ) : (
              <Alert
                message="Нет истории прохождения"
                description="Пройдите тест, чтобы начать историю"
                type="info"
                showIcon
              />
            )}
          </Panel>
        </Collapse>
      </Space>
    </div>
  );
});

export default TestResultsPage;