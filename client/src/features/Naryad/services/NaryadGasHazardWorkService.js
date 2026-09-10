// src/modules/Naryad/services/NaryadGasHazardWorkService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class NaryadGasHazardWorkService {
  static async fetchAll() {
    try {
      const response = await axios.get(`${API_URL}api/naryad-gas-hazard-works`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении всех записей ГОР:', error);
      throw error;
    }
  }

  static async fetchByService(service) {
    try {
      const response = await axios.get(
        `${API_URL}api/naryad-gas-hazard-works/service/${service}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Ошибка при получении записей для службы ${service}:`,
        error
      );
      throw error;
    }
  }

  static async create(data) {
    try {
      const response = await axios.post(
        `${API_URL}api/naryad-gas-hazard-works`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании записи ГОР:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const response = await axios.put(
        `${API_URL}api/naryad-gas-hazard-works/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении записи ГОР:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const response = await axios.delete(
        `${API_URL}api/naryad-gas-hazard-works/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении записи ГОР:', error);
      throw error;
    }
  }
}

export default NaryadGasHazardWorkService;
