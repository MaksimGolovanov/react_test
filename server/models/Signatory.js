const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Signatory = sequelize.define('signatory', {
     id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
     },
     name: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     position: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
     },
     sortOrder: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
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

module.exports = Signatory
