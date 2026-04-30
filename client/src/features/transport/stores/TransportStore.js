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
      this.fetchDrivers(),
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
      // Отменяем бронирование на сервере
      const cancelled = await TransportService.cancelBooking(
        bookingId,
        cancelledBy
      );

      // Вариант 1: Обновляем конкретное бронирование в массиве
      const index = this.bookings.findIndex((b) => b.id === bookingId);
      if (index !== -1) {
        this.bookings[index] = cancelled; // Статус теперь 'cancelled'
      }

      // Вариант 2: Полностью перезагружаем список бронирований (НАДЕЖНЕЕ)
      await this.fetchBookings();

      // Вариант 3: Обновляем только активные бронирования
      // this.bookings = this.bookings.filter(b => b.status === 'active');
      // await this.fetchBookings();

      return cancelled;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при отмене бронирования:', error);
      throw error;
    }
  });

  refreshData = action(async () => {
    await Promise.all([
      this.fetchBookings(),
      this.fetchVehicles(),
      this.fetchDepartments(),
    ]);
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
    // Проверяем только активные бронирования
    const vehicleBookings = this.bookings.filter(
      (b) =>
        b.vehicle_id === vehicleId &&
        b.booking_date === date &&
        b.status === 'active' // Важно! Только активные
    );

    const isAvailable = !vehicleBookings.some(
      (b) => b.time_slot_id === timeSlotId
    );

    console.log('Check availability:', {
      vehicleId,
      date,
      timeSlotId,
      vehicleBookings: vehicleBookings.map((b) => ({
        id: b.id,
        time_slot_id: b.time_slot_id,
        status: b.status,
      })),
      isAvailable,
    });

    return isAvailable;
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

  createTimeSlot = action(async (timeSlotData) => {
    try {
      const newTimeSlot = await TransportService.createTimeSlot(timeSlotData);
      this.timeSlots.push(newTimeSlot);
      return newTimeSlot;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при создании временного слота:', error);
      throw error;
    }
  });

  updateTimeSlot = action(async (id, updatedData) => {
    try {
      const updated = await TransportService.updateTimeSlot(id, updatedData);
      const index = this.timeSlots.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.timeSlots[index] = updated;
      }
      return updated;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при обновлении временного слота:', error);
      throw error;
    }
  });

  deleteTimeSlot = action(async (id) => {
    try {
      await TransportService.deleteTimeSlot(id);
      this.timeSlots = this.timeSlots.filter((t) => t.id !== id);
      return true;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при удалении временного слота:', error);
      throw error;
    }
  });

  // ========== ЗАЯВКИ ==========
  requests = [];
  requestsLoading = true;

  updateBooking = action(async (requestId, vehicleId, driverId) => {
    try {
      const response = await TransportService.updateBooking(requestId, {
        assigned_vehicle_id: vehicleId,
        assigned_driver_id: driverId,
      });
      // Обновляем заявку в массиве requests
      const requestIndex = this.requests.findIndex((r) => r.id === requestId);
      if (requestIndex !== -1) this.requests[requestIndex] = response.request;
      // Обновляем бронирование, если оно есть
      const bookingIndex = this.bookings.findIndex(
        (b) => b.request_id === requestId
      );
      if (bookingIndex !== -1 && response.booking)
        this.bookings[bookingIndex] = response.booking;
      return response;
    } catch (error) {
      this.error = error;
      throw error;
    }
  });

  fetchRequests = action(async (params = {}) => {
    try {
      this.requestsLoading = true;
      const query = new URLSearchParams(params).toString();
      const response = await TransportService.fetchRequests(query);
      this.requests = response;
      this.error = null;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при загрузке заявок:', error);
    } finally {
      this.requestsLoading = false;
    }
  });

  createRequest = action(async (requestData) => {
    try {
      const newRequest = await TransportService.createRequest(requestData);
      this.requests.push(newRequest);
      return newRequest;
    } catch (error) {
      this.error = error;
      throw error;
    }
  });

  updateRequest = action(async (id, data) => {
    try {
      const updated = await TransportService.updateRequest(id, data);
      const index = this.requests.findIndex((r) => r.id === id);
      if (index !== -1) this.requests[index] = updated;
      return updated;
    } catch (error) {
      this.error = error;
      throw error;
    }
  });

  assignVehicleAndDriver = action(async (id, vehicleId, driverId) => {
    try {
      const updated = await TransportService.assignVehicleAndDriver(id, {
        assigned_vehicle_id: vehicleId,
        assigned_driver_id: driverId,
      });
      const index = this.requests.findIndex((r) => r.id === id);
      if (index !== -1) this.requests[index] = updated;
      return updated;
    } catch (error) {
      this.error = error;
      throw error;
    }
  });

  confirmRequest = action(async (id) => {
    try {
      const result = await TransportService.confirmRequest(id);
      // Обновляем заявку и бронирование в сторах
      const requestIndex = this.requests.findIndex((r) => r.id === id);
      if (requestIndex !== -1) this.requests[requestIndex] = result.request;
      if (result.booking) this.bookings.push(result.booking);
      return result;
    } catch (error) {
      this.error = error;
      throw error;
    }
  });

  cancelRequest = action(async (id, notes, cancelledBy) => {
    try {
      const updated = await TransportService.cancelRequest(
        id,
        notes,
        cancelledBy
      );
      const index = this.requests.findIndex((r) => r.id === id);
      if (index !== -1) this.requests[index] = updated;
      return updated;
    } catch (error) {
      this.error = error;
      throw error;
    }
  });

  rescheduleRequest = action(
    async (id, newDate, newStartTime, newEndTime, notes) => {
      try {
        const updated = await TransportService.rescheduleRequest(id, {
          new_date: newDate,
          new_start_time: newStartTime,
          new_end_time: newEndTime,
          notes,
        });
        const index = this.requests.findIndex((r) => r.id === id);
        if (index !== -1) this.requests[index] = updated;
        return updated;
      } catch (error) {
        this.error = error;
        throw error;
      }
    }
  );

  deleteRequest = action(async (id) => {
    try {
      await TransportService.deleteRequest(id);
      this.requests = this.requests.filter((r) => r.id !== id);
      return true;
    } catch (error) {
      this.error = error;
      throw error;
    }
  });

  // ========== ВОДИТЕЛИ ==========

  drivers = [];
  driversLoading = true;

  fetchDrivers = action(async () => {
    try {
      this.driversLoading = true;
      const response = await TransportService.fetchDrivers();
      this.drivers = response;
      this.error = null;
      return response; // Добавьте возврат данных
    } catch (error) {
      this.error = error;
      console.error('Ошибка при загрузке водителей:', error);
      throw error;
    } finally {
      this.driversLoading = false;
    }
  });

  createDriver = action(async (driverData) => {
    try {
      const newDriver = await TransportService.createDriver(driverData);
      this.drivers.push(newDriver);
      return newDriver;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при создании водителя:', error);
      throw error;
    }
  });

  updateDriver = action(async (id, updatedData) => {
    try {
      const updated = await TransportService.updateDriver(id, updatedData);
      const index = this.drivers.findIndex((d) => d.id === id);
      if (index !== -1) {
        this.drivers[index] = updated;
      }
      // Также обновляем водителя в списке автомобилей, если он там есть
      this.vehicles.forEach((vehicle) => {
        if (vehicle.driver_id === id) {
          vehicle.driver_full_name = updated.fio;
        }
      });
      return updated;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при обновлении водителя:', error);
      throw error;
    }
  });

  deleteDriver = action(async (id) => {
    try {
      await TransportService.deleteDriver(id);
      this.drivers = this.drivers.filter((d) => d.id !== id);
      return true;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при удалении водителя:', error);
      throw error;
    }
  });

  getDriverById = (id) => {
    return this.drivers.find((d) => d.id === id);
  };

  getDriversByDepartment = (department) => {
    return this.drivers.filter((d) => d.department === department);
  };
}

const transportStore = new TransportStore();
export default transportStore;
