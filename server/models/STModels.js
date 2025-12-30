const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const STUser = sequelize.define(
     'st-users',
     {
          id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
          tabNumber: { type: DataTypes.STRING, unique: true },
          // Статистика обучения
          completed_courses: {
               type: DataTypes.INTEGER,
               defaultValue: 0,
               comment: 'Количество пройденных курсов',
          },
          average_score: {
               type: DataTypes.DECIMAL(5, 2),
               defaultValue: 0,
               comment: 'Средний балл по всем курсам',
          },
          total_training_time: {
               type: DataTypes.INTEGER,
               defaultValue: 0,
               comment: 'Общее время обучения (минуты)',
          },
          last_course_completed: {
               type: DataTypes.DATE,
               comment: 'Дата последнего пройденного курса',
          },

         
     },
     {
          timestamps: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
          tableName: 'st-users',
          comment: 'Пользователи системы обучения',
     }
)





module.exports = {
     STUser,
}
