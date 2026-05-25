const VehicleType = require('../models/VehicleType')
const VehicleSubtype = require('../models/VehicleSubtype')
const Vehicle = require('../models/Vehicle')
const Booking = require('../models/Booking')
const Department = require('../models/Department')
const TimeSlot = require('../models/TimeSlot')
const Drivers = require('../models/Drivers')
const ApiError = require('../error/ApiError')
const Request = require('../models/Request')

const { Op } = require('sequelize')
const sequelize = require('../db')

class TransportController {
     // ========== АВТОМОБИЛИ ==========

     async getAllVehicles(req, res, next) {
          try {
               const { technical_condition, vehicle_type, search } = req.query

               let where = {}

               if (technical_condition) {
                    where.technical_condition = technical_condition
               }

               if (vehicle_type) {
                    where.vehicle_type = vehicle_type
               }

               if (search) {
                    where[Op.or] = [
                         { vehicle_brand: { [Op.iLike]: `%${search}%` } },
                         { state_number: { [Op.iLike]: `%${search}%` } },

                         { company_affiliation: { [Op.iLike]: `%${search}%` } },
                    ]
               }

               const vehicles = await Vehicle.findAll({
                    where,
                    order: [['vehicle_brand', 'ASC']],
               })

               return res.json(vehicles)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении списка автомобилей: ' + error.message))
          }
     }

     async getVehicleById(req, res, next) {
          try {
               const { id } = req.params

               const vehicle = await Vehicle.findByPk(id)
               if (!vehicle) {
                    return next(ApiError.notFound('Автомобиль не найден'))
               }

               return res.json(vehicle)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении автомобиля: ' + error.message))
          }
     }

     async createVehicle(req, res, next) {
          try {
               const {
                    vin,
                    vehicle_brand,
                    vehicle_type_id,
                    vehicle_subtype_id,

                    state_number,
                    repair_type,
                    repair_waiting_time,
                    downtime_duration,
                    technical_condition,
                    current_location,
                    company_affiliation,
               } = req.body

               console.log('Received vehicle data:', req.body)

               // Получаем название типа по ID
               let vehicle_type = null
               if (vehicle_type_id) {
                    const type = await VehicleType.findByPk(vehicle_type_id)
                    if (type) {
                         vehicle_type = type.name
                         console.log('Found vehicle type:', vehicle_type)
                    } else {
                         return next(ApiError.badRequest('Указанный тип транспорта не найден'))
                    }
               } else {
                    return next(ApiError.badRequest('Тип транспорта обязателен'))
               }

               // Получаем название подтипа по ID (если указан)
               let vehicle_subtype = null
               if (vehicle_subtype_id) {
                    const subtype = await VehicleSubtype.findByPk(vehicle_subtype_id)
                    if (subtype) {
                         vehicle_subtype = subtype.name
                         console.log('Found vehicle subtype:', vehicle_subtype)
                    }
               }

               // Проверка на существующий госномер
               const existingVehicle = await Vehicle.findOne({ where: { state_number } })
               if (existingVehicle) {
                    return next(ApiError.badRequest('Автомобиль с таким госномером уже существует'))
               }

               // Проверка на VIN если указан
               if (vin) {
                    const existingVin = await Vehicle.findOne({ where: { vin } })
                    if (existingVin) {
                         return next(ApiError.badRequest('Автомобиль с таким VIN номером уже существует'))
                    }
               }

               // Создаем автомобиль
               const vehicle = await Vehicle.create({
                    vin: vin || null,
                    vehicle_brand,
                    vehicle_type,
                    vehicle_subtype,

                    state_number,
                    repair_type: repair_type || null,
                    repair_waiting_time: repair_waiting_time || null,
                    downtime_duration: downtime_duration || null,
                    technical_condition: technical_condition || 'исправен',
                    current_location: current_location || null,
                    company_affiliation,
               })

               console.log('Created vehicle:', vehicle.toJSON())

               return res.status(201).json(vehicle)
          } catch (error) {
               console.error('Error in createVehicle:', error)
               return next(ApiError.internal('Ошибка при создании автомобиля: ' + error.message))
          }
     }

     async updateVehicle(req, res, next) {
          try {
               const { id } = req.params
               const updateData = req.body

               const vehicle = await Vehicle.findByPk(id)
               if (!vehicle) {
                    return next(ApiError.notFound('Автомобиль не найден'))
               }

               // Если передан vehicle_type_id, преобразуем в название
               if (updateData.vehicle_type_id) {
                    const type = await VehicleType.findByPk(updateData.vehicle_type_id)
                    if (type) {
                         updateData.vehicle_type = type.name
                    }
                    delete updateData.vehicle_type_id
               }

               // Если передан vehicle_subtype_id, преобразуем в название
               if (updateData.vehicle_subtype_id) {
                    const subtype = await VehicleSubtype.findByPk(updateData.vehicle_subtype_id)
                    if (subtype) {
                         updateData.vehicle_subtype = subtype.name
                    }
                    delete updateData.vehicle_subtype_id
               }

               // Проверка на уникальность госномера при смене
               if (updateData.state_number && updateData.state_number !== vehicle.state_number) {
                    const existingVehicle = await Vehicle.findOne({
                         where: { state_number: updateData.state_number },
                    })
                    if (existingVehicle) {
                         return next(ApiError.badRequest('Автомобиль с таким госномером уже существует'))
                    }
               }

               // Проверка на уникальность VIN при смене
               if (updateData.vin && updateData.vin !== vehicle.vin) {
                    const existingVin = await Vehicle.findOne({
                         where: { vin: updateData.vin },
                    })
                    if (existingVin) {
                         return next(ApiError.badRequest('Автомобиль с таким VIN номером уже существует'))
                    }
               }

               await vehicle.update(updateData)
               return res.json(vehicle)
          } catch (error) {
               console.error('Error in updateVehicle:', error)
               return next(ApiError.internal('Ошибка при обновлении автомобиля: ' + error.message))
          }
     }

     async deleteVehicle(req, res, next) {
          try {
               const { id } = req.params

               const vehicle = await Vehicle.findByPk(id)
               if (!vehicle) {
                    return res.status(404).json({
                         message: 'Автомобиль не найден',
                         error: 'VEHICLE_NOT_FOUND',
                    })
               }

               const activeBookings = await Booking.findOne({
                    where: {
                         vehicle_id: id,
                         status: 'active',
                         booking_date: {
                              [Op.gte]: new Date(),
                         },
                    },
               })

               if (activeBookings) {
                    // Прямой ответ вместо ApiError.badRequest
                    return res.status(400).json({
                         message: 'Нельзя удалить автомобиль с активными бронированиями',
                         error: 'ACTIVE_BOOKINGS_EXIST',
                         details: {
                              booking_id: activeBookings.id,
                              booking_date: activeBookings.booking_date,
                         },
                    })
               }

               await vehicle.destroy()
               return res.status(200).json({
                    message: 'Автомобиль успешно удален',
                    deletedId: id,
               })
          } catch (error) {
               console.error('Error in deleteVehicle:', error)
               return res.status(500).json({
                    message: 'Ошибка при удалении автомобиля: ' + error.message,
                    error: 'INTERNAL_SERVER_ERROR',
               })
          }
     }
     // ========== ВОДИТЕЛИ ==========

     async getAllDrivers(req, res, next) {
          try {
               const { search, status } = req.query // вместо is_active используем status

               let where = {}

               if (status) {
                    where.is_active = status // теперь фильтруем по строковому статусу
               }

               if (search) {
                    where[Op.or] = [
                         { fio: { [Op.iLike]: `%${search}%` } },
                         { post: { [Op.iLike]: `%${search}%` } },
                         { department: { [Op.iLike]: `%${search}%` } },
                    ]
               }

               const drivers = await Drivers.findAll({
                    where,
                    order: [
                         ['sort_order', 'ASC'],
                         ['fio', 'ASC'],
                    ],
               })

               return res.json(drivers)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении списка водителей: ' + error.message))
          }
     }

     async getDriverById(req, res, next) {
          try {
               const { id } = req.params

               const driver = await Drivers.findByPk(id)

               if (!driver) {
                    return next(ApiError.notFound('Водитель не найден'))
               }

               return res.json(driver)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении водителя: ' + error.message))
          }
     }

     async createDriver(req, res, next) {
          try {
               const { fio, post, department, sort_order, is_active, date_from, date_to } = req.body

               // Проверка обязательных полей
               if (!fio || !post || !department) {
                    return next(ApiError.badRequest('ФИО, должность и отдел обязательны для заполнения'))
               }

               // Проверка на дубликат ФИО
               const existingDriver = await Drivers.findOne({
                    where: { fio },
               })
               if (existingDriver) {
                    return next(ApiError.badRequest('Водитель с таким ФИО уже существует'))
               }

               // Устанавливаем статус: если передан, то берём его, иначе 'at_work'
               const driverStatus = is_active || 'at_work'

               const driver = await Drivers.create({
                    fio,
                    post,
                    department,
                    sort_order: sort_order || 0,
                    is_active: driverStatus,
                    date_from,
                    date_to,

               })

               return res.status(201).json(driver)
          } catch (error) {
               console.error('Error in createDriver:', error)
               return next(ApiError.internal('Ошибка при создании водителя: ' + error.message))
          }
     }

     async updateDriver(req, res, next) {
          try {
               const { id } = req.params
               const { fio, post, department, sort_order, is_active, date_from, date_to } = req.body

               const driver = await Drivers.findByPk(id)
               if (!driver) {
                    return next(ApiError.notFound('Водитель не найден'))
               }

               // Проверка на дубликат ФИО при изменении
               if (fio && fio !== driver.fio) {
                    const existingDriver = await Drivers.findOne({
                         where: { fio },
                    })
                    if (existingDriver) {
                         return next(ApiError.badRequest('Водитель с таким ФИО уже существует'))
                    }
               }

               await driver.update({
                    fio: fio || driver.fio,
                    post: post || driver.post,
                    department: department || driver.department,
                    sort_order: sort_order !== undefined ? sort_order : driver.sort_order,
                    is_active: is_active !== undefined ? is_active : driver.is_active,
                    date_from: date_from,
                    date_to: date_to,
               })

               return res.json(driver)
          } catch (error) {
               return next(ApiError.internal('Ошибка при обновлении водителя: ' + error.message))
          }
     }

     async deleteDriver(req, res, next) {
          try {
               const { id } = req.params

               const driver = await Drivers.findByPk(id)
               if (!driver) {
                    return next(ApiError.notFound('Водитель не найден'))
               }

               // Мягкое удаление - устанавливаем статус 'deactivated' (или можно просто is_active = 'deactivated')
               await driver.update({ is_active: 'deactivated' })

               return res.json({ message: 'Водитель успешно деактивирован' })
          } catch (error) {
               return next(ApiError.internal('Ошибка при удалении водителя: ' + error.message))
          }
     }
     // ========== БРОНИРОВАНИЯ ==========

     async getAllBookings(req, res, next) {
          try {
               const bookings = await Booking.findAll({
                    include: [
                         {
                              model: Vehicle,
                              as: 'vehicle',
                              attributes: ['vehicle_brand', 'state_number'],
                         },
                         //{ model: Department, as: 'department', attributes: ['name'] },
                         { model: TimeSlot, as: 'timeSlot', attributes: ['label', 'start_time', 'end_time'] },
                    ],
                    order: [
                         ['booking_date', 'DESC'],
                         ['created_at', 'DESC'],
                    ],
               })

               return res.json(bookings)
          } catch (error) {
               console.error('Error in getAllBookings:', error)
               return next(ApiError.internal('Ошибка при получении списка бронирований: ' + error.message))
          }
     }

     async getBookingsByDate(req, res, next) {
          try {
               const { date } = req.params

               const bookings = await Booking.findAll({
                    where: {
                         booking_date: date,
                         status: 'active',
                    },
                    include: [
                         {
                              model: Vehicle,
                              as: 'vehicle',
                              attributes: ['vehicle_brand', 'state_number', 'technical_condition'],
                         },
                         //{ model: Department, as: 'department', attributes: ['name', 'head_name'] },
                         { model: TimeSlot, as: 'timeSlot', attributes: ['label', 'start_time', 'end_time'] },
                    ],
                    order: [['time_slot_id', 'ASC']],
               })

               return res.json(bookings)
          } catch (error) {
               console.error('Error in getBookingsByDate:', error)
               return next(ApiError.internal('Ошибка при получении бронирований по дате: ' + error.message))
          }
     }

     async getBookingsByVehicle(req, res, next) {
          try {
               const { vehicleId } = req.params
               const { date } = req.query

               let where = { vehicle_id: vehicleId, status: 'active' }
               if (date) {
                    where.booking_date = date
               }

               const bookings = await Booking.findAll({
                    where,
                   // include: [{ model: Department, attributes: ['name'] }],
                    order: [['booking_date', 'DESC']],
               })

               return res.json(bookings)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении бронирований автомобиля: ' + error.message))
          }
     }

     async createBooking(req, res, next) {
          try {
               const { vehicle_id, department_id, time_slot_id, driver_full_name, booking_date, purpose, created_by } =
                    req.body

               console.log('Creating booking with data:', req.body)

               // Проверка на существование автомобиля
               const vehicle = await Vehicle.findByPk(vehicle_id)
               if (!vehicle) {
                    return next(ApiError.notFound('Автомобиль не найден'))
               }

               // Проверка на исправность автомобиля
               if (vehicle.technical_condition !== 'исправен') {
                    return next(ApiError.badRequest('Автомобиль неисправен и не может быть забронирован'))
               }

               // Проверка на дублирование бронирования
               const existingBooking = await Booking.findOne({
                    where: {
                         vehicle_id,
                         booking_date,
                         time_slot_id,
                         status: 'active',
                    },
               })

               if (existingBooking) {
                    return next(ApiError.badRequest('Этот временной слот уже занят'))
               }

               // Проверка на существование отдела
               const department = await Department.findByPk(department_id)
               if (!department) {
                    return next(ApiError.notFound('Отдел не найден'))
               }

               const booking = await Booking.create({
                    vehicle_id,
                    department_id,
                    time_slot_id,
                    booking_date,
                    driver_full_name,
                    purpose,
                    created_by: created_by || 'system',
                    status: 'active',
               })

               // Возвращаем с дополнительной информацией
               const bookingWithDetails = await Booking.findByPk(booking.id, {
                    include: [
                         { model: Vehicle, as: 'vehicle', attributes: ['vehicle_brand', 'state_number'] },
                         { model: Department, as: 'department', attributes: ['name'] },
                         { model: TimeSlot, as: 'timeSlot', attributes: ['label', 'start_time', 'end_time'] },
                    ],
               })

               console.log('Booking created successfully:', bookingWithDetails.toJSON())

               return res.status(201).json(bookingWithDetails)
          } catch (error) {
               console.error('Error in createBooking:', error)
               return next(ApiError.internal('Ошибка при создании бронирования: ' + error.message))
          }
     }

     async cancelBooking(req, res, next) {
          try {
               const { bookingId } = req.params
               const { cancelled_by } = req.body

               const booking = await Booking.findByPk(bookingId)
               if (!booking) {
                    return next(ApiError.notFound('Бронирование не найдено'))
               }

               if (booking.status !== 'active') {
                    return next(ApiError.badRequest('Бронирование уже отменено или завершено'))
               }

               await booking.update({
                    status: 'cancelled',
                    cancelled_by: cancelled_by || 'system',
                    cancelled_at: new Date(),
               })

               return res.json({ message: 'Бронирование успешно отменено', booking })
          } catch (error) {
               return next(ApiError.internal('Ошибка при отмене бронирования: ' + error.message))
          }
     }

     async deleteBooking(req, res, next) {
          try {
               const { bookingId } = req.params

               const booking = await Booking.findByPk(bookingId)
               if (!booking) {
                    return next(ApiError.notFound('Бронирование не найдено'))
               }

               await booking.destroy()
               return res.json({ message: 'Бронирование успешно удалено' })
          } catch (error) {
               return next(ApiError.internal('Ошибка при удалении бронирования: ' + error.message))
          }
     }

     // ========== ОТДЕЛЫ ==========

     async getAllDepartments(req, res, next) {
          try {
               const departments = await Department.findAll({
                    where: { is_active: true },
                    order: [['name', 'ASC']],
               })
               return res.json(departments)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении списка отделов: ' + error.message))
          }
     }

     async createDepartment(req, res, next) {
          try {
               const { name, head_name, email, phone } = req.body

               const existingDepartment = await Department.findOne({ where: { name } })
               if (existingDepartment) {
                    return next(ApiError.badRequest('Отдел с таким названием уже существует'))
               }

               const department = await Department.create({
                    name,
                    head_name: head_name || null,
                    email: email || null,
                    phone: phone || null,
               })

               return res.json(department)
          } catch (error) {
               return next(ApiError.internal('Ошибка при создании отдела: ' + error.message))
          }
     }

     async updateDepartment(req, res, next) {
          try {
               const { id } = req.params
               const updateData = req.body

               const department = await Department.findByPk(id)
               if (!department) {
                    return next(ApiError.notFound('Отдел не найден'))
               }

               if (updateData.name && updateData.name !== department.name) {
                    const existingDepartment = await Department.findOne({
                         where: { name: updateData.name },
                    })
                    if (existingDepartment) {
                         return next(ApiError.badRequest('Отдел с таким названием уже существует'))
                    }
               }

               await department.update(updateData)
               return res.json(department)
          } catch (error) {
               return next(ApiError.internal('Ошибка при обновлении отдела: ' + error.message))
          }
     }

     async deleteDepartment(req, res, next) {
          try {
               const { id } = req.params

               const department = await Department.findByPk(id)
               if (!department) {
                    return next(ApiError.notFound('Отдел не найден'))
               }

               // Проверка на наличие активных бронирований
               const activeBookings = await Booking.findOne({
                    where: {
                         department_id: id,
                         status: 'active',
                         booking_date: {
                              [Op.gte]: new Date(),
                         },
                    },
               })

               if (activeBookings) {
                    return next(ApiError.badRequest('Нельзя удалить отдел с активными бронированиями'))
               }

               await department.destroy()
               return res.json({ message: 'Отдел успешно удален' })
          } catch (error) {
               return next(ApiError.internal('Ошибка при удалении отдела: ' + error.message))
          }
     }

     // ========== ТИПЫ ТРАНСПОРТА ==========

     async getAllVehicleTypes(req, res, next) {
          try {
               const types = await VehicleType.findAll({
                    where: { is_active: true },
                    order: [['sort_order', 'ASC']],
               })
               return res.json(types)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении типов транспорта: ' + error.message))
          }
     }

     async createVehicleType(req, res, next) {
          try {
               const { name, sort_order } = req.body

               const existingType = await VehicleType.findOne({ where: { name } })
               if (existingType) {
                    return next(ApiError.badRequest('Тип транспорта с таким названием уже существует'))
               }

               const type = await VehicleType.create({
                    name,
                    sort_order: sort_order || 0,
               })

               return res.json(type)
          } catch (error) {
               return next(ApiError.internal('Ошибка при создании типа транспорта: ' + error.message))
          }
     }

     async updateVehicleType(req, res, next) {
          try {
               const { id } = req.params
               const { name, sort_order } = req.body

               const type = await VehicleType.findByPk(id)
               if (!type) {
                    return next(ApiError.notFound('Тип транспорта не найден'))
               }

               if (name && name !== type.name) {
                    const existingType = await VehicleType.findOne({ where: { name } })
                    if (existingType) {
                         return next(ApiError.badRequest('Тип транспорта с таким названием уже существует'))
                    }
               }

               await type.update({ name, sort_order })
               return res.json(type)
          } catch (error) {
               return next(ApiError.internal('Ошибка при обновлении типа транспорта: ' + error.message))
          }
     }

     async deleteVehicleType(req, res, next) {
          try {
               const { id } = req.params

               const type = await VehicleType.findByPk(id)
               if (!type) {
                    return next(ApiError.notFound('Тип транспорта не найден'))
               }

               // Проверка на наличие автомобилей с этим типом
               const vehiclesWithType = await Vehicle.findOne({ where: { vehicle_type_id: id } })
               if (vehiclesWithType) {
                    return next(ApiError.badRequest('Нельзя удалить тип, так как есть автомобили с этим типом'))
               }

               await type.destroy()
               return res.json({ message: 'Тип транспорта успешно удален' })
          } catch (error) {
               return next(ApiError.internal('Ошибка при удалении типа транспорта: ' + error.message))
          }
     }

     // ========== ПОДТИПЫ ТРАНСПОРТА ==========

     async getAllVehicleSubtypes(req, res, next) {
          try {
               const subtypes = await VehicleSubtype.findAll({
                    where: { is_active: true },
                    include: [
                         {
                              model: VehicleType,
                              as: 'vehicleType', // Добавьте алиас, который определён в модели
                              attributes: ['id', 'name'],
                         },
                    ],
                    order: [['sort_order', 'ASC']],
               })

               console.log('Subtypes found:', subtypes.length)

               return res.json(subtypes)
          } catch (error) {
               console.error('Error in getAllVehicleSubtypes:', error)
               return next(ApiError.internal('Ошибка при получении подтипов транспорта: ' + error.message))
          }
     }

     async createVehicleSubtype(req, res, next) {
          try {
               const { vehicle_type_id, name, sort_order } = req.body

               // Проверка обязательных полей
               if (!vehicle_type_id || !name) {
                    return next(ApiError.badRequest('Тип транспорта и название подтипа обязательны'))
               }

               // Проверка существования типа
               const vehicleType = await VehicleType.findByPk(vehicle_type_id)
               if (!vehicleType) {
                    return next(ApiError.notFound('Тип транспорта не найден'))
               }

               // Проверка на дубликат
               const existingSubtype = await VehicleSubtype.findOne({
                    where: { vehicle_type_id, name },
               })
               if (existingSubtype) {
                    return next(ApiError.badRequest('Подтип с таким названием уже существует для этого типа'))
               }

               // Создание подтипа
               const subtype = await VehicleSubtype.create({
                    vehicle_type_id,
                    name,
                    sort_order: sort_order || 0,
               })

               // Возвращаем созданный подтип с информацией о типе
               const createdSubtype = await VehicleSubtype.findByPk(subtype.id, {
                    include: [{ model: VehicleType, as: 'vehicleType', attributes: ['name'] }],
               })

               const result = {
                    id: createdSubtype.id,
                    vehicle_type_id: createdSubtype.vehicle_type_id,
                    name: createdSubtype.name,
                    sort_order: createdSubtype.sort_order,
                    is_active: createdSubtype.is_active,
                    vehicle_type_name: createdSubtype.vehicleType?.name || '—',
               }

               return res.status(201).json(result)
          } catch (error) {
               console.error('Error in createVehicleSubtype:', error)
               return next(ApiError.internal('Ошибка при создании подтипа транспорта: ' + error.message))
          }
     }

     async updateVehicleSubtype(req, res, next) {
          try {
               const { id } = req.params
               const { vehicle_type_id, name, sort_order } = req.body

               const subtype = await VehicleSubtype.findByPk(id)
               if (!subtype) {
                    return next(ApiError.notFound('Подтип транспорта не найден'))
               }

               if (vehicle_type_id) {
                    const vehicleType = await VehicleType.findByPk(vehicle_type_id)
                    if (!vehicleType) {
                         return next(ApiError.notFound('Тип транспорта не найден'))
                    }
               }

               if (name && (vehicle_type_id || subtype.vehicle_type_id)) {
                    const existingSubtype = await VehicleSubtype.findOne({
                         where: {
                              vehicle_type_id: vehicle_type_id || subtype.vehicle_type_id,
                              name,
                              id: { [Op.ne]: id },
                         },
                    })
                    if (existingSubtype) {
                         return next(ApiError.badRequest('Подтип с таким названием уже существует для этого типа'))
                    }
               }

               await subtype.update({ vehicle_type_id, name, sort_order })
               return res.json(subtype)
          } catch (error) {
               return next(ApiError.internal('Ошибка при обновлении подтипа транспорта: ' + error.message))
          }
     }

     async deleteVehicleSubtype(req, res, next) {
          try {
               const { id } = req.params

               const subtype = await VehicleSubtype.findByPk(id)
               if (!subtype) {
                    return next(ApiError.notFound('Подтип транспорта не найден'))
               }

               // Проверка на наличие автомобилей с этим подтипом
               const vehiclesWithSubtype = await Vehicle.findOne({ where: { vehicle_subtype_id: id } })
               if (vehiclesWithSubtype) {
                    return next(ApiError.badRequest('Нельзя удалить подтип, так как есть автомобили с этим подтипом'))
               }

               await subtype.destroy()
               return res.json({ message: 'Подтип транспорта успешно удален' })
          } catch (error) {
               return next(ApiError.internal('Ошибка при удалении подтипа транспорта: ' + error.message))
          }
     }

     // ========== ВРЕМЕННЫЕ СЛОТЫ ==========

     async getAllTimeSlots(req, res, next) {
          try {
               const timeSlots = await TimeSlot.findAll({
                    where: { is_active: true },
                    order: [['sort_order', 'ASC']],
               })
               return res.json(timeSlots)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении временных слотов: ' + error.message))
          }
     }

     async createTimeSlot(req, res, next) {
          try {
               const { slot_key, label, start_time, end_time, sort_order } = req.body

               // Проверка на существующий ключ
               const existingSlot = await TimeSlot.findOne({ where: { slot_key } })
               if (existingSlot) {
                    return next(ApiError.badRequest('Временной слот с таким ключом уже существует'))
               }

               const timeSlot = await TimeSlot.create({
                    slot_key,
                    label,
                    start_time,
                    end_time,
                    sort_order: sort_order || 0,
               })

               return res.json(timeSlot)
          } catch (error) {
               return next(ApiError.internal('Ошибка при создании временного слота: ' + error.message))
          }
     }

     async updateTimeSlot(req, res, next) {
          try {
               const { id } = req.params
               const { slot_key, label, start_time, end_time, sort_order } = req.body

               const timeSlot = await TimeSlot.findByPk(id)
               if (!timeSlot) {
                    return next(ApiError.notFound('Временной слот не найден'))
               }

               if (slot_key && slot_key !== timeSlot.slot_key) {
                    const existingSlot = await TimeSlot.findOne({ where: { slot_key } })
                    if (existingSlot) {
                         return next(ApiError.badRequest('Временной слот с таким ключом уже существует'))
                    }
               }

               await timeSlot.update({ slot_key, label, start_time, end_time, sort_order })
               return res.json(timeSlot)
          } catch (error) {
               return next(ApiError.internal('Ошибка при обновлении временного слота: ' + error.message))
          }
     }

     async deleteTimeSlot(req, res, next) {
          try {
               const { id } = req.params

               const timeSlot = await TimeSlot.findByPk(id)
               if (!timeSlot) {
                    return next(ApiError.notFound('Временной слот не найден'))
               }

               // Проверка на наличие бронирований с этим слотом
               const bookingsWithSlot = await Booking.findOne({ where: { time_slot_id: id } })
               if (bookingsWithSlot) {
                    return next(
                         ApiError.badRequest('Нельзя удалить временной слот, так как есть бронирования с этим слотом')
                    )
               }

               await timeSlot.destroy()
               return res.json({ message: 'Временной слот успешно удален' })
          } catch (error) {
               return next(ApiError.internal('Ошибка при удалении временного слота: ' + error.message))
          }
     }

     // ========== СТАТИСТИКА ==========

     async getStatistics(req, res, next) {
          try {
               const totalVehicles = await Vehicle.count()
               const availableVehicles = await Vehicle.count({
                    where: { technical_condition: 'исправен' },
               })
               const activeBookings = await Booking.count({
                    where: { status: 'active' },
               })

               // Используем sequelize из импорта
               const bookingsByDay = await Booking.findAll({
                    attributes: ['booking_date', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
                    where: { status: 'active' },
                    group: ['booking_date'],
                    order: [['booking_date', 'DESC']],
                    limit: 7,
               })

               return res.json({
                    total_vehicles: totalVehicles,
                    available_vehicles: availableVehicles,
                    unavailable_vehicles: totalVehicles - availableVehicles,
                    active_bookings: activeBookings,
                    bookings_by_day: bookingsByDay,
               })
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении статистики: ' + error.message))
          }
     }

     async getStatisticsByDate(req, res, next) {
          try {
               const { date } = req.params

               const bookingsCount = await Booking.count({
                    where: {
                         booking_date: date,
                         status: 'active',
                    },
               })

               const bookingsByDepartment = await Booking.findAll({
                    attributes: ['department_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
                    where: {
                         booking_date: date,
                         status: 'active',
                    },
                    include: [{ model: Department, attributes: ['name'] }],
                    group: ['department_id', 'department.id'],
               })

               return res.json({
                    date,
                    total_bookings: bookingsCount,
                    bookings_by_department: bookingsByDepartment,
               })
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении статистики по дате: ' + error.message))
          }
     }

     // ========== ЗАЯВКИ ==========

     async getAllRequests(req, res, next) {
          try {
               const { date, status, department_id } = req.query
               let where = {}
               if (date) where.request_date = date
               if (status) where.status = status
               if (department_id) where.department_id = department_id

               const requests = await Request.findAll({
                    where,
                    include: [
                         //{ model: Department, as: 'department' },
                         { model: VehicleType, as: 'vehicleType' },
                         { model: Vehicle, as: 'assignedVehicle' },
                         { model: Drivers, as: 'assignedDriver' },
                    ],
                    order: [
                         ['request_date', 'ASC'],
                         ['start_time', 'ASC'],
                    ],
               })
               return res.json(requests)
          } catch (error) {
               return next(ApiError.internal('Ошибка получения заявок: ' + error.message))
          }
     }

     async getRequestById(req, res, next) {
          try {
               const { id } = req.params
               const request = await Request.findByPk(id, {
                    include: [
                         { model: Department, as: 'department' },
                         { model: VehicleType, as: 'vehicleType' },
                         { model: Vehicle, as: 'assignedVehicle' },
                         { model: Drivers, as: 'assignedDriver' },
                    ],
               })
               if (!request) return next(ApiError.notFound('Заявка не найдена'))
               return res.json(request)
          } catch (error) {
               return next(ApiError.internal(error.message))
          }
     }

     async createRequest(req, res, next) {
          try {
               const {
                    department_id,
                    vehicle_type_id,
                    assigned_vehicle_id,
                    start_time,
                    end_time,
                    request_date,
                    work_place,
                    purpose,
                    created_by,
               } = req.body

               // Валидация обязательных полей
               if (!department_id || !start_time || !end_time || !request_date || !work_place) {
                    return next(ApiError.badRequest('Не все обязательные поля заполнены'))
               }

               const request = await Request.create({
                    department_id,
                    vehicle_type_id: vehicle_type_id || null,
                    assigned_vehicle_id: assigned_vehicle_id || null,
                    start_time,
                    end_time,
                    request_date,
                    work_place,
                    purpose: purpose || null,
                    created_by: created_by || 'system',
                    status: 'pending',
               })

               return res.status(201).json(request)
          } catch (error) {
               console.error('Create request error:', error)
               return next(ApiError.internal('Ошибка создания заявки: ' + error.message))
          }
     }

     async updateRequest(req, res, next) {
          try {
               const { id } = req.params
               const request = await Request.findByPk(id)
               if (!request) return next(ApiError.notFound('Заявка не найдена'))
               await request.update(req.body)
               return res.json(request)
          } catch (error) {
               return next(ApiError.internal(error.message))
          }
     }

     async assignVehicleAndDriver(req, res, next) {
          try {
               const { id } = req.params
               const { assigned_vehicle_id, assigned_driver_id } = req.body
               const request = await Request.findByPk(id)
               if (!request) return next(ApiError.notFound('Заявка не найдена'))
               // временно убираем проверку статуса и конфликтов
               await request.update({ assigned_vehicle_id, assigned_driver_id })
               return res.json(request)
          } catch (error) {
               console.error('Assign error:', error)
               return next(ApiError.internal(error.message))
          }
     }

     async confirmRequest(req, res, next) {
          try {
               const { id } = req.params
               const request = await Request.findByPk(id)

               if (!request) {
                    return next(ApiError.notFound('Заявка не найдена'))
               }

               if (request.status !== 'pending'&& request.status !== 'rescheduled') {
                    return next(ApiError.badRequest('Подтвердить можно только заявку в статусе ожидания'))
               }

               if (!request.assigned_vehicle_id || !request.assigned_driver_id) {
                    return next(ApiError.badRequest('Не назначен автомобиль или водитель'))
               }

               // Создаём бронирование (адаптируйте под свои поля Booking)
               const booking = await Booking.create({
                    request_id: request.id,
                    vehicle_id: request.assigned_vehicle_id,
                    driver_id: request.assigned_driver_id,
                    department_id: request.department_id,
                    booking_date: request.request_date,
                    start_time: request.start_time,
                    end_time: request.end_time,
                    purpose: request.purpose,
                    status: 'active',
                    created_by: req.body.created_by || 'system',
               })

               // Обновляем статус заявки
               await request.update({ status: 'confirmed' })

               return res.json({ request, booking })
          } catch (error) {
               console.error('Confirm request error:', error)
               return next(ApiError.internal('Ошибка подтверждения заявки: ' + error.message))
          }
     }

     async updateBooking(req, res, next) {
          try {
               const { requestId } = req.params
               const { assigned_vehicle_id, assigned_driver_id } = req.body

               const request = await Request.findByPk(requestId)
               if (!request) return next(ApiError.notFound('Заявка не найдена'))
               if (request.status !== 'confirmed')
                    return next(ApiError.badRequest('Редактирование доступно только для подтверждённых заявок'))

               // Проверка конфликта, если автомобиль меняется
               if (assigned_vehicle_id && assigned_vehicle_id !== request.assigned_vehicle_id) {
                    const conflicting = await Booking.findOne({
                         where: {
                              vehicle_id: assigned_vehicle_id,
                              booking_date: request.request_date,
                              status: 'active',
                              request_id: { [Op.ne]: requestId },
                              [Op.or]: [
                                   { start_time: { [Op.between]: [request.start_time, request.end_time] } },
                                   { end_time: { [Op.between]: [request.start_time, request.end_time] } },
                              ],
                         },
                    })
                    if (conflicting) return next(ApiError.badRequest('Автомобиль уже занят в указанное время'))
               }

               await request.update({ assigned_vehicle_id, assigned_driver_id })

               const booking = await Booking.findOne({ where: { request_id: requestId, status: 'active' } })
               if (booking) {
                    await booking.update({ vehicle_id: assigned_vehicle_id, driver_id: assigned_driver_id })
               }

               return res.json({ request, booking })
          } catch (error) {
               return next(ApiError.internal(error.message))
          }
     }

     async cancelRequest(req, res, next) {
          try {
               const { id } = req.params
               const { notes, cancelled_by } = req.body
               const request = await Request.findByPk(id)
               if (!request) return next(ApiError.notFound('Заявка не найдена'))

               if (request.status === 'confirmed') {
                    const booking = await Booking.findOne({ where: { request_id: id, status: 'active' } })
                    if (booking) {
                         await booking.update({
                              status: 'cancelled',
                              cancelled_by: cancelled_by || 'system',
                              cancelled_at: new Date(),
                         })
                    }
               }
               await request.update({
                    status: 'cancelled',
                    notes: notes || 'Отменено диспетчером',
                    updated_by: cancelled_by,
               })
               return res.json(request)
          } catch (error) {
               return next(ApiError.internal(error.message))
          }
     }

     async rescheduleRequest(req, res, next) {
          try {
               const { id } = req.params
               const { new_date, new_start_time, new_end_time, notes } = req.body
               const request = await Request.findByPk(id)
               if (!request) return next(ApiError.notFound('Заявка не найдена'))

               await request.update({
                    status: 'rescheduled',
                    rescheduled_to_date: new_date,
                    start_time: new_start_time || request.start_time,
                    end_time: new_end_time || request.end_time,
                    assigned_vehicle_id: null,
                    assigned_driver_id: null,
                    notes: notes || `Перенесена с ${request.request_date} на ${new_date}`,
                    request_date: new_date, // обновляем дату заявки на новую
               })
               return res.json(request)
          } catch (error) {
               return next(ApiError.internal(error.message))
          }
     }

     async deleteRequest(req, res, next) {
          try {
               const { id } = req.params
               const request = await Request.findByPk(id)
               if (!request) return next(ApiError.notFound('Заявка не найдена'))
               if (request.status === 'confirmed') {
                    return next(ApiError.badRequest('Нельзя удалить подтверждённую заявку'))
               }
               await request.destroy()
               return res.json({ message: 'Заявка удалена' })
          } catch (error) {
               return next(ApiError.internal(error.message))
          }
     }
}

module.exports = new TransportController()
