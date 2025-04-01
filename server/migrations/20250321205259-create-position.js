'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("positions", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: "Название должности"
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Дата мягкого удаления', // Поле для soft delete
        },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("positions", {})
  }
};
