import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Alert,
  Button,
  Result,
  Space,
  Modal,
  Progress,
  Row,
  Col,
  Statistic,
  Tag
} from 'antd';
import {
  ClockCircleOutlined,
  ArrowLeftOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import trainingStore from '../store/SecurityTrainingStore';
import { courses } from '../data/coursesData';
import TestComponent from '../components/TestComponent';

const { Title, Text, Paragraph } = Typography;
const { Countdown } = Statistic;

const TestPage = observer(() => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [testCompleted, setTestCompleted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const course = courses.find(c => c.id === courseId);
  const test = course?.test;
  const progress = trainingStore.userProgress[courseId];
  const canTakeTest = trainingStore.canTakeTest(courseId, course?.lessons?.length || 0);
  const isCourseCompleted = progress?.completed || false;

  useEffect(() => {
    if (!course) {
      navigate('/security-training');
      return;
    }

    if (!canTakeTest && !isCourseCompleted) {
      Modal.warning({
        title: 'Доступ к тесту ограничен',
        content: 'Для прохождения теста необходимо завершить все уроки курса.',
        onOk: () => navigate(`/security-training/course/${courseId}`),
        okText: 'Вернуться к урокам'
      });
    }
  }, [course, canTakeTest, isCourseCompleted, navigate, courseId]);

  if (!course || !test) {
    return null;
  }

  const handleTestComplete = (score) => {
    setTestScore(score);
    setTestCompleted(true);
    setShowResults(true);
  };

  const handleRetakeTest = () => {
    setTestCompleted(false);
    setTestScore(0);
    setShowResults(false);
  };

  const handleReturnToCourse = () => {
    navigate(`/security-training/course/${courseId}`);
  };

  const handleViewResults = () => {
    navigate(`/security-training/results/${courseId}`);
  };

  const getResultType = (score) => {
    if (score >= test.passingScore) return 'success';
    if (score >= test.passingScore - 20) return 'warning';
    return 'error';
  };

  const getResultMessage = (score) => {
    if (score >= test.passingScore) {
      return 'Поздравляем! Вы успешно прошли тест!';
    } else if (score >= test.passingScore - 20) {
      return 'Почти получилось! Попробуйте еще раз после повторения материала.';
    } else {
      return 'Рекомендуем повторить материал курса и попробовать снова.';
    }
  };

  if (testCompleted && showResults) {
    return (
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleReturnToCourse}
          style={{ marginBottom: '24px' }}
        >
          Вернуться к курсу
        </Button>

        <Result
          status={getResultType(testScore)}
          title={`Результат теста: ${testScore}%`}
          subTitle={getResultMessage(testScore)}
          extra={[
            <Button
              key="retake"
              onClick={handleRetakeTest}
              icon={<ClockCircleOutlined />}
            >
              Пройти тест заново
            </Button>,
            <Button
              key="results"
              type="primary"
              onClick={handleViewResults}
              icon={<SafetyOutlined />}
            >
              Подробные результаты
            </Button>,
            <Button
              key="courses"
              onClick={() => navigate('/security-training')}
            >
              К списку курсов
            </Button>
          ]}
        />

        <Card style={{ marginTop: '24px' }}>
          <Title level={5}>Статистика теста</Title>
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Statistic
                title="Минимальный балл"
                value={test.passingScore}
                suffix="%"
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Ваш результат"
                value={testScore}
                suffix="%"
                valueStyle={{
                  color: testScore >= test.passingScore ? '#3f8600' : '#cf1322'
                }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Статус"
                value={testScore >= test.passingScore ? 'Сдан' : 'Не сдан'}
                valueStyle={{
                  color: testScore >= test.passingScore ? '#3f8600' : '#cf1322'
                }}
              />
            </Col>
          </Row>

          {testScore < test.passingScore && (
            <Alert
              message="Рекомендации"
              description="Для успешной сдачи теста рекомендуется повторить уроки, по которым были допущены ошибки. Обратите особое внимание на вопросы, на которые вы ответили неправильно."
              type="info"
              showIcon
              style={{ marginTop: '24px' }}
            />
          )}
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleReturnToCourse}
          >
            Вернуться к курсу
          </Button>
          
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>{test.title}</Title>
            <Text type="secondary">
              Курс: {course.title}
            </Text>
          </div>
          
          <Space>
            {isCourseCompleted && (
              <Tag color="green">
                Предыдущий результат: {progress.testScore}%
              </Tag>
            )}
          </Space>
        </div>

        <Alert
          message="Инструкция по прохождению теста"
          description={
            <Space direction="vertical" size="small">
              <Text>• Время на прохождение теста: 30 минут</Text>
              <Text>• Минимальный проходной балл: {test.passingScore}%</Text>
              <Text>• Всего вопросов: {test.questions.length}</Text>
              <Text>• Можно вернуться к предыдущим вопросам</Text>
              <Text>• Тест завершится автоматически по истечении времени</Text>
            </Space>
          }
          type="info"
          showIcon
        />

        <TestComponent
          test={test}
          courseId={courseId}
          onComplete={handleTestComplete}
        />

        <Card style={{ marginTop: '16px' }}>
          <Title level={5}>Важно знать:</Title>
          <Paragraph type="secondary">
            <ul>
              <li>Не переключайтесь между вкладками браузера во время теста</li>
              <li>Убедитесь в стабильном интернет-соединении</li>
              <li>После завершения теста вы сможете увидеть подробные результаты</li>
              <li>При успешной сдаче теста курс будет отмечен как пройденный</li>
            </ul>
          </Paragraph>
        </Card>
      </Space>
    </div>
  );
});

export default TestPage;