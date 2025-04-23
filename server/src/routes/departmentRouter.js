const Router = require('express');
const router = new Router();
const departmentController = require('../controllers/departmentController');
const validate = require('../middleware/validateMiddleware');
const { departmentSchema, departmentUpdateSchema } = require('../validators/departmentValidator');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, validate(departmentSchema), departmentController.createDepartment); // Добавить новую организацию
router.get('/', departmentController.getAllDepartment); // Получить всех отделов
router.get('/:id/history', departmentController.getDepartmentHistory); // Получение истории для конкретного отдела
router.get('/delete', departmentController.getDeletedDepartments); // Получить удаленных отделов

router.put('/:id', authMiddleware, validate(departmentUpdateSchema), departmentController.updateDepartment); // Редактировать организацию по ID
router.delete('/:id', authMiddleware, departmentController.deleteDepartment); // Удалить организацию по ID

module.exports = router;
