import React from 'react';
import { Space, Button, Select, Input } from 'antd';
import {
  ReloadOutlined,
  FilterOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import WeekDayPicker from './../VehicleWeek/WeekDayPicker';

dayjs.locale('ru');

const { Option } = Select;

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
  departmentsList, // массив отделов { id, name }
  searchText,
  setSearchText,
  showStatusFilter = false,
  token,
}) => {
  const hasActiveFilters =
    filters.filterStatus !== 'all' ||
    filters.filterType !== 'all' ||
    filters.filterDepartment !== 'all' ||
    searchText !== '';

  const isPastDate =
    selectedDate && selectedDate.isBefore(dayjs().startOf('day'), 'day');

  const handleClearSearch = () => {
    setSearchText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Первая строка: выбор даты и кнопка обновления */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <WeekDayPicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <Button
          size="small"
          icon={<ReloadOutlined />}
          onClick={handleRefreshData}
          type="text"
        />

        {isPastDate && (
          <span style={{  color: token.colorWarning}}>
            ⚠️ Просмотр
          </span>
        )}
      </div>

      {/* Вторая строка: строка поиска и фильтры */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <Input
          placeholder="Поиск по модели, госномеру, типу, подтипу..."
          prefix={<SearchOutlined style={{ color: token.colorTextDisabled  }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          onClear={handleClearSearch}
          style={{ width: 280 }}
          size="small"
        />

        <Space size="small" wrap>
          <FilterOutlined style={{  color: token.colorPrimary  }} />

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
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>

          {/* Исправленный Select для отделов – отображаем названия, значение = id (UUID) */}
          <Select
            value={filters.filterDepartment}
            onChange={setFilterDepartment}
            style={{ width: 180 }}
            size="small"
            placeholder="Служба"
            allowClear
          >
            <Option value="all">Все службы</Option>
            {departmentsList.map((dept) => (
              <Option key={dept.id} value={dept.short_name || dept.name}>
                {dept.short_name || dept.name}
              </Option>
            ))}
          </Select>

          {showStatusFilter && (
            <Select
              value={filters.filterStatus}
              onChange={setFilterStatus}
              style={{ width: 130 }}
              size="small"
              placeholder="Статус заявки"
              allowClear
            >
              <Option value="all">Все статусы</Option>
              <Option value="pending">Ожидает</Option>
              <Option value="confirmed">Подтверждено</Option>
              <Option value="cancelled">Отменено</Option>
              <Option value="rescheduled">Перенесено</Option>
            </Select>
          )}

          {hasActiveFilters && (
            <Button size="small" onClick={handleResetAllFilters} type="link">
              Сброс
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};
