// src/features/security-training/components/LessonViewer.jsx
import React, { useRef } from 'react';
import { Card, Typography, Button, Space, Alert } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const LessonViewer = ({ lesson, onComplete }) => {
  const videoRef = useRef(null);

  return (
    <Card>
      <div style={{ marginBottom: '24px' }}>
        {lesson.videoUrl ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: '16px' }}>
            <iframe
              src={lesson.videoUrl}
              title={lesson.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <Alert
            message="Видео материал отсутствует"
            description="Для этого урока видео материал пока не добавлен"
            type="info"
            showIcon
            icon={<PlayCircleOutlined />}
            style={{ marginBottom: '16px' }}
          />
        )}
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: lesson.content }}
        style={{
          fontSize: '16px',
          lineHeight: '1.6'
        }}
      />

      {lesson.additionalResources && (
        <div style={{ marginTop: '32px' }}>
          <Title level={5}>Дополнительные материалы</Title>
          <ul>
            {lesson.additionalResources.map((resource, index) => (
              <li key={index}>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: '32px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
        <Space>
          <Paragraph type="secondary">
            После изучения материала нажмите "Завершить урок"
          </Paragraph>
        </Space>
      </div>
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Button
          type="primary"
          size="large"
          onClick={onComplete}
        >
          Завершить урок
        </Button>
      </div>
    </Card>
  );
};

export default LessonViewer;