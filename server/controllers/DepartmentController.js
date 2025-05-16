const { Department } = require('../models/models')
const ApiError = require('../error/ApiError')

class DepartmentController {
     async getAllDepartments(req, res, next) {
          try {
               console.log('Fetching departments...') // Добавьте лог
               const departments = await Department.findAll()
               console.log('Found departments:', departments.length) // Лог количества
               return res.json(departments)
          } catch (err) {
               console.error('Error in getAllDepartments:', err)
               return next(ApiError.internal('Ошибка при получении списка отделов'))
          }
     }

     async getDepartmentById(req, res, next) {
          try {
               const { id } = req.params
               const department = await Department.findOne({ where: { id } })
               if (!department) {
                    return next(ApiError.notFound('Отдел не найден'))
               }
               return res.json(department)
          } catch (err) {
               return next(ApiError.internal('Ошибка при получении отдела'))
          }
     }

     async createDepartment(req, res, next) {
          try {
               const { code, description, short_name } = req.body
               const department = await Department.create({ code, description, short_name })
               return res.json(department)
          } catch (err) {
               return next(ApiError.internal('Ошибка при создании отдела'))
          }
     }

     async updateDepartment(req, res, next) {
          try {
               const { id } = req.params
               const { code, description, short_name } = req.body

               const [updated] = await Department.update({ code, description, short_name }, { where: { id } })

               if (!updated) {
                    return next(ApiError.notFound('Отдел не найден'))
               }

               const updatedDepartment = await Department.findOne({ where: { id } })
               return res.json(updatedDepartment)
          } catch (err) {
               return next(ApiError.internal('Ошибка при обновлении отдела'))
          }
     }

     async deleteDepartment(req, res, next) {
          try {
               const { id } = req.params
               const deleted = await Department.destroy({ where: { id } })

               if (!deleted) {
                    return next(ApiError.notFound('Отдел не найден'))
               }

               return res.json({ message: 'Отдел успешно удален' })
          } catch (err) {
               return next(ApiError.internal('Ошибка при удалении отдела'))
          }
     }
}

module.exports = new DepartmentController()
