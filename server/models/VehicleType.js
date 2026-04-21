const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const VehicleType = sequelize.define('vehicle_types', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
})

// ⚠️ УДАЛИТЕ эти строки (перенесите в associations.js):
// VehicleType.hasMany(VehicleSubtype, { foreignKey: 'vehicle_type_id', as: 'subtypes' })

module.exports = VehicleType