// src/features/usb/ui/UsbHeader/UsbHeader.jsx
import React from 'react';
import { Button, Input, Space, message, theme } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  SendOutlined,
} from '@ant-design/icons';
import styles from './UsbHeader.module.css';

const { useToken } = theme;

const UsbHeader = ({
  searchTerm,
  onSearchChange,
  onAddNew,
  onEdit,
  selectedId,
  usbData,
  showInWorkOnly,
  onToggleShowInWorkOnly,
  onSendReminders,
  isSending,
  hasUsbsToNotify,
  sendingState,
}) => {
  const { token } = useToken();

  const stats = {
    total: usbData?.length || 0,
    inWork: usbData?.filter((u) => u.log?.toLowerCase() === 'да').length || 0,
    notInWork:
      usbData?.filter((u) => u.log?.toLowerCase() === 'нет').length || 0,
  };

  return (
    <div
      className={styles.header}
      style={{
        background: token.colorBgContainer,
        borderColor: token.colorBorder,
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div className={styles.actionsRow}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
              Добавить
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={onEdit}
              disabled={!selectedId}
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
                <span
                  className={styles.switchText}
                  style={{ color: token.colorTextSecondary }}
                >
                  Показывать только USB-накопители в работе
                </span>
              </label>
            </div>
          </Space>
        </div>
        <div
          className={styles.searchStatsRow}
          style={{ borderTopColor: token.colorBorder }}
        >
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
              <span
                className={styles.statItem}
                style={{ color: token.colorTextSecondary }}
              >
                Всего: <strong>{stats.total}</strong>
              </span>
              <span
                className={styles.statItem}
                style={{ color: token.colorTextSecondary }}
              >
                В работе:{' '}
                <strong style={{ color: token.colorSuccess }}>
                  {stats.inWork}
                </strong>
              </span>
              <span
                className={styles.statItem}
                style={{ color: token.colorTextSecondary }}
              >
                Не в работе:{' '}
                <strong style={{ color: token.colorWarning }}>
                  {stats.notInWork}
                </strong>
              </span>
            </Space>
          </div>
        </div>
      </Space>
    </div>
  );
};

export default UsbHeader;
