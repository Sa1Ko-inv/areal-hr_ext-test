const HR_Operation = require("../models/hr_operation");
const Employees = require('../models/employees');
const Passport = require('../models/passport');
const Address = require('../models/address');
const Files = require('../models/file');
const sequelize = require('../db');
const historyService = require('./historyService'); // Импортируем historyService

class HROperationsController {
    // Приём сотрудника на работу
    async hireEmployee(req, res, next) {
        const { employee_id, department_id, position_id, salary } = req.body;
        try {
            const operation = await HR_Operation.create({
                type: 'hire',
                employee_id,
                department_id,
                position_id,
                salary
            });

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Сотрудник', // Изменено на 'Сотрудник'
                employee_id,  // Используем employee_id
                'Принятие на работу',
                {
                    operation_type: 'hire', // Добавлено для ясности
                    department_id: { old: null, new: department_id },
                    position_id: { old: null, new: position_id },
                    salary: { old: null, new: salary }
                },
                null // Пока нет авторизации
            );

            console.log('Сотрудник принят на работу:', operation.toJSON());
            return res.json(operation);
        } catch (error) {
            console.log('Ошибка при приёме сотрудника', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    // Изменение зарплаты сотрудника
    async changeSalary(req, res, next) {
        const { employee_id } = req.params;
        const { salary } = req.body;

        try {
            const operation = await HR_Operation.create({
                type: 'salary_change',
                employee_id,
                salary: salary
            });
            const oldOperation = await HR_Operation.findOne({ where: { employee_id } });

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Сотрудник', // Изменено на 'Сотрудник'
                employee_id,  // Используем employee_id
                'Изменение зарплаты', // Используем 'update', так как это изменение
                {
                    // operation_type: 'salary_change', // Добавлено для ясности
                    salary: { old: oldOperation ? oldOperation.salary : null, new: salary }
                },
                null // Пока нет авторизации
            );

            console.log('Зарплата изменена:', operation.toJSON());
            return res.json(operation);
        } catch (error) {
            console.log('Ошибка при изменении зарплаты', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    // Перевод сотрудника в другой отдел
    async changeDepartment(req, res, next) {
        const { employee_id } = req.params;
        const { department_id, position_id } = req.body;

        try {
            const operation = await HR_Operation.create({
                type: 'department_change',
                employee_id,
                department_id: department_id,
                position_id: position_id
            });
            const oldOperation = await HR_Operation.findOne({ where: { employee_id } });

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Сотрудник', // Изменено на 'Сотрудник'
                employee_id,  // Используем employee_id
                'Перевод в другой отдел', // Используем 'update'
                {
                    // operation_type: 'department_change', // добавлено
                    department_id: { old: oldOperation ? oldOperation.department_id : null, new: department_id },
                    // position_id: { old: oldOperation ? oldOperation.position_id : null, new: position_id }
                },
                null // Пока нет авторизации
            );

            console.log('Отдел изменен:', operation.toJSON());
            return res.json(operation);
        } catch (error) {
            console.log('Ошибка при переводе сотрудника', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
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

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Сотрудник',  // Изменено на 'Сотрудник'
                employee_id, // Используем employee_id
                'Увольнение',      // Операция 'create' для записи увольнения
                {
                    operation_type: 'fire', // добавлено
                },
                null // Пока нет авторизации
            );

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
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async getHROperationHistory(req, res, next) {
        const { employee_id } = req.params; // Изменено на employee_id
        const { page, limit } = req.query;
        try {
            const { count, rows } = await historyService.getHistoryForObject('Сотрудник', employee_id, page, limit); // Изменено на 'Сотрудник' и employee_id
            return res.json({ count, rows });
        } catch (error) {
            console.error("Ошибка при получении истории кадровой операции", error);
            return next(error);
        }
    }
}

module.exports = new HROperationsController();
