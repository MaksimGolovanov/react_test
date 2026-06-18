// models/confidentialModels.js
const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const ConfidentialInfo = sequelize.define(
     'confidential_info',
     {
          id: {
               type: DataTypes.INTEGER,
               primaryKey: true,
               autoIncrement: true,
          },
          section_letter: {
               type: DataTypes.STRING(1),
               allowNull: true,
               comment: 'Буква раздела: A, Б',
          },
          section_title: {
               type: DataTypes.STRING(255),
               allowNull: true,
               comment: 'Название раздела',
          },
          subsection_number: {
               type: DataTypes.SMALLINT,
               allowNull: true,
               comment: 'Номер подраздела (1..11)',
          },
          subsection_title: {
               type: DataTypes.STRING(255),
               allowNull: true,
               comment: 'Название подраздела',
          },
          item_number: {
               type: DataTypes.STRING(20),
               allowNull: true,
               comment: 'Номер пункта (1.1, 2.3 и т.д.)',
          },
          information_description: {
               type: DataTypes.TEXT,
               allowNull: false,
               comment: 'Описание информации',
          },
          confidentiality_mark: {
               type: DataTypes.STRING(100),
               allowNull: false,
               comment: 'Гриф конфиденциальности',
          },
          access_period: {
               type: DataTypes.STRING(255),
               allowNull: false,
               comment: 'Срок ограничения доступа',
          },
          notes: {
               type: DataTypes.TEXT,
               allowNull: true,
               comment: 'Примечания',
          },
          createdBy: {
               type: DataTypes.INTEGER,
               allowNull: true,
               comment: 'ID пользователя, создавшего запись',
          },
     },
     {
          timestamps: true,
          tableName: 'confidential_info',
     }
)

module.exports = { ConfidentialInfo }
