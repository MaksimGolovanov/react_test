import React from 'react'
import { Button, Input, Space, message } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, SendOutlined } from '@ant-design/icons'

import styles from './UsbHeader.module.css'

const UsbHeader = ({
  searchTerm,
  onSearchChange,
  onAddNew,
  onEdit,
  selectedIds,
  usbData,
  showInWorkOnly,
  onToggleShowInWorkOnly,
  onSendReminders,
  isSending,
  hasUsbsToNotify,
  sendingState
}) => {

  const handleEditClick = () => {
    if (selectedIds.length === 0) {
      message.warning('Выберите USB-накопитель для редактирования')
      return
    }
    onEdit(selectedIds[0])
  }

  const stats = {
    total: usbData?.length || 0,
    inWork: usbData?.filter((u) => u.log?.toLowerCase() === 'да').length || 0,
    notInWork: usbData?.filter((u) => u.log?.toLowerCase() === 'нет').length || 0
  }

  return (
    <div className={styles.header}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Первая строка с кнопками действий */}
        <div className={styles.actionsRow}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
              Добавить
            </Button>

            <Button
              icon={<EditOutlined />}
              onClick={handleEditClick}
              type="primary"
              disabled={selectedIds.length === 0}
            >
              Редактировать
            </Button>

            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={onSendReminders}
              disabled={!hasUsbsToNotify || isSending}
              loading={isSending || sendingState?.status === 'sending'}
            >
              Отправить напоминания
            </Button>

            <div className={styles.switchContainer}>
              <label className={styles.switchLabel}>
                <input
                  type="checkbox"
                  checked={showInWorkOnly}
                  onChange={onToggleShowInWorkOnly}
                  className={styles.switchInput}
                />
                <span className={styles.switchText}>
                  Показывать только USB-накопители в работе
                </span>
              </label>
            </div>
          </Space>
        </div>

        {/* Вторая строка с поиском и статистикой */}
        <div className={styles.searchStatsRow}>
          <Space>
            <Input
              placeholder="Поиск по регистрационному номеру, серийному номеру или ФИО..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ width: 400 }}
              
            />
          </Space>

          <div className={styles.statsContainer}>
            <Space size="small">
              <span className={styles.statItem}>
                Всего: <strong>{stats.total}</strong>
              </span>
              <span className={styles.statItem}>
                В работе: <strong className={styles.statInWork}>{stats.inWork}</strong>
              </span>
              <span className={styles.statItem}>
                Не в работе: <strong className={styles.statNotInWork}>{stats.notInWork}</strong>
              </span>
            </Space>
          </div>
        </div>
      </Space>
    </div>
  )
}

export default UsbHeader