'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Альтернативно можно использовать removeConstraint
    await queryInterface.removeConstraint('organizations', 'organizations_name_key');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint('organizations', {
      fields: ['name'],
      type: 'unique',
      name: 'organizations_name_key'
    });
  }
};
