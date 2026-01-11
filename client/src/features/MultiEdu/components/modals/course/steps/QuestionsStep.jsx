// src/features/security-training/components/admin/modals/steps/QuestionsStep.jsx

import { Table, Tag, Button, Space, Card, Tooltip, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const QuestionsStep = ({
  questions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}) => {
  const columns = [
    {
      title: 'Вопрос',
      dataIndex: 'question_text',
      key: 'question',
      render: (text, record) => (
        <Space direction="vertical" size={2}>
          <Text>{text.substring(0, 80)}...</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.question_type === 'single'
              ? 'Одиночный выбор'
              : record.question_type === 'multiple'
              ? 'Множественный выбор'
              : 'Текстовый ответ'}
            {record.points > 1 && ` • ${record.points} баллов`}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Тип',
      dataIndex: 'question_type',
      key: 'type',
      render: (type) => (
        <Tag
          color={
            type === 'single'
              ? 'blue'
              : type === 'multiple'
              ? 'green'
              : 'orange'
          }
        >
          {type === 'single'
            ? 'Одиночный'
            : type === 'multiple'
            ? 'Множественный'
            : 'Текстовый'}
        </Tag>
      ),
    },
    {
      title: 'Баллы',
      dataIndex: 'points',
      key: 'points',
      width: 80,
    },
    {
      title: 'Порядок',
      dataIndex: 'order_index',
      key: 'order',
      width: 80,
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Редактировать">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEditQuestion(record)}
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => onDeleteQuestion(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h4>Вопросы теста ({questions.length})</h4>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddQuestion}
          >
            Добавить вопрос
          </Button>
        </div>

        {questions.length === 0 ? (
          <Card>
            <Text type="secondary">
              Вопросы не добавлены. Добавьте первый вопрос теста.
            </Text>
          </Card>
        ) : (
          <Table
            dataSource={questions}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        )}
      </Space>
    </div>
  );
};

export default QuestionsStep;
