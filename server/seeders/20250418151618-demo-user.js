'use strict';

const argon2 = require('argon2');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await argon2.hash(process.env.PASSWORD, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 4,
      parallelism: 1,
    });

    // Проверяем, существует ли пользователь с таким логином
    const existingUser = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE login = :login`,
      {
        replacements: { login: process.env.LOGIN },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingUser.length === 0) {
      await queryInterface.bulkInsert('users', [
        {
          first_name: 'test',
          last_name: 'test',
          middle_name: 'test',
          login: process.env.LOGIN,
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      login: process.env.LOGIN,
    });
  },
};