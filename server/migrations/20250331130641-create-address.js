'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      region: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Регион',
      },
      locality: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Населенный пункт',
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Улица',
      },
      house: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Дом',
      },
      building: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Здание',
      },
      apartment: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Квартира',
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'ID сотрудника',
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
        comment: 'Дата мягкого удаления',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('address');
  },
};
