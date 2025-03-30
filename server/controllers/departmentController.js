const Department = require("../models/department");

class DepartmentController {
    async createDepartment(req, res, next) {
        let organizationId = req.body.organization_id;

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
                paranoid: false,
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
                where: { id: id},
                paranoid: false,
            });

            if (!department) {
                return res.status(404).json({ error: 'Отдел не найден' });
            }

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
                    const newParentDepartment = await Department.findOne(
                        { where: { id: parent_id }, paranoid: false }
                    );
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

            return res.json(department);
        } catch (error) {
            console.log('Ошибка при обновлении отдела', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async deleteDepartment(req, res, next) {
        const {id} = req.params;

        try {
            const department = await Department.findByPk(id);


            await department.destroy()

            return res.json({message: 'Отдел успешно удален'});
        } catch (error) {
            console.log('Ошибка при удалении отдела', error);

        }
    }
}

module.exports = new DepartmentController();