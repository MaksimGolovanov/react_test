const { StopRole } = require('../../models/IusPtModels')
const ApiError = require('../../error/ApiError')

class IusStopRolesController {
     async getAll(req, res, next) {
          try {
               const stopRoles = await StopRole.findAll()
               return res.json(stopRoles)
          } catch (err) {
               next(ApiError.internal(err.message))
          }
     }

     async create(req, res, next) {
          try {
               const { CodName, Description, CanDoWithoutApproval, Owner, Note, Approvers } = req.body

               const stopRole = await StopRole.create({
                    CodName,
                    Description,
                    CanDoWithoutApproval,
                    Owner,
                    Note,
                    Approvers,
               })

               return res.json(stopRole)
          } catch (err) {
               next(ApiError.internal(err.message))
          }
     }

     // Массовое создание
     async createbulk(req, res, next) {
          try {
               const stopRoles = req.body
               if (!Array.isArray(stopRoles) || stopRoles.length === 0) {
                    return next(ApiError.badRequest('Данные должны быть массивом'))
               }
               const created = await StopRole.bulkCreate(stopRoles)
               return res.json(created)
          } catch (err) {
               next(ApiError.internal(err.message))
          }
     }

     async update(req, res, next) {
          try {
               const { id } = req.params
               const { CodName, Description, CanDoWithoutApproval, Owner, Note, Approvers } = req.body

               const [updated] = await StopRole.update(
                    { CodName, Description, CanDoWithoutApproval, Owner, Note, Approvers },
                    { where: { id } }
               )

               if (updated) {
                    const updatedStopRole = await StopRole.findByPk(id)
                    return res.json(updatedStopRole)
               }

               throw new Error('Стоп-роль не найдена')
          } catch (err) {
               next(ApiError.internal(err.message))
          }
     }

     async delete(req, res, next) {
          try {
               const { id } = req.params

               const deleted = await StopRole.destroy({
                    where: { id },
               })

               if (deleted) {
                    return res.json({ message: 'Стоп-роль успешно удалена' })
               }

               throw new Error('Стоп-роль не найдена')
          } catch (err) {
               next(ApiError.internal(err.message))
          }
     }

     // Массовое удаление
     // Массовое удаление
     async deletebulk(req, res, next) {
          try {
               console.log('DELETE /stoproles/bulk, body:', req.body) // отладка
               const { ids } = req.body
               if (!ids || !Array.isArray(ids) || ids.length === 0) {
                    return res.status(400).json({ message: 'Не передан массив id для удаления' })
               }
               const deleted = await StopRole.destroy({ where: { id: ids } })
               return res.json({ deletedCount: deleted })
          } catch (err) {
               console.error('Ошибка массового удаления стоп-ролей:', err)
               return res.status(500).json({ message: err.message })
          }
     }
}

module.exports = new IusStopRolesController()
