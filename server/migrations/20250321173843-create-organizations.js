/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('organizations', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            comment: "Название организации"
        },
        comment: {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: "Комментарий"
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }
    })
  },

  async down (queryInterface) {
    await queryInterface.dropTable('Organizations')
  }
};
