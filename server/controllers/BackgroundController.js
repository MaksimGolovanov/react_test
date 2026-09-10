// controllers/BackgroundController.js
const path = require('path')
const fs = require('fs')
const { Background } = require('../models/models')
const ApiError = require('../error/ApiError')

class BackgroundController {
     async getAll(req, res) {
          const backgrounds = await Background.findAll({ order: [['createdAt', 'DESC']] })
          return res.json(backgrounds)
     }

     async getOne(req, res) {
          const { id } = req.params
          const bg = await Background.findByPk(id)
          if (!bg) throw ApiError.notFound('Фон не найден')
          return res.json(bg)
     }

     async create(req, res, next) {
          try {
               const { name, description, isActive } = req.body
               // Логика загрузки файла будет отдельно, здесь только создание записи с filename
               // Но для простоты мы можем объединить загрузку и создание в одном методе upload
               throw ApiError.badRequest('Используйте метод upload для загрузки фона')
          } catch (e) {
               next(e)
          }
     }

     async upload(req, res, next) {
          try {
               if (!req.files || !req.files.background) {
                    throw ApiError.badRequest('Файл фона не загружен')
               }

               const { name, description, isActive } = req.body
               if (!name) {
                    throw ApiError.badRequest('Не указано название фона')
               }

               const bgDir = path.resolve(__dirname, '..', 'static', 'backgrounds')
               if (!fs.existsSync(bgDir)) {
                    fs.mkdirSync(bgDir, { recursive: true })
               }

               const file = req.files.background
               const ext = path.extname(file.name).toLowerCase()
               if (!['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
                    throw ApiError.badRequest('Недопустимый формат файла. Разрешены: jpg, jpeg, png, gif, webp')
               }

               // Генерируем уникальное имя
               const timestamp = Date.now()
               const filename = `bg_${timestamp}${ext}`
               const filePath = path.join(bgDir, filename)

               // Сохраняем файл
               await file.mv(filePath)

               // Если передан флаг isActive, то снимаем активность с других фонов
               const isActiveBool = isActive === 'true' || isActive === true
               if (isActiveBool) {
                    await Background.update({ isActive: false }, { where: {} })
               }

               const bg = await Background.create({
                    name,
                    description: description || '',
                    filename,
                    isActive: isActiveBool,
               })

               return res.status(201).json(bg)
          } catch (e) {
               console.error('Ошибка загрузки фона:', e)
               next(ApiError.internal(e.message))
          }
     }

     async update(req, res, next) {
          try {
               const { id } = req.params
               const { name, description, isActive } = req.body

               const bg = await Background.findByPk(id)
               if (!bg) throw ApiError.notFound('Фон не найден')

               // Если делаем активным, снимаем активность с остальных
               if (isActive === true) {
                    await Background.update({ isActive: false }, { where: { id: { [Op.ne]: id } } })
               }

               await bg.update({ name, description, isActive })
               return res.json(bg)
          } catch (e) {
               next(e)
          }
     }

     async delete(req, res, next) {
          try {
               const { id } = req.params
               const bg = await Background.findByPk(id)
               if (!bg) throw ApiError.notFound('Фон не найден')

               // Удаляем файл
               const filePath = path.resolve(__dirname, '..', 'static', 'backgrounds', bg.filename)
               if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath)
               }

               await bg.destroy()
               return res.json({ success: true })
          } catch (e) {
               next(e)
          }
     }
}

module.exports = new BackgroundController()
