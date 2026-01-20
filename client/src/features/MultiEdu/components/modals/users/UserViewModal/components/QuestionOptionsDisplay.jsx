// components/QuestionOptionsDisplay.js
import React from 'react';
import { Space, Typography } from 'antd';
import { ExclamationCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { formatAnswerDisplay } from '../utils/formatUtils';

const { Text } = Typography;

export const QuestionOptionsDisplay = ({ question, userAnswer, correctAnswer }) => {
  if (!question.options) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <Text type="secondary" style={{ fontSize: '12px' }}>
        Варианты ответов:
      </Text>
      <div style={{ marginTop: 4 }}>
        {question.options.map((option) => {
          if (!option || !option.id) return null;

          const isUserAnswer = Array.isArray(userAnswer)
            ? userAnswer.includes(option.id)
            : userAnswer === option.id;

          const isCorrectAnswer = Array.isArray(correctAnswer)
            ? correctAnswer.includes(option.id)
            : correctAnswer === option.id;

          let borderColor = '#d9d9d9';
          if (isUserAnswer && isCorrectAnswer) {
            borderColor = '#52c41a';
          } else if (isUserAnswer && !isCorrectAnswer) {
            borderColor = '#ff4d4f';
          } else if (!isUserAnswer && isCorrectAnswer) {
            borderColor = '#73d13d';
          }

          return (
            <div
              key={option.id}
              style={{
                padding: '8px 12px',
                marginBottom: 4,
                border: `1px solid ${borderColor}`,
                borderRadius: 4,
                backgroundColor: isUserAnswer
                  ? isCorrectAnswer
                    ? '#f6ffed'
                    : '#fff2e8'
                  : isCorrectAnswer
                  ? '#f6ffed'
                  : 'transparent',
              }}
            >
              <Space>
                {isUserAnswer && (
                  <ExclamationCircleOutlined
                    style={{
                      color: isCorrectAnswer ? '#52c41a' : '#ff4d4f',
                    }}
                  />
                )}
                <Text style={{ fontSize: '13px' }}>
                  {option.id.toUpperCase()}. {option.text}
                </Text>
                {isCorrectAnswer && (
                  <CheckOutlined
                    style={{
                      color: '#52c41a',
                      marginLeft: 'auto',
                    }}
                  />
                )}
              </Space>
            </div>
          );
        })}
      </div>
    </div>
  );
};