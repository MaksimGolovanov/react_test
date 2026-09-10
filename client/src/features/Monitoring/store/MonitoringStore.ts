// src/modules/Monitoring/store/MonitoringStore.ts

import { makeAutoObservable, action, runInAction } from 'mobx';
import MonitoringService from '../services/MonitoringService';
import { ServerStatus, LogEntry } from '../types/monitoring.types';

class MonitoringStore {
  status: ServerStatus | null = null;
  logs: LogEntry[] = [];
  loading: boolean = false;
  error: Error | null = null;
  autoRefresh: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  fetchStatus = action(async () => {
    try {
      const data = await MonitoringService.fetchStatus();
      runInAction(() => {
        this.status = data;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error as Error;
      });
    }
  });

  fetchLogs = action(async (limit: number = 300) => {
    try {
      const data = await MonitoringService.fetchLogs(limit);
      runInAction(() => {
        this.logs = data.logs;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error as Error;
      });
    }
  });

  // Полная загрузка (статус + логи)
  fetchAll = action(async () => {
    this.loading = true;
    try {
      await Promise.all([this.fetchStatus(), this.fetchLogs()]);
    } catch (error) {
      // ошибки уже обработаны в методах выше
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  });

  // Локальная очистка логов (не удаляет на сервере)
  clearLogs = action(() => {
    this.logs = [];
  });

  toggleAutoRefresh = action(() => {
    this.autoRefresh = !this.autoRefresh;
  });
}

const monitoringStore = new MonitoringStore();
export default monitoringStore;
