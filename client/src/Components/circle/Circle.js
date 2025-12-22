import React from 'react';
import { Avatar, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const API_URL = process.env.REACT_APP_API_URL;

const Circle = ({ 
  fullName, 
  size = 40, 
  employeeId, 
  shape = 'circle', 
  showTooltip = true 
}) => {
  const avatarProps = {
    size: size,
    shape: shape,
    style: { 
      backgroundColor: '#99a6bdff',
    },
  };

  // Если есть employeeId, пробуем загрузить фото
  const avatarContent = employeeId ? (
    <Avatar
      {...avatarProps}
      src={`${API_URL}static/photo/${employeeId}.jpg`}
      alt={fullName || 'Avatar'}
      icon={<UserOutlined />} // Иконка покажется если фото не загрузится
    />
  ) : (
    <Avatar
      {...avatarProps}
      icon={<UserOutlined />}
    />
  );

  if (showTooltip && fullName) {
    return (
      <Tooltip title={fullName} placement="top">
        {avatarContent}
      </Tooltip>
    );
  }

  return avatarContent;
};

export default Circle;