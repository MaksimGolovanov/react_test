// controllers/naryadGasHazardWorkController.js

const { NaryadGasHazardWork } = require('../models/models')
const ApiError = require('../error/ApiError')

class NaryadGasHazardWorkController {
     // Получить все записи
     async getAll(req, res, next) {
          try {
               const items = await NaryadGasHazardWork.findAll({
                    order: [
                         ['service', 'ASC'],
                         ['code', 'ASC'],
                    ],
               })
               return res.json(items)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении списка ГОР: ' + error.message))
          }
     }

     // Получить записи по службе
     async getByService(req, res, next) {
          try {
               const { service } = req.params
               if (!service) {
                    return next(ApiError.badRequest('Не указана служба'))
               }
               const items = await NaryadGasHazardWork.findAll({
                    where: { service },
                    order: [['code', 'ASC']],
               })
               return res.json(items)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении записей по службе: ' + error.message))
          }
     }

     // Создать запись
     async create(req, res, next) {
          try {
               const {
                    code,
                    service,
                    description,
                    dangerFactors,
                    executorCategory,
                    preparationMeasures,
                    safetyMeasures,
                    appendices,
                    withoutPermit,
               } = req.body

               // Проверка обязательных полей
               if (!code || !service || !description) {
                    return next(ApiError.badRequest('Код, служба и описание обязательны'))
               }

               // Проверка на дубликат (код + служба)
               const existing = await NaryadGasHazardWork.findOne({
                    where: { code, service },
               })
               if (existing) {
                    return next(ApiError.badRequest('Запись с таким кодом и службой уже существует'))
               }

               const item = await NaryadGasHazardWork.create({
                    code,
                    service,
                    description,
                    dangerFactors: dangerFactors || '',
                    executorCategory: executorCategory || '',
                    preparationMeasures: preparationMeasures || '',
                    safetyMeasures: safetyMeasures || '',
                    appendices: appendices || '',
                    withoutPermit: withoutPermit || false,
               })

               return res.json(item)
          } catch (error) {
               return next(ApiError.internal('Ошибка при создании записи: ' + error.message))
          }
     }

     // Обновить запись
     async update(req, res, next) {
          try {
               const { id } = req.params
               const {
                    code,
                    service,
                    description,
                    dangerFactors,
                    executorCategory,
                    preparationMeasures,
                    safetyMeasures,
                    appendices,
                    withoutPermit,
               } = req.body

               const item = await NaryadGasHazardWork.findByPk(id)
               if (!item) {
                    return next(ApiError.notFound('Запись не найдена'))
               }

               // Если меняются код или служба, проверяем дубликат
               if ((code && code !== item.code) || (service && service !== item.service)) {
                    const existing = await NaryadGasHazardWork.findOne({
                         where: { code: code || item.code, service: service || item.service },
                    })
                    if (existing && existing.id !== parseInt(id)) {
                         return next(ApiError.badRequest('Запись с таким кодом и службой уже существует'))
                    }
               }

               await item.update({
                    code: code || item.code,
                    service: service || item.service,
                    description: description || item.description,
                    dangerFactors: dangerFactors !== undefined ? dangerFactors : item.dangerFactors,
                    executorCategory: executorCategory !== undefined ? executorCategory : item.executorCategory,
                    preparationMeasures:
                         preparationMeasures !== undefined ? preparationMeasures : item.preparationMeasures,
                    safetyMeasures: safetyMeasures !== undefined ? safetyMeasures : item.safetyMeasures,
                    appendices: appendices !== undefined ? appendices : item.appendices,
                    withoutPermit: withoutPermit !== undefined ? withoutPermit : item.withoutPermit,
               })

               return res.json(item)
          } catch (error) {
               return next(ApiError.internal('Ошибка при обновлении записи: ' + error.message))
          }
     }

     // Удалить запись
     async delete(req, res, next) {
          try {
               const { id } = req.params
               const item = await NaryadGasHazardWork.findByPk(id)
               if (!item) {
                    return next(ApiError.notFound('Запись не найдена'))
               }
               await item.destroy()
               return res.json({ message: 'Запись успешно удалена' })
          } catch (error) {
               return next(ApiError.internal('Ошибка при удалении записи: ' + error.message))
          }
     }
}

module.exports = new NaryadGasHazardWorkController()
