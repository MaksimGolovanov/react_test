// components/ActivityTabContent.js
import React from 'react';
import { Timeline, Space, Tag, Typography } from 'antd';
import {
  TrophyOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { formatTimeFromMinutes } from '../utils/formatUtils';

const { Text } = Typography;

export const ActivityTabContent = ({ userProgress }) => {
  if (userProgress.length === 0) {
    return <Text type="secondary">Нет данных об активности</Text>;
  }

  // Преобразуем данные к нужному формату
  const transformActivityData = () => {
    return userProgress.map(item => {
      const progress = item.progress || {};
      
      // Определяем статус курса
      let status = 'in_progress';
      let passed = null;
      
      if (progress.passed_test === true || progress.passed === true) {
        status = 'completed';
        passed = true;
      } else if (progress.passed_test === false || progress.passed === false) {
        status = 'failed';
        passed = false;
      }

      // Определяем дату активности
      let activityDate = null;
      if (progress.updated_at) {
        activityDate = progress.updated_at;
      } else if (progress.last_accessed) {
        activityDate = progress.last_accessed;
      } else if (progress.completed_at) {
        activityDate = progress.completed_at;
      } else if (progress.created_at) {
        activityDate = progress.created_at;
      }

      // Определяем баллы
      let score = null;
      if (progress.test_score) {
        score = parseFloat(progress.test_score);
      } else if (progress.score) {
        score = parseFloat(progress.score);
      }

      // Определяем время
      let timeSpent = 0;
      if (progress.total_time_spent) {
        timeSpent = progress.total_time_spent;
      } else if (progress.time_spent) {
        timeSpent = progress.time_spent;
      }

      return {
        id: item.id,
        title: item.title || `Курс ${item.id}`,
        progress: {
          passed,
          status,
          score,
          time_spent: timeSpent,
          updated_at: activityDate,
          created_at: progress.created_at,
          last_accessed: progress.last_accessed,
          completed_at: progress.completed_at,
        }
      };
    });
  };

  const activityData = transformActivityData();

  // Фильтруем данные, где нет даты активности
  const validActivityData = activityData.filter(item => 
    item.progress.updated_at || 
    item.progress.last_accessed || 
    item.progress.created_at || 
    item.progress.completed_at
  );

  if (validActivityData.length === 0) {
    return <Text type="secondary">Нет данных об активности</Text>;
  }

  return (
    <Timeline style={{ marginTop: 16 }}>
      {[...validActivityData]
        .sort(
          (a, b) => {
            const dateA = a.progress.updated_at || 
                         a.progress.last_accessed || 
                         a.progress.completed_at || 
                         a.progress.created_at || 
                         new Date(0);
            const dateB = b.progress.updated_at || 
                         b.progress.last_accessed || 
                         b.progress.completed_at || 
                         b.progress.created_at || 
                         new Date(0);
            return new Date(dateB) - new Date(dateA);
          }
        )
        .slice(0, 10)
        .map((course, index) => {
          // Определяем дату для отображения
          const displayDate = course.progress.updated_at || 
                            course.progress.last_accessed || 
                            course.progress.completed_at || 
                            course.progress.created_at;
          
          // Определяем статус текста
          let statusText = 'В процессе';
          if (course.progress.passed === true) {
            statusText = 'Завершен';
          } else if (course.progress.passed === false) {
            statusText = 'Не пройден';
          }

          return (
            <Timeline.Item
              key={index}
              color={
                course.progress.passed === true
                  ? 'green'
                  : course.progress.passed === false
                  ? 'red'
                  : 'blue'
              }
              dot={
                course.progress.passed === true ? (
                  <TrophyOutlined style={{ fontSize: '12px' }} />
                ) : course.progress.passed === false ? (
                  <CloseCircleOutlined style={{ fontSize: '12px' }} />
                ) : (
                  <QuestionCircleOutlined style={{ fontSize: '12px' }} />
                )
              }
            >
              <Space direction="vertical" size={0}>
                <Text strong>{course.title}</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {statusText}
                  {': '}
                  {displayDate
                    ? moment(displayDate).format('DD.MM.YYYY HH:mm')
                    : 'Дата не указана'}
                </Text>
                <Text style={{ fontSize: '12px' }}>
                  {course.progress.score !== undefined && course.progress.score !== null && (
                    <>
                      Результат:{' '}
                      <Tag color={course.progress.passed === true ? 'green' : 'red'}>
                        {course.progress.score.toFixed(1)}%
                      </Tag>
                    </>
                  )}
                  {course.progress.time_spent > 0 && (
                    <>
                      <span style={{ marginLeft: 8 }}>Время: </span>
                      <Tag color="blue">
                        {formatTimeFromMinutes(course.progress.time_spent)}
                      </Tag>
                    </>
                  )}
                </Text>
              </Space>
            </Timeline.Item>
          );
        })}
    </Timeline>
  );
};