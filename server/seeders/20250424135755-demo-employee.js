'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Создаем сотрудника
    const emp = await queryInterface.bulkInsert(
      'employees',
      [
        {
          last_name: 'Джордан',
          first_name: 'Майкл',
          middle_name: 'Джеффри',
          birth_date: '17/02/1963',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    const empId = emp[0].id;

    //Создаем паспорт
    await queryInterface.bulkInsert('passports', [
      {
        series: '0000',
        number: '000000',
        issued_by: 'УМВД по Ярославской области',
        issued_date: '17/03/1977',
        division_code: '000-000',
        employee_id: empId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Создаем адрес
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
  },



  async down(
    queryInterface,
    Sequelize
  ) {
    // // Находим сотрудника через queryInterface
    const employees = await queryInterface.sequelize.query(
      `SELECT id FROM employees WHERE
       last_name = 'Джордан' AND
       first_name = 'Майкл' AND
       middle_name = 'Джеффри' AND
       birth_date = '17/02/1963'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (employees.length > 0) {
      const empId = employees[0].id;

      // Удаляем кадровые операции
      await queryInterface.bulkDelete('hr_operations', {
        employee_id: empId
      }, {
        force: true // для paranoid таблиц
      });

      // Удаляем адрес
      await queryInterface.bulkDelete('addresses', {
        employee_id: empId
      });

      // Удаляем паспорт
      await queryInterface.bulkDelete('passports', {
        employee_id: empId
      });
      await queryInterface.bulkDelete('employees', [{
        id: empId
      }])
    }

    // await queryInterface.bulkDelete('addresses', [
    //   {
    //     region: 'New York',
    //     locality: 'Brooklyn',
    //     street: 'Williamsburg',
    //     house: '0',
    //     building: '0',
    //     apartment: '0',
    //   },
    // ]);
    //
    // await queryInterface.bulkDelete('passports', [
    //   {
    //     series: '0000',
    //     number: '000000',
    //     issued_by: 'УМВД по Ярославской области',
    //     issued_date: '17/03/1977',
    //     division_code: '000-000',
    //   },
    // ]);
    //
    // await queryInterface.bulkDelete('employees', [
    //   {
    //     last_name: 'Джордан',
    //     first_name: 'Майкл',
    //     middle_name: 'Джеффри',
    //     birth_date: '17/02/1963',
    //   },
    // ]);
  },
};
