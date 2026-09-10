// src/modules/Monitoring/ui/MonitoringStatus/MonitoringStatus.tsx

import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import {
  ClockCircleOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  HddOutlined,
} from '@ant-design/icons';
import { ServerStatus } from '../../types/monitoring.types';

interface MonitoringStatusProps {
  status: ServerStatus | null;
  loading: boolean;
}

const MonitoringStatus: React.FC<MonitoringStatusProps> = ({ status, loading }) => {
  const uptimeHours = status ? Math.floor(status.uptime / 3600) : 0;
  const memoryUsed = status?.memoryUsage?.heapUsed
    ? (status.memoryUsage.heapUsed / 1024 / 1024).toFixed(1)
    : '—';
  const loadAvg = status?.loadAverage?.[0]?.toFixed(2) || '—';
  const dbStatus = status?.database || 'проверка...';
  const dbColor = dbStatus === 'connected' ? '#3f8600' : '#cf1322';

  return (
    <Row gutter={[8, 8]} style={{ marginBottom: 8 }}>
      <Col xs={12} sm={6}>
        <Card size="small" bodyStyle={{ padding: '8px 12px' }} loading={loading}>
          <Statistic
            title="Время работы"
            value={uptimeHours}
            suffix="ч"
            prefix={<ClockCircleOutlined />}
            valueStyle={{ fontSize: 18 }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card size="small" bodyStyle={{ padding: '8px 12px' }} loading={loading}>
          <Statistic
            title="Память (heap)"
            value={memoryUsed}
            suffix="MB"
            prefix={<HddOutlined />}
            valueStyle={{ fontSize: 18 }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card size="small" bodyStyle={{ padding: '8px 12px' }} loading={loading}>
          <Statistic
            title="Нагрузка (1 мин)"
            value={loadAvg}
            prefix={<CloudServerOutlined />}
            valueStyle={{ fontSize: 18 }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card size="small" bodyStyle={{ padding: '8px 12px' }} loading={loading}>
          <Statistic
            title="База данных"
            value={dbStatus}
            valueStyle={{ color: dbColor, fontSize: 18 }}
            prefix={<DatabaseOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default MonitoringStatus;