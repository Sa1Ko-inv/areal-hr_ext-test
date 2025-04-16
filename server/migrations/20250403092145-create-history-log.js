'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('histories', {
      // Исправлено имя таблицы
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      operation_date: {
        // Переименовано
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
        comment: 'Дата и время операции',
      },
      changed_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'ID пользователя, выполнившего изменение (пока null)',
      },
      object_type: {
        type: Sequelize.STRING,
        allowNull: false,
        comment:
          'Тип объекта (Организация, Отдел, Должность, Сотрудник, Кадровая операция)',
      },
      object_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'ID измененного объекта',
      },
      changed_fields: {
        type: Sequelize.JSONB,
        allowNull: false,
        comment:
          "JSON-объект с измененными полями (ключ: имя поля, значение: {old: 'старое значение', new: 'новое значение'})",
      },
      operation_type: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Тип операции ('create', 'update', 'delete')",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      // updatedAt: {  //Удалено, так как мы отключили его в модели
      //     type: Sequelize.DATE,
      //     allowNull: false,
      //     defaultValue: Sequelize.literal('NOW()')
      // },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('histories'); // Исправлено имя таблицы
  },
};
