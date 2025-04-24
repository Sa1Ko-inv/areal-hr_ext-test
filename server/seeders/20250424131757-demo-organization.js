'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // 1. Создаем организацию
    const org = await queryInterface.bulkInsert('organizations', [{
      name: 'ТестБанк',
      comment: 'ТестБанк хорошая компания',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: true });

    const orgId = org[0].id;

    // 2. Создаем структуру отделов
    const departments = [
      // Родительские отделы
      {
        name: 'Технический отдел(ТестБанк)',
        comment: 'Родительский отдел для технических подразделений',
        organization_id: orgId,
        parent_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Отдел продаж(ТестБанк)',
        comment: 'Родительский отдел для коммерческих подразделений',
        organization_id: orgId,
        parent_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Вставляем родительские отделы и получаем их ID
    const insertedParents = await queryInterface.bulkInsert('departments', departments, { returning: true });

    // Дочерние отделы
    const childDepartments = [
      // Для технического отдела
      {
        name: 'Фронтенд разработка(ТестБанк)',
        comment: 'Разработка пользовательских интерфейсов',
        organization_id: orgId,
        parent_id: insertedParents[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Бэкенд разработка(ТестБанк)',
        comment: 'Разработка серверной части',
        organization_id: orgId,
        parent_id: insertedParents[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Для отдела продаж
      {
        name: 'Внутренние продажи(ТестБанк)',
        comment: 'Работа с существующими клиентами',
        organization_id: orgId,
        parent_id: insertedParents[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Внешние продажи(ТестБанк)',
        comment: 'Привлечение новых клиентов',
        organization_id: orgId,
        parent_id: insertedParents[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('departments', childDepartments);
  },

  async down(queryInterface) {
    // 1. Удаляем дочерние отделы (обратный порядок создания)
    await queryInterface.bulkDelete('departments', {
      name: [
        'Фронтенд разработка(ТестБанк)',
        'Бэкенд разработка(ТестБанк)',
        'Внутренние продажи(ТестБанк)',
        'Внешние продажи(ТестБанк)'
      ]
    });

    // 2. Удаляем родительские отделы
    await queryInterface.bulkDelete('departments', {
      name: [
        'Технический отдел(ТестБанк)',
        'Отдел продаж(ТестБанк)'
      ]
    });

    // 3. Удаляем организацию
    await queryInterface.bulkDelete('organizations', {
      name: 'ТестБанк'
    });
  }
};
