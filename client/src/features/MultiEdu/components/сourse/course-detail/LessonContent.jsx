import React, { useState, useEffect, useRef } from 'react';
import { Card, Alert, Button, Space, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

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
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [selectedLesson?.id, isCompleted]);

  useEffect(() => {
    if (selectedLesson && !isCompleted && hasStarted) {
      startTimeRef.current = Date.now() - timeSpent * 1000;

      timerRef.current = setInterval(() => {
        const secondsSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeSpent(secondsSpent);

        if (secondsSpent % 30 === 0) {
          saveTemporaryTime(secondsSpent);
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [selectedLesson?.id, isCompleted, hasStarted]);

  const saveTemporaryTime = (seconds) => {
    if (!selectedLesson?.id) return;

    const lessonTimeData = {
      lessonId: selectedLesson.id,
      secondsSpent: seconds,
      timestamp: new Date().toISOString(),
      lessonTitle: selectedLesson.title,
      isTemporary: true,
    };

    const savedTimes = JSON.parse(localStorage.getItem('lessonTimes') || '[]')
      .filter(item => item.lessonId !== selectedLesson.id);
    
    savedTimes.push(lessonTimeData);
    localStorage.setItem('lessonTimes', JSON.stringify(savedTimes));
  };

  const handleCompleteLesson = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const minutesSpent = Math.max(1, Math.ceil(timeSpent / 60));

    const lessonTimeData = {
      lessonId: selectedLesson.id,
      minutesSpent: minutesSpent,
      secondsSpent: timeSpent,
      timestamp: new Date().toISOString(),
      lessonTitle: selectedLesson.title,
      isTemporary: false,
      completed: true,
    };

    const savedTimes = JSON.parse(localStorage.getItem('lessonTimes') || '[]')
      .filter(item => item.lessonId !== selectedLesson.id);
    
    savedTimes.push(lessonTimeData);
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

  if (!selectedLesson) {
    return <EmptyLessonPlaceholder />;
  }

  return (
    <div style={{ margin: '0 auto' }}>
      <Card style={styles.card}>
        <LessonHeader 
          title={selectedLesson.title}
          lessonId={selectedLesson.id}
          timeSpent={formatTime(timeSpent)}
          isCompleted={isCompleted}
        />
        
        <LessonContentBody 
          content={selectedLesson.content}
          videoUrl={selectedLesson.video_url}
          presentationUrl={selectedLesson.presentation_url}
        />
      </Card>

      <CompleteLessonButton
        isCompleted={isCompleted}
        onComplete={handleCompleteLesson}
      />
    </div>
  );
};

const EmptyLessonPlaceholder = () => (
  <Card style={styles.emptyCard}>
    <div style={styles.emptyIcon}>📚</div>
    <h2 style={styles.emptyTitle}>Выберите урок для обучения</h2>
    <p style={styles.emptyDescription}>
      Начните с первого урока, чтобы освоить материал курса
    </p>
  </Card>
);

const LessonHeader = ({ title, lessonId, timeSpent, isCompleted }) => (
  <div style={{ marginBottom: '20px' }}>
    <h2 style={styles.lessonTitle}>{title}</h2>
    <div style={styles.lessonMeta}>
      
      <div style={styles.timeSpent}>⏱️ Время изучения: {timeSpent}</div>
      {isCompleted && (
        <div style={styles.completedBadge}>✅ Урок завершен</div>
      )}
    </div>
  </div>
);

const LessonContentBody = ({ content, videoUrl, presentationUrl }) => (
  <div style={styles.contentContainer}>
    {content ? (
      <div 
        dangerouslySetInnerHTML={{ __html: content }}
        style={styles.contentHtml}
      />
    ) : (
      <Alert
        message="Контент урока не загружен"
        description="Содержание урока временно недоступно"
        type="warning"
        showIcon
        size="small"
        style={{ fontSize: '13px' }}
      />
    )}
    <LessonResources videoUrl={videoUrl} presentationUrl={presentationUrl} />
  </div>
);

const LessonResources = ({ videoUrl, presentationUrl }) => {
  if (!videoUrl && !presentationUrl) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {videoUrl && (
          <ResourceAlert type="video" url={videoUrl} label="Смотреть видео" />
        )}
        {presentationUrl && (
          <ResourceAlert 
            type="presentation" 
            url={presentationUrl} 
            label="Открыть презентацию" 
          />
        )}
      </Space>
    </div>
  );
};

const ResourceAlert = ({ type, url, label }) => {
  const typeConfig = {
    video: { message: 'Видеоурок' },
    presentation: { message: 'Презентация' },
  };

  return (
    <Alert
      message={typeConfig[type].message}
      description={
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '13px' }}
        >
          {label}
        </a>
      }
      type="info"
      showIcon
      size="small"
      style={{ fontSize: '13px' }}
    />
  );
};

const CompleteLessonButton = ({ isCompleted, onComplete }) => (
  <div style={styles.completeButtonContainer}>
    <Button
      type={isCompleted ? 'default' : 'primary'}
      size="middle"
      icon={<CheckCircleOutlined />}
      onClick={onComplete}
      disabled={isCompleted}
      style={styles.completeButton}
    >
      {isCompleted ? 'Урок завершен' : 'Завершить урок'}
    </Button>
  </div>
);

const styles = {
  card: {
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '40px 20px',
    maxWidth: '500px',
    margin: '40px auto',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  emptyIcon: {
    fontSize: '48px',
    color: '#1890ff',
    marginBottom: '16px',
    opacity: 0.8,
  },
  emptyTitle: {
    marginBottom: '8px',
    fontSize: '18px',
  },
  emptyDescription: {
    color: '#666',
    fontSize: '14px',
  },
  lessonTitle: {
    marginBottom: '8px',
    fontSize: '18px',
    fontWeight: 600,
  },
  lessonMeta: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  lessonId: {
    color: '#666',
    fontSize: '12px',
  },
  timeSpent: {
    color: '#1890ff',
    fontSize: '12px',
  },
  completedBadge: {
    color: '#52c41a',
    fontSize: '12px',
  },
  contentContainer: {
    maxHeight: 'calc(100vh - 250px)',
    overflowY: 'auto',
    paddingRight: '10px',
  },
  contentHtml: {
    lineHeight: '1.6',
    fontSize: '15px',
    color: '#333',
  },
  completeButtonContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  completeButton: {
    fontSize: '14px',
    height: '40px',
    padding: '0 24px',
    borderRadius: '6px',
    marginBottom: '10px',
  },
};

export default LessonContent;