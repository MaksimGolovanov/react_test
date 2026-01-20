// components/TestResultExtraInfo.js
import React from 'react';
import { Space, Tag } from 'antd';
import { formatTimeFromMinutes } from '../utils/formatUtils';

export const TestResultExtraInfo = ({ result }) => (
  <Space>
    <Tag
      color={
        result.score >= 80
          ? 'success'
          : result.score >= 60
          ? 'warning'
          : 'error'
      }
    >
      {result.score >= 80
        ? 'Отлично'
        : result.score >= 60
        ? 'Удовлетворительно'
        : 'Неудовлетворительно'}
    </Tag>
    {result.timeSpent > 0 && (
      <Tag color="blue">
        {formatTimeFromMinutes(result.timeSpent)}
      </Tag>
    )}
  </Space>
);