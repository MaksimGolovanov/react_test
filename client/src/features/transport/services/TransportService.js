import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class TransportService {
  static async fetchAllDepartments() {
    try {
      const response = await axios.get(`${API_URL}api/departments`);
      return response.data;
    } catch (error) {
      console.error('Department fetch error:', error.response || error);
      throw error;
    }
  }

  static async fetchDepartmentById(id) {
    try {
      const response = await axios.get(`${API_URL}api/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении отдела:', error);
      throw error;
    }
  }

  static async fetchStaffOne(id) {
    try {
      const response = await axios.get(`${API_URL}api/staff/${id}`);
      return response.data;
    } catch (error) {
      console.error('Staff fetch error:', error);
      throw error;
    }
  }

  // ========== АВТОМОБИЛИ ==========

  static async fetchVehicles() {
    try {
      const response = await axios.get(`${API_URL}api/transport/vehicles`);
      return response.data;
    } catch (error) {
      console.error('Vehicles fetch error:', error.response || error);
      throw error;
    }
  }

  static async fetchVehicleById(id) {
    try {
      const response = await axios.get(
        `${API_URL}api/transport/vehicles/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении автомобиля:', error);
      throw error;
    }
  }

  static async createVehicle(vehicleData) {
    try {
      const response = await axios.post(
        `${API_URL}api/transport/vehicles`,
        vehicleData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Create vehicle error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async updateVehicle(id, updatedData) {
    try {
      const response = await axios.put(
        `${API_URL}api/transport/vehicles/${id}`,
        updatedData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Update vehicle error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async deleteVehicle(id) {
    try {
      await axios.delete(`${API_URL}api/transport/vehicles/${id}`);
      return true;
    } catch (error) {
      console.error('Ошибка при удалении автомобиля:', error);
      throw error;
    }
  }

  static async importVehicles(vehiclesData) {
    try {
      const response = await axios.post(
        `${API_URL}api/transport/vehicles/import`,
        vehiclesData
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при импорте автомобилей:', error);
      throw error;
    }
  }

  // ========== БРОНИРОВАНИЯ ==========

  static async fetchBookings() {
    try {
      const response = await axios.get(`${API_URL}api/transport/bookings`);
      return response.data;
    } catch (error) {
      console.error('Bookings fetch error:', error.response || error);
      throw error;
    }
  }

  static async fetchBookingsByDate(date) {
    try {
      const response = await axios.get(
        `${API_URL}api/transport/bookings/date/${date}`
      );
      return response.data;
    } catch (error) {
      console.error('Bookings by date fetch error:', error);
      throw error;
    }
  }

  static async fetchBookingsByVehicle(vehicleId, date) {
    try {
      const response = await axios.get(
        `${API_URL}api/transport/bookings/vehicle/${vehicleId}`,
        {
          params: { date },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Bookings by vehicle fetch error:', error);
      throw error;
    }
  }

  static async createBooking(bookingData) {
    try {
      const response = await axios.post(
        `${API_URL}api/transport/bookings`,
        bookingData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Create booking error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async cancelBooking(bookingId, cancelledBy) {
    try {
      const response = await axios.put(
        `${API_URL}api/transport/bookings/${bookingId}/cancel`,
        { cancelled_by: cancelledBy },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Cancel booking error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async deleteBooking(bookingId) {
    try {
      await axios.delete(`${API_URL}api/transport/bookings/${bookingId}`);
      return true;
    } catch (error) {
      console.error('Ошибка при удалении бронирования:', error);
      throw error;
    }
  }

  // ========== ОТДЕЛЫ ==========

  static async fetchDepartments() {
    try {
      const response = await axios.get(`${API_URL}api/transport/departments`);
      return response.data;
    } catch (error) {
      console.error('Departments fetch error:', error.response || error);
      throw error;
    }
  }

  static async createDepartment(departmentData) {
    try {
      const response = await axios.post(
        `${API_URL}api/transport/departments`,
        departmentData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Create department error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async updateDepartment(id, updatedData) {
    try {
      const response = await axios.put(
        `${API_URL}api/transport/departments/${id}`,
        updatedData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Update department error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async deleteDepartment(id) {
    try {
      await axios.delete(`${API_URL}api/transport/departments/${id}`);
      return true;
    } catch (error) {
      console.error('Ошибка при удалении отдела:', error);
      throw error;
    }
  }

  // ========== ТИПЫ ТРАНСПОРТА ==========

  static async fetchVehicleTypes() {
    try {
      const response = await axios.get(`${API_URL}api/transport/vehicle-types`);
      return response.data;
    } catch (error) {
      console.error('Vehicle types fetch error:', error.response || error);
      throw error;
    }
  }

  static async createVehicleType(typeData) {
    try {
      const response = await axios.post(
        `${API_URL}api/transport/vehicle-types`,
        typeData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Create vehicle type error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async updateVehicleType(id, updatedData) {
    try {
      const response = await axios.put(
        `${API_URL}api/transport/vehicle-types/${id}`,
        updatedData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Update vehicle type error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async deleteVehicleType(id) {
    try {
      await axios.delete(`${API_URL}api/transport/vehicle-types/${id}`);
      return true;
    } catch (error) {
      console.error('Ошибка при удалении типа:', error);
      throw error;
    }
  }

  // ========== ПОДТИПЫ ТРАНСПОРТА ==========

  static async fetchVehicleSubtypes() {
    try {
      const response = await axios.get(
        `${API_URL}api/transport/vehicle-subtypes`
      );
      return response.data;
    } catch (error) {
      console.error('Vehicle subtypes fetch error:', error.response || error);
      throw error;
    }
  }

  static async createVehicleSubtype(subtypeData) {
    try {
      const response = await axios.post(
        `${API_URL}api/transport/vehicle-subtypes`,
        subtypeData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Create vehicle subtype error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async updateVehicleSubtype(id, updatedData) {
    try {
      const response = await axios.put(
        `${API_URL}api/transport/vehicle-subtypes/${id}`,
        updatedData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Update vehicle subtype error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async deleteVehicleSubtype(id) {
    try {
      await axios.delete(`${API_URL}api/transport/vehicle-subtypes/${id}`);
      return true;
    } catch (error) {
      console.error('Ошибка при удалении подтипа:', error);
      throw error;
    }
  }

  // ========== СТАТИСТИКА ==========

  static async fetchStatistics() {
    try {
      const response = await axios.get(`${API_URL}api/transport/statistics`);
      return response.data;
    } catch (error) {
      console.error('Statistics fetch error:', error.response || error);
      throw error;
    }
  }

  static async fetchStatisticsByDate(date) {
    try {
      const response = await axios.get(
        `${API_URL}api/transport/statistics/date/${date}`
      );
      return response.data;
    } catch (error) {
      console.error('Statistics by date fetch error:', error);
      throw error;
    }
  }

  // ========== ВРЕМЕННЫЕ СЛОТЫ ==========

  static async fetchTimeSlots() {
    try {
      const response = await axios.get(`${API_URL}api/transport/time-slots`);
      return response.data;
    } catch (error) {
      console.error('Time slots fetch error:', error.response || error);
      throw error;
    }
  }

  static async createTimeSlot(timeSlotData) {
    try {
      const response = await axios.post(
        `${API_URL}api/transport/time-slots`,
        timeSlotData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Create time slot error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async updateTimeSlot(id, updatedData) {
    try {
      const response = await axios.put(
        `${API_URL}api/transport/time-slots/${id}`,
        updatedData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Update time slot error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async deleteTimeSlot(id) {
    try {
      await axios.delete(`${API_URL}api/transport/time-slots/${id}`);
      return true;
    } catch (error) {
      console.error(
        'Delete time slot error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // ========== ЗАЯВКИ ==========

  static async updateBooking(requestId, data) {
    const response = await axios.put(
      `${API_URL}api/transport/requests/${requestId}/update-booking`,
      data
    );
    return response.data;
  }

  static async fetchRequests(params = '') {
    const response = await axios.get(
      `${API_URL}api/transport/requests${params ? '?' + params : ''}`
    );
    return response.data;
  }

  static async createRequest(data) {
    const response = await axios.post(`${API_URL}api/transport/requests`, data);
    return response.data;
  }

  static async updateRequest(id, data) {
    const response = await axios.put(
      `${API_URL}api/transport/requests/${id}`,
      data
    );
    return response.data;
  }

  static async assignVehicleAndDriver(id, assignment) {
    const response = await axios.put(
      `${API_URL}api/transport/requests/${id}/assign`,
      assignment
    );
    return response.data;
  }

  static async confirmRequest(id) {
    const response = await axios.put(
      `${API_URL}api/transport/requests/${id}/confirm`
    );
    return response.data;
  }

  static async cancelRequest(id, notes, cancelledBy) {
    const response = await axios.put(
      `${API_URL}api/transport/requests/${id}/cancel`,
      { notes, cancelled_by: cancelledBy }
    );
    return response.data;
  }

  static async rescheduleRequest(id, data) {
    const response = await axios.put(
      `${API_URL}api/transport/requests/${id}/reschedule`,
      data
    );
    return response.data;
  }

  static async deleteRequest(id) {
    const response = await axios.delete(
      `${API_URL}api/transport/requests/${id}`
    );
    return response.data;
  }

  // ========== ВОДИТЕЛИ ==========

  static async fetchDrivers() {
    try {
      const response = await axios.get(`${API_URL}api/transport/drivers`);
      return response.data;
    } catch (error) {
      console.error('Drivers fetch error:', error.response || error);
      throw error;
    }
  }

  static async fetchDriverById(id) {
    try {
      const response = await axios.get(`${API_URL}api/transport/drivers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Driver fetch error:', error.response || error);
      throw error;
    }
  }

  static async createDriver(driverData) {
    try {
      const response = await axios.post(
        `${API_URL}api/transport/drivers`,
        driverData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Create driver error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async updateDriver(id, updatedData) {
    try {
      const response = await axios.put(
        `${API_URL}api/transport/drivers/${id}`,
        updatedData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Update driver error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  static async deleteDriver(id) {
    try {
      await axios.delete(`${API_URL}api/transport/drivers/${id}`);
      return true;
    } catch (error) {
      console.error(
        'Delete driver error:',
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

export default TransportService;
