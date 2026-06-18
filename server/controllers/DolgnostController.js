const { Dolgnost } = require('../models/models')
const ApiError = require('../error/ApiError')

class DolgnostController {
  async getAllDolgnost(req, res, next) {
    try {
      const dolgnost = await Dolgnost.findAll()
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
      if (!dolgnost) return next(ApiError.notFound('Должность не найдена'))
      return res.json(dolgnost)
    } catch (err) {
      return next(ApiError.internal('Ошибка при получении должности'))
    }
  }

  async createDolgnost(req, res, next) {
    try {
      const { dolgn, dolgn_s, confidential_points } = req.body
      const dolgnost = await Dolgnost.create({ dolgn, dolgn_s, confidential_points })
      return res.json(dolgnost)
    } catch (err) {
      return next(ApiError.internal('Ошибка при создании должности'))
    }
  }

  async updateDolgnost(req, res, next) {
    try {
      const { id } = req.params
      const { dolgn, dolgn_s, confidential_points } = req.body

      const [updated] = await Dolgnost.update(
        { dolgn, dolgn_s, confidential_points },
        { where: { id } }
      )

      if (!updated) return next(ApiError.notFound('Должность не найдена'))

      const updatedDolgnost = await Dolgnost.findOne({ where: { id } })
      return res.json(updatedDolgnost)
    } catch (err) {
      return next(ApiError.internal('Ошибка при обновлении должности'))
    }
  }

  async deleteDolgnost(req, res, next) {
    try {
      const { id } = req.params
      const deleted = await Dolgnost.destroy({ where: { id } })
      if (!deleted) return next(ApiError.notFound('Должность не найдена'))
      return res.json({ message: 'Должность успешно удалена' })
    } catch (err) {
      return next(ApiError.internal('Ошибка при удалении должности'))
    }
  }
}

module.exports = new DolgnostController()