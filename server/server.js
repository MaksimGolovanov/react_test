require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const iususer = require('./models/IusPtModels');
const stuser = require('./models/STModels')
const cors = require('cors');
const route = require('./routes/index');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 5000;
const snmpPoller = require('./snmpPoller');

const app = express();

// Настройка CORS
app.use(cors());

// Настройка парсинга JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Настройка загрузки файлов
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Создаем папку для фото, если ее нет
const photoDir = path.resolve(__dirname, 'static', 'photo');
if (!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir, { recursive: true });
}

// Обслуживание статических файлов
app.use('/static', express.static(path.resolve(__dirname, 'static')));
app.use('/static/photo', express.static(path.join(__dirname, 'static', 'photo'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.jpg')) {
            res.setHeader('Cache-Control', 'public, max-age=86400'); // Кэширование на 1 день
        }
    }
}));

// Middleware для проверки существования файла
app.use('/static/photo/:filename', (req, res, next) => {
    const filePath = path.join(photoDir, req.params.filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Not found');
    }
    next();
});

// Роуты API
app.use('/api', route);

// Запуск сервера
const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        
        snmpPoller.start();
        
        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
    } catch (e) {
        console.error('Ошибка при запуске сервера:', e);
        process.exit(1);
    }
};

start();