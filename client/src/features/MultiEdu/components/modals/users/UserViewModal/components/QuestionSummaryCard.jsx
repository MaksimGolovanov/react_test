// components/QuestionSummaryCard.js
import React from 'react';
import { Card, Space, Tag, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { formatAnswerDisplay } from '../utils/formatUtils';

const { Text } = Typography;

export const QuestionSummaryCard = ({ item }) => (
  <Card
    size="small"
    style={{
      border: `1px solid ${item.isCorrect ? '#d9f7be' : '#ffccc7'}`,
      backgroundColor: item.isCorrect ? '#f6ffed' : '#fff2e8',
      height: '100%',
    }}
    bodyStyle={{ padding: '12px' }}
  >
    <Space direction="vertical" size={2} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text strong style={{ fontSize: '13px' }}>
          Вопрос {item.questionId}
        </Text>
        <Tag size="small" color={item.isCorrect ? 'success' : 'error'}>
          {item.points} балл
        </Tag>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '8px 0',
        }}
      >
        {item.isCorrect ? (
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px' }} />
        ) : (
          <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '24px' }} />
        )}
      </div>

      <Text type="secondary" style={{ fontSize: '11px', textAlign: 'center' }}>
        {item.isCorrect ? 'Правильно' : 'Неправильно'}
      </Text>

      <div style={{ marginTop: 4 }}>
        <Text style={{ fontSize: '11px' }}>
          Ответ:{' '}
          {formatAnswerDisplay(
            item.userAnswer,
            item.questionType,
            item.options
          )}
        </Text>
      </div>
    </Space>
  </Card>
);