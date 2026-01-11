import React from 'react';
import { Layout, Tag, Space, Typography } from 'antd';
import { 
  PlayCircleOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

const CourseHeader = ({ selectedLesson, userProgress }) => {
  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 20px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={5} style={{ margin: 0, fontSize: '16px' }}>
          {selectedLesson?.title || 'Выберите урок'}
        </Title>
        
        {selectedLesson?.content_type && (
          <ContentTypeTag contentType={selectedLesson.content_type} />
        )}
      </div>

      {selectedLesson && (
        <Space size="small">
          <LessonTags 
            duration={selectedLesson.duration}
            isCompleted={userProgress?.completedLessons?.includes(selectedLesson.id)}
          />
        </Space>
      )}
    </Header>
  );
};

const ContentTypeTag = ({ contentType }) => {
  const tagConfig = {
    video: { color: 'red', label: 'Видео' },
    interactive: { color: 'green', label: 'Интерактив' },
    default: { color: 'blue', label: 'Текст' }
  };

  const config = tagConfig[contentType] || tagConfig.default;

  return (
    <Tag
      size="small"
      color={config.color}
      style={{ marginLeft: '12px', fontSize: '11px' }}
    >
      {config.label}
    </Tag>
  );
};

const LessonTags = ({ duration, isCompleted }) => (
  <>
    {duration && (
      <Tag 
        size="small" 
        icon={<PlayCircleOutlined style={{ fontSize: '11px' }} />}
        style={{ fontSize: '11px' }}
      >
        {duration}
      </Tag>
    )}
    {isCompleted && (
      <Tag 
        size="small"
        color="green" 
        icon={<CheckCircleOutlined style={{ fontSize: '11px' }} />}
        style={{ fontSize: '11px' }}
      >
        Завершен
      </Tag>
    )}
  </>
);

export default CourseHeader;