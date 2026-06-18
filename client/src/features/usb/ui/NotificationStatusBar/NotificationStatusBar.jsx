// src/features/usb/ui/NotificationStatusBar/NotificationStatusBar.jsx
import React from 'react';
import { Card, Progress, Alert, Button, Typography, Space, Tag, theme } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, MailOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { useToken } = theme;

const NotificationStatusBar = ({ sendingState, onClose }) => {
  const { token } = useToken();
  const { show, total, sent, failed, currentEmail, status } = sendingState;
  if (!show) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'sending':
        return { text: 'Отправка...', icon: <ClockCircleOutlined />, color: token.colorPrimary, alertType: 'info', progressStatus: 'active' };
      case 'completed':
        return failed > 0
          ? { text: 'Частично успешно', icon: <CheckCircleOutlined />, color: token.colorWarning, alertType: 'warning', progressStatus: 'success' }
          : { text: 'Завершено', icon: <CheckCircleOutlined />, color: token.colorSuccess, alertType: 'success', progressStatus: 'success' };
      case 'error':
        return { text: 'Ошибка', icon: <CloseCircleOutlined />, color: token.colorError, alertType: 'error', progressStatus: 'exception' };
      default:
        return { text: 'Подготовка...', icon: <ClockCircleOutlined />, color: token.colorTextSecondary, alertType: 'info', progressStatus: 'normal' };
    }
  };

  const config = getStatusConfig();
  const progressPercent = total > 0 ? ((sent + failed) / total) * 100 : 0;

  return (
    <Card
      size="small"
      style={{ borderColor: config.color, marginBottom: 16 }}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onClose} size="small" />}
      title={
        <Space size={8}>
          {config.icon}
          <Text>Отправка уведомлений</Text>
          <Tag color={config.color}>{config.text}</Tag>
        </Space>
      }
    >
      <Progress percent={progressPercent} status={config.progressStatus} strokeColor={token.colorPrimary} />
      {status === 'sending' && currentEmail && (
        <Alert message={<MailOutlined />} description={currentEmail} type="info" showIcon style={{ marginTop: 8 }} />
      )}
      {status === 'completed' && failed === 0 && <Alert message="Все уведомления успешно отправлены!" type="success" showIcon style={{ marginTop: 8 }} />}
      {status === 'completed' && failed > 0 && <Alert message={`Отправлено ${sent} из ${total}. Ошибок: ${failed}`} type="warning" showIcon style={{ marginTop: 8 }} />}
      {status === 'error' && <Alert message="Ошибка отправки. Попробуйте еще раз." type="error" showIcon style={{ marginTop: 8 }} />}
      <div style={{ marginTop: 12, textAlign: 'right' }}>
        <Button onClick={onClose} size="small" danger={status === 'error'} type={status === 'completed' ? 'primary' : 'default'}>
          {status === 'sending' ? 'Отмена' : status === 'completed' ? 'Готово' : 'Закрыть'}
        </Button>
      </div>
    </Card>
  );
};

export default NotificationStatusBar;