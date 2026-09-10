const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const GramotaTemplate = sequelize.define('gramota_template', {
     id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
     },
     name: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     description: {
          type: DataTypes.TEXT,
          allowNull: true,
     },
     text: {
          type: DataTypes.TEXT,
          allowNull: false,
     },
     isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
     },
     layout: {
          type: DataTypes.JSON,
          allowNull: true,
          defaultValue: null,
     },
     gramotaType: {
          // <-- добавьте это поле
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'ПОЧЕТНАЯ ГРАМОТА',
     },
     createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
     },
     updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
     },
})

module.exports = GramotaTemplate
