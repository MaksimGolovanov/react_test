import React from 'react';
import { Space, Divider, theme } from 'antd';

const { useToken } = theme;

const StatisticsBar = ({ statistics, selectedDate }) => {
  const { token } = useToken();
  return (
    <Space size="middle" wrap>
      <div><span style={{ color: token.colorTextSecondary, fontSize: 12, marginRight: 8 }}>Дата:</span><span style={{ color: token.colorText }}>{selectedDate?.format('DD.MM.YYYY')}</span></div>
      <Divider type="vertical" style={{ borderColor: token.colorBorder, height: 24, margin: 0 }} />
      <div><span style={{ color: token.colorTextSecondary, fontSize: 12, marginRight: 8 }}>Всего:</span><span style={{ color: token.colorText, fontSize: 16, fontWeight: 500 }}>{statistics.total}</span></div>
      <Divider type="vertical" style={{ borderColor: token.colorBorder, height: 24, margin: 0 }} />
      <div><span style={{ color: token.colorTextSecondary, fontSize: 12, marginRight: 8 }}>Исправны:</span><span style={{ color: token.colorSuccess, fontSize: 16, fontWeight: 500 }}>{statistics.available}</span></div>
      <Divider type="vertical" style={{ borderColor: token.colorBorder, height: 24, margin: 0 }} />
      <div><span style={{ color: token.colorTextSecondary, fontSize: 12, marginRight: 8 }}>Забронировано:</span><span style={{ color: token.colorPrimary, fontSize: 16, fontWeight: 500 }}>{statistics.booked}</span></div>
      <Divider type="vertical" style={{ borderColor: token.colorBorder, height: 24, margin: 0 }} />
      <div><span style={{ color: token.colorTextSecondary, fontSize: 12, marginRight: 8 }}>Неисправны:</span><span style={{ color: token.colorError, fontSize: 16, fontWeight: 500 }}>{statistics.unavailable}</span></div>
    </Space>
  );
};

export default StatisticsBar;