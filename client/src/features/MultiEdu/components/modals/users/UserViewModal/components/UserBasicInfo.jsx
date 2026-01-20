// components/UserBasicInfo.js
import React from 'react';
import { Card, Descriptions, Space, Tag, Typography } from 'antd';

const { Text } = Typography;

export const UserBasicInfo = ({ user, userFio }) => (
  <Card size="small" style={{ marginBottom: 16 }}>
    <Descriptions column={2} size="small">
      {userFio && (
        <Descriptions.Item label="ФИО">
          <Text strong style={{ fontSize: '14px' }}>
            {userFio}
          </Text>
        </Descriptions.Item>
      )}
      <Descriptions.Item label="Логин">
        <Text strong>{user?.login || 'Не указан'}</Text>
      </Descriptions.Item>
      <Descriptions.Item label="Табельный номер">
        <Tag color="blue">{user?.tabNumber || 'Не указан'}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="ID пользователя">
        <Text code>{user?.user_id || user?.id || 'Не указан'}</Text>
      </Descriptions.Item>
      <Descriptions.Item label="Роли">
        <Space wrap>
          {user?.roles?.map((role, index) => (
            <Tag
              key={index}
              color={
                role === 'ADMIN'
                  ? 'red'
                  : role === 'ST-ADMIN'
                  ? 'volcano'
                  : role === 'ST'
                  ? 'blue'
                  : 'green'
              }
            >
              {role}
            </Tag>
          )) || <Tag color="default">Не назначены</Tag>}
        </Space>
      </Descriptions.Item>
      {user?.description && (
        <Descriptions.Item label="Описание" span={2}>
          {user.description}
        </Descriptions.Item>
      )}
    </Descriptions>
  </Card>
);