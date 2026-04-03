const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const VehicleType = require('./VehicleType')

const VehicleSubtype = sequelize.define('vehicle_subtypes', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    vehicle_type_id: { 
        type: DataTypes.UUID, 
        allowNull: false,
        references: {
            model: 'vehicle_types',
            key: 'id'
        }
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    indexes: [
        {
            unique: true,
            fields: ['vehicle_type_id', 'name']
        }
    ]
})

// Устанавливаем связи
VehicleSubtype.belongsTo(VehicleType, { foreignKey: 'vehicle_type_id', as: 'vehicleType' })
VehicleType.hasMany(VehicleSubtype, { foreignKey: 'vehicle_type_id', as: 'subtypes' })

module.exports = VehicleSubtype