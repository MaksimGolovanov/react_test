// components/TestResultHeader.js
import React from 'react';
import { Space, Tag, Badge, Typography } from 'antd';
import moment from 'moment';

const { Text } = Typography;

export const TestResultHeader = ({ result }) => (
  <Space>
    <Text strong>{result.courseName}</Text>
    <Tag color={result.passed ? 'green' : 'red'}>
      {result.passed ? 'Пройдено' : 'Не пройдено'}
    </Tag>
    <Tag color={result.score >= 80 ? 'green' : 'orange'}>
      {result.score}%
    </Tag>
    <Badge
      count={`${result.correctCount}/${result.totalQuestions}`}
      style={{
        backgroundColor:
          result.correctCount === result.totalQuestions
            ? '#52c41a'
            : result.correctCount > result.totalQuestions / 2
            ? '#faad14'
            : '#ff4d4f',
      }}
    />
    {result.date && (
      <Text type="secondary" style={{ fontSize: '12px' }}>
        {moment(result.date).format('DD.MM.YYYY HH:mm')}
      </Text>
    )}
    {result.attemptNumber > 1 && (
      <Tag color="blue">Попытка: {result.attemptNumber}</Tag>
    )}
  </Space>
);