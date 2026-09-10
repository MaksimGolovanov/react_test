// src/modules/Monitoring/types/monitoring.types.ts

export interface MemoryUsage {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
}

export interface ServerStatus {
  uptime: number;
  nodeVersion: string;
  platform: string;
  arch: string;
  cpuCount: number;
  loadAverage: number[];
  totalMemory: number;
  freeMemory: number;
  memoryUsage: MemoryUsage;
  pid: number;
  startTime: string;
  env: string;
  database?: string; // 'connected' или строка ошибки
}

export type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'STDOUT' | 'STDERR';

export interface LogEntry {
  timestamp: string; // ISO
  level: LogLevel;
  message: string;
}

export interface LogsResponse {
  logs: LogEntry[];
  count: number;
}

export interface DbStatusResponse {
  status: 'connected' | 'error';
  message?: string;
  timestamp: string;
}
