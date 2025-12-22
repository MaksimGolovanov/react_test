const { Card } = require('../models/models')
const ApiError = require('../error/ApiError')
const nodemailer = require('nodemailer')

class CardController {
     async getAll(req, res, next) {
          try {
               const card = await Card.findAll()
               return res.json(card)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении списка Карт'))
          }
     }

     async create(req, res, next) {
          try {
               const { ser_num, type, description, fio, department, data_prov, log } = req.body

               // Проверка на существующий USB с таким же номером
               const existingCard = await Card.findOne({ where: { ser_num } })
               if (existingCard) {
                    return next(ApiError.badRequest('Карта с таким серийным номером уже существует'))
               }

               // Преобразование дат
               const formattedData = {
                    ser_num: ser_num || null,
                    type: type || null,
                    description: description || null,
                    fio: fio || null,
                    department: department || null,
                    data_prov: data_prov ? new Date(data_prov) : null, // Убрали card.data_prov
                    log: log || null,
               }

               const card = await Card.create(formattedData)
               return res.json(card)
          } catch (error) {
               return next(ApiError.internal('Ошибка при создании карта: ' + error.message))
          }
     }

     async update(req, res, next) {
          try {
               const { id } = req.params
               const { ser_num, type, description, fio, department, data_prov, log } = req.body

               const card = await Card.findByPk(id)
               if (!card) {
                    return next(ApiError.notFound('карта не найдена'))
               }

               if (ser_num && ser_num !== card.ser_num) {
                    const existingCard = await Card.findOne({ where: { ser_num } })
                    if (existingCard) {
                         return next(ApiError.badRequest('Карта с таким серийным номером уже существует'))
                    }
               }

               // Преобразование дат
               const updateData = {
                    ser_num: ser_num !== undefined ? ser_num : card.ser_num,
                    type: type !== undefined ? type : card.type,
                    description: description !== undefined ? description : card.description,
                    fio: fio !== undefined ? fio : card.fio,
                    department: department !== undefined ? department : card.department,
                    data_prov: data_prov !== undefined ? (data_prov ? new Date(data_prov) : null) : card.data_prov,
                    log: log !== undefined ? log : card.log,
               }

               await card.update(updateData)
               return res.json(card)
          } catch (error) {
               return next(ApiError.internal('Ошибка при обновлении карты: ' + error.message))
          }
     }

     async delete(req, res, next) {
          try {
               const { id } = req.params
               const card = await Card.findByPk(id)
               if (!card) {
                    return next(ApiError.notFound('Карта не найдена'))
               }

               await card.destroy()
               return res.json({ message: 'Карта успешно удалена' })
          } catch (error) {
               return next(ApiError.internal('Ошибка при удалении карты: ' + error.message))
          }
     }
}

module.exports = new CardController()
