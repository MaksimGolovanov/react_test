const { Signatory } = require('../models/models')
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize')

class SignatoryController {
     async getAll(req, res) {
          const signatories = await Signatory.findAll({
               order: [
                    ['sortOrder', 'ASC'],
                    ['createdAt', 'DESC'],
               ],
          })
          return res.json(signatories)
     }

     async getOne(req, res) {
          const { id } = req.params
          const signatory = await Signatory.findByPk(id)
          if (!signatory) throw ApiError.notFound('Подписант не найден')
          return res.json(signatory)
     }

     async create(req, res, next) {
          try {
               const { name, position, isActive, sortOrder } = req.body
               if (!name || !position) {
                    throw ApiError.badRequest('Не указаны ФИО или должность')
               }
               const isActiveBool = isActive === true
               if (isActiveBool) {
                    await Signatory.update({ isActive: false }, { where: { isActive: true } })
               }
               const signatory = await Signatory.create({
                    name,
                    position,
                    isActive: isActiveBool,
                    sortOrder: sortOrder || 0,
               })
               return res.status(201).json(signatory)
          } catch (e) {
               next(e)
          }
     }

     async update(req, res, next) {
          try {
               const { id } = req.params
               const { name, position, isActive, sortOrder } = req.body
               const signatory = await Signatory.findByPk(id)
               if (!signatory) throw ApiError.notFound('Подписант не найден')

               if (isActive === true) {
                    await Signatory.update({ isActive: false }, { where: { id: { [Op.ne]: id } } })
               }
               await signatory.update({
                    name,
                    position,
                    isActive: isActive || false,
                    sortOrder: sortOrder || 0,
               })
               return res.json(signatory)
          } catch (e) {
               next(e)
          }
     }

     async delete(req, res, next) {
          try {
               const { id } = req.params
               const signatory = await Signatory.findByPk(id)
               if (!signatory) throw ApiError.notFound('Подписант не найден')
               await signatory.destroy()
               return res.json({ success: true })
          } catch (e) {
               next(e)
          }
     }

     async setActive(req, res, next) {
          try {
               const { id } = req.params
               const signatory = await Signatory.findByPk(id)
               if (!signatory) throw ApiError.notFound('Подписант не найден')
               await Signatory.update({ isActive: false }, { where: {} })
               await signatory.update({ isActive: true })
               return res.json(signatory)
          } catch (e) {
               next(e)
          }
     }
}

module.exports = new SignatoryController()
