import React from 'react'
import { Space, DatePicker, Button, Select } from 'antd'
import { CalendarOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import locale from 'antd/es/date-picker/locale/ru_RU'

const { Option } = Select

export const BookingTableFilters = ({
    selectedDate,
    setSelectedDate,
    filters,
    setFilterStatus,
    setFilterType,
    setFilterDepartment,
    handleRefreshData,
    handleResetTypeFilter,
    handleResetDepartmentFilter,
    handleResetAllFilters,
    uniqueTypes,
    departments,
}) => {
    const handleDateChange = (date) => {
        if (date && date.isValid()) {
            setSelectedDate(date.startOf('day'))
        } else {
            setSelectedDate(dayjs().startOf('day'))
        }
    }

    const hasActiveFilters = filters.filterStatus !== 'all' ||
        filters.filterType !== 'all' ||
        filters.filterDepartment !== 'all'

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
        }}>
            <Space size="small" wrap>
                <Space>
                    <CalendarOutlined />
                    <span style={{ fontWeight: 'bold' }}>Бронирование на</span>
                </Space>
                <DatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    format="DD.MM.YYYY"
                    style={{ width: 130 }}
                    allowClear={false}
                    placeholder="Выберите дату"
                    locale={locale}
                />
                <Button
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={handleRefreshData}
                    type="text"
                    title="Обновить данные"
                >
                    Обновить
                </Button>
            </Space>

            <Space size="middle" wrap>
                <Space size="small">
                    <FilterOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontSize: '14px' }}>Фильтры:</span>
                </Space>

                <Select
                    value={filters.filterStatus}
                    onChange={setFilterStatus}
                    style={{ width: 140 }}
                    size="small"
                    placeholder="Состояние"
                >
                    <Option value="all">Все авто</Option>
                    <Option value="available">Только исправные</Option>
                    <Option value="unavailable">Только неисправные</Option>
                </Select>

                <Select
                    value={filters.filterType}
                    onChange={setFilterType}
                    style={{ width: 150 }}
                    size="small"
                    placeholder="Тип транспорта"
                    allowClear
                    onClear={handleResetTypeFilter}
                >
                    <Option value="all">Все типы</Option>
                    {uniqueTypes.map((type) => (
                        <Option key={type} value={type}>{type}</Option>
                    ))}
                </Select>

                <Select
                    value={filters.filterDepartment}
                    onChange={setFilterDepartment}
                    style={{ width: 160 }}
                    size="small"
                    placeholder="Служба"
                    allowClear
                    onClear={handleResetDepartmentFilter}
                >
                    <Option value="all">Все службы</Option>
                    {departments.map((dept) => (
                        <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                    ))}
                </Select>

                {hasActiveFilters && (
                    <Button size="small" onClick={handleResetAllFilters} type="link">
                        Сбросить все
                    </Button>
                )}
            </Space>
        </div>
    )
}