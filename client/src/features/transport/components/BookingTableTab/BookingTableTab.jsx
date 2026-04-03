import React from 'react'
import { Table } from 'antd'
import { getBookingTableColumns } from './BookingTableColumns'
import { BookingTableFilters } from './BookingTableFilters'

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
    const columns = getBookingTableColumns({
        selectedDate,
        bookings,
        filterDepartment: filters.filterDepartment,
        handleCancelBooking,
        handleBookVehicle,
        getVehicleBookingsForDate,
        getCellColor,
        TIME_SLOTS: timeSlots,
    })

    return (
        <Table
            columns={columns}
            dataSource={filteredVehicles}
            rowKey="id"
            scroll={{ y: 'calc(100vh - 300px)' }}
            pagination={false}
            size="small"
            bordered
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
                    handleResetAllFilters={handleResetAllFilters}
                    uniqueTypes={uniqueTypes}
                    departments={departments}
                />
            )}
        />
    )
}