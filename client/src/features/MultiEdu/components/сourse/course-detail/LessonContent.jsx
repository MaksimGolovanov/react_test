import React, { useState, useEffect, useRef } from 'react';
import { Card, Alert, Button, Space, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
// Убедитесь, что путь правильный!
import trainingStore from '../../../store/SecurityTrainingStore';

const LessonContent = ({ selectedLesson, userProgress, onCompleteLesson }) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [testResults, setTestResults] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Сохраняем selectedLesson в глобальную область для отладки
  useEffect(() => {
    if (selectedLesson) {
      window.selectedLesson = selectedLesson;
    }
  }, [selectedLesson]);

  const isCompleted = userProgress?.completedLessons?.includes(
    selectedLesson?.id
  );

  // Запускаем таймер при загрузке урока
  useEffect(() => {
    console.log('🎯 LessonContent mounted:', {
      selectedLessonId: selectedLesson?.id,
      isCompleted,
      userProgress: userProgress?.completedLessons,
    });

    if (selectedLesson && !isCompleted) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const secondsSpent = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        setTimeSpent(secondsSpent);
      }, 1000);

      console.log('⏱️ Таймер запущен для урока:', selectedLesson.id);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        console.log('⏱️ Таймер остановлен');
      }
    };
  }, [selectedLesson, isCompleted]);

  const handleCompleteLesson = () => {
    console.log('🔄 Нажата кнопка "Завершить урок"');
    console.log('Данные:', {
      lessonId: selectedLesson?.id,
      timeSpent,
      isCompleted,
      userProgress,
    });

    // Останавливаем таймер
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Вычисляем время в минутах (округляем до 1 минуты минимум)
    const minutesSpent = Math.max(1, Math.floor(timeSpent / 60));
    console.log('⏱️ Фактическое время изучения:', {
      секунды: timeSpent,
      минуты: minutesSpent,
      форматированное: `${Math.floor(timeSpent / 60)}:${(timeSpent % 60)
        .toString()
        .padStart(2, '0')}`,
    });

    // Вызываем колбэк с временем
    if (selectedLesson?.id && onCompleteLesson) {
      console.log('📤 Вызываем onCompleteLesson с данными:', {
        lessonId: selectedLesson.id,
        minutesSpent: minutesSpent,
        timestamp: new Date().toISOString(),
      });

      const lessonTimeData = {
        lessonId: selectedLesson.id,
        minutesSpent: minutesSpent,
        timestamp: new Date().toISOString(),
        lessonTitle: selectedLesson.title,
      };

      const savedTimes = JSON.parse(
        localStorage.getItem('lessonTimes') || '[]'
      );
      savedTimes.push(lessonTimeData);
      localStorage.setItem('lessonTimes', JSON.stringify(savedTimes));

      onCompleteLesson(selectedLesson.id, minutesSpent);
      message.info(`Время изучения: ${minutesSpent} минут`);
    } else {
      console.error('❌ Ошибка: нет lessonId или onCompleteLesson');
      message.error('Ошибка: не удалось завершить урок');
    }

    // Сбрасываем время
    setTimeSpent(0);
  };

  // Если урок не выбран
  if (!selectedLesson) {
    return (
      <Card
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          maxWidth: '500px',
          margin: '40px auto',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            color: '#1890ff',
            marginBottom: '16px',
            opacity: 0.8,
          }}
        >
          📚
        </div>
        <h2 style={{ marginBottom: '8px', fontSize: '18px' }}>
          Выберите урок для обучения
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Начните с первого урока, чтобы освоить материал курса
        </p>
      </Card>
    );
  }

  return (
    <div style={{ margin: '0 auto' }}>
      <Card
        style={{
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <h2
            style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 600 }}
          >
            {selectedLesson.title}
          </h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ color: '#666', fontSize: '12px' }}>
              ID урока: <strong>{selectedLesson.id}</strong>
            </div>
            {!isCompleted && (
              <div style={{ color: '#1890ff', fontSize: '12px' }}>
                ⏱️ Время изучения: {Math.floor(timeSpent / 60)}:
                {(timeSpent % 60).toString().padStart(2, '0')}
              </div>
            )}
            {isCompleted && (
              <div style={{ color: '#52c41a', fontSize: '12px' }}>
                ✅ Урок завершен
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            maxHeight: 'calc(100vh - 330px)',
            overflowY: 'auto',
            paddingRight: '10px',
          }}
        >
          {selectedLesson.content ? (
            <div
              dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
              style={{
                lineHeight: '1.6',
                fontSize: '15px',
                color: '#333',
              }}
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

          <LessonResources
            videoUrl={selectedLesson.video_url}
            presentationUrl={selectedLesson.presentation_url}
          />
        </div>
      </Card>

      <CompleteLessonButton
        isCompleted={isCompleted}
        onComplete={handleCompleteLesson}
        userProgress={userProgress}
        timeSpent={timeSpent}
      />

      {/* Отображение результатов теста */}
      {testResults && (
        <Card style={{ marginTop: '20px' }}>
          <h3>Результаты теста сохранения:</h3>
          <pre style={{ fontSize: '12px' }}>
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};

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
  const config = {
    video: { message: 'Видеоурок' },
    presentation: { message: 'Презентация' },
  };

  return (
    <Alert
      message={config[type].message}
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

const CompleteLessonButton = ({
  isCompleted,
  onComplete,
  userProgress,
  timeSpent,
}) => {
  const [testResults, setTestResults] = useState(null);

  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <Button
        type={isCompleted ? 'default' : 'primary'}
        size="middle"
        icon={<CheckCircleOutlined />}
        onClick={onComplete}
        disabled={isCompleted}
        style={{
          fontSize: '14px',
          height: '40px',
          padding: '0 24px',
          borderRadius: '6px',
          marginBottom: '10px',
        }}
      >
        {isCompleted ? 'Урок завершен' : 'Завершить урок'}
      </Button>
    </div>
  );
};

export default LessonContent;
