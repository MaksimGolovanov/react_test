const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Request = sequelize.define('transport_requests', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    department_id: { type: DataTypes.STRING(255), allowNull: false },
    vehicle_type_id: { type: DataTypes.UUID, allowNull: true },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false },
    request_date: { type: DataTypes.DATEONLY, allowNull: false }, // дата, на которую нужен транспорт
    work_place: { type: DataTypes.STRING(255), allowNull: false },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'rejected', 'cancelled', 'rescheduled'),
        defaultValue: 'pending'
    },
    assigned_vehicle_id: { type: DataTypes.UUID, allowNull: true },
    assigned_driver_id: { type: DataTypes.UUID, allowNull: true },
    rescheduled_to_date: { type: DataTypes.DATEONLY, allowNull: true },
    purpose: { type: DataTypes.TEXT, allowNull: true }, // цель использования – из заявки
    notes: { type: DataTypes.TEXT, allowNull: true },
    created_by: { type: DataTypes.STRING(50), allowNull: false },
    updated_by: { type: DataTypes.STRING(50), allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});

module.exports = Request;