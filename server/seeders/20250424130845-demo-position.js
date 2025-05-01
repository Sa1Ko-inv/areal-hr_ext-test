'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const positions = [
      { name: 'Тест1-разработчик', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Тест2-разработчик', createdAt: new Date(), updatedAt: new Date() },
    ];

    for (const position of positions) {
      // Проверяем, существует ли позиция
      const existingPosition = await queryInterface.sequelize.query(
        `SELECT id FROM positions WHERE name = :name`,
        {
          replacements: { name: position.name },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (existingPosition.length === 0) {
        await queryInterface.bulkInsert('positions', [position]);
      }
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('positions', {
      name: ['Тест1-разработчик', 'Тест2-разработчик'],
    });
  },
};