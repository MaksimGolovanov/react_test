import React from 'react'
import { Table, Tag, Tooltip } from 'antd'
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'

const IpTable = ({ data, sortConfig, onSort, selectedRowKeys, onSelectionChange }) => {
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null
        return sortConfig.direction === 'ascending' ? (
            <SortAscendingOutlined style={{ marginLeft: 5 }} />
        ) : (
            <SortDescendingOutlined style={{ marginLeft: 5 }} />
        )
    }

    const columns = [
        {
            title: (
                <span onClick={() => onSort('ip')} style={{ cursor: 'pointer' }}>
                    IP-адрес {getSortIcon('ip')}
                </span>
            ),
            dataIndex: 'ip',
            key: 'ip',
            width: '130px',
            render: (text) => (
                <Tag color="blue" style={{ fontFamily: 'monospace' }}>
                    {text}
                </Tag>
            ),
        },
        {
            title: (
                <span onClick={() => onSort('subnet_mask')} style={{ cursor: 'pointer' }}>
                    Маска подсети {getSortIcon('subnet_mask')}
                </span>
            ),
            dataIndex: 'subnet_mask',
            key: 'subnet_mask',
            width: '130px',
            
        },
        {
            title: (
                <span onClick={() => onSort('device_type')} style={{ cursor: 'pointer' }}>
                    Тип устройства {getSortIcon('device_type')}
                </span>
            ),
            dataIndex: 'device_type',
            key: 'device_type',
            width: '200px',
            
        },
        {
            title: (
                <span onClick={() => onSort('switch')} style={{ cursor: 'pointer' }}>
                    Коммутатор {getSortIcon('switch')}
                </span>
            ),
            dataIndex: 'switch',
            key: 'switch',
            width: '200px',
            
        },
        {
            title: (
                <span onClick={() => onSort('switch_port')} style={{ cursor: 'pointer' }}>
                    Порт {getSortIcon('switch_port')}
                </span>
            ),
            dataIndex: 'switch_port',
            key: 'switch_port',
            width: '200px',
            
        },
        {
            title: (
                <span onClick={() => onSort('network_segment')} style={{ cursor: 'pointer' }}>
                    Сегмент сети {getSortIcon('network_segment')}
                </span>
            ),
            dataIndex: 'network_segment',
            key: 'network_segment',
            width: '200px',
            
        },
        {
            title: (
                <span onClick={() => onSort('description')} style={{ cursor: 'pointer' }}>
                    Описание {getSortIcon('description')}
                </span>
            ),
            dataIndex: 'description',
            key: 'description',
            
            ellipsis: {
                showTitle: false,
            },
            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    {text || <span style={{ color: '#8c8c8c', fontStyle: 'italic' }}>нет описания</span>}
                </Tooltip>
            ),
        },
    ]

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectionChange,
        type: 'radio',
        columnWidth: 60,
    }

    return (
        <Table
            size="middle"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            style={{ width: '100%' }}
        />
    )
}

export default IpTable