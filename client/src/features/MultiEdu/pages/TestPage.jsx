import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Alert,
  Button,
  Result,
  Space,
  Modal,
  Row,
  Col,
  Statistic,
  Tag,
  Spin,
  Empty,
  message,
} from 'antd';
import {
  ClockCircleOutlined,
  ArrowLeftOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import trainingStore from '../store/SecurityTrainingStore';
import CourseService from '../api/CourseService';
import TestComponent from '../components/admin/TestComponent';
import userStore from '../../admin/store/UserStore';

const { Title, Text, Paragraph } = Typography;

const TestPage = observer(() => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const [testCompleted, setTestCompleted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Получаем данные пользователя из store
  const isUserAuthenticated = userStore.isAuthenticated;
  const tabNumber = userStore.tabNumber || '';
  const progress = trainingStore.userProgress[courseId] || {};
  const canTakeTest = trainingStore.canTakeTest(
    courseId,
    course?.lessons?.length || 0
  );
  const isCourseCompleted = progress.completed || false;

  useEffect(() => {
    loadTestData();
  }, [courseId]);

  const loadTestData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Загружаем курс
      const courseData = await CourseService.getCourseById(courseId);
      setCourse(courseData);

      // Загружаем вопросы теста
      const questionsData = await CourseService.getCourseQuestions(courseId);
      setQuestions(questionsData || []);

      if (!questionsData || questionsData.length === 0) {
        setError('Тест для этого курса пока не настроен');
      }
    } catch (error) {
      console.error('Error loading test data:', error);
      setError('Не удалось загрузить данные теста');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && course && !canTakeTest && !isCourseCompleted) {
      Modal.warning({
        title: 'Доступ к тесту ограничен',
        content: 'Для прохождения теста необходимо завершить все уроки курса.',
        onOk: () => navigate(`/security-training/${courseId}`),
        okText: 'Вернуться к урокам',
      });
    }
  }, [loading, course, canTakeTest, isCourseCompleted, navigate, courseId]);

  const submitTestToServer = async (answers, score, timeSpent = 0) => {
    try {
      setSubmitting(true);

      if (!isUserAuthenticated || !tabNumber) {
        console.warn(
          'User not authenticated, test results will be saved locally only'
        );
        return { success: false, message: 'Пользователь не авторизован' };
      }

      const passingScore = course?.passing_score || 70;
      const passed = score >= passingScore;

      console.log('=== SUBMIT TEST TO SERVER ===');
      console.log('User ID (tabNumber):', tabNumber);
      console.log('Course ID:', courseId);
      console.log('Score:', score);
      console.log('Passed:', passed);

      // Формируем данные для отправки
      const testData = {
        answers: answers,
        score: score,
        time_spent: timeSpent,
        passed: passed,
      };

      console.log('Test data to send:', testData);

      // Отправляем результаты теста
      const result = await CourseService.submitTest(
        tabNumber,
        courseId,
        testData
      );

      console.log('Server response:', result);

      if (result && result.success) {
        message.success('Результаты теста успешно сохранены');

        // Пробуем обновить прогресс, но не критично если не получится
        try {
          const progressData = {
            test_score: score,
            passed_test: passed,
            total_time_spent: timeSpent,
          };

          if (passed) {
            progressData.completed_at = new Date().toISOString();
          }

          await CourseService.updateUserProgress(
            tabNumber,
            courseId,
            progressData
          );
          console.log('Progress updated successfully');
        } catch (progressError) {
          console.warn(
            'Warning: Progress update failed, but test was saved:',
            progressError
          );
          // Не показываем ошибку пользователю, так как основной тест сохранен
        }

        return { success: true, data: result };
      } else {
        const errorMsg =
          result?.message || 'Результаты не были сохранены на сервере';
        message.warning(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('Error in submitTestToServer:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Показываем понятное сообщение об ошибке
      if (error.response?.status === 404) {
        message.error(
          'Ошибка подключения к серверу. Результаты сохранены локально.'
        );
      } else if (error.code === 'ERR_NETWORK') {
        message.error('Ошибка сети. Результаты сохранены локально.');
      } else {
        message.error(
          'Не удалось сохранить результаты теста на сервере. Они сохранены локально.'
        );
      }

      return {
        success: false,
        message: error.message || 'Ошибка сети',
        error: error,
      };
    } finally {
      setSubmitting(false);
    }
  };
  const handleTestComplete = async (answers, score, timeSpent = 0) => {
    console.log(
      'Test completed with score:',
      score,
      'Answers:',
      answers,
      'Time:',
      timeSpent
    );

    const passingScore = course?.passing_score || 70;
    const passed = score >= passingScore;

    // Сохраняем результат в локальном store
    trainingStore.submitTest(courseId, answers, score);
    trainingStore.updateTestResult(courseId, {
      score,
      answers,
      time_spent: timeSpent,
      passed: passed,
      completed_at: passed ? new Date().toISOString() : null,
    });

    // Обновляем статистику
    if (isUserAuthenticated && tabNumber) {
      trainingStore.updateStatisticsAfterTest(tabNumber, courseId, {
        score,
        passed,
        time_spent: timeSpent,
      });
    }

    // Отправляем результаты на сервер
    let serverSaved = false;

    if (isUserAuthenticated && tabNumber) {
      const result = await submitTestToServer(answers, score, timeSpent);
      serverSaved = result.success;

      if (!serverSaved) {
        message.info(
          'Результаты сохранены локально. Для синхронизации с сервером проверьте подключение.'
        );
      }
    } else {
      message.info(
        'Результаты сохранены локально. Для сохранения на сервере необходимо авторизоваться.'
      );
    }

    setTestScore(score);
    setTestCompleted(true);
    setShowResults(true);
    setTestSubmitted(serverSaved);
  };

  const handleRetakeTest = () => {
    setTestCompleted(false);
    setTestScore(0);
    setShowResults(false);
    setTestSubmitted(false);
  };

  const handleReturnToCourse = () => {
    navigate(`/security-training/${courseId}`);
  };

  const handleViewResults = () => {
    navigate(`/security-training/results/${courseId}`);
  };

  const getResultType = (score) => {
    const passingScore = course?.passing_score || 70;
    if (score >= passingScore) return 'success';
    if (score >= passingScore - 20) return 'warning';
    return 'error';
  };

  const getResultMessage = (score) => {
    const passingScore = course?.passing_score || 70;
    if (score >= passingScore) {
      return 'Поздравляем! Вы успешно прошли тест!';
    } else if (score >= passingScore - 20) {
      return 'Почти получилось! Попробуйте еще раз после повторения материала.';
    } else {
      return 'Рекомендуем повторить материал курса и попробовать снова.';
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip="Загрузка теста..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Result
          status="error"
          title="Тест не доступен"
          subTitle={error}
          extra={[
            <Button
              key="back"
              onClick={() => navigate(`/security-training/${courseId}`)}
            >
              Вернуться к курсу
            </Button>,
          ]}
        />
      </div>
    );
  }

  if (!course || questions.length === 0) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Empty
          description={
            <div>
              <Title level={4}>Тест не настроен</Title>
              <Text type="secondary">
                Вопросы для тестирования еще не добавлены к этому курсу
              </Text>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button
          type="primary"
          onClick={() => navigate(`/security-training/${courseId}`)}
          style={{ marginTop: '20px' }}
        >
          Вернуться к курсу
        </Button>
      </div>
    );
  }

  if (testCompleted && showResults) {
    const passingScore = course.passing_score || 70;

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
            !isCourseCompleted && (
              <Button
                key="retake"
                onClick={handleRetakeTest}
                icon={<ClockCircleOutlined />}
                loading={submitting}
              >
                Пройти тест заново
              </Button>
            ),
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
            </Button>,
          ].filter(Boolean)}
        />

        <Card style={{ marginTop: '24px' }}>
          <Title level={5}>Статистика теста</Title>
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Statistic
                title="Минимальный балл"
                value={passingScore}
                suffix="%"
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Ваш результат"
                value={testScore}
                suffix="%"
                valueStyle={{
                  color: testScore >= passingScore ? '#3f8600' : '#cf1322',
                }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Статус"
                value={testScore >= passingScore ? 'Сдан' : 'Не сдан'}
                valueStyle={{
                  color: testScore >= passingScore ? '#3f8600' : '#cf1322',
                }}
              />
            </Col>
          </Row>

          {testScore < passingScore && (
            <Alert
              message="Рекомендации"
              description="Для успешной сдачи теста рекомендуется повторить уроки, по которым были допущены ошибки. Обратите особое внимание на вопросы, на которые вы ответили неправильно."
              type="info"
              showIcon
              style={{ marginTop: '24px' }}
            />
          )}

          {testSubmitted && (
            <Alert
              message="Результаты сохранены"
              description={
                testScore >= passingScore
                  ? `Курс "${course.title}" отмечен как пройденный. Результат сохранен в вашем прогрессе.`
                  : `Ваш результат сохранен. Вы можете попробовать пройти тест еще раз.`
              }
              type={testScore >= passingScore ? 'success' : 'info'}
              showIcon
              style={{ marginTop: '24px' }}
            />
          )}

          {!testSubmitted && isUserAuthenticated && (
            <Alert
              message="Внимание"
              description="Результаты теста не были сохранены на сервере. Пройдите тест еще раз для сохранения результатов."
              type="warning"
              showIcon
              style={{ marginTop: '24px' }}
            />
          )}

          {!isUserAuthenticated && (
            <Alert
              message="Авторизация"
              description="Для сохранения результатов теста необходимо авторизоваться в системе."
              type="warning"
              showIcon
              style={{ marginTop: '24px' }}
            />
          )}
        </Card>
      </div>
    );
  }

  const passingScore = course.passing_score || 70;
  const timeLimit = 30; // минут

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button icon={<ArrowLeftOutlined />} onClick={handleReturnToCourse}>
            Вернуться к курсу
          </Button>

          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>
              Тестирование по курсу
            </Title>
            <Text type="secondary">{course.title}</Text>
          </div>

          <Space>
            {isCourseCompleted && (
              <Tag color="green">
                Предыдущий результат: {progress.testScore}%
              </Tag>
            )}
            {!isUserAuthenticated && (
              <Tag color="orange">Результаты не будут сохранены</Tag>
            )}
          </Space>
        </div>

        {!isUserAuthenticated && (
          <Alert
            message="Внимание: вы не авторизованы"
            description="Ваши результаты теста не будут сохранены. Авторизуйтесь для сохранения прогресса."
            type="warning"
            showIcon
          />
        )}

        <Alert
          message="Инструкция по прохождению теста"
          description={
            <Space direction="vertical" size="small">
              <Text>• Время на прохождение теста: {timeLimit} минут</Text>
              <Text>• Минимальный проходной балл: {passingScore}%</Text>
              <Text>• Всего вопросов: {questions.length}</Text>
              <Text>• Внимательно читайте каждый вопрос</Text>
              <Text>• Можно вернуться к предыдущим вопросам</Text>
            </Space>
          }
          type="info"
          showIcon
        />

        {questions.length > 0 ? (
          <TestComponent
            questions={questions}
            timeLimit={30}
            onComplete={handleTestComplete}
          />
        ) : (
          <Alert
            message="Вопросы не загружены"
            description="Тест для этого курса пока не настроен. Обратитесь к администратору."
            type="warning"
            showIcon
          />
        )}

        <Card style={{ marginTop: '16px' }}>
          <Title level={5}>Важно знать:</Title>
          <Paragraph type="secondary">
            <ul>
              <li>Отвечайте на вопросы внимательно и без спешки</li>
              <li>Не переключайтесь между вкладками браузера во время теста</li>
              <li>Убедитесь в стабильном интернет-соединении</li>
              <li>
                После завершения теста вы сможете увидеть подробные результаты
              </li>
              <li>
                При успешной сдаче теста курс будет отмечен как пройденный
              </li>
            </ul>
          </Paragraph>
        </Card>
      </Space>
    </div>
  );
});

export default TestPage;
