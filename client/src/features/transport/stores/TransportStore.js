import { makeAutoObservable, action } from 'mobx';
import TransportService from '../services/TransportService';

class TransportStore {
  // Автомобили
  vehicles = [];
  vehiclesLoading = true;

  // Бронирования
  bookings = [];
  bookingsLoading = true;

  // Отделы
  departments = [];
  departmentsLoading = true;

  // Типы и подтипы
  vehicleTypes = [];
  vehicleSubtypes = [];

  // Временные слоты
  timeSlots = [];

  // Статистика
  statistics = null;

  // Ошибки
  error = null;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  init = action(async () => {
    await Promise.all([
      this.fetchVehicles(),
      this.fetchBookings(),
      this.fetchDepartments(),
      this.fetchVehicleTypes(),
      this.fetchVehicleSubtypes(),
      this.fetchTimeSlots(),
      this.fetchStatistics(),
    ]);
  });

  // ========== АВТОМОБИЛИ ==========

  fetchVehicles = action(async () => {
    try {
      this.vehiclesLoading = true;
      const response = await TransportService.fetchVehicles();
      this.vehicles = response;
      this.error = null;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при загрузке автомобилей:', error);
    } finally {
      this.vehiclesLoading = false;
    }
  });

  createVehicle = action(async (vehicleData) => {
    try {
      const newVehicle = await TransportService.createVehicle(vehicleData);
      this.vehicles.push(newVehicle);
      return newVehicle;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при создании автомобиля:', error);
      throw error;
    }
  });

  updateVehicle = action(async (id, updatedData) => {
    try {
      const updated = await TransportService.updateVehicle(id, updatedData);
      const index = this.vehicles.findIndex((v) => v.id === id);
      if (index !== -1) {
        this.vehicles[index] = updated;
      }
      return updated;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при обновлении автомобиля:', error);
      throw error;
    }
  });

  deleteVehicle = action(async (id) => {
    try {
      await TransportService.deleteVehicle(id);
      this.vehicles = this.vehicles.filter((v) => v.id !== id);
      return true;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при удалении автомобиля:', error);
      throw error;
    }
  });

  // ========== БРОНИРОВАНИЯ ==========

  fetchBookings = action(async () => {
    try {
      this.bookingsLoading = true;
      const response = await TransportService.fetchBookings();
      this.bookings = response;
      this.error = null;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при загрузке бронирований:', error);
    } finally {
      this.bookingsLoading = false;
    }
  });

  fetchBookingsByDate = action(async (date) => {
    try {
      const response = await TransportService.fetchBookingsByDate(date);
      return response;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при загрузке бронирований по дате:', error);
      throw error;
    }
  });

  createBooking = action(async (bookingData) => {
    try {
      const newBooking = await TransportService.createBooking(bookingData);
      this.bookings.push(newBooking);
      return newBooking;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при создании бронирования:', error);
      throw error;
    }
  });

  cancelBooking = action(async (bookingId, cancelledBy) => {
    try {
      const cancelled = await TransportService.cancelBooking(
        bookingId,
        cancelledBy
      );
      const index = this.bookings.findIndex((b) => b.id === bookingId);
      if (index !== -1) {
        this.bookings[index] = cancelled;
      }
      return cancelled;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при отмене бронирования:', error);
      throw error;
    }
  });

  deleteBooking = action(async (bookingId) => {
    try {
      await TransportService.deleteBooking(bookingId);
      this.bookings = this.bookings.filter((b) => b.id !== bookingId);
      return true;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при удалении бронирования:', error);
      throw error;
    }
  });

  // ========== ОТДЕЛЫ ==========

  fetchDepartments = action(async () => {
    try {
      this.departmentsLoading = true;
      const response = await TransportService.fetchDepartments();
      this.departments = response;
      this.error = null;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при загрузке отделов:', error);
    } finally {
      this.departmentsLoading = false;
    }
  });

  createDepartment = action(async (departmentData) => {
    try {
      const newDepartment =
        await TransportService.createDepartment(departmentData);
      // Убедитесь, что newDepartment содержит корректный id от сервера
      this.departments.push(newDepartment);
      return newDepartment;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при создании отдела:', error);
      throw error;
    }
  });

  updateDepartment = action(async (id, updatedData) => {
    try {
      const updated = await TransportService.updateDepartment(id, updatedData);
      const index = this.departments.findIndex((d) => d.id === id);
      if (index !== -1) {
        this.departments[index] = updated;
      }
      return updated;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при обновлении отдела:', error);
      throw error;
    }
  });

  deleteDepartment = action(async (id) => {
    try {
      await TransportService.deleteDepartment(id);
      this.departments = this.departments.filter((d) => d.id !== id);
      return true;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при удалении отдела:', error);
      throw error;
    }
  });

  // ========== ТИПЫ ТРАНСПОРТА ==========

  fetchVehicleTypes = action(async () => {
    try {
      const response = await TransportService.fetchVehicleTypes();
      this.vehicleTypes = response;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при загрузке типов транспорта:', error);
    }
  });

  createVehicleType = action(async (typeData) => {
    try {
      const newType = await TransportService.createVehicleType(typeData);
      this.vehicleTypes.push(newType);
      return newType;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при создании типа:', error);
      throw error;
    }
  });

  updateVehicleType = action(async (id, updatedData) => {
    try {
      const updated = await TransportService.updateVehicleType(id, updatedData);
      const index = this.vehicleTypes.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.vehicleTypes[index] = updated;
      }
      return updated;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при обновлении типа:', error);
      throw error;
    }
  });

  deleteVehicleType = action(async (id) => {
    try {
      await TransportService.deleteVehicleType(id);
      this.vehicleTypes = this.vehicleTypes.filter((t) => t.id !== id);
      return true;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при удалении типа:', error);
      throw error;
    }
  });

  // ========== ПОДТИПЫ ТРАНСПОРТА ==========

  fetchVehicleSubtypes = action(async () => {
    try {
      const response = await TransportService.fetchVehicleSubtypes();
      this.vehicleSubtypes = response;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при загрузке подтипов транспорта:', error);
    }
  });

  createVehicleSubtype = action(async (subtypeData) => {
    try {
      const newSubtype =
        await TransportService.createVehicleSubtype(subtypeData);
      this.vehicleSubtypes.push(newSubtype);
      return newSubtype;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при создании подтипа:', error);
      throw error;
    }
  });

  updateVehicleSubtype = action(async (id, updatedData) => {
    try {
      const updated = await TransportService.updateVehicleSubtype(
        id,
        updatedData
      );
      const index = this.vehicleSubtypes.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.vehicleSubtypes[index] = updated;
      }
      return updated;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при обновлении подтипа:', error);
      throw error;
    }
  });

  deleteVehicleSubtype = action(async (id) => {
    try {
      await TransportService.deleteVehicleSubtype(id);
      this.vehicleSubtypes = this.vehicleSubtypes.filter((s) => s.id !== id);
      return true;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при удалении подтипа:', error);
      throw error;
    }
  });

  // ========== ВРЕМЕННЫЕ СЛОТЫ ==========

  fetchTimeSlots = action(async () => {
    try {
      const response = await TransportService.fetchTimeSlots();
      this.timeSlots = response;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при загрузке временных слотов:', error);
    }
  });

  // ========== СТАТИСТИКА ==========

  fetchStatistics = action(async () => {
    try {
      const response = await TransportService.fetchStatistics();
      this.statistics = response;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при загрузке статистики:', error);
    }
  });

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

  getBookingsForDate = (date) => {
    return this.bookings.filter(
      (b) => b.booking_date === date && b.status === 'active'
    );
  };

  getVehicleBookingsForDate = (vehicleId, date) => {
    return this.bookings.filter(
      (b) =>
        b.vehicle_id === vehicleId &&
        b.booking_date === date &&
        b.status === 'active'
    );
  };

  isTimeSlotAvailable = (vehicleId, date, timeSlotId) => {
    const vehicleBookings = this.getVehicleBookingsForDate(vehicleId, date);
    return !vehicleBookings.some((b) => b.time_slot_id === timeSlotId);
  };

  get uniqueVehicleTypes() {
    const types = this.vehicles
      .map((v) => v.vehicle_type)
      .filter((t) => t && t !== '');
    return [...new Set(types)];
  }

  get currentStatistics() {
    const total = this.vehicles.length;
    const available = this.vehicles.filter(
      (v) => v.technical_condition === 'исправен'
    ).length;
    const unavailable = total - available;
    const booked = this.bookings.filter((b) => b.status === 'active').length;
    return { total, available, unavailable, booked };
  }
}

const transportStore = new TransportStore();
export default transportStore;
