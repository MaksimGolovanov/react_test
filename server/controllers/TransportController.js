const VehicleType = require('../models/VehicleType')
const VehicleSubtype = require('../models/VehicleSubtype')
const {Vehicle} = require('../models/Vehicle')
const {Booking} = require('../models/Booking')
const Department = require('../models/Department')
const {TimeSlot} = require('../models/TimeSlot')
const ApiError = require('../error/ApiError')
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
                    { driver_full_name: { [Op.iLike]: `%${search}%` } },
                    { company_affiliation: { [Op.iLike]: `%${search}%` } }
                ]
            }
            
            const vehicles = await Vehicle.findAll({
                where,
                order: [['vehicle_brand', 'ASC']]
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
                vehicle_type,
                vehicle_subtype,
                driver_full_name,
                state_number,
                repair_type,
                repair_waiting_time,
                downtime_duration,
                technical_condition,
                current_location,
                company_affiliation
            } = req.body
            
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
            
            const vehicle = await Vehicle.create({
                vin: vin || null,
                vehicle_brand,
                vehicle_type,
                vehicle_subtype: vehicle_subtype || null,
                driver_full_name,
                state_number,
                repair_type: repair_type || null,
                repair_waiting_time: repair_waiting_time || null,
                downtime_duration: downtime_duration || null,
                technical_condition: technical_condition || 'исправен',
                current_location: current_location || null,
                company_affiliation
            })
            
            return res.json(vehicle)
        } catch (error) {
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
            
            // Проверка на уникальность госномера при смене
            if (updateData.state_number && updateData.state_number !== vehicle.state_number) {
                const existingVehicle = await Vehicle.findOne({ 
                    where: { state_number: updateData.state_number } 
                })
                if (existingVehicle) {
                    return next(ApiError.badRequest('Автомобиль с таким госномером уже существует'))
                }
            }
            
            // Проверка на уникальность VIN при смене
            if (updateData.vin && updateData.vin !== vehicle.vin) {
                const existingVin = await Vehicle.findOne({ 
                    where: { vin: updateData.vin } 
                })
                if (existingVin) {
                    return next(ApiError.badRequest('Автомобиль с таким VIN номером уже существует'))
                }
            }
            
            await vehicle.update(updateData)
            return res.json(vehicle)
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении автомобиля: ' + error.message))
        }
    }
    
    async deleteVehicle(req, res, next) {
        try {
            const { id } = req.params
            
            const vehicle = await Vehicle.findByPk(id)
            if (!vehicle) {
                return next(ApiError.notFound('Автомобиль не найден'))
            }
            
            // Проверка на наличие активных бронирований
            const activeBookings = await Booking.findOne({
                where: {
                    vehicle_id: id,
                    status: 'active',
                    booking_date: {
                        [Op.gte]: new Date()
                    }
                }
            })
            
            if (activeBookings) {
                return next(ApiError.badRequest('Нельзя удалить автомобиль с активными бронированиями'))
            }
            
            await vehicle.destroy()
            return res.json({ message: 'Автомобиль успешно удален' })
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении автомобиля: ' + error.message))
        }
    }
    
    // ========== БРОНИРОВАНИЯ ==========
    
    async getAllBookings(req, res, next) {
        try {
            const bookings = await Booking.findAll({
                include: [
                    { model: Vehicle, attributes: ['vehicle_brand', 'state_number', 'driver_full_name'] },
                    { model: Department, attributes: ['name'] }
                ],
                order: [['booking_date', 'DESC'], ['created_at', 'DESC']]
            })
            
            return res.json(bookings)
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении списка бронирований: ' + error.message))
        }
    }
    
    async getBookingsByDate(req, res, next) {
        try {
            const { date } = req.params
            
            const bookings = await Booking.findAll({
                where: {
                    booking_date: date,
                    status: 'active'
                },
                include: [
                    { model: Vehicle, attributes: ['vehicle_brand', 'state_number', 'driver_full_name', 'technical_condition'] },
                    { model: Department, attributes: ['name', 'head_name'] }
                ],
                order: [['time_slot_id', 'ASC']]
            })
            
            return res.json(bookings)
        } catch (error) {
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
                include: [
                    { model: Department, attributes: ['name'] }
                ],
                order: [['booking_date', 'DESC']]
            })
            
            return res.json(bookings)
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении бронирований автомобиля: ' + error.message))
        }
    }
    
    async createBooking(req, res, next) {
        try {
            const {
                vehicle_id,
                department_id,
                time_slot_id,
                booking_date,
                purpose,
                created_by
            } = req.body
            
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
                    status: 'active'
                }
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
                purpose,
                created_by: created_by || 'system',
                status: 'active'
            })
            
            // Возвращаем с дополнительной информацией
            const bookingWithDetails = await Booking.findByPk(booking.id, {
                include: [
                    { model: Vehicle, attributes: ['vehicle_brand', 'state_number'] },
                    { model: Department, attributes: ['name'] }
                ]
            })
            
            return res.json(bookingWithDetails)
        } catch (error) {
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
                cancelled_at: new Date()
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
                order: [['name', 'ASC']]
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
                phone: phone || null
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
                    where: { name: updateData.name } 
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
                        [Op.gte]: new Date()
                    }
                }
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
                order: [['sort_order', 'ASC']]
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
                sort_order: sort_order || 0
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
                include: [{ model: VehicleType, attributes: ['name'] }],
                order: [['sort_order', 'ASC']]
            })
            return res.json(subtypes)
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении подтипов транспорта: ' + error.message))
        }
    }
    
    async createVehicleSubtype(req, res, next) {
        try {
            const { vehicle_type_id, name, sort_order } = req.body
            
            // Проверка существования типа
            const vehicleType = await VehicleType.findByPk(vehicle_type_id)
            if (!vehicleType) {
                return next(ApiError.notFound('Тип транспорта не найден'))
            }
            
            const existingSubtype = await VehicleSubtype.findOne({ 
                where: { vehicle_type_id, name } 
            })
            if (existingSubtype) {
                return next(ApiError.badRequest('Подтип с таким названием уже существует для этого типа'))
            }
            
            const subtype = await VehicleSubtype.create({
                vehicle_type_id,
                name,
                sort_order: sort_order || 0
            })
            
            return res.json(subtype)
        } catch (error) {
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
                        id: { [Op.ne]: id }
                    }
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
                order: [['sort_order', 'ASC']]
            })
            return res.json(timeSlots)
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении временных слотов: ' + error.message))
        }
    }
    
    // ========== СТАТИСТИКА ==========
    
    async getStatistics(req, res, next) {
        try {
            const totalVehicles = await Vehicle.count()
            const availableVehicles = await Vehicle.count({ 
                where: { technical_condition: 'исправен' } 
            })
            const activeBookings = await Booking.count({ 
                where: { status: 'active' } 
            })
            
            // Используем sequelize из импорта
            const bookingsByDay = await Booking.findAll({
                attributes: [
                    'booking_date',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                where: { status: 'active' },
                group: ['booking_date'],
                order: [['booking_date', 'DESC']],
                limit: 7
            })
            
            return res.json({
                total_vehicles: totalVehicles,
                available_vehicles: availableVehicles,
                unavailable_vehicles: totalVehicles - availableVehicles,
                active_bookings: activeBookings,
                bookings_by_day: bookingsByDay
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
                    status: 'active'
                }
            })
            
            const bookingsByDepartment = await Booking.findAll({
                attributes: [
                    'department_id',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                where: {
                    booking_date: date,
                    status: 'active'
                },
                include: [{ model: Department, attributes: ['name'] }],
                group: ['department_id', 'department.id']
            })
            
            return res.json({
                date,
                total_bookings: bookingsCount,
                bookings_by_department: bookingsByDepartment
            })
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении статистики по дате: ' + error.message))
        }
    }
}

module.exports = new TransportController()