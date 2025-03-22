const Router = require('express');
const router = new Router();
const departmentController = require('../controllers/departmentController');


router.post('/', departmentController.createDepartment) // Добавить новую организацию
router.get('/', departmentController.getAllDepartment) // Получить всех организаций
router.put('/:id', departmentController.updateDepartment) // Редактировать организацию по ID
router.delete('/:id', departmentController.deleteDepartment) // Удалить организацию по ID

module.exports = router;