const Department = require("../models/department");

class DepartmentController {
    async createDepartment(req, res, next) {
        const {name, comment, organization_id, parent_id} = req.body;

        try {

            const department = await Department.create({
                name,
                comment,
                organization_id,
                parent_id
            });

            return res.json(department);

        } catch (error) {
            console.log('Ошибка при создании отдела', error);

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
        const {id} = req.params;
        const {name, comment, organization_id, parent_id} = req.body;

        try {
            const department = await Department.findByPk(id);

            await department.update({
                name,
                comment,
                organization_id,
                parent_id
            })

            return res.json(department);
        } catch (error) {
            console.log('Ошибка при обновлении отдела', error);

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