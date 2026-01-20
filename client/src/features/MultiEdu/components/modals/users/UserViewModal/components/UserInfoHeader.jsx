// components/UserInfoHeader.js
import React from 'react';
import { Space, Typography } from 'antd';
import AvatarWithFallback from '../../../../../../../Components/AvatarWithFallback/AvatarWithFallback';

const { Title, Text } = Typography;

export const UserInfoHeader = ({ user, userFio }) => (
  <Space align="center">
    <AvatarWithFallback
      tabNumber={user?.tabNumber}
      size={40}
      fallbackSrc={`${process.env.REACT_APP_API_URL}static/photo/no.jpg`}
    />
    <div>
      <Title level={4} style={{ margin: 0 }}>
        {userFio || user?.login || 'Пользователь'}
      </Title>
      <Text type="secondary" style={{ fontSize: '12px' }}>
        {user?.login && userFio
          ? `Логин: ${user.login}`
          : user?.login || 'Логин не указан'}
        {user?.tabNumber && ` • Таб. №: ${user.tabNumber}`}
      </Text>
    </div>
  </Space>
);