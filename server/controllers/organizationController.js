const Organization = require('../models/organization')
// const {department} = require('../models/department')
const Department = require("../models/department");
const sequelize = require('../db');

class OrganizationController {
    async createOrganization(req, res, next) {
        const {name, comment} = req.body;
        try {
            const organization = await Organization.create(
                {name, comment})

            return res.json(organization);

        } catch (error) {
            console.log('Ошибка при создании Организации', error)
        }
    }

    // Получение всех организаций
    async getAllOrganization(req, res, next) {
        try {
            const organizations = await Organization.findAll({
                // paranoid: false
            });
            return res.json(organizations);
        } catch (error) {
            console.log('Ошибка при получении Организаций', error)
        }
    }

    // Получение организации по ID с ее отделами
    async getOrganizationWithDepartments(req, res, next) {
        try {
            const {id} = req.params;
            const organization = await Organization.findOne({
                where: {id: id},
                // paranoid: false,
                include: [{
                    model: Department,
                    as: 'departments',
                    // paranoid: false,
                    where: {parent_id: null},
                    required: false,
                    include: [
                        {
                            model: Department,
                            as: 'children',
                            // paranoid: false,
                            hierarchy: true
                        }
                    ]
                }]
            });

            if (organization) {
                return res.json(organization);
            } else {
                return res.status(404).json({ error: 'Организация не найдена' });
            }
        } catch (error) {
            console.log('Ошибка при получении Организации', error)
        }
    }

    async updateOrganization(req, res, next) {
        const {id} = req.params;
        const {name, comment} = req.body;

        try {
            const organization = await Organization.findOne({
                where: {id: id},
                // paranoid: false // Ищем даже удаленные записи
            });

            if (!organization) {
                return res.status(404).json({ error: 'Организация не найдена' });
            }

            await organization.update({name, comment});
            return res.json(organization);
        } catch (error) {
            console.log('Ошибка при обновлении Организации', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async deleteOrganization(req, res, next) {
        const {id} = req.params;
        const transaction = await sequelize.transaction(); // Получаем транзакцию

        try {
            const organization = await Organization.findByPk(id, { transaction });

            if (!organization) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Организация не найдена' });
            }

            // Находим все корневые отделы организации
            const rootDepartments = await Department.findAll({
                where: {
                    organization_id: id,
                    parent_id: null
                },
                transaction
            });

            // Рекурсивная функция для удаления отделов
            const deleteDepartmentWithChildren = async (departmentId) => {
                // Находим все дочерние отделы
                const children = await Department.findAll({
                    where: { parent_id: departmentId },
                    transaction
                });

                // Сначала удаляем дочерние отделы
                for (const child of children) {
                    await deleteDepartmentWithChildren(child.id);
                }

                // Затем удаляем текущий отдел
                const department = await Department.findByPk(departmentId, { transaction });
                if (department) {
                    await department.destroy({ transaction });
                }
            };

            // Удаляем все корневые отделы и их потомков
            for (const department of rootDepartments) {
                await deleteDepartmentWithChildren(department.id);
            }

            // Удаляем саму организацию
            await organization.destroy({ transaction });

            await transaction.commit();
            return res.json({message: 'Организация и все связанные отделы успешно удалены'});
        } catch (error) {
            await transaction.rollback();
            console.error('Ошибка при удалении организации:', error);
            return res.status(500).json({
                error: 'Ошибка сервера',
                details: error.message
            });
        }
    }
}

module.exports = new OrganizationController();