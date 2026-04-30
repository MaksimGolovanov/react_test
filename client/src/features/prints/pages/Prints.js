import React from 'react';
import { Tabs } from 'antd';
import { PrinterOutlined, DatabaseOutlined, EnvironmentOutlined, BarChartOutlined } from '@ant-design/icons';
import './Prints.css';
import PrintModel from '../components/PrintModel';
import PrintLocation from '../components/PrintLocation';
import PrintAll from '../components/PrintAll';
import PrintReport from '../components/PrintReport';

function Print() {
    const items = [
        {
            key: 'Prints',
            label: (
                <span>
                    <PrinterOutlined />
                    <span style={{ marginLeft: 8 }}>Принтеры</span>
                </span>
            ),
            children: <PrintAll />,
        },
        {
            key: 'print_model',
            label: (
                <span>
                    <DatabaseOutlined />
                    <span style={{ marginLeft: 8 }}>Справочник принтеров</span>
                </span>
            ),
            children: <PrintModel />,
        },
        {
            key: 'location',
            label: (
                <span>
                    <EnvironmentOutlined />
                    <span style={{ marginLeft: 8 }}>Справочник зданий</span>
                </span>
            ),
            children: <PrintLocation />,
        },
        {
            key: 'print_statistic',
            label: (
                <span>
                    <BarChartOutlined />
                    <span style={{ marginLeft: 8 }}>Отчет</span>
                </span>
            ),
            children: <PrintReport />,
        },
    ];

    return (
        <div style={{ padding: 16, minHeight: 'calc(100vh - 250px)' }}>
            <div
                style={{
                    borderRadius: 16,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    padding: '20px 24px',
                    background: '#fff',
                }}
            >
                <Tabs
                    defaultActiveKey="Prints"
                    items={items}
                    size="large"
                    tabBarStyle={{
                        marginBottom: 24,
                        borderBottom: '1px solid #f0f0f0',
                    }}
                />
            </div>
        </div>
    );
}

export default Print;