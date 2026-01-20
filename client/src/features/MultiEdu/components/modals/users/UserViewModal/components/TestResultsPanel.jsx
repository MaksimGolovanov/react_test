// components/TestResultsPanel.js
import React from 'react';
import { Card, Row, Col, Progress, Tag, Space, Typography, List, Alert } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { formatTimeFromMinutes, formatAnswerDisplay } from '../utils/formatUtils';
import { QuestionOptionsDisplay } from './QuestionOptionsDisplay';

const { Text } = Typography;

export const TestResultsPanel = ({ result }) => (
  <>
    <div style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card size="small" title="Результат теста">
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={result.score}
                strokeColor={
                  result.passed
                    ? '#52c41a'
                    : result.score >= 60
                    ? '#faad14'
                    : '#ff4d4f'
                }
                size={120}
                format={(percent) => (
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                      {percent}%
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      {result.correctCount} из {result.totalQuestions}
                    </div>
                    <div style={{ fontSize: '12px' }}>
                      {result.earnedPoints}/{result.totalPoints} баллов
                    </div>
                  </div>
                )}
              />
              <div style={{ marginTop: 12 }}>
                <Tag color={result.passed ? 'success' : 'error'}>
                  {result.passed ? 'Тест пройден' : 'Тест не пройден'}
                </Tag>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">
                    Время выполнения: {formatTimeFromMinutes(result.timeSpent)}
                  </Text>
                </div>
                {result.attemptNumber > 1 && (
                  <div>
                    <Tag color="blue" style={{ marginTop: 8 }}>
                      Попытка: {result.attemptNumber}
                    </Tag>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col span={16}>
          <Card size="small" title="Детали по вопросам">
            <List
              dataSource={result.questionAnalysis}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    size="small"
                    style={{
                      width: '100%',
                      borderLeft: `4px solid ${item.isCorrect ? '#52c41a' : '#ff4d4f'}`,
                      backgroundColor: item.isCorrect ? '#f6ffed' : '#fff2e8',
                    }}
                    bodyStyle={{ padding: '12px' }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Text strong style={{ fontSize: '14px' }}>
                          Вопрос {item.questionId}: {item.questionText}
                        </Text>
                        <Space>
                          <Tag color={item.isCorrect ? 'success' : 'error'}>
                            {item.isCorrect ? '✓' : '✗'} {item.points} балл
                          </Tag>
                          <Tag
                            color={item.questionType === 'multiple' ? 'blue' : 'purple'}
                          >
                            {item.questionType === 'multiple'
                              ? 'Множественный'
                              : 'Одиночный'}
                          </Tag>
                        </Space>
                      </div>

                      <QuestionOptionsDisplay
                        question={item}
                        userAnswer={item.userAnswer}
                        correctAnswer={item.correctAnswer}
                      />

                      <div style={{ marginTop: 8 }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Ответ пользователя:{' '}
                            <Text strong>
                              {formatAnswerDisplay(
                                item.userAnswer,
                                item.questionType,
                                item.options
                              )}
                            </Text>
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Правильный ответ:{' '}
                            <Text strong type="success">
                              {formatAnswerDisplay(
                                item.correctAnswer,
                                item.questionType,
                                item.options
                              )}
                            </Text>
                          </Text>
                        </Space>
                      </div>

                      {item.explanation && (
                        <Alert
                          message="Пояснение"
                          description={item.explanation}
                          type="info"
                          showIcon
                          style={{ marginTop: 8 }}
                          size="small"
                        />
                      )}
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  </>
);