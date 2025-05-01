'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Проверяем, существует ли организация
    let orgId;
    const existingOrg = await queryInterface.sequelize.query(
      `SELECT id FROM organizations WHERE name = :name`,
      {
        replacements: { name: 'ТестБанк' },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingOrg.length === 0) {
      const org = await queryInterface.bulkInsert(
        'organizations',
        [
          {
            name: 'ТестБанк',
            comment: 'ТестБанк хорошая компания',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { returning: true }
      );
      orgId = org[0].id;
    } else {
      orgId = existingOrg[0].id;
    }

    // Родительские отделы
    const departments = [
      {
        name: 'Технический отдел(ТестБанк)',
        comment: 'Родительский отдел для технических подразделений',
        organization_id: orgId,
        parent_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Отдел продаж(ТестБанк)',
        comment: 'Родительский отдел для коммерческих подразделений',
        organization_id: orgId,
        parent_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const insertedParents = [];
    for (const dept of departments) {
      const existingDept = await queryInterface.sequelize.query(
        `SELECT id FROM departments WHERE name = :name AND organization_id = :orgId`,
        {
          replacements: { name: dept.name, orgId },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (existingDept.length === 0) {
        const inserted = await queryInterface.bulkInsert('departments', [dept], { returning: true });
        insertedParents.push(inserted[0]);
      } else {
        insertedParents.push({ id: existingDept[0].id });
      }
    }

    // Дочерние отделы
    const childDepartments = [
      {
        name: 'Фронтенд разработка(ТестБанк)',
        comment: 'Разработка пользовательских интерфейсов',
        organization_id: orgId,
        parent_id: insertedParents[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Бэкенд разработка(ТестБанк)',
        comment: 'Разработка серверной части',
        organization_id: orgId,
        parent_id: insertedParents[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Внутренние продажи(ТестБанк)',
        comment: 'Работа с существующими клиентами',
        organization_id: orgId,
        parent_id: insertedParents[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Внешние продажи(ТестБанк)',
        comment: 'Привлечение новых клиентов',
        organization_id: orgId,
        parent_id: insertedParents[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const dept of childDepartments) {
      const existingDept = await queryInterface.sequelize.query(
        `SELECT id FROM departments WHERE name = :name AND organization_id = :orgId`,
        {
          replacements: { name: dept.name, orgId },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (existingDept.length === 0) {
        await queryInterface.bulkInsert('departments', [dept]);
      }
    }
  },

  async down(queryInterface) {
    // Удаляем дочерние отделы
    await queryInterface.bulkDelete('departments', {
      name: [
        'Фронтенд разработка(ТестБанк)',
        'Бэкенд разработка(ТестБанк)',
        'Внутренние продажи(ТестБанк)',
        'Внешние продажи(ТестБанк)',
      ],
    });

    // Удаляем родительские отделы
    await queryInterface.bulkDelete('departments', {
      name: ['Технический отдел(ТестБанк)', 'Отдел продаж(ТестБанк)'],
    });

    // Удаляем организацию
    await queryInterface.bulkDelete('organizations', {
      name: 'ТестБанк',
    });
  },
};