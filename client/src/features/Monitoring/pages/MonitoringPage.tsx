// src/modules/Monitoring/pages/MonitoringPage.tsx

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Alert, Skeleton, Typography, Space } from 'antd';
import monitoringStore from '../store/MonitoringStore';
import MonitoringHeader from '../ui/MonitoringHeader/MonitoringHeader';
import MonitoringStatus from '../ui/MonitoringStatus/MonitoringStatus';
import MonitoringLogs from '../ui/MonitoringLogs/MonitoringLogs';
import styles from './MonitoringPage.module.css';

const { Title, Text } = Typography;

const MonitoringPage: React.FC = observer(() => {
  const { status, logs, loading, error, autoRefresh } = monitoringStore;

  useEffect(() => {
    monitoringStore.fetchAll();
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        monitoringStore.fetchAll();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const handleRefresh = () => monitoringStore.fetchAll();
  const handleToggleAutoRefresh = () => monitoringStore.toggleAutoRefresh();
  const handleClearLogs = () => monitoringStore.clearLogs();

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Alert message="Ошибка загрузки" description={error.message} type="error" showIcon />
      </div>
    );
  }

  if (loading && !status) {
    return (
      <div className={styles.loadingContainer}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {/* Заголовок и кнопки */}
        <div className={styles.headerRow}>
          <Title level={4} style={{ margin: 0 }}>Мониторинг сервера</Title>
          <MonitoringHeader
            loading={loading}
            autoRefresh={autoRefresh}
            onRefresh={handleRefresh}
            onToggleAutoRefresh={handleToggleAutoRefresh}
            onClearLogs={handleClearLogs}
          />
        </div>

        {/* Статусные карточки */}
        <MonitoringStatus status={status} loading={loading} />

        {/* Системная информация – компактно в одну строку */}
        <div className={styles.systemInfo}>
          <span><strong>Node:</strong> {status?.nodeVersion}</span>
          <span><strong>Платформа:</strong> {status?.platform} ({status?.arch})</span>
          <span><strong>CPU:</strong> {status?.cpuCount} ядер</span>
          <span><strong>PID:</strong> {status?.pid}</span>
          <span><strong>Старт:</strong> {status?.startTime ? new Date(status.startTime).toLocaleString() : '—'}</span>
          <span><strong>Окружение:</strong> {status?.env}</span>
        </div>

        {/* Таблица логов – обёрнута в scroll-контейнер */}
        <div className={styles.tableCard}>
          <div className={styles.logsScroll}>
            <MonitoringLogs logs={logs} loading={loading} />
          </div>
        </div>
      </Space>
    </div>
  );
});

export default MonitoringPage;