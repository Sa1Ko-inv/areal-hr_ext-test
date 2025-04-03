const Router = require('express');
const router = new Router();
const departmentController = require('../controllers/departmentController');
const validate = require('../middleware/validateMiddleware');
const {departmentSchema, departmentUpdateSchema } = require('../validators/departmentValidator');


router.post('/',validate(departmentSchema) ,departmentController.createDepartment) // Добавить новую организацию
router.get('/', departmentController.getAllDepartment) // Получить всех организаций
router.get('/:id/history', departmentController.getEmployeeHistory); // Получение истории для конкретной должности
router.put('/:id',validate(departmentUpdateSchema) ,departmentController.updateDepartment) // Редактировать организацию по ID
router.delete('/:id', departmentController.deleteDepartment) // Удалить организацию по ID

module.exports = router;