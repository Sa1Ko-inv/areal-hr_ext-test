'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Organizations', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Дата удаления (мягкое удаление)"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Organizations', 'deletedAt');
  }
};

