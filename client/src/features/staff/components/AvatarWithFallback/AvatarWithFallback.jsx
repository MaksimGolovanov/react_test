import React, { useState, useEffect } from 'react';
import { Avatar, theme } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { useToken } = theme;

const AvatarWithFallback = ({ tabNumber, size = 60, className, icon = <UserOutlined />, fallbackSrc = null, timestamp }) => {
  const { token } = useToken();
  const [errorCount, setErrorCount] = useState(0);
  const defaultFallback = `${process.env.REACT_APP_API_URL}static/photo/no.jpg`;
  const customFallback = fallbackSrc || defaultFallback;

  const getAvatarSrc = () => {
    if (tabNumber) return `${process.env.REACT_APP_API_URL}static/photo/${tabNumber}.jpg?t=${timestamp || Date.now()}`;
    return customFallback;
  };

  const [src, setSrc] = useState(getAvatarSrc());

  useEffect(() => {
    setSrc(getAvatarSrc());
    setErrorCount(0);
  }, [tabNumber, timestamp]);

  const handleError = () => {
    if (errorCount === 0) {
      setSrc(customFallback);
      setErrorCount(1);
    }
  };

  return <Avatar size={size} src={src} icon={icon} className={className} onError={handleError} style={{ border: `2px solid ${token.colorPrimary}` }} />;
};

export default AvatarWithFallback;