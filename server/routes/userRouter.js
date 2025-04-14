const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const validate = require('../middleware/validateMiddleware');
const {userCreateSchema, userLoginSchema, userUpdateSchema,} = require('../validators/userValidator')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/registration', validate(userCreateSchema), userController.registration) // Регистрация пользователя
router.post('/login', validate(userLoginSchema), userController.login) // Авторизация пользователя
router.get('/auth', authMiddleware, userController.check) // Проверка авторизации пользователя

router.post('/create', checkRole('admin'), validate(userCreateSchema), userController.createUser) // Создание нового пользователя
router.get('/', userController.getAllUsers) // Получение всех пользователей
router.put('/:id', checkRole('admin'), validate(userUpdateSchema), userController.updateUser) // Обновление данных пользователя по ID
router.delete('/:id', checkRole('admin'), userController.deleteUser) // Удаление пользователя по ID

module.exports = router;