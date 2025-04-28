const HR_Operation = require('../models/hr_operation');
const Employees = require('../models/employees');
const Passport = require('../models/passport');
const Address = require('../models/address');
const Files = require('../models/file');
const Department = require('../models/department');
const Position = require('../models/position');
const Organization = require('../models/organization');
const sequelize = require('../db');
const historyService = require('./historyService');
const History = require('../models/history'); // Импортируем historyService

class HROperationsController {
  // Приём сотрудника на работу
  async hireEmployee(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { employee_id, department_id, position_id, salary } = req.body;

      if (!employee_id || !department_id || !position_id || salary === undefined) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Не все обязательные поля предоставлены' });
      }

      // Проверяем, существует ли сотрудник
      const employee = await Employees.findOne({
        where: { id: employee_id },
        transaction,
      });

      if (!employee) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Сотрудник не найден' });
      }

      // Получаем информацию об отделе и должности
      const dept = await Department.findOne({
        where: { id: department_id },
        include: [{ model: Organization, attributes: ['name'] }],
        transaction,
      });

      if (!dept) {
        await transaction.rollback();
        return res.status(404).json({ error: `Отдел с ID ${department_id} не найден` });
      }

      const departmentNameString = `${dept.name}${dept.organization ? ` (${dept.organization.name})` : ''}`;

      const pos = await Position.findOne({
        where: { id: position_id },
        transaction,
      });

      if (!pos) {
        await transaction.rollback();
        return res.status(404).json({ error: `Должность с ID ${position_id} не найдена` });
      }

      // Создаем операцию с транзакцией
      const operation = await HR_Operation.create(
        {
          type: 'hire',
          employee_id,
          department_id,
          position_id,
          salary,
        },
        { transaction }
      );

      // Запись в историю
      await historyService.createHistoryEntry(
        'Сотрудник',
        employee_id,
        'hire',
        {
          status: { old: 'Уволен', new: 'Работает' },
          department: { old: null, new: departmentNameString },
          position: { old: null, new: pos.name },
          salary: { old: null, new: salary },
        },
        `${req.user.id} ${req.user.last_name} ${req.user.first_name} ${req.user.middle_name}`,
        transaction
      );

      await transaction.commit();
      return res.json(operation);
    } catch (error) {
      await transaction.rollback();
      console.error('Ошибка при приёме сотрудника:', error.stack);
      return res.status(500).json({
        error: 'Ошибка сервера',
        details: error.message,
      });
    }
  }

  // Изменение зарплаты сотрудника
  async changeSalary(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { employee_id } = req.params;
      const { salary } = req.body;

      const lastOperation = await HR_Operation.findOne({
        where: { employee_id },
        order: [['createdAt', 'DESC']],
        transaction,
      });

      if (!lastOperation) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Информация о сотруднике не найдена' });
      }

      const operation = await HR_Operation.create(
        {
          type: 'salary_change',
          employee_id,
          salary,
          department_id: lastOperation.department_id,
          position_id: lastOperation.position_id,
        },
        { transaction }
      );

      await historyService.createHistoryEntry(
        'Сотрудник',
        employee_id,
        'salary_change',
        {
          salary: { old: lastOperation.salary, new: salary },
        },
        `${req.user.id} ${req.user.last_name} ${req.user.first_name} ${req.user.middle_name}`,
        transaction
      );

      await transaction.commit();
      return res.json(operation);
    } catch (error) {
      await transaction.rollback();
      console.error('Ошибка при изменении зарплаты:', error.stack);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  // Перевод сотрудника в другой отдел
  async changeDepartment(req, res) {
    const { employee_id } = req.params;

    const { department_id } = req.body;

    // Проверка наличия нового department_id
    if (department_id === undefined || department_id === null) {
      return res.status(400).json({ error: 'Не указан ID нового отдела (department_id)' });
    }

    // Начинаем транзакцию
    const transaction = await sequelize.transaction();

    try {
      // Получаем последнюю HR операцию для сохранения текущей зарплаты и старого отдела
      const lastOperation = await HR_Operation.findOne({
        where: { employee_id },
        order: [['createdAt', 'DESC']],
        transaction, // Передаем транзакцию
      });

      if (!lastOperation) {
        await transaction.rollback(); // Откатываем транзакцию при ошибке
        return res.status(404).json({
          error: 'Не найдена информация о сотруднике или его предыдущих операциях',
        });
      }

      // --- Получение информации о старом и новом отделах ---
      // let oldDepartmentInfo = null;
      // let newDepartmentInfo = null;
      let oldDepartmentName = 'N/A'; // Значение по умолчанию
      let newDepartmentName = 'N/A'; // Значение по умолчанию

      // Получаем старый отдел и организацию
      if (lastOperation.department_id) {
        const oldDept = await Department.findOne({
          where: { id: lastOperation.department_id },
          include: [{ model: Organization, attributes: ['name'] }], // Включаем организацию
          transaction, // Передаем транзакцию
        });
        if (oldDept) {
          // oldDepartmentInfo = oldDept; // Сохраняем для создания новой операции
          oldDepartmentName = `${oldDept.name}${oldDept.organization ? ` (${oldDept.organization.name})` : ''}`;
        }
      }

      // Получаем новый отдел и организацию
      const newDept = await Department.findOne({
        where: { id: department_id },
        include: [{ model: Organization, attributes: ['name'] }], // Включаем организацию
        transaction, // Передаем транзакцию
      });

      if (!newDept) {
        // Если новый отдел не найден, возвращаем ошибку
        await transaction.rollback(); // Откатываем транзакцию при ошибке
        return res.status(404).json({ error: `Отдел с ID ${department_id} не найден` });
      }
      // newDepartmentInfo = newDept; // Сохраняем для создания новой операции
      newDepartmentName = `${newDept.name}${newDept.organization ? ` (${newDept.organization.name})` : ''}`;

      // Создаем новую операцию, сохраняя текущую зарплату и должность
      // Используем department_id из запроса
      const operation = await HR_Operation.create(
        {
          type: 'department_change',
          employee_id,
          department_id: department_id, // Используем новый ID отдела
          position_id: lastOperation.position_id, // Сохраняем текущую должность
          salary: lastOperation.salary, // Сохраняем текущую зарплату
        },
        { transaction }
      ); // Передаем транзакцию

      // Записываем в историю названия отделов
      await historyService.createHistoryEntry(
        'Сотрудник',
        employee_id,
        'department_change',
        {
          department: {
            // Используем ключ 'department' для ясности
            old: oldDepartmentName, // Название старого отдела (и организации)
            new: newDepartmentName, // Название нового отдела (и организации)
          },
        },
        `${req.user.id} ${req.user.last_name || ''} ${req.user.first_name || ''} ${req.user.middle_name || ''}`,
        transaction // Передаем транзакцию
      );

      // Фиксируем транзакцию после успешного выполнения всех операций
      await transaction.commit();

      console.log('Отдел изменен:', operation.toJSON());
      return res.json(operation);
    } catch (error) {
      // Откатываем транзакцию в случае ошибки
      await transaction.rollback();

      console.log('Ошибка при переводе сотрудника', error);
      // Логируем более подробную информацию об ошибке
      console.error('Stack trace:', error.stack);
      return res.status(500).json({
        error: 'Ошибка сервера при переводе сотрудника',
        details: error.message, // Добавляем сообщение об ошибке для отладки
      });
    }
  }

  // Увольнение сотрудника (без удаления данных)
  async fireEmployee(req, res) {
    const { employee_id } = req.params;
    const transaction = await sequelize.transaction();

    try {
      // Получаем последнюю HR операцию для сохранения текущих значений
      const lastOperation = await HR_Operation.findOne({
        where: { employee_id },
        order: [['createdAt', 'DESC']],
        transaction,
      });

      if (!lastOperation) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Информация о сотруднике не найдена' });
      }

      // Получаем информацию о сотруднике для истории
      const employee = await Employees.findOne({
        where: { id: employee_id },
        include: [
          { model: Passport },
          { model: Address },
        ],
        transaction,
      });

      if (!employee) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Сотрудник не найден' });
      }

      // Сначала создаем запись о кадровой операции
      const operation = await HR_Operation.create(
        {
          type: 'fire',
          employee_id,
          // Сохраняем текущие значения, если они есть
          department_id: lastOperation ? lastOperation.department_id : null,
          position_id: lastOperation ? lastOperation.position_id : null,
          salary: lastOperation ? lastOperation.salary : null,
        },
        { transaction }
      );

      // Записываем в историю
      await historyService.createHistoryEntry(
        'Сотрудник',
        employee_id,
        'fire',
        {
          status: { old: 'Работает', new: 'Уволен' },
        },
        `${req.user.id} ${req.user.last_name} ${req.user.first_name} ${req.user.middle_name}`,
        transaction
      );

      await transaction.commit();
      return res.json({
        message: 'Сотрудник уволен',
        operation: operation.toJSON(),
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Ошибка при увольнении сотрудника:', error.stack);
      return res.status(500).json({
        error: 'Ошибка при увольнении сотрудника',
        details: error.message,
      });
    }
  }

  // Получение всех кадровых операций
  async getAllOperations(req, res) {
    try {
      const operations = await HR_Operation.findAll({
        order: [['createdAt', 'DESC']], // Сортировка по дате создания (новые сначала)
      });

      console.log('Получены все кадровые операции:', operations.length);
      return res.json(operations);
    } catch (error) {
      console.log('Ошибка при получении кадровых операций', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  // Получение HR информации о сотруднике
  async getEmployeeHRInfo(req, res) {
    const { employee_id } = req.params;

    try {
      // Находим последнюю HR операцию для сотрудника
      const latestOperation = await HR_Operation.findOne({
        where: { employee_id },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Department,
            as: 'department',
            include: [Organization],
          },
          { model: Position, as: 'position' },
        ],
      });

      if (!latestOperation) {
        return res.json({ status: 'not_hired', message: 'Не принят' });
      }

      // Формируем информацию о сотруднике
      const hrInfo = {
        status: latestOperation.type === 'fire' ? 'fired' : 'hired',
        salary: latestOperation.salary,
        department: latestOperation.department
          ? `${latestOperation.department.name}${latestOperation.department.organization ? ` (${latestOperation.department.organization.name})` : ''}`
          : null,
        position: latestOperation.position ? latestOperation.position.name : null,
        department_id: latestOperation.department_id,
        position_id: latestOperation.position_id,
      };

      return res.json(hrInfo);
    } catch (error) {
      console.error('Ошибка при получении HR информации о сотруднике:', error.stack);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  // Получение истории увольнений сотрудников
  async getFiredHistory(req, res, next) {
    try {
      let { page, limit } = req.query;
      page = page || 1;
      limit = limit || 10;
      const offset = (page - 1) * limit;

      const {count, rows} = await History.findAndCountAll({
        limit,
        offset,
        where: {
          object_type: 'Сотрудник',
          operation_type: 'fire',
        },
      });

      return res.json({count, rows}); // Отправляем данные клиенту { count, rows }
    } catch (error) {
      // Передаем ошибку в централизованный обработчик ошибок
      next(error);
    }
  }
}

module.exports = new HROperationsController();
