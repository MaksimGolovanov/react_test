const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

module.exports = (app) => {
  const tilesDir = path.join(__dirname, 'static/tiles');
  // Хранилище загруженных БД: { mapId: dbInstance }
  const tileDatabases = new Map();
  // Список карт для API
  const mapsList = [];

  // Сканируем папку и загружаем все .mbtiles
  if (fs.existsSync(tilesDir)) {
    const files = fs.readdirSync(tilesDir).filter(f => f.endsWith('.mbtiles'));
    for (const file of files) {
      const mapId = path.basename(file, '.mbtiles'); // ks3-2, another-map и т.д.
      const filePath = path.join(tilesDir, file);
      try {
        const db = new Database(filePath, { readonly: true });
        tileDatabases.set(mapId, db);
        mapsList.push({ id: mapId, name: mapId.replace(/-/g, ' ') }); // человеко-читаемое имя
        console.log(`Загружена карта: ${mapId} (${filePath})`);
      } catch (e) {
        console.error(`Ошибка загрузки ${file}:`, e.message);
      }
    }
  } else {
    console.warn('Директория с тайлами не найдена:', tilesDir);
  }

  // API: список доступных карт
  app.get('/api/maps', (req, res) => {
    res.json(mapsList);
  });

  // Маршрут отдачи тайлов с указанием карты
  app.get('/tiles/:mapId/:z/:x/:y.png', (req, res) => {
    const { mapId, z, x, y } = req.params;
    const db = tileDatabases.get(mapId);
    if (!db) {
      return res.status(404).send(`Карта "${mapId}" не найдена`);
    }

    const zInt = parseInt(z);
    const xInt = parseInt(x);
    let yInt = parseInt(y);
    // Преобразование в TMS (origin = bottom-left)
    const tmsY = (1 << zInt) - 1 - yInt;

    const stmt = db.prepare(
      `SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?`
    );
    const row = stmt.get(zInt, xInt, tmsY);
    if (!row) {
      return res.status(404).send('Тайл не найден');
    }

    res.setHeader('Content-Type', 'image/png');
    res.send(row.tile_data);
  });

  // (Опционально) закрыть соединения при завершении приложения
  process.on('exit', () => {
    for (const db of tileDatabases.values()) {
      db.close();
    }
  });
};