const Router = require('express');
const router = new Router();
const hrOperationsController = require('../controllers/hr_operationController');
const validate = require('../middleware/validateMiddleware');
const {hireSchema, salaryChangeSchema, departmentChangeSchema} = require('../validators/hr_operationValidator');

// Маршруты для HR операций
router.post('/hire', validate(hireSchema), hrOperationsController.hireEmployee); // Принять сотрудника на работу
router.put('/salary/:employee_id', validate(salaryChangeSchema), hrOperationsController.changeSalary); // Изменить зарплату сотрудника
router.put('/department/:employee_id', validate(departmentChangeSchema), hrOperationsController.changeDepartment); // Перевести сотрудника в другой отдел
router.post('/fire/:employee_id', hrOperationsController.fireEmployee); // Уволить сотрудника
router.get('/', hrOperationsController.getAllOperations);

router.get('/:employee_id/history', hrOperationsController.getHROperationHistory); // Получение истории для конкретной должности
router.get('/fired-employees', hrOperationsController.getFiredHistory); // Получение истории уволенных сотрудников
router.get('/employee/:employee_id', hrOperationsController.getEmployeeHRInfo); // Получение HR информации о сотруднике



module.exports = router;