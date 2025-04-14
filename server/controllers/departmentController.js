const Department = require("../models/department");
const historyService = require('./historyService');
const Organization = require("../models/organization"); // Импортируем historyService

class DepartmentController {
    async createDepartment(req, res, next) {
        let organizationId = req.body.organization_id;
        const { name, parent_id } = req.body;

        try {
            // Переменные для хранения названий
            let organizationName = null;
            let parentDepartmentName = null;

            // Получаем информацию о родительском отделе, если он указан
            if (req.body.parent_id) {
                const parentDepartment = await Department.findByPk(req.body.parent_id, {
                    include: [{ model: Organization }]
                });

                if (!parentDepartment) {
                    return res.status(404).json({ error: 'Родительский отдел не найден' });
                }

                organizationId = parentDepartment.organization_id;
                parentDepartmentName = parentDepartment.name;
            }

            // Получаем информацию об организации
            const organization = await Organization.findByPk(organizationId);
            if (!organization) {
                return res.status(404).json({ error: 'Организация не найдена' });
            }
            organizationName = organization.name;

            // Создаем отдел
            const department = await Department.create({
                ...req.body,
                organization_id: organizationId,
            });

            // Записываем в историю с названиями вместо ID
            await historyService.createHistoryEntry(
                'Отдел',
                department.id,
                'create',
                {
                    name: { old: null, new: name },
                    parent_department: { old: null, new: parentDepartmentName || null },
                    organization: { old: null, new: organizationName }
                },
                `${req.user.id} ${req.user.last_name} ${req.user.first_name} ${req.user.middle_name}`
            );

            return res.json(department);
        } catch (error) {
            console.log('Ошибка при создании отдела', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }


    async getAllDepartment(req, res, next) {
        try {
            const departments = await Department.findAll({
                where: {
                    parent_id: null
                },
                include: [
                    {
                        model: Department,
                        as: "children",
                    }
                ],
            });
            return res.json(departments);
        } catch (error) {
            console.log('Ошибка при получении всех отделов', error);

        }
    }

    async updateDepartment(req, res, next) {
        const { id } = req.params;
        const { parent_id, ...updateData } = req.body;

        try {
            const department = await Department.findOne({
                where: { id: id },
                include: [
                    { model: Organization },
                    { model: Department, as: 'parent' }
                ]
            });

            if (!department) {
                return res.status(404).json({ error: 'Отдел не найден' });
            }

            // Сохраняем старые значения для истории
            const oldName = department.name;
            const oldParentId = department.parent_id;
            const oldParentName = department.parent ? department.parent.name : null;
            const oldOrganizationId = department.organization_id;
            const oldOrganizationName = department.organization ? department.organization.name : null;

            let newOrganizationId = updateData.organization_id;
            let newParentName = null;
            let newOrganizationName = null;

            // Определяем новое имя отдела (с учетом возможного обновления)
            const newDepartmentName = updateData.name || oldName;

            // Флаг, указывающий, что отдел из корневого стал дочерним
            let becameChild = oldParentId === null && parent_id !== null;

            // Флаг, указывающий, что отдел из дочернего стал корневым
            let becameRoot = oldParentId !== null && parent_id === null;

            if (parent_id !== undefined && parent_id !== department.parent_id) {
                // Если parent_id изменился
                if (parent_id === null) {
                    // Если parent_id стал null, то организация должна быть указана в запросе
                    if (!newOrganizationId) {
                        return res.status(400).json({ error: 'При удалении родительского отдела необходимо указать organization_id' });
                    }

                    // Получаем название новой организации
                    const newOrganization = await Organization.findByPk(newOrganizationId);
                    if (newOrganization) {
                        newOrganizationName = newOrganization.name;
                    }
                } else {
                    // Получаем новый родительский отдел с его организацией
                    const newParentDepartment = await Department.findOne({
                        where: { id: parent_id },
                        include: [{ model: Organization }]
                    });

                    if (!newParentDepartment) {
                        return res.status(404).json({ error: 'Новый родительский отдел не найден' });
                    }

                    newOrganizationId = newParentDepartment.organization_id;
                    newParentName = newParentDepartment.name;
                    newOrganizationName = newParentDepartment.organization ? newParentDepartment.organization.name : null;
                }
            } else if (newOrganizationId && newOrganizationId !== oldOrganizationId) {
                // Если изменилась только организация
                const newOrganization = await Organization.findByPk(newOrganizationId);
                if (newOrganization) {
                    newOrganizationName = newOrganization.name;
                }
            }

            // Обновляем отдел с новым organization_id
            await department.update({
                ...updateData,
                parent_id,
                organization_id: newOrganizationId,
            });

            // Если не получили новые названия, но ID изменились, получаем актуальные данные
            if (parent_id !== null && parent_id !== oldParentId && !newParentName) {
                const updatedParent = await Department.findByPk(parent_id);
                if (updatedParent) {
                    newParentName = updatedParent.name;
                }
            }

            if (newOrganizationId !== oldOrganizationId && !newOrganizationName) {
                const updatedOrg = await Organization.findByPk(newOrganizationId);
                if (updatedOrg) {
                    newOrganizationName = updatedOrg.name;
                }
            }

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Отдел',
                id,
                'update',
                {
                    name: { old: oldName, new: newDepartmentName },
                    parent_department: {
                        // Если отдел из корневого стал дочерним, записываем null в old
                        old: becameChild ? null : oldParentName,
                        // Если отдел из дочернего стал корневым, записываем null в new
                        new: becameRoot ? null : (newParentName || oldParentName)
                    },
                    organization: { old: oldOrganizationName, new: newOrganizationName || oldOrganizationName }
                },
                `${req.user.id} ${req.user.last_name} ${req.user.first_name} ${req.user.middle_name}`
            );

            return res.json(department);
        } catch (error) {
            console.log('Ошибка при обновлении отдела', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }



    async deleteDepartment(req, res, next) {
        const { id } = req.params;
        try {
            // Находим отдел с включением связанных моделей
            const department = await Department.findOne({
                where: { id: id },
                include: [
                    { model: Organization },
                    { model: Department, as: 'parent' }
                ]
            });

            if (!department) {
                return res.status(404).json({ error: 'Отдел не найден' });
            }

            // Сохраняем старые значения для истории
            const oldName = department.name;
            const oldParentId = department.parent_id;
            const oldParentName = department.parent ? department.parent.name : null;
            const oldOrganizationId = department.organization_id;
            const oldOrganizationName = department.organization ? department.organization.name : null;

            // Находим все дочерние отделы (включая вложенные)
            const findAllChildren = async (parentId) => {
                const children = await Department.findAll({ where: { parent_id: parentId } });
                let allChildren = [...children];
                for (const child of children) {
                    const nestedChildren = await findAllChildren(child.id);
                    allChildren = [...allChildren, ...nestedChildren];
                }
                return allChildren;
            };

            const children = await findAllChildren(id);

            // Удаляем все дочерние отделы
            for (const child of children) {
                await child.destroy();
            }

            // Удаляем сам отдел
            await department.destroy();

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Отдел',
                id,
                'delete',
                {
                    name: { old: oldName, new: null },
                    parent_department: { old: oldParentName, new: null },
                    organization: { old: oldOrganizationName, new: null }
                },
                `${req.user.id} ${req.user.last_name} ${req.user.first_name} ${req.user.middle_name}`
            );

            return res.json({ message: 'Отдел и все дочерние отделы успешно удалены' });
        } catch (error) {
            console.log('Ошибка при удалении отдела', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async getEmployeeHistory(req, res, next) {
        const { id } = req.params;
        const { page, limit } = req.query;
        try {
            const { count, rows } = await historyService.getHistoryForObject('Отдел', id, page, limit);
            return res.json({ count, rows });
        } catch (error) {
            console.error("Ошибка при получении истории отдела", error);
            return next(error);
        }
    }
}

module.exports = new DepartmentController();
