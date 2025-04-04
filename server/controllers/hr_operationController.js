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
            // Получаем последнюю HR операцию для сохранения текущих значений
            const lastOperation = await HR_Operation.findOne({
                where: { employee_id },
                order: [['createdAt', 'DESC']]
            });

            if (!lastOperation) {
                return res.status(404).json({ error: 'Не найдена информация о сотруднике' });
            }

            // Создаем новую операцию, сохраняя текущие значения department_id и position_id
            const operation = await HR_Operation.create({
                type: 'salary_change',
                employee_id,
                salary: salary,
                department_id: lastOperation.department_id,
                position_id: lastOperation.position_id
            });

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Сотрудник',
                employee_id,
                'Изменение зарплаты',
                {
                    salary: { old: lastOperation.salary, new: salary }
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
            // Получаем последнюю HR операцию для сохранения текущей зарплаты
            const lastOperation = await HR_Operation.findOne({
                where: { employee_id },
                order: [['createdAt', 'DESC']]
            });

            if (!lastOperation) {
                return res.status(404).json({ error: 'Не найдена информация о сотруднике' });
            }

            // Создаем новую операцию, сохраняя текущую зарплату
            const operation = await HR_Operation.create({
                type: 'department_change',
                employee_id,
                department_id: department_id,
                position_id: position_id,
                salary: lastOperation.salary // Сохраняем текущую зарплату
            });

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Сотрудник',
                employee_id,
                'Перевод в другой отдел',
                {
                    department_id: { old: lastOperation.department_id, new: department_id },
                    position_id: { old: lastOperation.position_id, new: position_id }
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

    // Добавьте этот метод в класс HROperationsController
    async getEmployeeHRInfo(req, res, next) {
        const { employee_id } = req.params;

        try {
            // Находим последнюю HR операцию для сотрудника
            const latestOperation = await HR_Operation.findOne({
                where: { employee_id },
                order: [['createdAt', 'DESC']],
                include: [
                    { model: require('../models/department'), as: 'department' },
                    { model: require('../models/position'), as: 'position' }
                ]
            });

            if (!latestOperation) {
                return res.json({ status: 'not_hired', message: 'Не принят' });
            }

            // Если сотрудник был уволен (последняя операция - увольнение)
            if (latestOperation.type === 'fire') {
                return res.json({ status: 'fired', message: 'Уволен' });
            }

            // Формируем информацию о сотруднике
            const hrInfo = {
                status: 'hired',
                salary: latestOperation.salary,
                department: latestOperation.department ? latestOperation.department.name : null,
                position: latestOperation.position ? latestOperation.position.name : null,
                department_id: latestOperation.department_id,
                position_id: latestOperation.position_id
            };

            return res.json(hrInfo);
        } catch (error) {
            console.log('Ошибка при получении HR информации о сотруднике', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

}

module.exports = new HROperationsController();
