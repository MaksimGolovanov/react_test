import React from 'react'
import { Space, Divider } from 'antd'


const StatisticsBar = ({ statistics, selectedDate }) => {
    return (
        <Space size="middle" wrap>
            <div>
                <span style={{ fontSize: '12px', color: '#8c8c8c', marginRight: 8 }}>
                    Дата:
                </span>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    {selectedDate?.format('DD.MM.YYYY')}
                </span>
            </div>
            <Divider type="vertical" style={{ height: 24, margin: 0 }} />
            <div>
                <span style={{ fontSize: '12px', color: '#8c8c8c', marginRight: 8 }}>
                    Всего:
                </span>
                <span style={{ fontSize: '16px', fontWeight: 500 }}>
                    {statistics.total}
                </span>
            </div>
            <Divider type="vertical" style={{ height: 24, margin: 0 }} />
            <div>
                <span style={{ fontSize: '12px', color: '#8c8c8c', marginRight: 8 }}>
                    Исправны:
                </span>
                <span style={{ fontSize: '16px', fontWeight: 500, color: '#3f8600' }}>
                    {statistics.available}
                </span>
            </div>
            <Divider type="vertical" style={{ height: 24, margin: 0 }} />
            <div>
                <span style={{ fontSize: '12px', color: '#8c8c8c', marginRight: 8 }}>
                    Забронировано:
                </span>
                <span style={{ fontSize: '16px', fontWeight: 500, color: '#1890ff' }}>
                    {statistics.booked}
                </span>
            </div>
            <Divider type="vertical" style={{ height: 24, margin: 0 }} />
            <div>
                <span style={{ fontSize: '12px', color: '#8c8c8c', marginRight: 8 }}>
                    Неисправны:
                </span>
                <span style={{ fontSize: '16px', fontWeight: 500, color: '#cf1322' }}>
                    {statistics.unavailable}
                </span>
            </div>
        </Space>
    )
}

export default StatisticsBar