// src/modules/IpAddress/services/IpService.ts
import axios from 'axios';
import { IpAddress, IpAddressInput } from '../types/ip.types';

const API_URL = process.env.REACT_APP_API_URL;

class IpService {
  static async fetchIp(): Promise<IpAddress[]> {
    try {
      const response = await axios.get<IpAddress[]>(`${API_URL}api/ipaddress`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении IP-адресов:', error);
      throw error;
    }
  }

  static async createIp(data: IpAddressInput): Promise<IpAddress> {
    try {
      const response = await axios.post<IpAddress>(`${API_URL}api/ipaddress`, data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании IP-адреса:', error);
      throw error;
    }
  }

  static async updateIp(id: number, data: IpAddressInput): Promise<IpAddress> {
    try {
      const response = await axios.put<IpAddress>(`${API_URL}api/ipaddress/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении IP-адреса:', error);
      throw error;
    }
  }

  static async deleteIp(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}api/ipaddress/${id}`);
    } catch (error) {
      console.error('Ошибка при удалении IP-адреса:', error);
      throw error;
    }
  }
}

export default IpService;