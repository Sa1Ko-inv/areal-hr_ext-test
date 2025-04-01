'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('passport', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      series: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Серия паспорта',
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Номер паспорта',
      },
      issued_by: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Кем выдан',
      },
      issued_date: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Дата выдачи',
      },
      division_code: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Код подразделения',
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'ID сотрудника',
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
    await queryInterface.dropTable('passport');
  }
};