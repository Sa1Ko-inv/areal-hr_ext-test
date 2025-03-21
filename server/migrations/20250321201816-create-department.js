'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Departments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Название отдела',
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Комментарий',
      },
      organization_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Organizations', // Таблица, на которую ссылаемся
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'ID организации',
      },
      parent_Id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Departments', // Самореференция на родительский отдел
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID родительского отдела',
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
        comment: 'Дата мягкого удаления', // Поле для soft delete
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Departments');
  }
};
