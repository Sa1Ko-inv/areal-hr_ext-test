const Router = require('express');
const router = new Router();
const organizationController = require('../controllers/organizationController');
const validate = require('../middleware/validateMiddleware');
const {organizationSchema, organizationUpdateSchema} = require('../validators/organizationValidator')

router.post('/',validate(organizationSchema), organizationController.createOrganization) // Добавить новую отдел
router.get('/', organizationController.getAllOrganization) // Получить всех отдел
router.get('/:id/departments', organizationController.getOrganizationWithDepartments) // Получить отдел с его подразделениями по ID

router.get('/:id/history', organizationController.getOrganizationHistory); // Получение истории для конкретной должности
router.get('/delete', organizationController.getDeletedOrganizations); // Получить удаленных организаций

router.put('/:id', validate(organizationUpdateSchema), organizationController.updateOrganization) // Редактировать отдел по ID
router.delete('/:id', organizationController.deleteOrganization) // Удалить отдел по ID

module.exports = router;
