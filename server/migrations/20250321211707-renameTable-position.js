'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable('positions', 'Positions'); // Меняем имя таблицы с "Positions" на "job_positions"
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable('Positions', 'positions'); // Возвращаем имя таблицы назад в "Positions"
  }
};
