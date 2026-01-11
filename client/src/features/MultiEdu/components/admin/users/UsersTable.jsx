// src/features/security-training/components/admin/UsersTable.jsx
import React from 'react';
import { Table, Space, Typography, Progress, Tag, Button, Tooltip, Popconfirm, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import AvatarWithFallback from '../../../../../Components/AvatarWithFallback/AvatarWithFallback';
import moment from 'moment';

const { Text } = Typography;

const UsersTable = ({ users, loading, onEditUser, onDeleteUser, onViewUser }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'red';
      case 'ST-ADMIN': return 'volcano';
      case 'ST': return 'blue';
      case 'USER': return 'green';
      default: return 'default';
    }
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'normal';
    return 'exception';
  };

  const userColumns = [
    {
      title: 'Пользователь',
      dataIndex: 'login',
      key: 'login',
      width: 200,
      render: (text, record) => (
        <Space>
          <AvatarWithFallback
            tabNumber={record.tabNumber}
            size={45}
            fallbackSrc={`${process.env.REACT_APP_API_URL}static/photo/no.jpg`}
            timestamp={Date.now()}
          />
          <div>
            <Text strong style={{ fontSize: '14px' }}>
              {text || 'Не указано'}
            </Text>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.tabNumber}
              </Text>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.description}
              </Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Роли',
      dataIndex: 'roles',
      key: 'roles',
      width: 150,
      render: (roles) => (
        <Space wrap>
          {roles?.map((role, index) => (
            <Tag key={index} color={getRoleColor(role)}>
              {role}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Статистика обучения',
      key: 'stats',
      width: 250,
      render: (_, record) => (
        <div>
          <Space direction="vertical" size={2} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Курсы:
              </Text>
              <Badge
                count={record.completed_courses || 0}
                style={{ backgroundColor: '#52c41a' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Средний балл:
              </Text>
              <Progress
                percent={record.average_score || 0}
                size="small"
                strokeColor={getProgressColor(record.average_score)}
                style={{ width: 100 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Время обучения:
              </Text>
              <Text style={{ fontSize: '12px' }}>
                {record.total_training_time || 0} мин.
              </Text>
            </div>
          </Space>
        </div>
      ),
    },
    {
      title: 'Последняя активность',
      dataIndex: 'last_course_completed',
      key: 'lastActivity',
      width: 150,
      render: (date) => (
        <div>
          {date ? (
            <div>
              <Text style={{ fontSize: '12px' }}>
                {moment(date).format('DD.MM.YYYY')}
              </Text>
              <div>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  {moment(date).format('HH:mm')}
                </Text>
              </div>
            </div>
          ) : (
            <Tag color="default">Нет данных</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Просмотр">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Popconfirm
              title="Удалить пользователя?"
              description={`Вы уверены, что хотите удалить пользователя ${record.login}?`}
              onConfirm={() => onDeleteUser(record)}
              okText="Да"
              cancelText="Нет"
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={userColumns}
      dataSource={users}
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Всего ${total} пользователей`,
      }}
      rowKey={(record) => record.id || record.tabNumber}
      scroll={{ x: 1000 }}
      bordered
    />
  );
};

export default UsersTable;