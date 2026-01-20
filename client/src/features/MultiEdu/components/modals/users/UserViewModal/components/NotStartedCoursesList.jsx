// components/NotStartedCoursesList.js
import React from 'react';
import { List, Space, Tag, Typography } from 'antd';

const { Text } = Typography;

export const NotStartedCoursesList = ({ courses }) => {
  if (courses.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        Не начаты ({courses.length})
      </Text>
      <List
        size="small"
        dataSource={courses}
        renderItem={(item) => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>{item.title || `Курс ${item.id}`}</Text>
                <Tag color="default">Не начат</Tag>
              </Space>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};