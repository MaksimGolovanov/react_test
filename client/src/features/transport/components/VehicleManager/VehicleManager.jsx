import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Table, Button, Space, Popconfirm, message, Row, Col, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { VehicleModal } from './VehicleModal'
import { VehicleSearch } from './VehicleSearch'
import { useRootStore } from '../../hooks/useStores'

const VehicleManager = observer(() => {
    const { transportStore, filterStore } = useRootStore()
    const [modalVisible, setModalVisible] = useState(false)
    const [editingVehicle, setEditingVehicle] = useState(null)

    const handleAddVehicle = () => {
        setEditingVehicle(null)
        setModalVisible(true)
    }

    const handleEditVehicle = (record) => {
        setEditingVehicle(record)
        setModalVisible(true)
    }

    const handleSaveVehicle = async (values) => {
        if (editingVehicle) {
            await transportStore.updateVehicle(editingVehicle.id, values)
            message.success('Автомобиль обновлен')
        } else {
            await transportStore.createVehicle(values)
            message.success('Автомобиль добавлен')
        }
        setModalVisible(false)
        setEditingVehicle(null)
    }

    const handleDeleteVehicle = async (id) => {
        await transportStore.deleteVehicle(id)
        message.success('Автомобиль удален')
    }

    const vehicleColumns = [
        {
            title: 'Модель',
            dataIndex: 'vehicle_brand',
            key: 'brand',
            width: 150,
            sorter: (a, b) => a.vehicle_brand?.localeCompare(b.vehicle_brand),
        },
        {
            title: 'Госномер',
            dataIndex: 'state_number',
            key: 'stateNumber',
            width: 120,
            sorter: (a, b) => a.state_number?.localeCompare(b.state_number),
        },
        {
            title: 'Тип транспорта',
            dataIndex: 'vehicle_type',
            key: 'type',
            width: 150,
            render: (text) => text || '—',
        },
        {
            title: 'Подтип',
            dataIndex: 'vehicle_subtype',
            key: 'subtype',
            width: 150,
        },
        {
            title: 'Водитель (таб.№)',
            dataIndex: 'driver_full_name',
            key: 'driver',
            width: 150,
        },
        {
            title: 'Тех. состояние',
            dataIndex: 'technical_condition',
            key: 'condition',
            width: 150,
            render: (text) => (
                <Tag color={text === 'исправен' ? 'success' : text === 'в ремонте' ? 'warning' : 'error'}>
                    {text}
                </Tag>
            ),
        },
        {
            title: 'Принадлежность',
            dataIndex: 'company_affiliation',
            key: 'affiliation',
            width: 150,
        },
        {
            title: 'Действия',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditVehicle(record)}
                    />
                    <Popconfirm
                        title="Удалить автомобиль?"
                        onConfirm={() => handleDeleteVehicle(record.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    const displayVehicles = filterStore.searchText
        ? filterStore.filteredVehicles
        : transportStore.vehicles

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col flex="auto">
                    <VehicleSearch
                        value={filterStore.searchText}
                        onChange={filterStore.setSearchText.bind(filterStore)}
                    />
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddVehicle}
                    >
                        Добавить автомобиль
                    </Button>
                </Col>
            </Row>

            <Table
                size="small"
                columns={vehicleColumns}
                dataSource={displayVehicles}
                rowKey="id"
                pagination={false}
                scroll={{ x: 1400, y: 'calc(100vh - 300px)' }}
                bordered
            />

            <VehicleModal
                visible={modalVisible}
                editingVehicle={editingVehicle}
                onSave={handleSaveVehicle}
                onCancel={() => {
                    setModalVisible(false)
                    setEditingVehicle(null)
                }}
                vehicleTypes={transportStore.vehicleTypes}
            />
        </div>
    )
})

export default VehicleManager