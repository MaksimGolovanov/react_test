import React, { useState } from 'react';  // добавить useState если его нет
import { Table } from 'antd';
import { getBookingTableColumns } from './BookingTableColumns';
import { BookingTableFilters } from './BookingTableFilters';

export const BookingTableTab = ({
  vehicles,
  bookings,
  departments,
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
  handleBookVehicle,
  handleCancelBooking,
  getVehicleBookingsForDate,
  getCellColor,
  uniqueTypes,
  filteredVehicles,
  timeSlots,
}) => {
  // Состояние для поиска
  const [searchText, setSearchText] = useState('');

  // Фильтрация автомобилей по поисковому запросу
  const getFilteredBySearch = () => {
    if (!searchText.trim()) return filteredVehicles;
    
    const searchLower = searchText.toLowerCase().trim();
    return filteredVehicles.filter(vehicle => 
      vehicle.vehicle_brand?.toLowerCase().includes(searchLower) ||
      vehicle.state_number?.toLowerCase().includes(searchLower) ||
      vehicle.vehicle_type?.toLowerCase().includes(searchLower) ||
      vehicle.vehicle_subtype?.toLowerCase().includes(searchLower) ||
      vehicle.company_affiliation?.toLowerCase().includes(searchLower)
    );
  };

  const finalFilteredVehicles = getFilteredBySearch();

  // Обновленный сброс всех фильтров
  const handleResetAllFiltersWithSearch = () => {
    handleResetAllFilters();
    setSearchText('');
  };

  const columns = getBookingTableColumns({
    selectedDate,
    bookings,
    filterDepartment: filters.filterDepartment,
    handleCancelBooking,
    handleBookVehicle,
    getVehicleBookingsForDate,
    getCellColor,
    TIME_SLOTS: timeSlots,
  });

  return (
    <Table
      columns={columns}
      dataSource={finalFilteredVehicles}
      rowKey="id"
      scroll={{ y: 'calc(100vh - 300px)' }}
      pagination={false}
      size="small"
      bordered
      tableLayout="auto"
      title={() => (
        <BookingTableFilters
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          filters={filters}
          setFilterStatus={setFilterStatus}
          setFilterType={setFilterType}
          setFilterDepartment={setFilterDepartment}
          handleRefreshData={handleRefreshData}
          handleResetTypeFilter={handleResetTypeFilter}
          handleResetDepartmentFilter={handleResetDepartmentFilter}
          handleResetAllFilters={handleResetAllFiltersWithSearch}
          uniqueTypes={uniqueTypes}
          departments={departments}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      )}
    />
  );
};