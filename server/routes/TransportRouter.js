const Router = require('express')
const router = new Router()
const transportController = require('../controllers/TransportController')

// ========== АВТОМОБИЛИ ==========
router.get('/vehicles', transportController.getAllVehicles)
router.get('/vehicles/:id', transportController.getVehicleById)
router.post('/vehicles', transportController.createVehicle)
router.put('/vehicles/:id', transportController.updateVehicle)
router.delete('/vehicles/:id', transportController.deleteVehicle)

// ========== БРОНИРОВАНИЯ ==========
router.get('/bookings', transportController.getAllBookings)
router.get('/bookings/date/:date', transportController.getBookingsByDate)
router.get('/bookings/vehicle/:vehicleId', transportController.getBookingsByVehicle)
router.post('/bookings', transportController.createBooking)
router.put('/bookings/:bookingId/cancel', transportController.cancelBooking)
router.delete('/bookings/:bookingId', transportController.deleteBooking)

// ========== ОТДЕЛЫ ==========
router.get('/departments', transportController.getAllDepartments)
router.post('/departments', transportController.createDepartment)
router.put('/departments/:id', transportController.updateDepartment)
router.delete('/departments/:id', transportController.deleteDepartment)

// ========== ТИПЫ ТРАНСПОРТА ==========
router.get('/vehicle-types', transportController.getAllVehicleTypes)
router.post('/vehicle-types', transportController.createVehicleType)
router.put('/vehicle-types/:id', transportController.updateVehicleType)
router.delete('/vehicle-types/:id', transportController.deleteVehicleType)

// ========== ПОДТИПЫ ТРАНСПОРТА ==========
router.get('/vehicle-subtypes', transportController.getAllVehicleSubtypes)
router.post('/vehicle-subtypes', transportController.createVehicleSubtype)
router.put('/vehicle-subtypes/:id', transportController.updateVehicleSubtype)
router.delete('/vehicle-subtypes/:id', transportController.deleteVehicleSubtype)

// ========== ВРЕМЕННЫЕ СЛОТЫ ==========
router.get('/time-slots', transportController.getAllTimeSlots)

// ========== СТАТИСТИКА ==========
router.get('/statistics', transportController.getStatistics)
router.get('/statistics/date/:date', transportController.getStatisticsByDate)

module.exports = router