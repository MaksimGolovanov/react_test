import React, { useState, useMemo } from 'react'
import IpStore from '../store/IpStore'
import { observer } from 'mobx-react-lite'
import { Alert, Spin, Card } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import styles from './style.module.css'

import IpTable from '../ui/IpTable/IpTable'
import IpModal from '../ui/IpModal/IpModal'
import IpHeader from '../ui/IpHeader/IpHeader'

const ipToNumber = (ip) => {
    if (!ip) return 0
    return ip.split('.').reduce((acc, octet, index) => {
        return acc + parseInt(octet, 10) * Math.pow(256, 3 - index)
    }, 0)
}

const IpAddress = observer(() => {
    const [searchTerm, setSearchTerm] = useState('')
    const [sortConfig, setSortConfig] = useState({
        key: 'ip',
        direction: 'ascending',
    })
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentIp, setCurrentIp] = useState(null)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRow, setSelectedRow] = useState(null)

    const filteredIps = useMemo(() => {
        if (!IpStore.ipaddress) return []
        return IpStore.ipaddress.filter(
            (ip) =>
                ip.ip.includes(searchTerm) ||
                (ip.description && ip.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (ip.device_type && ip.device_type.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    }, [searchTerm, IpStore.ipaddress])

    const sortedIps = useMemo(() => {
        if (!filteredIps) return []
        let sortableItems = [...filteredIps]

        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (sortConfig.key === 'ip') {
                    const aValue = ipToNumber(a.ip)
                    const bValue = ipToNumber(b.ip)
                    return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue
                }

                const aValue = a[sortConfig.key] || ''
                const bValue = b[sortConfig.key] || ''

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1
                }
                return 0
            })
        }
        return sortableItems
    }, [filteredIps, sortConfig])

    const requestSort = (key) => {
        let direction = 'ascending'
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })
    }

    const handleAddNew = () => {
        setCurrentIp(null)
        setIsModalVisible(true)
    }

    const handleEdit = (ip) => {
        setCurrentIp(ip)
        setIsModalVisible(true)
    }

    const handleModalClose = () => {
        setIsModalVisible(false)
        setCurrentIp(null)
    }

    if (IpStore.error) {
        return (
            <div style={{ padding: 24 }}>
                <Alert message="Ошибка загрузки данных" description={IpStore.error.message} type="error" showIcon />
            </div>
        )
    }

    if (IpStore.isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                }}
            >
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} size="large" />
                <p style={{ marginTop: 16 }}>Загрузка данных об IP-адресах...</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <IpHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddNew={handleAddNew}
                selectedRow={selectedRow}
                onEdit={handleEdit}
                onDelete={() => {
                    setSelectedRowKeys([])
                    setSelectedRow(null)
                }}
            />

            <Card className={styles.tableCard}>
                <div className={styles.userListScroll}>
                    <IpTable
                        data={sortedIps}
                        sortConfig={sortConfig}
                        onSort={requestSort}
                        selectedRowKeys={selectedRowKeys}
                        onSelectionChange={(keys, rows) => {
                            setSelectedRowKeys(keys)
                            setSelectedRow(rows[0] || null)
                        }}
                    />
                </div>
            </Card>

            <IpModal
                visible={isModalVisible}
                currentIp={currentIp}
                onCancel={handleModalClose}
                onSuccess={() => {
                    handleModalClose()
                    setSelectedRowKeys([])
                    setSelectedRow(null)
                }}
            />
        </div>
    )
})

export default IpAddress