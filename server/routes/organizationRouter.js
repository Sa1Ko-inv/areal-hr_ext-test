const Router = require('express');
const router = new Router();
const organizationController = require('../controllers/organizationController');

router.post('/', organizationController.createOrganization) // Добавить новую отдел
router.get('/', organizationController.getAllOrganization) // Получить всех отдел
router.put('/:id', organizationController.updateOrganization) // Редактировать отдел по ID
router.delete('/:id', organizationController.deleteOrganization) // Удалить отдел по ID

module.exports = router;
