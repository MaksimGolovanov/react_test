import React, { useState, useEffect, useRef } from 'react'
import { Space, Button, Select, Tooltip, Input } from 'antd'
import { ReloadOutlined, FilterOutlined, LeftOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

dayjs.locale('ru')

const { Option } = Select

// Компонент выбора дня недели - текущий день всегда по центру
const WeekDayPicker = ({ selectedDate, setSelectedDate }) => {
    const today = dayjs().startOf('day')
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
    const containerRef = useRef(null)
    
    // Генерируем дни относительно сегодняшнего дня
    // Всегда 7 дней: 3 дня до сегодня, сегодня, 3 дня после
    const getDaysRelativeToToday = () => {
        const days = []
        const baseDate = today.add(currentWeekOffset, 'week')
        for (let i = -3; i <= 3; i++) {
            days.push(baseDate.add(i, 'day'))
        }
        return days
    }
    
    const weekDays = getDaysRelativeToToday()
    
    // Прокрутка к сегодняшнему дню (всегда индекс 3)
    useEffect(() => {
        if (containerRef.current) {
            const todayIndex = 3 // сегодня всегда на позиции 3 (центр)
            const scrollAmount = todayIndex * 56 - containerRef.current.clientWidth / 2 + 28
            containerRef.current.scrollTo({ left: scrollAmount, behavior: 'auto' })
        }
    }, [currentWeekOffset])
    
    // Предыдущая неделя
    const goToPrevWeek = () => {
        setCurrentWeekOffset(currentWeekOffset - 1)
    }
    
    // Следующая неделя
    const goToNextWeek = () => {
        setCurrentWeekOffset(currentWeekOffset + 1)
    }
    
    // Текущая неделя
    const goToCurrentWeek = () => {
        setCurrentWeekOffset(0)
        setSelectedDate(today)
    }
    
    const isPast = (day) => day.isBefore(today, 'day')
    const isToday = (day) => day.isSame(today, 'day')
    const isSelected = (day) => day.isSame(selectedDate, 'day')
    
    
    const isCurrentWeek = currentWeekOffset === 0
    
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tooltip title="Предыдущая неделя">
                <Button
                    size="small"
                    icon={<LeftOutlined />}
                    onClick={goToPrevWeek}
                    type="text"
                />
            </Tooltip>
            
            <div 
                ref={containerRef}
                style={{ 
                    display: 'flex', 
                    gap: '4px',
                    overflowX: 'auto',
                    scrollbarWidth: 'thin',
                    flex: 1
                }}
            >
                {weekDays.map((day) => {
                    const isPastDay = isPast(day)
                    const isTodayDay = isToday(day)
                    const isSelectedDay = isSelected(day)
                    
                    return (
                        <Tooltip
                            key={day.format('DD.MM.YYYY')}
                            title={isPastDay ? 'Нельзя бронировать (прошедшая дата)' : ''}
                        >
                            <Button
                                size="small"
                                style={{
                                    minWidth: '52px',
                                    padding: '2px 4px',
                                    height: 'auto',
                                    textAlign: 'center',
                                    backgroundColor: isSelectedDay ? '#faad14' : isTodayDay ? '#52c41a' : isPastDay ? '#f5f5f5' : '#fff',
                                    borderColor: isSelectedDay || isTodayDay ? 'transparent' : '#d9d9d9',
                                    color: isSelectedDay || isTodayDay ? '#fff' : isPastDay ? '#bfbfbf' : '#666',
                                    cursor: 'pointer',
                                    opacity: isPastDay ? 0.6 : 1
                                }}
                                onClick={() => setSelectedDate(day.startOf('day'))}
                            >
                                <div style={{ fontSize: '11px', fontWeight: isSelectedDay ? 600 : 400 }}>
                                    {day.format('ddd').toUpperCase().slice(0, 2)}
                                </div>
                                <div style={{ fontSize: '10px' }}>{day.format('DD')}</div>
                            </Button>
                        </Tooltip>
                    )
                })}
            </div>
            
            <Tooltip title="Следующая неделя">
                <Button
                    size="small"
                    icon={<RightOutlined />}
                    onClick={goToNextWeek}
                    type="text"
                />
            </Tooltip>
            
            {!isCurrentWeek && (
                <Button
                    size="small"
                    onClick={goToCurrentWeek}
                    type="link"
                    style={{ fontSize: '11px', padding: '0 4px' }}
                >
                    Текущая
                </Button>
            )}
        </div>
    )
}

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
    searchText,           // новый пропс
    setSearchText,        // новый пропс
}) => {
    const hasActiveFilters = filters.filterStatus !== 'all' ||
        filters.filterType !== 'all' ||
        filters.filterDepartment !== 'all' ||
        searchText !== ''
    
    const isPastDate = selectedDate && selectedDate.isBefore(dayjs().startOf('day'), 'day')

    const handleClearSearch = () => {
        setSearchText('')
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Первая строка: выбор даты и кнопка обновления */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <WeekDayPicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                
                <Button
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={handleRefreshData}
                    type="text"
                />
                
                {isPastDate && (
                    <span style={{ fontSize: '11px', color: '#faad14' }}>
                        ⚠️ Просмотр
                    </span>
                )}
            </div>

            {/* Вторая строка: строка поиска и фильтры */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <Input
                    placeholder="Поиск по модели, госномеру, типу, подтипу..."
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                    onClear={handleClearSearch}
                    style={{ width: 280 }}
                    size="small"
                />
                
                <Space size="small" wrap>
                    <FilterOutlined style={{ color: '#1890ff', fontSize: 12 }} />
                    
                    <Select
                        value={filters.filterStatus}
                        onChange={setFilterStatus}
                        style={{ width: 110 }}
                        size="small"
                        placeholder="Состояние"
                    >
                        <Option value="all">Все авто</Option>
                        <Option value="available">Исправные</Option>
                        <Option value="unavailable">Неисправные</Option>
                    </Select>

                    <Select
                        value={filters.filterType}
                        onChange={setFilterType}
                        style={{ width: 120 }}
                        size="small"
                        onClear={handleResetTypeFilter}
                        placeholder="Тип"
                        
                    >
                        <Option value="all">Все типы</Option>
                        {uniqueTypes.map((type) => (
                            <Option key={type} value={type}>{type}</Option>
                        ))}
                    </Select>

                    <Select
                        value={filters.filterDepartment}
                        onChange={setFilterDepartment}
                        style={{ width: 130 }}
                        size="small"
                        onClear={handleResetDepartmentFilter}
                        placeholder="Служба"
                        
                    >
                        <Option value="all">Все службы</Option>
                        {departments.map((dept) => (
                            <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                        ))}
                    </Select>

                    {hasActiveFilters && (
                        <Button size="small" onClick={handleResetAllFilters} type="link">
                            Сброс
                        </Button>
                    )}
                </Space>
            </div>
        </div>
    )
}