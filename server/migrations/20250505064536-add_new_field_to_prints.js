'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('prints', 'description', {
      type: Sequelize.STRING, // или другой тип данных
      allowNull: true,        // или false, если поле обязательно
      defaultValue: null      // установите значение по умолчанию при необходимости
    });
    
    // Для обновления существующих записей (опционально)
    await queryInterface.sequelize.query(`
      UPDATE prints 
      SET description = 'default_value' 
      WHERE description IS NULL
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('prints', 'description');
  }
};