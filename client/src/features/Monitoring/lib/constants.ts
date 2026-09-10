// src/modules/Monitoring/lib/constants.ts

import { LogLevel } from '../types/monitoring.types';

export const LOG_COLORS: Record<LogLevel, string> = {
  INFO: 'blue',
  ERROR: 'red',
  WARN: 'orange',
  STDOUT: 'green',
  STDERR: 'magenta',
};

export const LOG_LEVELS: LogLevel[] = ['INFO', 'ERROR', 'WARN', 'STDOUT', 'STDERR'];

export const REFRESH_INTERVAL = 5000; // 5 секунд
export const MAX_LOG_LIMIT = 300;