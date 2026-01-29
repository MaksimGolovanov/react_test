// components/CourseProgressList.js
import React, { useState } from 'react';
import { List, Space, Tag, Progress, Typography, Button, Modal, message } from 'antd';
import { UndoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { formatTimeFromMinutes } from '../utils/formatUtils';

const { Text } = Typography;
const { confirm } = Modal;

export const CourseProgressList = ({ courses, title, status, onResetProgress }) => {
  const [resetLoading, setResetLoading] = useState({});
  
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

  const showResetConfirm = (course) => {
    confirm({
      title: 'Сбросить статистику курса?',
      icon: <ExclamationCircleOutlined />,
      content: `Вы уверены, что хотите сбросить всю статистику по курсу "${course.title || `Курс ${course.id}`}"? Все данные о прогрессе будут удалены без возможности восстановления.`,
      okText: 'Сбросить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        await handleResetProgress(course);
      },
    });
  };

  const handleResetProgress = async (course) => {
    setResetLoading(prev => ({ ...prev, [course.id]: true }));
    
    try {
      if (onResetProgress) {
        await onResetProgress(course.id);
      }
      
      message.success('Статистика курса успешно сброшена');
    } catch (error) {
      console.error('Ошибка при сбросе статистики:', error);
      message.error('Не удалось сбросить статистику курса');
    } finally {
      setResetLoading(prev => ({ ...prev, [course.id]: false }));
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text strong>
          {title} ({courses.length})
        </Text>
      </div>
      
      <List
        size="small"
        dataSource={courses}
        renderItem={(item) => (
          <List.Item
            style={{ 
              padding: '8px 0',
              borderBottom: '1px solid #f0f0f0',
              position: 'relative'
            }}
          >
            <div style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, marginRight: 12 }}>
                    <Text strong>{item.title || `Курс ${item.id}`}</Text>
                    {item.description && (
                      <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginTop: 2 }}>
                        {item.description}
                      </Text>
                    )}
                  </div>
                  <Space>
                    <Tag color={tagColor}>{item.progress.score || 0}%</Tag>
                    {item.progress.time_spent > 0 && (
                      <Tag color="blue">
                        {formatTimeFromMinutes(item.progress.time_spent)}
                      </Tag>
                    )}
                    
                    {/* Кнопка сброса для каждого курса */}
                    
                      <Button
                        type="text"
                        size="small"
                        icon={<UndoOutlined />}
                        loading={resetLoading[item.id]}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          showResetConfirm(item);
                        }}
                        style={{
                          color: '#ff4d4f',
                          padding: '0 8px',
                          fontSize: '12px',
                          height: 'auto',
                          minWidth: '80px'
                        }}
                        title="Сбросить статистику курса"
                      >
                        Сбросить
                      </Button>
                    
                  </Space>
                </div>
                
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 4
                  }}
                >
                  <Progress
                    percent={status === 'completed' ? 100 : item.progress.score || 0}
                    size="small"
                    strokeColor={progressColor}
                    style={{ width: '60%', marginRight: 12 }}
                    showInfo={status !== 'completed'}
                  />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {getStatusText(status, item)}
                  </Text>
                </div>
                
                {item.progress.attempt_number && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      Попытка: {item.progress.attempt_number}
                    </Text>
                    {item.progress.last_activity && (
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        Последняя активность: {moment(item.progress.last_activity).format('DD.MM.YYYY HH:mm')}
                      </Text>
                    )}
                  </div>
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
        item.progress.completed_at || item.progress.created_at
          ? moment(item.progress.completed_at || item.progress.created_at).format('DD.MM.YYYY')
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
        item.progress.updated_at || item.progress.last_accessed
          ? moment(item.progress.updated_at || item.progress.last_accessed).format('DD.MM.YYYY HH:mm')
          : 'Нет данных'
      }`;
    default:
      return '';
  }
};