'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('positions', [
      {
        name: 'Тест1-разработчик',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Тест2-разработчик',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('positions', {
      name: ['Тест1-разработчик', 'Тест2-разработчик'],
    });
  },
};