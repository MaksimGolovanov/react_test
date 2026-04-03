const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const TimeSlot = sequelize.define('time_slots', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slot_key: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    label: { type: DataTypes.STRING(50), allowNull: false },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
})

module.exports = TimeSlot