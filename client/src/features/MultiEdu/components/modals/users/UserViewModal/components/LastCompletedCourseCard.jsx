// components/LastCompletedCourseCard.js
import React from 'react';
import { Card, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import { formatTimeFromMinutes } from '../utils/formatUtils';

const { Text } = Typography;

export const LastCompletedCourseCard = ({ course }) => {
  if (!course) return null;

  return (
    <Card size="small" style={{ marginTop: 8 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Text strong>
            {course.title || `Курс ${course.id}`}
          </Text>
          <Space>
            <Tag color="green">{course.progress.score}%</Tag>
            {course.progress.time_spent > 0 && (
              <Tag color="blue">
                {formatTimeFromMinutes(course.progress.time_spent)}
              </Tag>
            )}
          </Space>
        </div>

        {course.progress.created_at && (
          <div>
            <Tag color="blue" style={{ marginRight: 8 }}>
              Завершен:{' '}
              {moment(course.progress.created_at).format('DD.MM.YYYY')}
            </Tag>
            <Text
              type="secondary"
              style={{
                fontSize: '12px',
                marginTop: 4,
                display: 'block',
              }}
            >
              {moment(course.progress.created_at).format('HH:mm')}
            </Text>
          </div>
        )}

        {/* Информация о попытках */}
        {course.progress.attempt_number && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Попытка: {course.progress.attempt_number}
          </Text>
        )}
      </Space>
    </Card>
  );
};