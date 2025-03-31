'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Фамилия',
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Имя',
      },
      middle_name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Отчество',
      },
      birth_date: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Дата рождения',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Дата мягкого удаления',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('employees');
  }
};