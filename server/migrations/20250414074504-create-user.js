'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Имя"
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Фамилия"
      },
      middle_name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Отчество"
      },
      login: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Login"
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "пароль"
      },
      role: {
        type: Sequelize.ENUM('admin', 'hr_manager'),
        allowNull: false,
        comment: "Роль"
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
    await queryInterface.dropTable('users');
  }
};