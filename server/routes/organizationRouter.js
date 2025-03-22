const Router = require('express');
const router = new Router();
const organizationController = require('../controllers/organizationController');

router.post('/', organizationController.createOrganization) // Добавить новую группу
router.get('/', organizationController.getAllOrganization) // Получить всех участников всех групп
router.put('/:id', organizationController.updateOrganization) // Редактировать имя группы по ID
router.delete('/:id', organizationController.deleteOrganization) // Удалить группу по ID

module.exports = router;
