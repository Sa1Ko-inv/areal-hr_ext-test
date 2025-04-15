'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('histories', 'changed_by', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'ФИО пользователя или логин, выполнившего изменение',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('histories', 'changed_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'ID пользователя, выполнившего изменение (пока null)',
    });
  },
};
