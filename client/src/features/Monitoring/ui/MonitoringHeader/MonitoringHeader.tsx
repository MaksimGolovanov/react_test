// src/modules/Monitoring/ui/MonitoringHeader/MonitoringHeader.tsx

import React from 'react';
import { Button, Space } from 'antd';
import {
  ReloadOutlined,
  ClearOutlined,
  PauseOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

interface MonitoringHeaderProps {
  loading: boolean;
  autoRefresh: boolean;
  onRefresh: () => void;
  onToggleAutoRefresh: () => void;
  onClearLogs: () => void;
}

const MonitoringHeader: React.FC<MonitoringHeaderProps> = ({
  loading,
  autoRefresh,
  onRefresh,
  onToggleAutoRefresh,
  onClearLogs,
}) => {
  return (
    <Space size="small" wrap>
      <Button
        type="primary"
        icon={<ReloadOutlined />}
        onClick={onRefresh}
        loading={loading}
        size="small"
      >
        Обновить
      </Button>
      <Button
        icon={autoRefresh ? <PauseOutlined /> : <PlayCircleOutlined />}
        onClick={onToggleAutoRefresh}
        type={autoRefresh ? 'default' : 'dashed'}
        size="small"
      >
        {autoRefresh ? 'Автообновление вкл' : 'Автообновление выкл'}
      </Button>
      <Button danger icon={<ClearOutlined />} onClick={onClearLogs} size="small">
        Очистить экран
      </Button>
    </Space>
  );
};

export default MonitoringHeader;