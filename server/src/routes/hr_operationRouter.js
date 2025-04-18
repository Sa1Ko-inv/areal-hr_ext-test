const Router = require('express');
const router = new Router();
const hrOperationsController = require('../controllers/hr_operationController');
const validate = require('../middleware/validateMiddleware');
const { hireSchema, salaryChangeSchema, departmentChangeSchema } = require('../validators/hr_operationValidator');
const authMiddleware = require('../middleware/authMiddleware');

// Маршруты для HR операций
router.post('/hire', authMiddleware, validate(hireSchema), hrOperationsController.hireEmployee); // Принять сотрудника на работу
router.put('/salary/:employee_id', authMiddleware, validate(salaryChangeSchema), hrOperationsController.changeSalary); // Изменить зарплату сотрудника
router.put('/department/:employee_id', authMiddleware, validate(departmentChangeSchema), hrOperationsController.changeDepartment); // Перевести сотрудника в другой отдел
router.post('/fire/:employee_id', authMiddleware, hrOperationsController.fireEmployee); // Уволить сотрудника
router.get('/', hrOperationsController.getAllOperations);

router.get('/fired-employees', hrOperationsController.getFiredHistory); // Получение истории уволенных сотрудников
router.get('/employee/:employee_id', hrOperationsController.getEmployeeHRInfo); // Получение HR информации о сотруднике

module.exports = router;
