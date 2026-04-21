const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Drivers = sequelize.define('tdrivers', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fio: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    post: { type: DataTypes.STRING(50), allowNull: false },
    department: { type: DataTypes.STRING(50), allowNull: false },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
})

module.exports = Drivers