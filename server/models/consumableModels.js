// models/consumableModels.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// Модель картриджа (расходного материала)
const Consumable = sequelize.define('consumable', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  model: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING, allowNull: false }, // 'СЭБ', 'Склад', 'АБК'
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  minQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  createdBy: { type: DataTypes.INTEGER }, // id пользователя, создавшего запись
}, {
  timestamps: true,
});

// Модель движения (приход/уход)
const Movement = sequelize.define('movement', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING(10), allowNull: false }, // 'income' или 'outcome'
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  createdBy: { type: DataTypes.INTEGER },
}, {
  timestamps: true,
});

// Установка связей
Consumable.hasMany(Movement, { foreignKey: 'consumableId', onDelete: 'CASCADE', as: 'movements' });
Movement.belongsTo(Consumable, { foreignKey: 'consumableId', as: 'consumable' });

module.exports = { Consumable, Movement };