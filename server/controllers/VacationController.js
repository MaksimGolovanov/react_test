// controllers/VacationController.js
const { Vacation } = require('../models/models')

class VacationController {
     async getAll(req, res) {
          const { year } = req.query
          const where = {}
          if (year) {
               where.year = year
          }
          const vacations = await Vacation.findAll({ where })
          return res.json(vacations)
     }

     async getOne(req, res) {
          const { id } = req.params
          const vacation = await Vacation.findOne({ where: { id } })
          if (!vacation) {
               return res.status(404).json({ message: 'Запись не найдена' })
          }
          return res.json(vacation)
     }

     async create(req, res) {
          const { fio, position, totalDays, parts, delta, year } = req.body // !!! год добавлен
          if (!year) {
               return res.status(400).json({ message: 'Год обязателен' })
          }
          const vacation = await Vacation.create({ fio, position, totalDays, parts, delta, year })
          return res.status(201).json(vacation)
     }

     async update(req, res) {
          const { id } = req.params
          const { fio, position, totalDays, parts, delta, year } = req.body // !!! год добавлен
          const vacation = await Vacation.findOne({ where: { id } })
          if (!vacation) {
               return res.status(404).json({ message: 'Запись не найдена' })
          }
          await vacation.update({ fio, position, totalDays, parts, delta, year })
          return res.json(vacation)
     }

     async delete(req, res) {
          const { id } = req.params
          const vacation = await Vacation.findOne({ where: { id } })
          if (!vacation) {
               return res.status(404).json({ message: 'Запись не найдена' })
          }
          await vacation.destroy()
          return res.json({ message: 'Запись удалена' })
     }
}

module.exports = new VacationController()
