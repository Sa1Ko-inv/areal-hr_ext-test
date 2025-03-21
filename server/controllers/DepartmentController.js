const Department = require("../models/Department");
const ApiError = require("../error/ApiError");

class DepartmentController {
    async createDepartment(req, res, next) {
        const {name, comment, organization_Id, parent_Id} = req.body;

        try {
            if (!organization_Id) {
                return next(ApiError.badRequest('ID организации не указан'));
            }

            const department = await Department.create({
                name,
                comment,
                organization_Id,
                parent_Id
            });

            return res.json(department);

        } catch (error) {
            console.log('Ошибка при создании отдела', error);
            next(ApiError.badRequest(error.message));
        }
    }

    async getAllDepartment(req, res, next) {
        try {
            const departments = await Department.findAll({
                paranoid: false,
                include: [
                    {model: Department, as: "parent"},
                    {model: Department, as: "children"},
                ]
            });
            return res.json(departments);
        } catch (error) {
            console.log('Ошибка при получении всех отделов', error);
            next(ApiError.badRequest(error.message));
        }
    }

    async updateDepartment(req, res, next) {
        const {id} = req.params;
        const {name, comment, organization_Id, parent_Id} = req.body;

        try {
            const department = await Department.findByPk(id);

            if (!department) {
                return next(ApiError.badRequest('Отдел не найден'));
            }

            await department.update({
                name,
                comment,
                organization_Id,
                parent_Id
            })

            return res.json(department);
        } catch (error) {
            console.log('Ошибка при обновлении отдела', error);
            next(ApiError.badRequest(error.message));
        }
    }

    async deleteDepartment(req, res, next) {
        const {id} = req.params;

        try {
            const department = await Department.findByPk(id);
            if (!department) {
                return next(ApiError.badRequest('Отдел не найден'));
            }

            await department.destroy()

            return res.json({message: 'Отдел успешно удален'});
        } catch (error) {
            console.log('Ошибка при удалении отдела', error);
            next(ApiError.badRequest(error.message));
        }
    }
}

module.exports = new DepartmentController();