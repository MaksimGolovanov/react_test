// src/modules/Monitoring/ui/MonitoringLogs/MonitoringLogs.tsx

import React from 'react';
import { Table, Tag, Typography, theme } from 'antd';
import { LogEntry } from '../../types/monitoring.types';
import { LOG_COLORS } from '../../lib/constants';

const { Text } = Typography;
const { useToken } = theme;

interface MonitoringLogsProps {
  logs: LogEntry[];
  loading: boolean;
}

const MonitoringLogs: React.FC<MonitoringLogsProps> = ({ logs, loading }) => {
  const { token } = useToken();

  const columns = [
    {
      title: 'Время',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (time: string) =>
        new Date(time).toLocaleTimeString('ru-RU', { hour12: false }),
    },
    {
      title: 'Уровень',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: LogEntry['level']) => (
        <Tag color={LOG_COLORS[level] || 'default'} style={{ fontSize: 11, padding: '0 6px' }}>
          {level}
        </Tag>
      ),
    },
    {
      title: 'Сообщение',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (msg: string) => (
        <Text style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12 }}>
          {msg}
        </Text>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={logs}
      rowKey={(_, index) => index}
      pagination={false}
      size="small"
      loading={loading}
      rowClassName={(record) => {
        if (record.level === 'ERROR') return 'log-error';
        if (record.level === 'WARN') return 'log-warn';
        return '';
      }}
      style={{ tableLayout: 'fixed' }}
    />
  );
};

export default MonitoringLogs;