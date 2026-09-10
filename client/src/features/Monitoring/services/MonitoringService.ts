// src/modules/Monitoring/services/MonitoringService.ts

import axios from 'axios';
import {
  ServerStatus,
  LogsResponse,
  DbStatusResponse,
} from '../types/monitoring.types';

const API_URL = process.env.REACT_APP_API_URL;

class MonitoringService {
  static async fetchStatus(): Promise<ServerStatus> {
    const response = await axios.get<ServerStatus>(
      `${API_URL}api/monitoring/status`
    );
    return response.data;
  }

  static async fetchLogs(limit: number = 300): Promise<LogsResponse> {
    const response = await axios.get<LogsResponse>(
      `${API_URL}api/monitoring/logs?limit=${limit}`
    );
    return response.data;
  }

  static async fetchDbStatus(): Promise<DbStatusResponse> {
    const response = await axios.get<DbStatusResponse>(
      `${API_URL}api/monitoring/db-status`
    );
    return response.data;
  }
}

export default MonitoringService;
