const { PositionAccess, Department, Dolgnost } = require('../models/models');
const { ConfidentialInfo } = require('../models/confidentialModels');
const ApiError = require('../error/ApiError');

class PositionAccessController {
     // Получить все записи с подгрузкой названий отдела и должности
     async getAll(req, res, next) {
          try {
               const records = await PositionAccess.findAll({
                    include: [
                         { model: Department, as: 'department', attributes: ['code', 'description', 'short_name'] },
                         { model: Dolgnost, as: 'dolgnost', attributes: ['dolgn', 'dolgn_s'] },
                    ],
                    order: [
                         [{ model: Department, as: 'department' }, 'description', 'ASC'],
                         [{ model: Dolgnost, as: 'dolgnost' }, 'dolgn', 'ASC'],
                    ],
               })
               return res.json(records)
          } catch (err) {
               console.error('❌ Error in getAll:', err)
               return next(ApiError.internal('Ошибка при получении доступа к КТ'))
          }
     }

     // Получить по id
     async getOne(req, res, next) {
          try {
               const { id } = req.params
               const record = await PositionAccess.findByPk(id, {
                    include: [
                         { model: Department, as: 'department' },
                         { model: Dolgnost, as: 'dolgnost' },
                    ],
               })
               if (!record) return next(ApiError.notFound('Запись не найдена'))
               return res.json(record)
          } catch (err) {
               return next(ApiError.internal('Ошибка при получении записи'))
          }
     }

     // Создать
     async create(req, res, next) {
          try {
               const { department_id, dolgnost_id, confidential_points } = req.body
               if (!department_id || !dolgnost_id) {
                    return next(ApiError.badRequest('Не указаны отдел или должность'))
               }
               // Проверяем на дублирование
               const existing = await PositionAccess.findOne({ where: { department_id, dolgnost_id } })
               if (existing) {
                    return next(ApiError.badRequest('Для этой пары отдел+должность уже задан доступ'))
               }
               const record = await PositionAccess.create({ department_id, dolgnost_id, confidential_points })
               return res.status(201).json(record)
          } catch (err) {
               console.error(err)
               return next(ApiError.internal('Ошибка при создании записи'))
          }
     }

     // Обновить
     async update(req, res, next) {
          try {
               const { id } = req.params
               const { department_id, dolgnost_id, confidential_points } = req.body
               const record = await PositionAccess.findByPk(id)
               if (!record) return next(ApiError.notFound('Запись не найдена'))
               await record.update({ department_id, dolgnost_id, confidential_points })
               return res.json(record)
          } catch (err) {
               return next(ApiError.internal('Ошибка при обновлении записи'))
          }
     }

     // Удалить
     async delete(req, res, next) {
          try {
               const { id } = req.params
               const deleted = await PositionAccess.destroy({ where: { id } })
               if (!deleted) return next(ApiError.notFound('Запись не найдена'))
               return res.json({ message: 'Запись успешно удалена' })
          } catch (err) {
               return next(ApiError.internal('Ошибка при удалении записи'))
          }
     }

     // Получить пункты КТ для конкретного сотрудника (по отделу и должности)
     async getByDepartmentAndPosition(req, res, next) {
          try {
               const { departmentCode, dolgnostName } = req.query
               if (!departmentCode || !dolgnostName) {
                    return next(ApiError.badRequest('Не указаны отдел или должность'))
               }
               // Находим отдел по коду
               const department = await Department.findOne({ where: { code: departmentCode.split(' ')[0] } })
               if (!department) return res.json([])
               // Находим должность по названию
               const dolgnost = await Dolgnost.findOne({ where: { dolgn: dolgnostName } })
               if (!dolgnost) return res.json([])
               // Ищем запись доступа
               const access = await PositionAccess.findOne({
                    where: { department_id: department.id, dolgnost_id: dolgnost.id },
               })
               if (!access || !access.confidential_points) return res.json([])
               const pointsNumbers = access.confidential_points
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s)
               // Загружаем полные данные пунктов из справочника
               const points = await ConfidentialInfo.findAll({
                    where: { item_number: pointsNumbers },
                    attributes: [
                         'id',
                         'item_number',
                         'information_description',
                         'confidentiality_mark',
                         'access_period',
                    ],
               })
               // Сортируем как в pointsNumbers
               const sorted = pointsNumbers.map((num) => points.find((p) => p.item_number === num)).filter((p) => p)
               return res.json(sorted)
          } catch (err) {
               console.error(err)
               return next(ApiError.internal('Ошибка при получении пунктов КТ для сотрудника'))
          }
     }
}

module.exports = new PositionAccessController()
