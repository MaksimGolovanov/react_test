require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const iususer = require('./models/IusPtModels')
const stuser = require('./models/STModels')
const doc = require('./models/documentModels')
const cors = require('cors')
const route = require('./routes/index')
const fileUpload = require('express-fileupload')
const path = require('path')
const fs = require('fs')
const PORT = process.env.PORT || 5000
const snmpPoller = require('./snmpPoller')

const app = express()

// Настройка CORS
app.use(cors())

// Настройка парсинга JSON
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Настройка загрузки файлов
app.use(
     fileUpload({
          limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
          useTempFiles: true,
          tempFileDir: '/tmp/',
          debug: true, // Добавьте для отладки
          createParentPath: true // Создавать родительские папки
     })
)

// Определяем пути к папкам
const photoDir = path.resolve(__dirname, 'static', 'photo')
const documentsDir = path.resolve(__dirname, 'static', 'documents')



// Создаем папки, если их нет
const createDirectories = () => {
    const dirs = [
        { path: photoDir, name: 'photo' },
        { path: documentsDir, name: 'documents' }
    ]
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir.path)) {
            console.log(`Создаю папку ${dir.name}:`, dir.path)
            fs.mkdirSync(dir.path, { recursive: true })
        } else {
            console.log(`Папка ${dir.name} уже существует:`, dir.path)
            
        }
    })
}

createDirectories()

// Обслуживание статических файлов
app.use('/static', express.static(path.resolve(__dirname, 'static')))

// Дополнительные статические маршруты для обратной совместимости
app.use('/static/documents', express.static(documentsDir))
app.use(
     '/static/photo',
     express.static(photoDir, {
          setHeaders: (res, filePath) => {
               if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
                    res.setHeader('Cache-Control', 'public, max-age=86400')
               }
          },
     })
)

// Middleware для логирования запросов к документам (НЕ блокирующий)
app.use('/static/documents/:filename', (req, res, next) => {
    console.log(`[${new Date().toISOString()}] Запрос документа: ${req.params.filename}`)
    next() // Всегда пропускаем дальше
})

// Middleware для логирования запросов к фото (НЕ блокирующий)
app.use('/static/photo/:filename', (req, res, next) => {
    console.log(`[${new Date().toISOString()}] Запрос фото: ${req.params.filename}`)
    next() // Всегда пропускаем дальше
})

// Тестовый маршрут для проверки файловой системы
app.get('/api/debug/files', (req, res) => {
    const result = {
        server_dir: __dirname,
        documents: {
            path: documentsDir,
            exists: fs.existsSync(documentsDir),
            files: fs.existsSync(documentsDir) ? fs.readdirSync(documentsDir) : []
        },
        photo: {
            path: photoDir,
            exists: fs.existsSync(photoDir),
            files: fs.existsSync(photoDir) ? fs.readdirSync(photoDir) : []
        },
        static: {
            path: path.resolve(__dirname, 'static'),
            exists: fs.existsSync(path.resolve(__dirname, 'static'))
        }
    }
    res.json(result)
})

// Роуты API
app.use('/api', route)

// Запуск сервера
const start = async () => {
     try {
          await sequelize.authenticate()
          await sequelize.sync()
          console.log('База данных подключена')

          snmpPoller.start()
          console.log('SNMP поллер запущен')

          app.listen(PORT, () => {
              
          })
     } catch (e) {
          console.error('Ошибка при запуске сервера:', e)
          process.exit(1)
     }
}

start()