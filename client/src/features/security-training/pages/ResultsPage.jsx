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
  Modal
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  BarChartOutlined,
  DownloadOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import trainingStore from '../store/SecurityTrainingStore';
import { courses } from '../data/coursesData';
import CertificateModal from '../components/CertificateModal';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const ResultsPage = observer(() => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [showCertificate, setShowCertificate] = useState(false);
  const [detailedResults, setDetailedResults] = useState([]);

  const course = courses.find(c => c.id === courseId);
  const test = course?.test;
  const progress = trainingStore.userProgress[courseId];
  const testHistory = trainingStore.testResults.filter(r => r.courseId === courseId);

  useEffect(() => {
    if (!course || !progress?.completed) {
      navigate(`/security-training/course/${courseId}`);
      return;
    }

    // Формируем детальные результаты
    if (testHistory.length > 0) {
      const latestTest = testHistory[testHistory.length - 1];
      const detailed = test.questions.map((question, index) => {
        const userAnswer = latestTest.answers[question.id];
        const isCorrect = checkAnswer(question, userAnswer);
        
        return {
          key: index,
          question: question.question,
          type: question.type === 'single' ? 'Один ответ' : 'Несколько ответов',
          yourAnswer: formatAnswer(question, userAnswer),
          correctAnswer: formatCorrectAnswer(question),
          isCorrect: isCorrect,
          explanation: getExplanation(question)
        };
      });
      
      setDetailedResults(detailed);
    }
  }, [course, progress, testHistory, navigate, courseId]);

  const checkAnswer = (question, userAnswer) => {
    const correctOptions = question.options.filter(opt => opt.correct).map(opt => opt.id);
    
    if (question.type === 'single') {
      return correctOptions.includes(userAnswer);
    } else {
      if (!Array.isArray(userAnswer)) return false;
      return userAnswer.length === correctOptions.length && 
             userAnswer.every(ans => correctOptions.includes(ans));
    }
  };

  const formatAnswer = (question, userAnswer) => {
    if (!userAnswer) return 'Нет ответа';
    
    if (question.type === 'single') {
      const option = question.options.find(opt => opt.id === userAnswer);
      return option ? option.text : 'Неизвестный ответ';
    } else {
      return question.options
        .filter(opt => userAnswer.includes(opt.id))
        .map(opt => opt.text)
        .join(', ');
    }
  };

  const formatCorrectAnswer = (question) => {
    return question.options
      .filter(opt => opt.correct)
      .map(opt => opt.text)
      .join(', ');
  };

  const getExplanation = (question) => {
    // В реальном приложении здесь может быть объяснение из базы данных
    return question.explanation || 'Объяснение к вопросу будет добавлено в следующем обновлении.';
  };

  if (!course || !progress?.completed) {
    return null;
  }

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
        <Tag color={score >= test.passingScore ? 'green' : 'red'}>
          {score}%
        </Tag>
      )
    },
    {
      title: 'Статус',
      key: 'status',
      render: (_, record) => (
        record.score >= test.passingScore ? 'Сдан' : 'Не сдан'
      )
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record, index) => (
        <Button
          type="link"
          onClick={() => {
            // Показать результаты конкретной попытки
            Modal.info({
              title: `Результат от ${new Date(record.date).toLocaleDateString()}`,
              content: `Счет: ${record.score}% (${record.score >= test.passingScore ? 'Сдан' : 'Не сдан'})`,
              width: 600
            });
          }}
        >
          Подробнее
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/security-training/course/${courseId}`)}
          >
            Вернуться к курсу
          </Button>
          
          <Title level={3} style={{ margin: 0, textAlign: 'center' }}>
            Результаты тестирования
          </Title>
          
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => window.print()}
            >
              Печать
            </Button>
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={() => setShowCertificate(true)}
            >
              Сертификат
            </Button>
          </Space>
        </div>

        <Card>
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Statistic
                title="Курс"
                value={course.title}
                prefix={<BarChartOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Лучший результат"
                value={Math.max(...testHistory.map(r => r.score), 0)}
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
                    <Text strong>{progress.testScore}%</Text>
                  </div>
                  <Progress percent={progress.testScore} status="active" />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>Текущий статус</Text>
                    <Tag color={progress.testScore >= test.passingScore ? 'green' : 'red'}>
                      {progress.testScore >= test.passingScore ? 'Сдан' : 'Не сдан'}
                    </Tag>
                  </div>
                  <Text type="secondary">
                    Минимальный проходной балл: {test.passingScore}%
                  </Text>
                </Card>
              </Col>
            </Row>
          </div>
        </Card>

        <Collapse defaultActiveKey={['1', '2']}>
          <Panel header="Детальные результаты последнего теста" key="1">
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
          </Panel>

          <Panel header="История прохождения тестов" key="2">
            <Table
              columns={historyColumns}
              dataSource={testHistory.map((r, i) => ({ ...r, key: i }))}
              pagination={false}
            />
            
            {testHistory.length > 1 && (
              <div style={{ marginTop: '24px' }}>
                <Title level={5}>Динамика результатов</Title>
                <Timeline>
                  {testHistory.map((attempt, index) => (
                    <Timeline.Item
                      key={index}
                      color={attempt.score >= test.passingScore ? 'green' : 'red'}
                    >
                      <Text strong>
                        {new Date(attempt.date).toLocaleDateString('ru-RU')} - {attempt.score}%
                      </Text>
                      <div>
                        <Text type="secondary">
                          Попытка {index + 1}
                        </Text>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            )}
          </Panel>
        </Collapse>

        <Card style={{ marginTop: '24px' }}>
          <Title level={5}>Анализ результатов</Title>
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Alert
                message="Сильные стороны"
                description="Вы хорошо усвоили основы информационной безопасности и парольную политику."
                type="success"
                showIcon
              />
            </Col>
            <Col span={12}>
              <Alert
                message="Что можно улучшить"
                description="Обратите внимание на вопросы о социальной инженерии и защите от фишинга."
                type="warning"
                showIcon
              />
            </Col>
          </Row>
          
          <div style={{ marginTop: '24px' }}>
            <Button
              type="primary"
              onClick={() => navigate(`/security-training/test/${courseId}`)}
              size="large"
              block
            >
              Пройти тест еще раз
            </Button>
          </div>
        </Card>
      </Space>

      <CertificateModal
        visible={showCertificate}
        onClose={() => setShowCertificate(false)}
        course={course}
        score={progress.testScore}
      />
    </div>
  );
});

export default ResultsPage;