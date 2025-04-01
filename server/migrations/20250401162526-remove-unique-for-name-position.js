'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Альтернативно можно использовать removeConstraint
    await queryInterface.removeConstraint('positions', 'positions_name_key');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint('positions', {
      fields: ['name'],
      type: 'unique',
      name: 'positions_name_key'
    });
  }
};
