const Organization = require('../models/organization')
const ApiError = require('../error/ApiError');
const Department = require("../models/department");
const sequelize = require('../db');
const historyService = require('./historyService');
const History = require("../models/history");


class OrganizationController {
    async createOrganization(req, res, next) {
        const {name, comment} = req.body;
        try {
            const organization = await Organization.create(
                {name, comment})
            await historyService.createHistoryEntry(
                'Организация',
                organization.id,
                'create',
                {name: {old: null, new: name}, comment: {old: null, new: comment}}, // old: null для создания// old: null для создания
                null // Пока нет авторизации
            );
            return res.json(organization);

        } catch (error) {
            console.log('Ошибка при создании Организации', error)
        }
    }

    // Получение всех организаций
    async getAllOrganization(req, res, next) {
        try {
            let {page, limit} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;

            const {count, rows} = await Organization.findAndCountAll({
                limit,
                offset,
                distinct: true,
                order: [['name', 'ASC']],
            })
            return res.json({count, rows});
        } catch (error) {
            console.log('Ошибка при получении Организаций', error)
            return res.status(500).json({error: 'Ошибка сервера'});
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
                    order: [['name', 'ASC']],
                    include: [
                        {
                            model: Department,
                            as: 'children',
                            // paranoid: false,
                            hierarchy: true,
                            order: [['name', 'ASC']],
                        }
                    ]
                }]
            });

            if (organization) {
                return res.json(organization);
            } else {
                return res.status(404).json({error: 'Организация не найдена'});
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
                return res.status(404).json({error: 'Организация не найдена'});
            }

            const oldName = organization.name; // Получаем старое значение
            const oldComment = organization.comment; // Получаем старое значение комментария

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Организация',
                id,
                'update',
                {
                    name: {old: oldName, new: name},
                    comment: {old: oldComment, new: comment}
                }, // old: oldName, new: name
                null // Пока нет авторизации
            )

            await organization.update({name, comment});
            return res.json(organization);
        } catch (error) {
            console.log('Ошибка при обновлении Организации', error);
            return res.status(500).json({error: 'Ошибка сервера'});
        }
    }

    async deleteOrganization(req, res, next) {
        const {id} = req.params;
        const transaction = await sequelize.transaction(); // Получаем транзакцию

        try {
            const organization = await Organization.findByPk(id, {transaction});

            if (!organization) {
                await transaction.rollback();
                return res.status(404).json({error: 'Организация не найдена'});
            }
            const oldName = organization.name; // Получаем старое значени
            const oldComment = organization.comment; // Получаем старое значение комментария

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
                    where: {parent_id: departmentId},
                    transaction
                });

                // Сначала удаляем дочерние отделы
                for (const child of children) {
                    await deleteDepartmentWithChildren(child.id);
                }

                // Затем удаляем текущий отдел
                const department = await Department.findByPk(departmentId, {transaction});
                if (department) {
                    await department.destroy({transaction});
                }
            };

            // Удаляем все корневые отделы и их потомков
            for (const department of rootDepartments) {
                await deleteDepartmentWithChildren(department.id);
            }

            // Удаляем саму организацию
            await organization.destroy({transaction});

            await historyService.createHistoryEntry(
                'Организация',
                id,
                'delete',
                {
                    name: {old: oldName, new: null},
                    comment: {old: oldComment, new: null}
                }, // old: oldName, new: name
                null // Пока нет авторизации
            )

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

    async getOrganizationHistory(req, res, next) {
        const {id} = req.params;
        const {page, limit} = req.query;
        try {
            const {count, rows} = await historyService.getHistoryForObject('Организация', id, page, limit);
            return res.json({count, rows});
        } catch (error) {
            console.error('Ошибка при получении истории организации:', error);
            return next(error)
        }
    }

    async getDeletedOrganizations(req, res, next) {
        try {
            let {page, limit} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = (page - 1) * limit;

            const {count, rows} = await History.findAndCountAll({
                limit,
                offset,
                distinct: true,
                order: [['operation_date', 'DESC']],
                where: {
                    object_type: 'Организация',
                    operation_type: 'delete'
                },
            });
            return res.json({count, rows});
        } catch (error) {
            console.error('Ошибка при получении удаленных организаций:', error);
            return next(ApiError.internal(error.message));
        }
    }
}

module.exports = new OrganizationController();