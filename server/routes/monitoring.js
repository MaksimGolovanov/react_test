// routes/monitoring.js
const express = require("express");
const router = express.Router();
const { getLogs, getServerStatus } = require("../utils/loggerCapture");
const sequelize = require("../db"); // ваша инстанция Sequelize

// Проверка состояния БД
router.get("/db-status", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: "connected", timestamp: new Date().toISOString() });
  } catch (err) {
    res
      .status(500)
      .json({
        status: "error",
        message: err.message,
        timestamp: new Date().toISOString(),
      });
  }
});

// Получение логов (параметр ?limit=100)
router.get("/logs", (req, res) => {
  const limit = parseInt(req.query.limit) || 200;
  const logs = getLogs(limit);
  res.json({ logs, count: logs.length });
});

// Получение общей информации о сервере
router.get("/status", (req, res) => {
  const status = getServerStatus();
  // Добавляем информацию о подключении к БД (можно асинхронно, но для простоты покажем только статус)
  sequelize
    .authenticate()
    .then(() => {
      status.database = "connected";
      res.json(status);
    })
    .catch((err) => {
      status.database = "error: " + err.message;
      res.status(500).json(status);
    });
});

module.exports = router;
