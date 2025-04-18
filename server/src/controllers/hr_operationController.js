const HR_Operation = require('../models/hr_operation');
const Employees = require('../models/employees');
const Passport = require('../models/passport');
const Address = require('../models/address');
const Files = require('../models/file');
const Department = require('../models/department');
const Position = require('../models/position');
const Organization = require('../models/organization');
const sequelize = require('../db');
const historyService = require('./historyService'); // Импортируем historyService

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

      let departmentNameString = 'N/A';
      let positionNameString = 'N/A';

      // Получаем отдел и организацию с транзакцией
      const dept = await Department.findOne({
        where: { id: department_id },
        include: [{ model: Organization, attributes: ['name'] }],
        transaction,
      });

      if (dept) {
        departmentNameString = `${dept.name}${dept.organization ? ` (${dept.organization.name})` : ''}`;
      } else {
        await transaction.rollback();
        return res.status(404).json({ error: `Отдел с ID ${department_id} не найден` });
      }

      // Получаем должность с транзакцией
      const pos = await Position.findOne({
        where: { id: position_id },
        transaction,
      });

      if (pos) {
        positionNameString = pos.name;
      } else {
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

      // Запись в историю с транзакцией
      await historyService.createHistoryEntry(
        'Сотрудник',
        employee_id,
        'Принятие на работу',
        {
          department: { old: null, new: departmentNameString },
          position: { old: null, new: positionNameString },
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
        'Изменение зарплаты',
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
        'Перевод в другой отдел',
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

  // Увольнение сотрудника (с мягким удалением и всех связанных данных)
  async fireEmployee(req, res) {
    const { employee_id } = req.params;
    const transaction = await sequelize.transaction();

    try {
      // Получаем последнюю HR операцию для сохранения текущих значений
      const lastOperation = await HR_Operation.findOne({
        where: { employee_id },
        order: [['createdAt', 'DESC']],
      });

      // Находим сотрудника и связанные данные (ДО создания операции!)
      const employee = await Employees.findOne({
        where: { id: employee_id },
        include: [
          { model: Passport },
          { model: Address },
          { model: Files },
          // Добавьте другие связанные модели при необходимости
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

      // Записываем в историю
      await historyService.createHistoryEntry(
        'Сотрудник',
        employee_id,
        'Увольнение',
        {
          first_name: { old: employee.first_name, new: null },
          last_name: { old: employee.last_name, new: null },
          middle_name: { old: employee.middle_name, new: null },
          passportSeries: {
            old: employee.passport ? employee.passport.series : null,
            new: null,
          },
          passportNumber: {
            old: employee.passport ? employee.passport.number : null,
            new: null,
          },
          region: {
            old: employee.address ? employee.address.region : null,
            new: null,
          },
          street: {
            old: employee.address ? employee.address.street : null,
            new: null,
          },
          house: {
            old: employee.address ? employee.address.house : null,
            new: null,
          },
          apartment: {
            old: employee.address ? employee.address.apartment : null,
            new: null,
          },
          operation_type: { old: null, new: 'fire' }, // Правильный формат для operation_type
        },
        `${req.user.id} ${req.user.last_name} ${req.user.first_name} ${req.user.middle_name}`
      );

      // Фиксируем транзакцию
      await transaction.commit();

      return res.json({
        message: 'Сотрудник уволен. Все данные помечены как удаленные.',
        operation: operation.toJSON(),
      });
    } catch (error) {
      await transaction.rollback();
      console.log('Ошибка при увольнении сотрудника', error);
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
            model: require('../models/department'),
            as: 'department',
            include: [Organization],
          },
          { model: require('../models/position'), as: 'position' },
        ],
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
        // Формируем название отдела с организацией
        department: latestOperation.department
          ? `${latestOperation.department.name}${latestOperation.department.organization ? ` (${latestOperation.department.organization.name})` : ''}`
          : null,
        position: latestOperation.position ? latestOperation.position.name : null,
        department_id: latestOperation.department_id,
        position_id: latestOperation.position_id,
      };

      return res.json(hrInfo);
    } catch (error) {
      console.log('Ошибка при получении HR информации о сотруднике', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  // Получение истории увольнений сотрудников
  async getFiredHistory(req, res, next) {
    try {
      // Получаем параметры пагинации из запроса (с значениями по умолчанию)
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10; // Или другое значение по умолчанию

      const historyData = await historyService.getFiredEmployeesHistory(page, limit);

      return res.json(historyData); // Отправляем данные клиенту { count, rows }
    } catch (error) {
      // Передаем ошибку в централизованный обработчик ошибок
      next(error);
    }
  }
}

module.exports = new HROperationsController();
