const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Booking = sequelize.define('bookings', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    vehicle_id: { type: DataTypes.UUID, allowNull: false },
    department_id: { type: DataTypes.UUID, allowNull: false },
    time_slot_id: { type: DataTypes.STRING, allowNull: false },
    booking_date: { type: DataTypes.DATEONLY, allowNull: false },
    purpose: { type: DataTypes.TEXT, allowNull: false },
    status: { 
        type: DataTypes.ENUM('active', 'cancelled', 'completed'),
        defaultValue: 'active'
    },
    created_by: { type: DataTypes.STRING },
    cancelled_by: { type: DataTypes.STRING },
    cancelled_at: { type: DataTypes.DATE },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
})

module.exports = Booking