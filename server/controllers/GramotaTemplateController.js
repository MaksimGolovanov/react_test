const { GramotaTemplate } = require('../models/models')
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize')

class GramotaTemplateController {
     async getAll(req, res) {
          const templates = await GramotaTemplate.findAll({
               order: [['createdAt', 'DESC']],
          })
          return res.json(templates)
     }

     async getOne(req, res) {
          const { id } = req.params
          const template = await GramotaTemplate.findByPk(id)
          if (!template) throw ApiError.notFound('Шаблон не найден')
          return res.json(template)
     }

     async create(req, res, next) {
          try {
               const { name, description, text, isActive, layout, gramotaType } = req.body // добавили gramotaType
               if (!name || !text) {
                    throw ApiError.badRequest('Не указаны название или текст шаблона')
               }
               const isActiveBool = isActive === true
               if (isActiveBool) {
                    await GramotaTemplate.update({ isActive: false }, { where: {} })
               }
               const template = await GramotaTemplate.create({
                    name,
                    description: description || '',
                    text,
                    isActive: isActiveBool,
                    layout: layout || null,
                    gramotaType: gramotaType || 'ПОЧЕТНАЯ ГРАМОТА', // сохраняем
               })
               return res.status(201).json(template)
          } catch (e) {
               next(e)
          }
     }

     async update(req, res, next) {
          try {
               const { id } = req.params
               const { name, description, text, isActive, layout, gramotaType } = req.body // добавили gramotaType
               const template = await GramotaTemplate.findByPk(id)
               if (!template) throw ApiError.notFound('Шаблон не найден')
               if (isActive === true) {
                    await GramotaTemplate.update({ isActive: false }, { where: { id: { [Op.ne]: id } } })
               }
               await template.update({
                    name,
                    description: description || '',
                    text,
                    isActive: isActive || false,
                    layout: layout || null,
                    gramotaType: gramotaType || 'ПОЧЕТНАЯ ГРАМОТА', // обновляем
               })
               return res.json(template)
          } catch (e) {
               next(e)
          }
     }

     async delete(req, res, next) {
          try {
               const { id } = req.params
               const template = await GramotaTemplate.findByPk(id)
               if (!template) throw ApiError.notFound('Шаблон не найден')
               await template.destroy()
               return res.json({ success: true })
          } catch (e) {
               next(e)
          }
     }

     async setActive(req, res, next) {
          try {
               const { id } = req.params
               const template = await GramotaTemplate.findByPk(id)
               if (!template) throw ApiError.notFound('Шаблон не найден')
               await GramotaTemplate.update({ isActive: false }, { where: {} })
               await template.update({ isActive: true })
               return res.json(template)
          } catch (e) {
               next(e)
          }
     }
}

module.exports = new GramotaTemplateController()
