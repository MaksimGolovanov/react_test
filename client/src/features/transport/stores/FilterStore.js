import { makeAutoObservable, computed } from 'mobx'
import dayjs from 'dayjs'

class FilterStore {
    filterStatus = 'all'
    filterType = 'all'
    filterDepartment = 'all'
    selectedDate = null
    searchText = ''

    constructor(rootStore) {
        makeAutoObservable(this)
        this.rootStore = rootStore
        this.selectedDate = dayjs().startOf('day')
    }

    setFilterStatus(status) {
        this.filterStatus = status
    }

    setFilterType(type) {
        this.filterType = type
    }

    setFilterDepartment(department) {
        this.filterDepartment = department
    }

    setSelectedDate(date) {
        this.selectedDate = date
    }

    setSearchText(text) {
        this.searchText = text
    }

    resetAllFilters() {
        this.filterStatus = 'all'
        this.filterType = 'all'
        this.filterDepartment = 'all'
        this.searchText = ''
    }

    resetTypeFilter() {
        this.filterType = 'all'
    }

    resetDepartmentFilter() {
        this.filterDepartment = 'all'
    }

    // Убираем @computed, используем getter (makeAutoObservable сам сделает его computed)
    get filteredVehicles() {
        const { transportStore } = this.rootStore
        let result = [...transportStore.vehicles]

        if (this.filterStatus === 'available') {
            result = result.filter(v => v.technical_condition === 'исправен')
        } else if (this.filterStatus === 'unavailable') {
            result = result.filter(v => v.technical_condition !== 'исправен')
        }

        if (this.filterType !== 'all') {
            result = result.filter(v => v.vehicle_type === this.filterType)
        }

        if (this.filterDepartment !== 'all' && this.selectedDate) {
            const date = this.selectedDate.format('YYYY-MM-DD')
            result = result.filter(vehicle =>
                transportStore.bookings.some(
                    b => b.vehicle_id === vehicle.id &&
                    b.booking_date === date &&
                    b.department_id === this.filterDepartment &&
                    b.status === 'active'
                )
            )
        }

        if (this.searchText) {
            const searchLower = this.searchText.toLowerCase()
            result = result.filter(vehicle =>
                vehicle.vehicle_brand?.toLowerCase().includes(searchLower) ||
                vehicle.state_number?.toLowerCase().includes(searchLower) ||
                vehicle.driver_full_name?.toLowerCase().includes(searchLower) ||
                vehicle.technical_condition?.toLowerCase().includes(searchLower) ||
                vehicle.vehicle_type?.toLowerCase().includes(searchLower) ||
                vehicle.vehicle_subtype?.toLowerCase().includes(searchLower) ||
                vehicle.company_affiliation?.toLowerCase().includes(searchLower)
            )
        }

        return result
    }

    get hasActiveFilters() {
        return this.filterStatus !== 'all' ||
            this.filterType !== 'all' ||
            this.filterDepartment !== 'all' ||
            !!this.searchText
    }
}

export default FilterStore