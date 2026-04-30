// Импортируем все модели
const Vehicle = require('./Vehicle')
const Booking = require('./Booking')
const Department = require('./Department')
const TimeSlot = require('./TimeSlot')
const VehicleType = require('./VehicleType')
const VehicleSubtype = require('./VehicleSubtype')
const Request = require('./Request');
const Drivers = require('./Drivers');

// Устанавливаем связи между моделями

// Vehicle <-> Booking
Vehicle.hasMany(Booking, { foreignKey: 'vehicle_id', as: 'bookings' })
Booking.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' })



// TimeSlot <-> Booking
TimeSlot.hasMany(Booking, { foreignKey: 'time_slot_id', as: 'bookings' })
Booking.belongsTo(TimeSlot, { foreignKey: 'time_slot_id', as: 'timeSlot' })

// VehicleType <-> VehicleSubtype
VehicleType.hasMany(VehicleSubtype, { foreignKey: 'vehicle_type_id', as: 'subtypes' })
VehicleSubtype.belongsTo(VehicleType, { foreignKey: 'vehicle_type_id', as: 'vehicleType' })

console.log('✅ Все ассоциации между моделями установлены')


Request.belongsTo(VehicleType, { foreignKey: 'vehicle_type_id', as: 'vehicleType' });
Request.belongsTo(Vehicle, { foreignKey: 'assigned_vehicle_id', as: 'assignedVehicle' });
Request.belongsTo(Drivers, { foreignKey: 'assigned_driver_id', as: 'assignedDriver' });


VehicleType.hasMany(Request, { foreignKey: 'vehicle_type_id', as: 'requests' });
Vehicle.hasMany(Request, { foreignKey: 'assigned_vehicle_id', as: 'assignedRequests' });
Drivers.hasMany(Request, { foreignKey: 'assigned_driver_id', as: 'assignedRequests' });
Booking.belongsTo(Request, { foreignKey: 'request_id', as: 'request' });
Request.hasOne(Booking, { foreignKey: 'request_id', as: 'booking' });


module.exports = { Vehicle, Booking, Department, TimeSlot, VehicleType, VehicleSubtype, Request, Drivers }