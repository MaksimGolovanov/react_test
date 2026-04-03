import React from 'react'
import { Space, Button, Badge, Tooltip, Tag } from 'antd'
import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons'

export const getBookingTableColumns = ({
    selectedDate,
    bookings,
    filterDepartment,
    handleCancelBooking,
    handleBookVehicle,
    getVehicleBookingsForDate,
    getCellColor,
    TIME_SLOTS,
}) => {
    const renderBookingsCell = (_, record) => {
        const date = selectedDate.format('YYYY-MM-DD')
        let vehicleBookings = bookings.filter(
            (b) => b.vehicle_id === record.id && b.booking_date === date && b.status === 'active'
        )

        if (filterDepartment !== 'all') {
            vehicleBookings = vehicleBookings.filter(
                (b) => b.department_id === filterDepartment
            )
        }

        if (vehicleBookings.length === 0) {
            return <Badge status="default" text="Свободно" />
        }

        return (
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {vehicleBookings.map((booking) => {
                    const timeSlot = TIME_SLOTS.find(
                        (slot) => slot.id === booking.time_slot_id
                    )
                    return (
                        <Tooltip
                            key={booking.id}
                            title={booking.purpose ? `Цель: ${booking.purpose}` : 'Цель не указана'}
                            placement="topLeft"
                        >
                            <Tag
                                color="blue"
                                closable
                                onClose={(e) => {
                                    e.preventDefault()
                                    handleCancelBooking(booking.id)
                                }}
                                style={{
                                    cursor: 'pointer',
                                    margin: '2px 0',
                                    display: 'block',
                                    textAlign: 'center',
                                }}
                            >
                                <Space size="small">
                                    <InfoCircleOutlined />
                                    <span>
                                        {timeSlot?.label || 'Забронировано'} - {booking.department_name}
                                    </span>
                                </Space>
                            </Tag>
                        </Tooltip>
                    )
                })}
            </Space>
        )
    }

    const renderActionCell = (_, record) => {
        const date = selectedDate.format('YYYY-MM-DD')
        const currentBookings = getVehicleBookingsForDate(record.id, date)
        const isFullyBooked = currentBookings.length >= TIME_SLOTS.length

        return (
            <Space size="middle">
                <Button
                    type="primary"
                    size="small"
                    onClick={() => handleBookVehicle(record)}
                    disabled={record.technical_condition !== 'исправен' || isFullyBooked}
                >
                    Забронировать
                </Button>
            </Space>
        )
    }

    return [
        {
            title: 'Модель',
            dataIndex: 'vehicle_brand',
            key: 'model',
            width: 120,
            onCell: (record) => ({ className: getCellColor(record, 'model') }),
            sorter: (a, b) => a.vehicle_brand?.localeCompare(b.vehicle_brand),
            showSorterTooltip: false,
        },
        {
            title: 'Госномер',
            dataIndex: 'state_number',
            key: 'stateNumber',
            width: 100,
            onCell: (record) => ({ className: getCellColor(record, 'stateNumber') }),
            sorter: (a, b) => a.state_number?.localeCompare(b.state_number),
            showSorterTooltip: false,
        },
        {
            title: 'Тип транспорта',
            dataIndex: 'vehicle_type',
            key: 'type',
            width: 120,
            onCell: (record) => ({ className: getCellColor(record, 'type') }),
            sorter: (a, b) => a.vehicle_type?.localeCompare(b.vehicle_type),
            showSorterTooltip: false,
        },
        {
            title: 'Подтип',
            dataIndex: 'vehicle_subtype',
            key: 'subtype',
            width: 140,
            onCell: (record) => ({ className: getCellColor(record, 'subtype') }),
            sorter: (a, b) => a.vehicle_subtype?.localeCompare(b.vehicle_subtype),
            showSorterTooltip: false,
        },
        {
            title: 'Водитель',
            dataIndex: 'driver_full_name',
            key: 'driver',
            width: 130,
            render: (text) => (
                <Space>
                    <UserOutlined />
                    <span>Таб. №{text}</span>
                </Space>
            ),
            onCell: (record) => ({ className: getCellColor(record, 'driver') }),
            sorter: (a, b) => a.driver_full_name?.localeCompare(b.driver_full_name),
            showSorterTooltip: false,
        },
        {
            title: 'Принадлежность',
            dataIndex: 'company_affiliation',
            key: 'affiliation',
            width: 130,
            onCell: (record) => ({ className: getCellColor(record, 'affiliation') }),
            sorter: (a, b) => a.company_affiliation?.localeCompare(b.company_affiliation),
            showSorterTooltip: false,
        },
        {
            title: 'Бронирования',
            key: 'bookings',
            width: 280,
            render: renderBookingsCell,
            onCell: (record) => ({ className: getCellColor(record, 'bookings') }),
            sorter: (a, b) => {
                const date = selectedDate.format('YYYY-MM-DD')
                const aBookings = bookings.filter(
                    (b) => b.vehicle_id === a.id && b.booking_date === date && b.status === 'active'
                )
                const bBookings = bookings.filter(
                    (b) => b.vehicle_id === b.id && b.booking_date === date && b.status === 'active'
                )
                return aBookings.length - bBookings.length
            },
        },
        {
            title: 'Действия',
            key: 'action',
            width: 100,
            render: renderActionCell,
            onCell: (record) => ({ className: getCellColor(record, 'action') }),
        },
    ]
}