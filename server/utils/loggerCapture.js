// utils/loggerCapture.js

const os = require("os");

// Хранилище логов (циклический буфер)
const MAX_LOG_ENTRIES = 2000;
const logEntries = [];

function addLog(level, message, ...args) {
  const timestamp = new Date().toISOString();
  const formatted = args.length
    ? `${message} ${args.map((a) => JSON.stringify(a)).join(" ")}`
    : message;
  logEntries.push({ timestamp, level, message: formatted });
  if (logEntries.length > MAX_LOG_ENTRIES) {
    logEntries.shift();
  }
}

// Сохраняем оригинальные методы
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;
const originalInfo = console.info;

// Переопределяем console.log
console.log = (...args) => {
  addLog("INFO", args.join(" "));
  originalLog(...args); // выводим в терминал (но уже не перехватываем stdout)
};

console.error = (...args) => {
  addLog("ERROR", args.join(" "));
  originalError(...args);
};

console.warn = (...args) => {
  addLog("WARN", args.join(" "));
  originalWarn(...args);
};

console.info = (...args) => {
  addLog("INFO", args.join(" "));
  originalInfo(...args);
};

// Убираем перехват process.stdout и process.stderr, чтобы избежать дублирования
// (были удалены блоки с process.stdout.write и process.stderr.write)

// Функция для получения логов
function getLogs(limit = 200) {
  return logEntries.slice(-limit);
}

// Функция получения состояния сервера
function getServerStatus() {
  const memoryUsage = process.memoryUsage();
  return {
    uptime: process.uptime(),
    nodeVersion: process.version,
    platform: os.platform(),
    arch: os.arch(),
    cpuCount: os.cpus().length,
    loadAverage: os.loadavg(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    memoryUsage: {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
      external: memoryUsage.external,
    },
    pid: process.pid,
    startTime: new Date(Date.now() - process.uptime() * 1000).toISOString(),
    env: process.env.NODE_ENV || "development",
  };
}

module.exports = { getLogs, getServerStatus };