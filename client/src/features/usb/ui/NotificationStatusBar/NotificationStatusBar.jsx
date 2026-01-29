import React from 'react'
import { 
  Card, 
  Progress, 
  Alert, 
  Button, 
  Typography, 
  Space,
  Tag,
} from 'antd'
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  MailOutlined,
  CloseOutlined
} from '@ant-design/icons'

const { Text } = Typography

const NotificationStatusBar = ({ sendingState, onClose }) => {
  const { show, total, sent, failed, currentEmail, status } = sendingState

  if (!show) return null

  // Определяем текст статуса и иконку
  const getStatusConfig = () => {
    switch (status) {
      case 'sending':
        return {
          text: 'Отправка...',
          icon: <ClockCircleOutlined />,
          color: 'processing',
          alertType: 'info',
          progressStatus: 'active'
        }
      case 'completed':
        return failed > 0 
          ? {
              text: 'Частично успешно',
              icon: <CheckCircleOutlined />,
              color: 'warning',
              alertType: 'warning',
              progressStatus: 'success'
            }
          : {
              text: 'Завершено',
              icon: <CheckCircleOutlined />,
              color: 'success',
              alertType: 'success',
              progressStatus: 'success'
            }
      case 'error':
        return {
          text: 'Ошибка',
          icon: <CloseCircleOutlined />,
          color: 'error',
          alertType: 'error',
          progressStatus: 'exception'
        }
      default:
        return {
          text: 'Подготовка...',
          icon: <ClockCircleOutlined />,
          color: 'default',
          alertType: 'info',
          progressStatus: 'normal'
        }
    }
  }

  const statusConfig = getStatusConfig()
  const remaining = total - sent - failed
  const progressPercent = total > 0 ? ((sent + failed) / total) * 100 : 0

  return (
    <Card
      size="small"
      className="mb-3"
      bordered
      style={{
        borderColor: `var(--ant-${statusConfig.color}-color)`,
        borderWidth: 1
      }}
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          size="small"
          style={{ marginTop: -2 }}
        />
      }
      title={
        <Space size={8}>
          {statusConfig.icon}
          <Text>Отправка уведомлений</Text>
          <Tag color={statusConfig.color} size="small">
            {statusConfig.text}
          </Tag>
        </Space>
      }
    >
      {/* Прогресс бар со статистикой */}
      <div className="mb-3">
        <Progress
          percent={progressPercent}
          status={statusConfig.progressStatus}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          size="small"
          format={() => (
            <Space size={4}>
              <Tag color="success" size="small">{sent}</Tag>
              <Tag color="error" size="small">{failed}</Tag>
              <Tag color="default" size="small">{remaining}</Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                ({sent + failed}/{total})
              </Text>
            </Space>
          )}
        />
      </div>

      {/* Компактная статистика */}
      {status === 'sending' && currentEmail && (
        <Alert
          message={
            <Space size={4}>
              <MailOutlined style={{ fontSize: 12 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {currentEmail}
              </Text>
            </Space>
          }
          type="info"
          showIcon={false}
          className="mb-2"
          style={{ padding: '4px 8px' }}
        />
      )}

      {/* Статусные сообщения */}
      {status === 'completed' && failed === 0 && (
        <Alert
          message="Все уведомления успешно отправлены!"
          type="success"
          showIcon
          className="mb-2"
          size="small"
        />
      )}

      {status === 'completed' && failed > 0 && (
        <Alert
          message={`Отправлено ${sent} из ${total}. Ошибок: ${failed}`}
          type="warning"
          showIcon
          className="mb-2"
          size="small"
        />
      )}

      {status === 'error' && (
        <Alert
          message="Ошибка отправки. Попробуйте еще раз."
          type="error"
          showIcon
          className="mb-2"
          size="small"
        />
      )}

      {/* Кнопка управления */}
      <div className="flex justify-end">
        {status === 'sending' && (
          <Button 
            onClick={onClose} 
            size="small"
            danger
          >
            Отмена
          </Button>
        )}
        
        {status === 'completed' && (
          <Button 
            onClick={onClose} 
            size="small" 
            type="primary"
          >
            Готово
          </Button>
        )}
        
        {status === 'error' && (
          <Button 
            onClick={onClose} 
            size="small"
            danger
          >
            Закрыть
          </Button>
        )}
      </div>
    </Card>
  )
}

export default NotificationStatusBar