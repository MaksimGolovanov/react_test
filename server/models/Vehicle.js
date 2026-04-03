const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Vehicle = sequelize.define('vehicles', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    vin: { type: DataTypes.STRING(17), unique: true },
    vehicle_brand: { type: DataTypes.STRING(200), allowNull: false },
    vehicle_type: { type: DataTypes.STRING(100), allowNull: false },
    vehicle_subtype: { type: DataTypes.STRING(100) },
    driver_full_name: { type: DataTypes.STRING(200), allowNull: false },
    state_number: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    repair_type: { type: DataTypes.STRING(100) },
    repair_waiting_time: { type: DataTypes.STRING(100) },
    downtime_duration: { type: DataTypes.STRING(100) },
    technical_condition: { 
        type: DataTypes.ENUM('исправен', 'не исправен', 'в ремонте'),
        defaultValue: 'исправен'
    },
    current_location: { type: DataTypes.STRING(200) },
    company_affiliation: { type: DataTypes.STRING(200), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
})

module.exports = Vehicle