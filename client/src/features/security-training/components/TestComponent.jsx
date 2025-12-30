// src/features/security-training/components/TestComponent.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Radio, 
  Checkbox, 
  Typography, 
  Progress, 
  Alert,
  Space,
  Divider 
} from 'antd';
import { observer } from 'mobx-react-lite';
import trainingStore from '../store/SecurityTrainingStore';

const { Title, Text } = Typography;

const TestComponent = observer(({ test, courseId, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 30); // 30 минут
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    
    test.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const correctOptions = question.options
        .filter(opt => opt.correct)
        .map(opt => opt.id);

      if (question.type === 'single') {
        if (userAnswer && correctOptions.includes(userAnswer)) {
          correctAnswers++;
        }
      } else if (question.type === 'multiple') {
        if (
          Array.isArray(userAnswer) &&
          userAnswer.length === correctOptions.length &&
          userAnswer.every(ans => correctOptions.includes(ans))
        ) {
          correctAnswers++;
        }
      }
    });

    return Math.round((correctAnswers / test.questions.length) * 100);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const score = calculateScore();
    
    setTimeout(() => {
      trainingStore.submitTest(courseId, answers, score);
      onComplete(score);
      setIsSubmitting(false);
    }, 1000);
  };

  const currentQ = test.questions[currentQuestion];

  return (
    <Card>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '24px' 
      }}>
        <Title level={4}>{test.title}</Title>
        <Alert 
          message={`Осталось времени: ${formatTime(timeLeft)}`} 
          type="warning" 
        />
      </div>

      <Progress
        percent={Math.round(((currentQuestion + 1) / test.questions.length) * 100)}
        size="small"
        style={{ marginBottom: '24px' }}
      />

      <Card>
        <Title level={5}>
          Вопрос {currentQuestion + 1} из {test.questions.length}
        </Title>
        <Text>{currentQ.question}</Text>

        <Divider />

        {currentQ.type === 'single' ? (
          <Radio.Group
            value={answers[currentQ.id]}
            onChange={e => handleAnswer(currentQ.id, e.target.value)}
          >
            <Space direction="vertical">
              {currentQ.options.map(option => (
                <Radio key={option.id} value={option.id}>
                  {option.text}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        ) : (
          <Checkbox.Group
            value={answers[currentQ.id] || []}
            onChange={values => handleAnswer(currentQ.id, values)}
          >
            <Space direction="vertical">
              {currentQ.options.map(option => (
                <Checkbox key={option.id} value={option.id}>
                  {option.text}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        )}
      </Card>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '24px' 
      }}>
        <Button 
          onClick={handlePrev} 
          disabled={currentQuestion === 0}
        >
          Назад
        </Button>

        <Space>
          {currentQuestion === test.questions.length - 1 ? (
            <Button 
              type="primary" 
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              Завершить тест
            </Button>
          ) : (
            <Button type="primary" onClick={handleNext}>
              Следующий вопрос
            </Button>
          )}
        </Space>
      </div>
    </Card>
  );
});

export default TestComponent;