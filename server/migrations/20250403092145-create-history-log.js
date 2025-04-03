'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('histories', { // Имя таблицы во множественном числе
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      operationDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      actionType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      operationObject: {
        // Убедитесь, что значения ENUM совпадают с моделью
        type: Sequelize.ENUM('Organization', 'Department', 'Position', 'Employee', 'HROperation'),
        allowNull: false
      },
      objectId: {
        type: Sequelize.INTEGER, // Или Sequelize.UUID
        allowNull: false
      },
      changedFields: {
        type: Sequelize.JSONB, // Используем JSONB
        allowNull: true
      },
      // --- Автор изменения ---
      // Раскомментируйте после добавления таблицы Users
      /*
      authorId: {
        type: Sequelize.INTEGER, // Или Sequelize.UUID
        allowNull: true, // Сделать false позже
        // references: { model: 'Users', key: 'id' },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL'
      },
      */
      context: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      createdAt: { // Стандартное поле Sequelize
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: { // Стандартное поле Sequelize
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Опционально: Добавить индексы для ускорения поиска по истории
    await queryInterface.addIndex('histories', ['operationObject', 'objectId']);
    await queryInterface.addIndex('histories', ['operationDate']);
    // await queryInterface.addIndex('Histories', ['authorId']); // После добавления authorId
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('histories');
  }
};