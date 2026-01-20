// components/CourseProgressList.js
import React from 'react';
import { List, Space, Tag, Progress, Typography } from 'antd';
import moment from 'moment';
import { formatTimeFromMinutes } from '../utils/formatUtils';

const { Text } = Typography;

export const CourseProgressList = ({ courses, title, status }) => {
  if (courses.length === 0) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { progressColor: '#52c41a', tagColor: 'green' };
      case 'failed':
        return { progressColor: '#ff4d4f', tagColor: 'red' };
      case 'inProgress':
        return { progressColor: '#1890ff', tagColor: 'blue' };
      default:
        return { progressColor: '#d9d9d9', tagColor: 'default' };
    }
  };

  const { progressColor, tagColor } = getStatusColor(status);

  return (
    <div style={{ marginBottom: 24 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        {title} ({courses.length})
      </Text>
      <List
        size="small"
        dataSource={courses}
        renderItem={(item) => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>{item.title || `Курс ${item.id}`}</Text>
                  <Space>
                    <Tag color={tagColor}>{item.progress.score || 0}%</Tag>
                    {item.progress.time_spent > 0 && (
                      <Tag color="blue">
                        {formatTimeFromMinutes(item.progress.time_spent)}
                      </Tag>
                    )}
                  </Space>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Progress
                    percent={status === 'completed' ? 100 : item.progress.score || 0}
                    size="small"
                    strokeColor={progressColor}
                    style={{ width: '60%' }}
                    showInfo={status !== 'completed'}
                  />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {getStatusText(status, item)}
                  </Text>
                </div>
                {item.progress.attempt_number && (
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Попытка: {item.progress.attempt_number}
                  </Text>
                )}
              </Space>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

const getStatusText = (status, item) => {
  switch (status) {
    case 'completed':
      return `Завершен: ${
        item.progress.created_at
          ? moment(item.progress.created_at).format('DD.MM.YYYY')
          : 'Дата не указана'
      }`;
    case 'failed':
      return `Последняя попытка: ${
        item.progress.updated_at
          ? moment(item.progress.updated_at).format('DD.MM.YYYY')
          : 'Дата не указана'
      }`;
    case 'inProgress':
      return `Последний доступ: ${
        item.progress.updated_at
          ? moment(item.progress.updated_at).format('DD.MM.YYYY HH:mm')
          : 'Нет данных'
      }`;
    default:
      return '';
  }
};