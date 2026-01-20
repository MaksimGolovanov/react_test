import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Radio,
  Checkbox,
  Input,
  Space,
  Progress,
  Alert,
  Divider,
  Row,
  Col,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const TestComponent = ({ questions, timeLimit = 30, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [timeUp, setTimeUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeUp) {
      handleSubmit();
    }
  }, [timeUp]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    let maxScore = 0;

    questions.forEach((question) => {
      maxScore += question.points || 1;
      const userAnswer = answers[question.id];

      if (!userAnswer) return;

      let isCorrect = false;

      switch (question.question_type) {
        case 'single':
          const correctOption = question.options?.find((opt) => opt.correct);
          isCorrect = correctOption && correctOption.id === userAnswer;
          break;

        case 'multiple':
          const correctOptions = question.options
            ?.filter((opt) => opt.correct)
            .map((opt) => opt.id);
          isCorrect =
            Array.isArray(userAnswer) &&
            userAnswer.length === correctOptions?.length &&
            userAnswer.every((answer) => correctOptions?.includes(answer));
          break;

        case 'text':
          isCorrect =
            question.correct_answer &&
            question.correct_answer.toLowerCase() ===
              userAnswer.toLowerCase().trim();
          break;
      }

      if (isCorrect) {
        score += question.points || 1;
      }
    });

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const score = calculateScore();
      const timeSpent = timeLimit * 60 - timeRemaining;

      if (onComplete) {
        await onComplete(answers, score, timeSpent);
      }
    } catch (error) {
      message.error('Ошибка при отправке теста');
    } finally {
      setSubmitting(false);
    }
  };

  if (questions.length === 0) {
    return <NoQuestionsAlert />;
  }

  const currentQuestionData = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  return (
    <Card>
      <TestHeader
        currentQuestion={currentQuestion}
        questionsLength={questions.length}
        timeRemaining={timeRemaining}
        submitting={submitting}
        progress={progress}
        questionType={currentQuestionData.question_type}
      />

      <QuestionSection
        questionData={currentQuestionData}
        answer={answers[currentQuestionData.id]}
        onAnswerChange={handleAnswerChange}
      />

      <Divider />

      <NavigationButtons
        currentQuestion={currentQuestion}
        questionsLength={questions.length}
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <TimeWarnings timeRemaining={timeRemaining} timeUp={timeUp} />

      <AnswersStats
        answeredCount={answeredCount}
        questionsLength={questions.length}
        progress={progress}
      />
    </Card>
  );
};

const NoQuestionsAlert = () => (
  <Alert
    message="Нет вопросов для теста"
    description="Вопросы для этого теста еще не добавлены."
    type="warning"
    showIcon
  />
);

const TestHeader = ({
  currentQuestion,
  questionsLength,
  timeRemaining,
  submitting,
  progress,
  questionType,
}) => (
  <div style={{ marginBottom: '24px' }}>
    <Row justify="space-between" align="middle">
      <Col>
        <Text strong>
          Вопрос {currentQuestion + 1} из {questionsLength}
          {questionType === 'single' && ' (одиночный выбор)'}
          {questionType === 'multiple' && ' (множественный выбор)'}
          {questionType === 'text' && ' (текстовый ответ)'}
        </Text>
      </Col>
      <Col>
        <Space>
          <ClockCircleOutlined />
          <Text type={timeRemaining < 300 ? 'danger' : 'secondary'}>
            {Math.floor(timeRemaining / 60)}:
            {(timeRemaining % 60).toString().padStart(2, '0')}
          </Text>
          {submitting && <LoadingOutlined />}
        </Space>
      </Col>
    </Row>

    <Progress percent={progress} size="small" style={{ marginTop: '8px' }} />
  </div>
);

const QuestionSection = ({ questionData, answer, onAnswerChange }) => (
  <div style={{ marginBottom: '32px' }}>
    <Title level={4}>{questionData.question_text}</Title>

    {questionData.question_type === 'single' && (
      <SingleChoiceQuestion
        options={questionData.options}
        value={answer}
        onChange={(value) => onAnswerChange(questionData.id, value)}
      />
    )}

    {questionData.question_type === 'multiple' && (
      <MultipleChoiceQuestion
        options={questionData.options}
        value={answer || []}
        onChange={(values) => onAnswerChange(questionData.id, values)}
      />
    )}

    {questionData.question_type === 'text' && (
      <TextAnswerQuestion
        value={answer || ''}
        onChange={(value) => onAnswerChange(questionData.id, value)}
      />
    )}
  </div>
);

const SingleChoiceQuestion = ({ options, value, onChange }) => (
  <Radio.Group
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{ width: '100%' }}
  >
    <Space direction="vertical" style={{ width: '100%' }}>
      {options?.map((option) => (
        <Radio
          key={option.id}
          value={option.id}
          style={{ display: 'block' }}
        >
          {option.text}
        </Radio>
      ))}
    </Space>
  </Radio.Group>
);

const MultipleChoiceQuestion = ({ options, value, onChange }) => (
  <Checkbox.Group value={value} onChange={onChange} style={{ width: '100%' }}>
    <Space direction="vertical" style={{ width: '100%' }}>
      {options?.map((option) => (
        <Checkbox key={option.id} value={option.id}>
          <span style={{ verticalAlign: 'middle' }}>{option.text}</span>
        </Checkbox>
      ))}
    </Space>
  </Checkbox.Group>
);

const TextAnswerQuestion = ({ value, onChange }) => (
  <TextArea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={4}
    placeholder="Введите ваш ответ..."
  />
);

const NavigationButtons = ({
  currentQuestion,
  questionsLength,
  onPrev,
  onNext,
  onSubmit,
  submitting,
}) => (
  <Row justify="space-between">
    <Col>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={onPrev}
        disabled={currentQuestion === 0 || submitting}
      >
        Предыдущий
      </Button>
    </Col>

    <Col>
      <Space>
        {currentQuestion === questionsLength - 1 ? (
          <Button
            type="primary"
            onClick={onSubmit}
            size="large"
            loading={submitting}
            disabled={submitting}
          >
            {submitting ? 'Сохранение...' : 'Завершить тест'}
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={onNext}
            disabled={submitting}
          >
            Следующий вопрос
          </Button>
        )}
      </Space>
    </Col>
  </Row>
);

const TimeWarnings = ({ timeRemaining, timeUp }) => {
  if (timeRemaining < 300 && !timeUp) {
    return (
      <Alert
        message="Внимание: время заканчивается!"
        description="Осталось менее 5 минут. Успейте завершить тест."
        type="warning"
        showIcon
        style={{ marginTop: '16px' }}
      />
    );
  }

  if (timeUp) {
    return (
      <Alert
        message="Время вышло!"
        description="Тест автоматически завершен по истечении времени."
        type="error"
        showIcon
        style={{ marginTop: '16px' }}
      />
    );
  }

  return null;
};

const AnswersStats = ({ answeredCount, questionsLength, progress }) => (
  <div style={styles.statsContainer}>
    <Row justify="space-between">
      <Col>
        <Text type="secondary">
          Отвечено: {answeredCount}/{questionsLength}
        </Text>
      </Col>
      <Col>
        <Text type="secondary">Прогресс: {progress}%</Text>
      </Col>
    </Row>
  </div>
);

const styles = {
  statsContainer: {
    marginTop: '16px',
    padding: '8px',
    background: '#f6f6f6',
    borderRadius: '4px',
  },
};

export default TestComponent;
