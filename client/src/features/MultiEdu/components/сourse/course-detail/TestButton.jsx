import React from 'react';
import { Button, Modal, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import './TestButton.css';

const { Text } = Typography;

const TestButton = ({ courseId, lessons, userProgress, isCourseCompleted }) => {
  const navigate = useNavigate();
  const completedLessonsCount = userProgress?.completedLessons?.length || 0;
  const totalLessons = lessons.length || 0;
  const canTakeTest = completedLessonsCount === totalLessons;

  const handleStartTest = () => {
    if (canTakeTest || isCourseCompleted) {
      navigate(`/multiedu/test/${courseId}`); // путь соответствует роутингу в App
    } else {
      Modal.warning({
        title: 'Доступ к тесту ограничен',
        content: 'Для прохождения теста необходимо завершить все уроки курса.',
        okText: 'Понятно',
      });
    }
  };

  return (
    <div className="test-button-wrapper">
      <Button
        type={isCourseCompleted ? "default" : "primary"}
        block
        size="middle"
        onClick={handleStartTest}
        disabled={!canTakeTest && !isCourseCompleted}
        className="test-button"
      >
        {isCourseCompleted ? 'Повторить тест' : 'Пройти тест'}
      </Button>
      {!canTakeTest && !isCourseCompleted && (
        <Text type="secondary" className="test-hint">
          Завершите все уроки для доступа к тесту
        </Text>
      )}
    </div>
  );
};

export default TestButton;