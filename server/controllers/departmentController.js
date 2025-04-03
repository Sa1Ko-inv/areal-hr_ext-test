const Department = require("../models/department");
const historyService = require('./historyService'); // Импортируем historyService

class DepartmentController {
    async createDepartment(req, res, next) {
        let organizationId = req.body.organization_id;
        const { name, parent_id } = req.body; // Получаем name и parent_id

        try {
            if (req.body.parent_id) {
                const parentDepartment = await Department.findByPk(req.body.parent_id);
                if (!parentDepartment) {
                    return res.status(404).json({ error: 'Родительский отдел не найден' });
                }
                organizationId = parentDepartment.organization_id;
            }

            const department = await Department.create({
                ...req.body,
                organization_id: organizationId,
            });

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Отдел',
                department.id,
                'create',
                {
                    name: { old: null, new: name }, // Логируем name
                    parent_id: { old: null, new: parent_id || null }, // Логируем parent_id
                    organization_id: {old: null, new: organizationId}
                },
                null // Пока нет авторизации
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
                ]
            });
            return res.json(departments);
        } catch (error) {
            console.log('Ошибка при получении всех отделов', error);

        }
    }

    async updateDepartment(req, res, next) {
        const { id } = req.params;
        const { parent_id, ...updateData } = req.body; // Получаем parent_id отдельно

        try {
            const department = await Department.findOne({
                where: { id: id },
            });

            if (!department) {
                return res.status(404).json({ error: 'Отдел не найден' });
            }

            // Сохраняем старые значения для истории
            const oldName = department.name;
            const oldParentId = department.parent_id;
            const oldOrganizationId = department.organization_id;

            let newOrganizationId = updateData.organization_id; // Используем organization_id из запроса

            if (parent_id !== undefined && parent_id !== department.parent_id) {
                // Если parent_id изменился
                if (parent_id === null) {
                    // Если parent_id стал null, то организация должна быть указана в запросе
                    if (!newOrganizationId) {
                        return res.status(400).json({ error: 'При удалении родительского отдела необходимо указать organization_id' });
                    }
                } else {
                    // Получаем организацию нового родительского отдела
                    const newParentDepartment = await Department.findOne({
                        where: { id: parent_id },
                    });
                    if (!newParentDepartment) {
                        return res.status(404).json({ error: 'Новый родительский отдел не найден' });
                    }
                    newOrganizationId = newParentDepartment.organization_id;
                }
            }

            // Обновляем отдел с новым organization_id
            await department.update({
                ...updateData,
                parent_id,
                organization_id: newOrganizationId,
            });

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Отдел',
                id,
                'update',
                {
                    name: { old: oldName, new: updateData.name || oldName }, // Логируем name
                    parent_id: { old: oldParentId, new: parent_id }, // Логируем parent_id
                    organization_id: {old: oldOrganizationId, new: newOrganizationId }
                },
                null // Пока нет авторизации
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
            const department = await Department.findByPk(id);

            if (!department) {
                return res.status(404).json({ error: 'Отдел не найден' });
            }

            // Сохраняем старые значения для истории
            const oldName = department.name;
            const oldParentId = department.parent_id;
            const oldOrganizationId = department.organization_id;

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
                    parent_id: { old: oldParentId, new: null },
                    organization_id: {old: oldOrganizationId, new: null}
                },
                null // Пока нет авторизации
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
            const { count, rows } = await historyService.getHistoryForObject('Сотрудник', id, page, limit);
            return res.json({ count, rows });
        } catch (error) {
            console.error("Ошибка при получении истории сотрудника", error);
            return next(error);
        }
    }
}

module.exports = new DepartmentController();
