const { Consumable, Movement } = require('../models/consumableModels')
const ApiError = require('../error/ApiError')

class ConsumableController {
     async getAll(req, res, next) {
          try {
               const consumables = await Consumable.findAll({
                    include: [{ model: Movement, as: 'movements', required: false }],
                    order: [['model', 'ASC']],
               })
               return res.json(consumables)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении списка картриджей'))
          }
     }

     async getOne(req, res, next) {
          try {
               const { id } = req.params
               const consumable = await Consumable.findByPk(id, {
                    include: [{ model: Movement, as: 'movements', order: [['date', 'DESC']] }],
               })
               if (!consumable) return next(ApiError.notFound('Картридж не найден'))
               return res.json(consumable)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении картриджа'))
          }
     }

     // controllers/consumableController.js (фрагмент)
     async create(req, res, next) {
          const transaction = await Consumable.sequelize.transaction()
          try {
               const { model, name, location, quantity, minQuantity } = req.body
               const createdBy = req.user?.id || null

               if (!model || model.trim() === '') return next(ApiError.badRequest('Модель обязательна'))
               if (!location || !['СЭБ', 'Склад', 'АБК'].includes(location)) {
                    return next(ApiError.badRequest('Некорректная локация для начального количества'))
               }
               if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0)) {
                    return next(ApiError.badRequest('Количество должно быть неотрицательным числом'))
               }

               // Проверяем, существует ли модель хотя бы на одном складе
               const existingAny = await Consumable.findOne({ where: { model: model.trim() }, transaction })
               const allLocations = ['СЭБ', 'Склад', 'АБК']

               if (!existingAny) {
                    // Модель нигде не существует – создаём записи для всех трёх складов
                    for (const loc of allLocations) {
                         const qty = loc === location ? quantity || 0 : 0
                         await Consumable.create(
                              {
                                   model: model.trim(),
                                   name: name ? name.trim() : null,
                                   location: loc,
                                   quantity: qty,
                                   minQuantity: minQuantity || 0,
                                   createdBy,
                              },
                              { transaction }
                         )
                    }
               } else {
                    // Модель уже есть где-то – добавляем количество только в указанный склад (через findOrCreate)
                    const [consumable, created] = await Consumable.findOrCreate({
                         where: { model: model.trim(), location },
                         defaults: {
                              model: model.trim(),
                              name: name ? name.trim() : null,
                              location,
                              quantity: 0,
                              minQuantity: minQuantity || 0,
                              createdBy,
                         },
                         transaction,
                    })
                    if (!created) {
                         // Если запись уже есть, увеличиваем количество
                         await consumable.update({ quantity: consumable.quantity + (quantity || 0) }, { transaction })
                    } else {
                         // Если создали новую запись, но количество указано
                         if (quantity) {
                              await consumable.update({ quantity }, { transaction })
                         }
                    }
               }

               await transaction.commit()

               // Возвращаем все записи этой модели (обновлённые)
               const allItems = await Consumable.findAll({
                    where: { model: model.trim() },
                    include: [{ model: Movement, as: 'movements' }],
               })
               return res.json(allItems)
          } catch (error) {
               await transaction.rollback()
               console.error(error)
               return next(ApiError.internal('Ошибка при создании картриджа'))
          }
     }

     async update(req, res, next) {
          try {
               const { id } = req.params
               const { model, name, location, quantity, minQuantity } = req.body

               const consumable = await Consumable.findByPk(id)
               if (!consumable) return next(ApiError.notFound('Картридж не найден'))

               if (model !== undefined && model.trim() === '')
                    return next(ApiError.badRequest('Модель не может быть пустой'))
               if (location !== undefined && !['СЭБ', 'Склад', 'АБК'].includes(location)) {
                    return next(ApiError.badRequest('Некорректная локация'))
               }
               if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0)) {
                    return next(ApiError.badRequest('Количество должно быть неотрицательным'))
               }

               await consumable.update({
                    model: model !== undefined ? model.trim() : consumable.model,
                    name: name !== undefined ? (name ? name.trim() : null) : consumable.name,
                    location: location || consumable.location,
                    quantity: quantity !== undefined ? quantity : consumable.quantity,
                    minQuantity: minQuantity !== undefined ? minQuantity : consumable.minQuantity,
               })
               return res.json(consumable)
          } catch (error) {
               return next(ApiError.internal('Ошибка при обновлении картриджа'))
          }
     }

     async delete(req, res, next) {
          try {
               const { id } = req.params
               const consumable = await Consumable.findByPk(id)
               if (!consumable) return next(ApiError.notFound('Картридж не найден'))
               await consumable.destroy()
               return res.json({ message: 'Картридж успешно удалён' })
          } catch (error) {
               return next(ApiError.internal('Ошибка при удалении картриджа'))
          }
     }

     async addMovement(req, res, next) {
          const transaction = await Consumable.sequelize.transaction()
          try {
               const { id } = req.params
               const { type, quantity, comment, date } = req.body
               const createdBy = req.user?.id || null

               if (!['income', 'outcome'].includes(type)) return next(ApiError.badRequest('Некорректный тип движения'))
               if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
                    return next(ApiError.badRequest('Количество должно быть положительным целым числом'))
               }

               const consumable = await Consumable.findByPk(id, { transaction })
               if (!consumable) {
                    await transaction.rollback()
                    return next(ApiError.notFound('Картридж не найден'))
               }

               let newQuantity = consumable.quantity
               if (type === 'income') {
                    newQuantity += quantity
               } else {
                    if (consumable.quantity < quantity) {
                         await transaction.rollback()
                         return next(ApiError.badRequest('Недостаточно картриджей на складе'))
                    }
                    newQuantity -= quantity
               }

               await Movement.create(
                    {
                         consumableId: id,
                         type,
                         quantity,
                         comment: comment || '',
                         date: date || new Date(),
                         createdBy,
                    },
                    { transaction }
               )

               await consumable.update({ quantity: newQuantity }, { transaction })
               await transaction.commit()

               const updated = await Consumable.findByPk(id, {
                    include: [{ model: Movement, as: 'movements' }],
               })
               return res.json(updated)
          } catch (error) {
               await transaction.rollback()
               console.error(error)
               return next(ApiError.internal('Ошибка при добавлении движения'))
          }
     }

     async move(req, res, next) {
          const transaction = await Consumable.sequelize.transaction()
          try {
               const { id } = req.params
               const { targetLocation, quantity, comment } = req.body
               const createdBy = req.user?.id || null

               if (!['СЭБ', 'Склад', 'АБК'].includes(targetLocation)) {
                    return next(ApiError.badRequest('Некорректная целевая локация'))
               }
               if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
                    return next(ApiError.badRequest('Количество должно быть положительным целым числом'))
               }

               const sourceItem = await Consumable.findByPk(id, { transaction })
               if (!sourceItem) {
                    await transaction.rollback()
                    return next(ApiError.notFound('Картридж-источник не найден'))
               }
               if (sourceItem.quantity < quantity) {
                    await transaction.rollback()
                    return next(ApiError.badRequest('Недостаточно картриджей на складе-источнике'))
               }

               let targetItem = await Consumable.findOne({
                    where: { model: sourceItem.model, location: targetLocation },
                    transaction,
               })
               if (!targetItem) {
                    targetItem = await Consumable.create(
                         {
                              model: sourceItem.model,
                              name: sourceItem.name,
                              location: targetLocation,
                              quantity: 0,
                              minQuantity: sourceItem.minQuantity,
                              createdBy,
                         },
                         { transaction }
                    )
               }

               await sourceItem.update({ quantity: sourceItem.quantity - quantity }, { transaction })
               await targetItem.update({ quantity: targetItem.quantity + quantity }, { transaction })

               const now = new Date()
               await Movement.create(
                    {
                         consumableId: sourceItem.id,
                         type: 'outcome',
                         quantity,
                         comment: `Перемещение на склад ${targetLocation}. ${comment || ''}`,
                         date: now,
                         createdBy,
                    },
                    { transaction }
               )
               await Movement.create(
                    {
                         consumableId: targetItem.id,
                         type: 'income',
                         quantity,
                         comment: `Перемещение со склада ${sourceItem.location}. ${comment || ''}`,
                         date: now,
                         createdBy,
                    },
                    { transaction }
               )

               await transaction.commit()

               const updatedSource = await Consumable.findByPk(sourceItem.id, {
                    include: [{ model: Movement, as: 'movements' }],
               })
               const updatedTarget = await Consumable.findByPk(targetItem.id, {
                    include: [{ model: Movement, as: 'movements' }],
               })
               return res.json({ source: updatedSource, target: updatedTarget })
          } catch (error) {
               await transaction.rollback()
               console.error(error)
               return next(ApiError.internal('Ошибка при перемещении'))
          }
     }
}

module.exports = new ConsumableController()
