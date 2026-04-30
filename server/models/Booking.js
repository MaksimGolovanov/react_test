const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Booking = sequelize.define('bookings', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    vehicle_id: { type: DataTypes.UUID, allowNull: false },
    department_id: { type: DataTypes.STRING(255), allowNull: true }, // заменили department_id
    time_slot_id: { type: DataTypes.UUID, allowNull: true },
    booking_date: { type: DataTypes.DATEONLY, allowNull: false },
    driver_full_name: { type: DataTypes.STRING, allowNull: true },
    purpose: { type: DataTypes.TEXT, allowNull: true },
    status: { 
        type: DataTypes.ENUM('active', 'cancelled', 'completed'),
        defaultValue: 'active'
    },
    request_id: { type: DataTypes.UUID, allowNull: true },
    driver_id: { type: DataTypes.UUID, allowNull: true },
    start_time: { type: DataTypes.TIME, allowNull: true },
    end_time: { type: DataTypes.TIME, allowNull: true },
    created_by: { type: DataTypes.STRING, allowNull: true },
    cancelled_by: { type: DataTypes.STRING, allowNull: true },
    cancelled_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
})

module.exports = Booking