// TestComponent.jsx
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
  message
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const TestComponent = ({ 
  questions, 
  timeLimit = 30,
  onComplete
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [timeUp, setTimeUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
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
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
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
    
    questions.forEach(question => {
      maxScore += question.points || 1;
      const userAnswer = answers[question.id];
      
      if (!userAnswer) return;
      
      let isCorrect = false;
      
      switch (question.question_type) {
        case 'single':
          const correctOption = question.options?.find(opt => opt.correct);
          isCorrect = correctOption && correctOption.id === userAnswer;
          break;
          
        case 'multiple':
          const correctOptions = question.options?.filter(opt => opt.correct).map(opt => opt.id);
          isCorrect = Array.isArray(userAnswer) && 
                     userAnswer.length === correctOptions?.length &&
                     userAnswer.every(answer => correctOptions?.includes(answer));
          break;
          
        case 'text':
          isCorrect = question.correct_answer && 
                     question.correct_answer.toLowerCase() === userAnswer.toLowerCase().trim();
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
      
      // Рассчитываем баллы
      const score = calculateScore();
      const timeSpent = timeLimit * 60 - timeRemaining;
      
      console.log('Test completed:', {
        score,
        timeSpent,
        answers
      });
      
      // Вызываем callback родительского компонента
      if (onComplete) {
        onComplete(answers, score, timeSpent);
      }
      
    } catch (error) {
      console.error('Error submitting test:', error);
      message.error('Ошибка при отправке теста');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  if (questions.length === 0) {
    return (
      <Alert
        message="Нет вопросов для теста"
        description="Вопросы для этого теста еще не добавлены."
        type="warning"
        showIcon
      />
    );
  }

  return (
    <Card>
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Text strong>
              Вопрос {currentQuestion + 1} из {questions.length}
            </Text>
          </Col>
          <Col>
            <Space>
              <ClockCircleOutlined />
              <Text type={timeRemaining < 300 ? 'danger' : 'secondary'}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </Text>
              {submitting && <LoadingOutlined />}
            </Space>
          </Col>
        </Row>
        
        <Progress 
          percent={progress} 
          size="small" 
          style={{ marginTop: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <Title level={4}>
          {currentQuestionData.question_text}
        </Title>
        
        {currentQuestionData.question_type === 'single' && (
          <Radio.Group
            value={answers[currentQuestionData.id]}
            onChange={e => handleAnswerChange(currentQuestionData.id, e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {currentQuestionData.options?.map(option => (
                <Radio 
                  key={option.id} 
                  value={option.id} 
                  style={{ display: 'block', marginBottom: '8px' }}
                >
                  {option.text}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}
        
        {currentQuestionData.question_type === 'multiple' && (
          <Checkbox.Group
            value={answers[currentQuestionData.id] || []}
            onChange={values => handleAnswerChange(currentQuestionData.id, values)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {currentQuestionData.options?.map(option => (
                <Checkbox 
                  key={option.id} 
                  value={option.id} 
                  style={{ display: 'block', marginBottom: '8px' }}
                >
                  {option.text}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        )}
        
        {currentQuestionData.question_type === 'text' && (
          <TextArea
            value={answers[currentQuestionData.id] || ''}
            onChange={e => handleAnswerChange(currentQuestionData.id, e.target.value)}
            rows={4}
            placeholder="Введите ваш ответ..."
          />
        )}
      </div>

      <Divider />

      <Row justify="space-between">
        <Col>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handlePrev}
            disabled={currentQuestion === 0 || submitting}
          >
            Предыдущий
          </Button>
        </Col>
        
        <Col>
          <Space>
            {currentQuestion === questions.length - 1 ? (
              <Button
                type="primary"
                onClick={handleSubmit}
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
                onClick={handleNext}
                disabled={submitting}
              >
                Следующий вопрос
              </Button>
            )}
          </Space>
        </Col>
      </Row>
      
      {timeRemaining < 300 && !timeUp && (
        <Alert
          message="Внимание: время заканчивается!"
          description={`Осталось менее 5 минут. Успейте завершить тест.`}
          type="warning"
          showIcon
          style={{ marginTop: '16px' }}
        />
      )}
      
      {timeUp && (
        <Alert
          message="Время вышло!"
          description="Тест автоматически завершен по истечении времени."
          type="error"
          showIcon
          style={{ marginTop: '16px' }}
        />
      )}
      
      {/* Статистика ответов */}
      <div style={{ marginTop: '16px', padding: '8px', background: '#f6f6f6', borderRadius: '4px' }}>
        <Row justify="space-between">
          <Col>
            <Text type="secondary">Отвечено: {answeredCount}/{questions.length}</Text>
          </Col>
          <Col>
            <Text type="secondary">
              Прогресс: {progress}%
            </Text>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default TestComponent;