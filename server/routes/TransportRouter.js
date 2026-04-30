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
router.post('/time-slots', transportController.createTimeSlot)  
router.put('/time-slots/:id', transportController.updateTimeSlot) 
router.delete('/time-slots/:id', transportController.deleteTimeSlot) 

// ========== ВОДИТЕЛИ ==========
router.get('/drivers', transportController.getAllDrivers)
router.get('/drivers/:id', transportController.getDriverById)
router.post('/drivers', transportController.createDriver)
router.put('/drivers/:id', transportController.updateDriver)
router.delete('/drivers/:id', transportController.deleteDriver)

// ========== СТАТИСТИКА ==========
router.get('/statistics', transportController.getStatistics)
router.get('/statistics/date/:date', transportController.getStatisticsByDate)

// Заявки
router.get('/requests', transportController.getAllRequests);
router.get('/requests/:id', transportController.getRequestById);
router.post('/requests', transportController.createRequest);
router.put('/requests/:id', transportController.updateRequest);
router.put('/requests/:id/assign', transportController.assignVehicleAndDriver);
router.put('/requests/:id/confirm', transportController.confirmRequest);
router.put('/requests/:id/cancel', transportController.cancelRequest);
router.put('/requests/:id/reschedule', transportController.rescheduleRequest);
router.delete('/requests/:id', transportController.deleteRequest);
router.put('/requests/:requestId/update-booking', transportController.updateBooking);


module.exports = router