'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Проверяем, существует ли сотрудник
    let empId;
    const existingEmployee = await queryInterface.sequelize.query(
      `SELECT id FROM employees WHERE last_name = :last_name AND first_name = :first_name AND middle_name = :middle_name AND birth_date = :birth_date`,
      {
        replacements: {
          last_name: 'Джордан',
          first_name: 'Майкл',
          middle_name: 'Джеффри',
          birth_date: '1963-02-17',
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingEmployee.length === 0) {
      const emp = await queryInterface.bulkInsert(
        'employees',
        [
          {
            last_name: 'Джордан',
            first_name: 'Майкл',
            middle_name: 'Джеффри',
            birth_date: '1963-02-17',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { returning: true }
      );
      empId = emp[0].id;
    } else {
      empId = existingEmployee[0].id;
    }

    // Проверяем, существует ли паспорт
    const existingPassport = await queryInterface.sequelize.query(
      `SELECT id FROM passports WHERE employee_id = :employee_id`,
      {
        replacements: { employee_id: empId },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingPassport.length === 0) {
      await queryInterface.bulkInsert('passports', [
        {
          series: '0000',
          number: '000000',
          issued_by: 'УМВД по Ярославской области',
          issued_date: '1977-03-17',
          division_code: '000-000',
          employee_id: empId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    // Проверяем, существует ли адрес
    const existingAddress = await queryInterface.sequelize.query(
      `SELECT id FROM addresses WHERE employee_id = :employee_id`,
      {
        replacements: { employee_id: empId },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingAddress.length === 0) {
      await queryInterface.bulkInsert('addresses', [
        {
          region: 'New York',
          locality: 'Brooklyn',
          street: 'Williamsburg',
          house: '0',
          building: '0',
          apartment: '0',
          employee_id: empId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    const employees = await queryInterface.sequelize.query(
      `SELECT id FROM employees WHERE last_name = :last_name AND first_name = :first_name AND middle_name = :middle_name AND birth_date = :birth_date`,
      {
        replacements: {
          last_name: 'Джордан',
          first_name: 'Майкл',
          middle_name: 'Джеффри',
          birth_date: '1963-02-17',
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (employees.length > 0) {
      const empId = employees[0].id;

      await queryInterface.bulkDelete('hr_operations', { employee_id: empId }, { force: true });
      await queryInterface.bulkDelete('addresses', { employee_id: empId });
      await queryInterface.bulkDelete('passports', { employee_id: empId });
      await queryInterface.bulkDelete('employees', { id: empId });
    }
  },
};