import React from 'react';
import { Button, Modal, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const TestButton = ({ courseId, lessons, userProgress, isCourseCompleted }) => {
  const navigate = useNavigate();
  
  const completedLessonsCount = userProgress?.completedLessons?.length || 0;
  const totalLessons = lessons.length || 0;
  const canTakeTest = completedLessonsCount === totalLessons;

  const handleStartTest = () => {
    if (canTakeTest || isCourseCompleted) {
      navigate(`test/${courseId}`);
    } else {
      Modal.warning({
        title: 'Доступ к тесту ограничен',
        content: 'Для прохождения теста необходимо завершить все уроки курса.',
        okText: 'Понятно',
      });
    }
  };

  return (
    <div style={{ marginTop: '16px', padding: '0 4px' }}>
      <Button
        type={isCourseCompleted ? "default" : "primary"}
        block
        size="middle"
        onClick={handleStartTest}
        disabled={!canTakeTest && !isCourseCompleted}
        style={{
          fontSize: '14px',
          height: '36px',
          borderRadius: '6px',
        }}
      >
        {isCourseCompleted ? 'Повторить тест' : 'Пройти тест'}
      </Button>

      {!canTakeTest && !isCourseCompleted && (
        <Text 
          type="secondary" 
          style={{ 
            display: 'block', 
            marginTop: '6px', 
            fontSize: '11px',
            textAlign: 'center'
          }}
        >
          Завершите все уроки для доступа к тесту
        </Text>
      )}
    </div>
  );
};

export default TestButton;