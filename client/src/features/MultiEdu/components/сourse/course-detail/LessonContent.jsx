import React, { useState, useEffect, useRef } from 'react';
import { Card, Alert, Button, Space, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import './LessonContent.css';

const LessonContent = ({ selectedLesson, userProgress, onCompleteLesson }) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const getSavedTimeForLesson = () => {
    if (!selectedLesson?.id) return 0;
    const savedTimes = JSON.parse(localStorage.getItem('lessonTimes') || '[]');
    const lessonTime = savedTimes.find(item => item.lessonId === selectedLesson.id);
    if (userProgress?.lessonTimeSpent) {
      const progressTime = userProgress.lessonTimeSpent[selectedLesson.id];
      if (progressTime) return progressTime * 60;
    }
    return lessonTime?.secondsSpent || 0;
  };

  const isCompleted = userProgress?.completedLessons?.includes(selectedLesson?.id);

  useEffect(() => {
    if (selectedLesson && !isCompleted) {
      const savedSeconds = getSavedTimeForLesson();
      setTimeSpent(savedSeconds);
      if (savedSeconds === 0) {
        startTimeRef.current = Date.now();
        setHasStarted(true);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedLesson?.id, isCompleted]);

  useEffect(() => {
    if (selectedLesson && !isCompleted && hasStarted) {
      startTimeRef.current = Date.now() - timeSpent * 1000;
      timerRef.current = setInterval(() => {
        const secondsSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeSpent(secondsSpent);
        if (secondsSpent % 30 === 0) saveTemporaryTime(secondsSpent);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedLesson?.id, isCompleted, hasStarted]);

  const saveTemporaryTime = (seconds) => {
    if (!selectedLesson?.id) return;
    const savedTimes = JSON.parse(localStorage.getItem('lessonTimes') || '[]')
      .filter(item => item.lessonId !== selectedLesson.id);
    savedTimes.push({
      lessonId: selectedLesson.id,
      secondsSpent: seconds,
      timestamp: new Date().toISOString(),
      lessonTitle: selectedLesson.title,
      isTemporary: true,
    });
    localStorage.setItem('lessonTimes', JSON.stringify(savedTimes));
  };

  const handleCompleteLesson = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const minutesSpent = Math.max(1, Math.ceil(timeSpent / 60));
    const savedTimes = JSON.parse(localStorage.getItem('lessonTimes') || '[]')
      .filter(item => item.lessonId !== selectedLesson.id);
    savedTimes.push({
      lessonId: selectedLesson.id,
      minutesSpent: minutesSpent,
      secondsSpent: timeSpent,
      timestamp: new Date().toISOString(),
      lessonTitle: selectedLesson.title,
      isTemporary: false,
      completed: true,
    });
    localStorage.setItem('lessonTimes', JSON.stringify(savedTimes));
    if (onCompleteLesson) {
      onCompleteLesson(selectedLesson.id, minutesSpent);
      message.success(`Урок завершен! Время изучения: ${formatTime(timeSpent)}`);
    }
    setHasStarted(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!selectedLesson) return <EmptyLessonPlaceholder />;

  return (
    <div className="lesson-content-container">
      <Card className="lesson-card">
        <div className="lesson-header">
          <h2 className="lesson-title">{selectedLesson.title}</h2>
          <div className="lesson-meta">
            <div className="time-spent">⏱️ Время изучения: {formatTime(timeSpent)}</div>
            {isCompleted && <div className="completed-badge">✅ Урок завершен</div>}
          </div>
        </div>
        <div className="lesson-body">
          {selectedLesson.content ? (
            <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} className="lesson-html" />
          ) : (
            <Alert message="Контент урока не загружен" description="Содержание урока временно недоступно" type="warning" showIcon size="small" />
          )}
          <LessonResources videoUrl={selectedLesson.video_url} presentationUrl={selectedLesson.presentation_url} />
        </div>
      </Card>
      <div className="complete-button-wrapper">
        <Button
          type={isCompleted ? 'default' : 'primary'}
          size="middle"
          icon={<CheckCircleOutlined />}
          onClick={handleCompleteLesson}
          disabled={isCompleted}
          className="complete-lesson-btn"
        >
          {isCompleted ? 'Урок завершен' : 'Завершить урок'}
        </Button>
      </div>
    </div>
  );
};

const EmptyLessonPlaceholder = () => (
  <Card className="empty-lesson-card">
    <div className="empty-icon">📚</div>
    <h2 className="empty-title">Выберите урок для обучения</h2>
    <p className="empty-description">Начните с первого урока, чтобы освоить материал курса</p>
  </Card>
);

const LessonResources = ({ videoUrl, presentationUrl }) => {
  if (!videoUrl && !presentationUrl) return null;
  return (
    <div className="lesson-resources">
      <Space direction="vertical" style={{ width: '100%' }}>
        {videoUrl && (
          <Alert
            message="Видеоурок"
            description={<a href={videoUrl} target="_blank" rel="noopener noreferrer">Смотреть видео</a>}
            type="info"
            showIcon
            size="small"
          />
        )}
        {presentationUrl && (
          <Alert
            message="Презентация"
            description={<a href={presentationUrl} target="_blank" rel="noopener noreferrer">Открыть презентацию</a>}
            type="info"
            showIcon
            size="small"
          />
        )}
      </Space>
    </div>
  );
};

export default LessonContent;