'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Переименовываем organization_Id → organization_id
        await queryInterface.renameColumn('departments', 'organization_Id', 'organization_id');

        // Переименовываем parent_Id → parent_id
        await queryInterface.renameColumn('departments', 'parent_Id', 'parent_id');
    },

    async down(queryInterface, Sequelize) {
        // Возвращаем старые названия (для отката)
        await queryInterface.renameColumn('departments', 'organization_id', 'organization_Id');
        await queryInterface.renameColumn('departments', 'parent_id', 'parent_Id');
    }
};
