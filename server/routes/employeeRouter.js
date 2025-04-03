const Router = require('express');
const router = new Router();
const employeeController = require('../controllers/employeeController');
const validate = require('../middleware/validateMiddleware');
const {employeeSchema, employeeUpdateSchema } = require('../validators/employeeValidator');

// CRUD операции для сотрудников
router.post('/', validate(employeeSchema), employeeController.createEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getOneEmployee);
router.put('/:id', validate(employeeUpdateSchema), employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

// Дополнительные операции для мягкого/жесткого удаления и восстановления
router.delete('/hard/:id', employeeController.hardDeleteEmployee);
router.post('/restore/:id', employeeController.restoreEmployee);

// Операции для файлов
router.delete('/file/:id', employeeController.deleteFile);
router.delete('/file/hard/:id', employeeController.hardDeleteFile);
router.post('/file/restore/:id', employeeController.restoreFile);

module.exports = router;
