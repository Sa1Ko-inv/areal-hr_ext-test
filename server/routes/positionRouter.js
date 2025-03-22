const Router = require('express');
const router = new Router();
const positionController = require('../controllers/positionController');

router.post('/', positionController.createPosition) // Добавить новую должность
router.get('/', positionController.getAllPositions) // Получить все должности
router.put('/:id', positionController.updatePosition) // Редактировать должность по ID
router.delete('/:id', positionController.deletePosition) // Удалить должность по ID

module.exports = router;
