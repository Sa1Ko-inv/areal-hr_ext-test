const Router = require('express');
const router = new Router();
const organizationController = require('../controllers/organizationController');
const validate = require('../middleware/validateMiddleware');
const { organizationSchema, organizationUpdateSchema } = require('../validators/organizationValidator');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, validate(organizationSchema), organizationController.createOrganization); // Добавить новую отдел
router.get('/', organizationController.getAllOrganization); // Получить всех отдел
router.get('/:id/departments', organizationController.getOrganizationWithDepartments); // Получить отдел с его подразделениями по ID

router.get('/:id/history', organizationController.getOrganizationHistory); // Получение истории для конкретной организации
router.get('/delete', organizationController.getDeletedOrganizations); // Получить удаленных организаций

router.put('/:id', authMiddleware, validate(organizationUpdateSchema), organizationController.updateOrganization); // Редактировать отдел по ID
router.delete('/:id', authMiddleware, organizationController.deleteOrganization); // Удалить отдел по ID

module.exports = router;
