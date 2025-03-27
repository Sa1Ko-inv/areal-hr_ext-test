const Router = require('express');
const router = new Router();
const positionController = require('../controllers/positionController');
const validate = require('../middleware/validateMiddleware');
const {positionSchema, positionUpdateSchema} = require('../validators/positionValidator')

router.post('/', validate(positionSchema), positionController.createPosition) // Добавить новую должность
router.get('/', positionController.getAllPositions) // Получить все должности
router.put('/:id', validate(positionUpdateSchema), positionController.updatePosition) // Редактировать должность по ID
router.delete('/:id', positionController.deletePosition) // Удалить должность по ID

module.exports = router;
