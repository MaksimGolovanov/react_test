// Импортируем все модели
const Vehicle = require('./Vehicle')
const Booking = require('./Booking')
const Department = require('./Department')
const TimeSlot = require('./TimeSlot')
const VehicleType = require('./VehicleType')
const VehicleSubtype = require('./VehicleSubtype')

// Устанавливаем связи между моделями

// Vehicle <-> Booking
Vehicle.hasMany(Booking, { foreignKey: 'vehicle_id', as: 'bookings' })
Booking.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' })

// Department <-> Booking
Department.hasMany(Booking, { foreignKey: 'department_id', as: 'bookings' })
Booking.belongsTo(Department, { foreignKey: 'department_id', as: 'department' })

// TimeSlot <-> Booking
TimeSlot.hasMany(Booking, { foreignKey: 'time_slot_id', as: 'bookings' })
Booking.belongsTo(TimeSlot, { foreignKey: 'time_slot_id', as: 'timeSlot' })

// VehicleType <-> VehicleSubtype
VehicleType.hasMany(VehicleSubtype, { foreignKey: 'vehicle_type_id', as: 'subtypes' })
VehicleSubtype.belongsTo(VehicleType, { foreignKey: 'vehicle_type_id', as: 'vehicleType' })

console.log('✅ Все ассоциации между моделями установлены')

module.exports = { Vehicle, Booking, Department, TimeSlot, VehicleType, VehicleSubtype }