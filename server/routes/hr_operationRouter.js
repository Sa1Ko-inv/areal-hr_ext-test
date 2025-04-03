const Router = require('express');
const router = new Router();
const hrOperationsController = require('../controllers/hr_operationController');
const validate = require('../middleware/validateMiddleware');
const {hireSchema, salaryChangeSchema, departmentChangeSchema} = require('../validators/hr_operationValidator');

// Маршруты для HR операций
router.post('/hire', validate(hireSchema), hrOperationsController.hireEmployee); // Принять сотрудника на работу
router.put('/salary/:employeeId', validate(salaryChangeSchema), hrOperationsController.changeSalary); // Изменить зарплату сотрудника
router.put('/department/:employeeId', validate(departmentChangeSchema), hrOperationsController.changeDepartment); // Перевести сотрудника в другой отдел
router.post('/fire/:employeeId', hrOperationsController.fireEmployee); // Уволить сотрудника
router.get('/', hrOperationsController.getAllOperations);

module.exports = router;