// controllers/confidentialController.js
const { ConfidentialInfo } = require('../models/confidentialModels')
const ApiError = require('../error/ApiError')

class ConfidentialController {
     // Получить все записи
     async getAll(req, res, next) {
          try {
               const records = await ConfidentialInfo.findAll({
                    order: [
                         ['section_letter', 'ASC'],
                         ['subsection_number', 'ASC'],
                         ['item_number', 'ASC'],
                    ],
               })
               return res.json(records)
          } catch (error) {
               console.error(error)
               return next(ApiError.internal('Ошибка при получении списка конфиденциальной информации'))
          }
     }

     // Получить одну запись по id
     async getOne(req, res, next) {
          try {
               const { id } = req.params
               const record = await ConfidentialInfo.findByPk(id)
               if (!record) return next(ApiError.notFound('Запись не найдена'))
               return res.json(record)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении записи'))
          }
     }

     // Создать новую запись
     async create(req, res, next) {
          try {
               const {
                    section_letter,
                    section_title,
                    subsection_number,
                    subsection_title,
                    item_number,
                    information_description,
                    confidentiality_mark,
                    access_period,
                    notes,
               } = req.body

               const createdBy = req.user?.id || null

               if (!information_description || information_description.trim() === '') {
                    return next(ApiError.badRequest('Описание информации обязательно'))
               }
               if (!confidentiality_mark || confidentiality_mark.trim() === '') {
                    return next(ApiError.badRequest('Гриф конфиденциальности обязателен'))
               }
               if (!access_period || access_period.trim() === '') {
                    return next(ApiError.badRequest('Срок действия ограничения доступа обязателен'))
               }

               const record = await ConfidentialInfo.create({
                    section_letter: section_letter || null,
                    section_title: section_title ? section_title.trim() : null,
                    subsection_number: subsection_number || null,
                    subsection_title: subsection_title ? subsection_title.trim() : null,
                    item_number: item_number ? item_number.trim() : null,
                    information_description: information_description.trim(),
                    confidentiality_mark: confidentiality_mark.trim(),
                    access_period: access_period.trim(),
                    notes: notes ? notes.trim() : null,
                    createdBy,
               })

               return res.status(201).json(record)
          } catch (error) {
               console.error(error)
               return next(ApiError.internal('Ошибка при создании записи'))
          }
     }

     // Обновить запись
     async update(req, res, next) {
          try {
               const { id } = req.params
               const {
                    section_letter,
                    section_title,
                    subsection_number,
                    subsection_title,
                    item_number,
                    information_description,
                    confidentiality_mark,
                    access_period,
                    notes,
               } = req.body

               const record = await ConfidentialInfo.findByPk(id)
               if (!record) return next(ApiError.notFound('Запись не найдена'))

               if (information_description !== undefined && information_description.trim() === '') {
                    return next(ApiError.badRequest('Описание информации не может быть пустым'))
               }
               if (confidentiality_mark !== undefined && confidentiality_mark.trim() === '') {
                    return next(ApiError.badRequest('Гриф конфиденциальности не может быть пустым'))
               }
               if (access_period !== undefined && access_period.trim() === '') {
                    return next(ApiError.badRequest('Срок действия не может быть пустым'))
               }

               await record.update({
                    section_letter: section_letter !== undefined ? section_letter : record.section_letter,
                    section_title:
                         section_title !== undefined
                              ? section_title
                                   ? section_title.trim()
                                   : null
                              : record.section_title,
                    subsection_number: subsection_number !== undefined ? subsection_number : record.subsection_number,
                    subsection_title:
                         subsection_title !== undefined
                              ? subsection_title
                                   ? subsection_title.trim()
                                   : null
                              : record.subsection_title,
                    item_number:
                         item_number !== undefined ? (item_number ? item_number.trim() : null) : record.item_number,
                    information_description:
                         information_description !== undefined
                              ? information_description.trim()
                              : record.information_description,
                    confidentiality_mark:
                         confidentiality_mark !== undefined ? confidentiality_mark.trim() : record.confidentiality_mark,
                    access_period: access_period !== undefined ? access_period.trim() : record.access_period,
                    notes: notes !== undefined ? (notes ? notes.trim() : null) : record.notes,
               })

               return res.json(record)
          } catch (error) {
               console.error(error)
               return next(ApiError.internal('Ошибка при обновлении записи'))
          }
     }

     // Удалить запись
     async delete(req, res, next) {
          try {
               const { id } = req.params
               const record = await ConfidentialInfo.findByPk(id)
               if (!record) return next(ApiError.notFound('Запись не найдена'))
               await record.destroy()
               return res.json({ message: 'Запись успешно удалена' })
          } catch (error) {
               return next(ApiError.internal('Ошибка при удалении записи'))
          }
     }
}

module.exports = new ConfidentialController()
