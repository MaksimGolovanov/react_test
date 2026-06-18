import React from 'react';
import { Menu, Tag, Alert } from 'antd';
import { CheckCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import './LessonsList.css';

const LessonsList = ({ lessons, userProgress, selectedLesson, onSelectLesson }) => {
  if (lessons.length === 0) {
    return (
      <Alert
        message="Уроки не добавлены"
        description="В этом курсе пока нет уроков"
        type="info"
        showIcon
        size="small"
      />
    );
  }

  return (
    <Menu
      mode="inline"
      selectedKeys={selectedLesson ? [selectedLesson.id] : []}
      className="lessons-menu"
    >
      {lessons.map((lesson, index) => (
        <Menu.Item
          key={lesson.id}
          icon={
            userProgress?.completedLessons?.includes(lesson.id) ? (
              <CheckCircleOutlined className="lesson-icon-completed" />
            ) : (
              <FileTextOutlined className="lesson-icon-default" />
            )
          }
          onClick={() => onSelectLesson(lesson)}
          className="lesson-menu-item"
        >
          <LessonItem lesson={lesson} index={index} />
        </Menu.Item>
      ))}
    </Menu>
  );
};

const LessonItem = ({ lesson, index }) => (
  <div className="lesson-item">
    <div className="lesson-item-title">
      <span>{index + 1}. {lesson.title}</span>
    </div>
    {lesson.duration && (
      <Tag size="small" className="lesson-duration-tag">
        {lesson.duration}
      </Tag>
    )}
  </div>
);

export default LessonsList;