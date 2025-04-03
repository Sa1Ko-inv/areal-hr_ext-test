const HR_Operation = require("../models/hr_operation");

class HROperationsController {
    // Приём сотрудника на работу
    async hireEmployee(req, res, next) {
        const {employeeId, departmentId,     salary} = req.body;
        try {
            const operation = await HR_Operation.create({
                type: 'hire',
                employeeId,
                departmentId,
                salary
            });

            console.log('Сотрудник принят на работу:', operation.toJSON());
            return res.json(operation);
        } catch (error) {
            console.log('Ошибка при приёме сотрудника', error);
            return res.status(500).json({error: 'Ошибка сервера'});
        }
    }

    // Изменение зарплаты сотрудника
    async changeSalary(req, res, next) {
        const {employeeId} = req.params;
        const {newSalary} = req.body;

        try {
            const operation = await HR_Operation.create({
                type: 'salary_change',
                employeeId,
                salary: newSalary
            });

            console.log('Зарплата изменена:', operation.toJSON());
            return res.json(operation);
        } catch (error) {
            console.log('Ошибка при изменении зарплаты', error);
            return res.status(500).json({error: 'Ошибка сервера'});
        }
    }

    // Перевод сотрудника в другой отдел
    async changeDepartment(req, res, next) {
        const {employeeId} = req.params;
        const {newDepartmentId, newPositionId} = req.body;

        try {
            const operation = await HR_Operation.create({
                type: 'department_change',
                employeeId,
                departmentId: newDepartmentId,
                positionId: newPositionId
            });

            console.log('Отдел изменен:', operation.toJSON());
            return res.json(operation);
        } catch (error) {
            console.log('Ошибка при переводе сотрудника', error);
            return res.status(500).json({error: 'Ошибка сервера'});
        }
    }

    // Увольнение сотрудника
    async fireEmployee(req, res, next) {
        const {employeeId} = req.params;

        try {
            const operation = await HR_Operation.create({
                type: 'fire',
                employeeId
            });

            console.log('Сотрудник уволен:', operation.toJSON());
            return res.json(operation);
        } catch (error) {
            console.log('Ошибка при увольнении сотрудника', error);
            return res.status(500).json({error: 'Ошибка сервера'});
        }
    }
    // Получение всех кадровых операций
    async getAllOperations(req, res, next) {
        try {
            const operations = await HR_Operation.findAll({
                order: [['createdAt', 'DESC']] // Сортировка по дате создания (новые сначала)
            });

            console.log('Получены все кадровые операции:', operations.length);
            return res.json(operations);
        } catch (error) {
            console.log('Ошибка при получении кадровых операций', error);
            return res.status(500).json({error: 'Ошибка сервера'});
        }
    }
}

module.exports = new HROperationsController();