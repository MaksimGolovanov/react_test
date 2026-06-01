const { Dolgnost } = require('../models/models')
const ApiError = require('../error/ApiError')

class DolgnostController {
     async getAllDolgnost(req, res, next) {
          try {
               const dolgnost = await Dolgnost.findAll()
                   // Принудительная сериализация
               const safeData = dolgnost ? JSON.parse(JSON.stringify(dolgnost)) : []
               return res.json(safeData)
          } catch (err) {
               console.error('❌ Error in getAllDolgnost:', err)
               return next(ApiError.internal('Ошибка при получении списка должностей'))
          }
     }

     async getDolgnostById(req, res, next) {
          try {
               const { id } = req.params
               const dolgnost = await Dolgnost.findOne({ where: { id } })
               if (!dolgnost) {
                    return next(ApiError.notFound('Должность не найдена'))
               }
               return res.json(dolgnost)
          } catch (err) {
               return next(ApiError.internal('Ошибка при получении должности'))
          }
     }

     async createDolgnost(req, res, next) {
          try {
               const { dolgn, dolgn_s } = req.body
               const dolgnost = await Dolgnost.create({ dolgn, dolgn_s })
               return res.json(dolgnost)
          } catch (err) {
               return next(ApiError.internal('Ошибка при создании отдела'))
          }
     }

     async updateDolgnost(req, res, next) {
          try {
               const { id } = req.params
               const { dolgn, dolgn_s } = req.body

               const [updated] = await Dolgnost.update({ dolgn, dolgn_s }, { where: { id } })

               if (!updated) {
                    return next(ApiError.notFound('Отдел не найден'))
               }

               const updatedDolgnost = await Dolgnost.findOne({ where: { id } })
               return res.json(updatedDolgnost)
          } catch (err) {
               return next(ApiError.internal('Ошибка при обновлении отдела'))
          }
     }

     async deleteDolgnost(req, res, next) {
          try {
               const { id } = req.params
               const deleted = await Dolgnost.destroy({ where: { id } })

               if (!deleted) {
                    return next(ApiError.notFound('Отдел не найден'))
               }

               return res.json({ message: 'Отдел успешно удален' })
          } catch (err) {
               return next(ApiError.internal('Ошибка при удалении отдела'))
          }
     }
}

module.exports = new DolgnostController()
