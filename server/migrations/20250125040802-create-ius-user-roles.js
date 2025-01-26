'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('IusUserRoles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tabNumber: {
        type: Sequelize.STRING, // Явно указываем тип STRING
        references: {
          model: 'IusUsers',
          key: 'tabNumber',
        },
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'IusSpravRoles',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('IusUserRoles');
  },
};