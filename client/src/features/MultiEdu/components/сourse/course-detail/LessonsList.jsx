import React from 'react';
import { Menu, Tag, Alert } from 'antd';
import { CheckCircleOutlined, FileTextOutlined } from '@ant-design/icons';

const LessonsList = ({ lessons, userProgress, selectedLesson, onSelectLesson }) => {
  if (lessons.length === 0) {
    return (
      <Alert
        message="Уроки не добавлены"
        description="В этом курсе пока нет уроков"
        type="info"
        showIcon
        size="small"
        style={{ fontSize: '12px' }}
      />
    );
  }

  return (
    <Menu
      mode="inline"
      selectedKeys={selectedLesson ? [selectedLesson.id] : []}
      style={{ borderRight: 0, fontSize: '13px' }}
    >
      {lessons.map((lesson, index) => (
        <Menu.Item
          key={lesson.id}
          icon={
            userProgress?.completedLessons?.includes(lesson.id) ? (
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
            ) : (
              <FileTextOutlined style={{ fontSize: '14px' }} />
            )
          }
          onClick={() => onSelectLesson(lesson)}
          style={{ 
            marginBottom: '6px', 
            padding: '8px 12px',
            borderRadius: '6px'
          }}
        >
          <LessonItem lesson={lesson} index={index} />
        </Menu.Item>
      ))}
    </Menu>
  );
};

const LessonItem = ({ lesson, index }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    width: '100%'
  }}>
    <div style={{ 
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '180px'
    }}>
      <span style={{ fontSize: '13px' }}>
        {index + 1}. {lesson.title}
      </span>
    </div>
    {lesson.duration && (
      <Tag size="small" style={{ fontSize: '10px', padding: '0 4px', margin: 0 }}>
        {lesson.duration}
      </Tag>
    )}
  </div>
);

export default LessonsList;