const Router = require('express');
const router = new Router();
const employeeController = require('../controllers/employeeController');
const validate = require('../middleware/validateMiddleware');
const { employeeSchema, employeeUpdateSchema } = require('../validators/employeeValidator');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, validate(employeeSchema), employeeController.createEmployee); // Создание нового сотрудника
router.post('/:id/files', authMiddleware, employeeController.uploadEmployeeFiles); // Загрузка файлов для сотрудника
router.put('/:id', authMiddleware, validate(employeeUpdateSchema), employeeController.updateEmployee); // Обновление данных сотрудника
router.delete('/:id', authMiddleware, employeeController.deleteEmployee); // Удаление сотрудника
router.get('/', employeeController.getAllEmployees); // Получение всех сотрудников
router.get('/:id', employeeController.getOneEmployee); // Получение конкретного сотрудника по ID
router.get('/:employee_id/history', employeeController.getEmployeeHistory); // Получение истории для конкретной сотрудника

// Дополнительные операции для мягкого/жесткого удаления и восстановления
router.delete('/hard/:id', employeeController.hardDeleteEmployee);
router.post('/restore/:id', employeeController.restoreEmployee);

// Операции для файлов
router.delete('/file/:id', employeeController.deleteFile);
router.delete('/file/hard/:id', employeeController.hardDeleteFile);
router.post('/file/restore/:id', employeeController.restoreFile);

module.exports = router;
