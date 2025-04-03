const HR_Operation = require("../models/hr_operation");
const Employees = require('../models/employees');
const Passport = require('../models/passport');
const Address = require('../models/address');
const Files = require('../models/file');
const sequelize = require('../db');

class HROperationsController {
    // Приём сотрудника на работу
    async hireEmployee(req, res, next) {
        const {employee_id, department_id, position_id, salary} = req.body;
        try {
            const operation = await HR_Operation.create({
                type: 'hire',
                employee_id,
                department_id,
                position_id,
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
        const {employee_id} = req.params;
        const {salary} = req.body;

        try {
            const operation = await HR_Operation.create({
                type: 'salary_change',
                employee_id,
                salary: salary
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
        const {employee_id} = req.params;
        const {department_id, position_id} = req.body;

        try {
            const operation = await HR_Operation.create({
                type: 'department_change',
                employee_id,
                department_id: department_id,
                position_id: position_id
            });

            console.log('Отдел изменен:', operation.toJSON());
            return res.json(operation);
        } catch (error) {
            console.log('Ошибка при переводе сотрудника', error);
            return res.status(500).json({error: 'Ошибка сервера'});
        }
    }

    // Увольнение сотрудника (с мягким удалением и всех связанных данных)
    async fireEmployee(req, res, next) {
        const { employee_id } = req.params;
        const transaction = await sequelize.transaction();

        try {
            // Сначала создаем запись о кадровой операции
            const operation = await HR_Operation.create({
                type: 'fire',
                employee_id
            }, { transaction });

            // Находим сотрудника и связанные данные
            const employee = await Employees.findOne({
                where: { id: employee_id },
                include: [
                    { model: Passport },
                    { model: Address },
                    { model: Files },
                    // Добавьте другие связанные модели при необходимости
                ],
                transaction
            });

            if (!employee) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Сотрудник не найден' });
            }

            // Мягкое удаление связанных данных
            // Паспорт
            if (employee.passport) {
                await employee.passport.destroy({ transaction });
            }

            // Адрес
            if (employee.address) {
                await employee.address.destroy({ transaction });
            }

            // Файлы
            if (employee.files && employee.files.length > 0) {
                for (const file of employee.files) {
                    await file.destroy({ transaction });
                }
            }

            // Мягкое удаление самого сотрудника
            await employee.destroy({ transaction });

            // Фиксируем транзакцию
            await transaction.commit();

            console.log('Сотрудник уволен (мягкое удаление):', {
                employee_id: employee_id,
                operationId: operation.id
            });

            return res.json({
                message: 'Сотрудник уволен. Все данные помечены как удаленные.',
                operation: operation.toJSON()
            });
        } catch (error) {
            await transaction.rollback();
            console.log('Ошибка при увольнении сотрудника', error);
            return res.status(500).json({
                error: 'Ошибка при увольнении сотрудника',
                details: error.message
            });
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