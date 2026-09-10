// models/naryadGasHazardWork.js

const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const NaryadGasHazardWork = sequelize.define(
     'naryad_gas_hazard_work',
     {
          id: {
               type: DataTypes.INTEGER,
               primaryKey: true,
               autoIncrement: true,
          },
          code: {
               type: DataTypes.STRING,
               allowNull: false,
               comment: 'Номер пункта, например 1.1',
          },
          service: {
               type: DataTypes.STRING,
               allowNull: false,
               comment: 'Структурное подразделение: ЛЭС, КС, СЗК и т.д.',
          },
          description: {
               type: DataTypes.TEXT,
               allowNull: false,
               comment: 'Место и характер работы',
          },
          dangerFactors: {
               type: DataTypes.TEXT,
               allowNull: true,
               comment: 'Возможные опасные и вредные факторы',
          },
          executorCategory: {
               type: DataTypes.TEXT,
               allowNull: true,
               comment: 'Категория исполнителей',
          },
          preparationMeasures: {
               type: DataTypes.TEXT,
               allowNull: true,
               comment: 'Мероприятия по подготовке (п.7)',
          },
          safetyMeasures: {
               type: DataTypes.TEXT,
               allowNull: true,
               comment: 'Мероприятия по безопасному проведению (п.9)',
          },
          appendices: {
               type: DataTypes.TEXT,
               allowNull: true,
               comment: 'Приложения',
          },
          withoutPermit: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: false,
               comment: 'Работа без наряда-допуска',
          },
     },
     {
          tableName: 'naryad_gas_hazard_works',
          timestamps: true,
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
     }
)

module.exports = NaryadGasHazardWork
