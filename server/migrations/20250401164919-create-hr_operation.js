'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hr_operations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(
            'hire',         // Принятие на работу
            'salary_change', // Изменение зарплаты
            'department_change', // Изменение отдела
            'fire'          // Увольнение
        ),
        allowNull: false,
        comment: "Тип операции",
      },
      salary: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "Зарплата"
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: "ID сотрудника"
      },
      position_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'positions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: "ID должности"
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'departments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: "ID отдела"
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
    await queryInterface.dropTable('hr_operations');
  }
};