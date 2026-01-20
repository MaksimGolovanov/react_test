const { Doc, DocTrainingType, DocCategory, DocStatus } = require('../../models/documentModels')
const ApiError = require('../../error/ApiError')
const path = require('path')
const fs = require('fs')

class DocController {
     // Получить все документы с связанными данными
     async getAll(req, res, next) {
          try {
               const docs = await Doc.findAll({
                    include: [
                         { model: DocTrainingType, as: 'training_type' },
                         { model: DocCategory, as: 'category' },
                         { model: DocStatus, as: 'status' },
                    ],
                    order: [['created_at', 'DESC']],
               })
               return res.json(docs)
          } catch (error) {
               return next(ApiError.internal(error.message))
          }
     }

     // Получить документ по ID
     async getById(req, res, next) {
          try {
               const { id } = req.params
               const doc = await Doc.findByPk(id, {
                    include: [
                         { model: DocTrainingType, as: 'training_type' },
                         { model: DocCategory, as: 'category' },
                         { model: DocStatus, as: 'status' },
                    ],
               })

               if (!doc) {
                    return next(ApiError.notFound('Документ не найден'))
               }

               return res.json(doc)
          } catch (error) {
               return next(ApiError.internal(error.message))
          }
     }

     // Создать новый документ
     async create(req, res, next) {
          try {
               const {
                    title,
                    description,
                    training_type_id,
                    category_id,
                    status_id,
                    file_name,
                    file_path,
                    file_url,
                    file_size,
                    version,
               } = req.body

               // Проверка обязательных полей
               if (!title || !training_type_id || !category_id || !status_id) {
                    return next(ApiError.badRequest('Заполните обязательные поля'))
               }

               const doc = await Doc.create({
                    title,
                    description,
                    training_type_id,
                    category_id,
                    status_id,
                    file_name,
                    file_path,
                    file_url,
                    file_size,
                    version,
               })

               return res.status(201).json(doc)
          } catch (error) {
               return next(ApiError.internal(error.message))
          }
     }

     // Обновить документ
     async update(req, res, next) {
          try {
               const { id } = req.params
               const updateData = req.body

               const doc = await Doc.findByPk(id)
               if (!doc) {
                    return next(ApiError.notFound('Документ не найден'))
               }

               await doc.update(updateData)
               return res.json(doc)
          } catch (error) {
               return next(ApiError.internal(error.message))
          }
     }

     // Удалить документ
     // Удалить документ
     async delete(req, res, next) {
          try {
               const { id } = req.params

               const doc = await Doc.findByPk(id)
               if (!doc) {
                    return next(ApiError.notFound('Документ не найден'))
               }

               // Удаляем связанный файл, если он есть
               if (doc.file_path) {
                    const documentsDir = path.resolve(__dirname, '..', '..', 'static', 'documents')
                    // Извлекаем только имя файла из пути
                    const fileName = doc.file_path.split('/').pop() || doc.file_path.split('\\').pop()
                    const filePath = path.join(documentsDir, fileName)

                    if (fs.existsSync(filePath)) {
                         fs.unlinkSync(filePath)
                    }
               }

               await doc.destroy()
               return res.json({ success: true, message: 'Документ удален' })
          } catch (error) {
               return next(ApiError.internal(error.message))
          }
     }

     // Загрузить файл документа
     // Загрузить файл документа
     async uploadFile(req, res, next) {
          try {
               if (!req.files || !req.files.file) {
                    return next(ApiError.badRequest('Файл не загружен'))
               }

               const file = req.files.file
               const fileExt = path.extname(file.name).toLowerCase()

               if (!['.pdf'].includes(fileExt)) {
                    return next(ApiError.badRequest('Допустимы только PDF файлы'))
               }

               const docsDir = path.resolve(__dirname, '..', '..', 'static', 'documents')
               if (!fs.existsSync(docsDir)) {
                    fs.mkdirSync(docsDir, { recursive: true })
               }

               const timestamp = Date.now()

               // Быстрое исправление кодировки
               let correctFileName = file.name
               try {
                    // Если имя содержит кракозябры (UTF-8 байты как Latin-1)
                    if (/[^\x00-\x7F]/.test(correctFileName) && !/[а-яА-Я]/.test(correctFileName)) {
                         correctFileName = Buffer.from(correctFileName, 'binary').toString('utf8')
                    }
               } catch (e) {
                    console.log('Could not fix encoding:', e)
               }

               console.log('Original:', file.name)
               console.log('Corrected:', correctFileName)

               // Создаем безопасное имя из исправленного
               const nameWithoutExt = path.basename(correctFileName, fileExt)

               // Простая транслитерация
               const translitMap = {
                    а: 'a',
                    б: 'b',
                    в: 'v',
                    г: 'g',
                    д: 'd',
                    е: 'e',
                    ё: 'e',
                    ж: 'zh',
                    з: 'z',
                    и: 'i',
                    й: 'y',
                    к: 'k',
                    л: 'l',
                    м: 'm',
                    н: 'n',
                    о: 'o',
                    п: 'p',
                    р: 'r',
                    с: 's',
                    т: 't',
                    у: 'u',
                    ф: 'f',
                    х: 'h',
                    ц: 'ts',
                    ч: 'ch',
                    ш: 'sh',
                    щ: 'sch',
                    ъ: '',
                    ы: 'y',
                    ь: '',
                    э: 'e',
                    ю: 'yu',
                    я: 'ya',
               }

               let transliterated = ''
               for (let i = 0; i < nameWithoutExt.length; i++) {
                    const char = nameWithoutExt[i].toLowerCase()
                    transliterated += translitMap[char] || char
               }

               const safeName = transliterated
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')

               const fileName = `${safeName || 'document'}-${timestamp}.pdf`
               const filePath = path.join(docsDir, fileName)

               // Сохраняем файл
               if (file.tempFilePath) {
                    fs.copyFileSync(file.tempFilePath, filePath)
               } else {
                    await file.mv(filePath)
               }

               const stats = fs.statSync(filePath)
               const fileSize = (stats.size / (1024 * 1024)).toFixed(1) + ' МБ'

               return res.json({
                    success: true,
                    file_name: correctFileName,
                    safe_file_name: fileName,
                    file_path: `documents/${fileName}`,
                    file_url: `/static/documents/${fileName}`,
                    file_size: fileSize,
                    message: 'Файл успешно загружен',
               })
          } catch (error) {
               console.error('Upload error:', error)
               return next(ApiError.internal(error.message))
          }
     }

     // Импорт документов
     async import(req, res, next) {
          try {
               const docsData = req.body

               if (!Array.isArray(docsData)) {
                    return next(ApiError.badRequest('Неверный формат данных'))
               }

               const importPromises = docsData.map(async (item) => {
                    // Проверяем, существует ли документ с таким названием
                    const existingDoc = await Doc.findOne({
                         where: { title: item.title },
                    })

                    if (existingDoc) {
                         return existingDoc.update(item)
                    } else {
                         return Doc.create(item)
                    }
               })

               await Promise.all(importPromises)
               return res.json({ success: true, message: 'Документы успешно импортированы' })
          } catch (error) {
               return next(ApiError.internal(error.message))
          }
     }
}

module.exports = new DocController()
