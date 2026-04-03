const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Department = sequelize.define('department_transport', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    head_name: { type: DataTypes.STRING(200) },
    email: { type: DataTypes.STRING(255) },
    phone: { type: DataTypes.STRING(50) },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
})

module.exports = Department