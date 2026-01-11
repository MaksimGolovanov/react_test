// src/features/security-training/components/admin/modals/steps/LessonsStep.jsx

import { Table, Tag, Button, Space, Card, Tooltip, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const LessonsStep = ({
  lessons,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}) => {
  const columns = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space direction="vertical" size={2}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.content_type === 'video'
              ? 'Видео'
              : record.content_type === 'interactive'
              ? 'Интерактив'
              : record.content_type === 'presentation'
              ? 'Презентация'
              : 'Текст'}
            {record.duration > 0 && ` • ${record.duration} мин.`}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Тип',
      dataIndex: 'content_type',
      key: 'type',
      render: (type) => (
        <Tag
          color={
            type === 'video'
              ? 'blue'
              : type === 'interactive'
              ? 'green'
              : type === 'presentation'
              ? 'orange'
              : 'default'
          }
        >
          {type === 'video'
            ? 'Видео'
            : type === 'interactive'
            ? 'Интерактив'
            : type === 'presentation'
            ? 'Презентация'
            : 'Текст'}
        </Tag>
      ),
    },
    {
      title: 'Порядок',
      dataIndex: 'order_index',
      key: 'order',
      width: 80,
    },
    {
      title: 'Статус',
      dataIndex: 'is_active',
      key: 'status',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Активен' : 'Неактивен'}
        </Tag>
      ),
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
              onClick={() => onEditLesson(record)}
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => onDeleteLesson(record.id)}
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
          <h4>Уроки курса ({lessons.length})</h4>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddLesson}>
            Добавить урок
          </Button>
        </div>

        {lessons.length === 0 ? (
          <Card>
            <Text type="secondary">
              Уроки не добавлены. Добавьте первый урок.
            </Text>
          </Card>
        ) : (
          <Table
            dataSource={lessons}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        )}
      </Space>
    </div>
  );
};

export default LessonsStep;
