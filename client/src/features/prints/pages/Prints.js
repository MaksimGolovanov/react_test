// src/features/prints/pages/Prints.js
import React from 'react';
import { Tabs, theme } from 'antd';
import { PrinterOutlined, DatabaseOutlined, EnvironmentOutlined, BarChartOutlined } from '@ant-design/icons';
import PrintModel from '../components/PrintModel';
import PrintLocation from '../components/PrintLocation';
import PrintAll from '../components/PrintAll';
import PrintReport from '../components/PrintReport';

const { useToken } = theme;

function Print() {
  const { token } = useToken();
  const items = [
    { key: 'Prints', label: <><PrinterOutlined /> <span style={{ marginLeft: 8 }}>Принтеры</span></>, children: <PrintAll /> },
    { key: 'print_model', label: <><DatabaseOutlined /> <span style={{ marginLeft: 8 }}>Справочник принтеров</span></>, children: <PrintModel /> },
    { key: 'location', label: <><EnvironmentOutlined /> <span style={{ marginLeft: 8 }}>Справочник зданий</span></>, children: <PrintLocation /> },
    { key: 'print_statistic', label: <><BarChartOutlined /> <span style={{ marginLeft: 8 }}>Отчет</span></>, children: <PrintReport /> },
  ];
  return (
    <div>
      <div style={{  padding: '20px 24px' }}>
        <Tabs defaultActiveKey="Prints" items={items} size="large" tabBarStyle={{ marginBottom: 24, borderBottom: `1px solid ${token.colorBorder}` }} />
      </div>
    </div>
  );
}

export default Print;