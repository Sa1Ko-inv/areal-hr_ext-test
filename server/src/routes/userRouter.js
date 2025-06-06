const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const validate = require('../middleware/validateMiddleware');
const { userCreateSchema, userLoginSchema } = require('../validators/userValidator');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/registration', validate(userCreateSchema), userController.registration); // Регистрация пользователя
router.post('/login', validate(userLoginSchema), userController.login); // Авторизация пользователя
router.post('/logout', authMiddleware, userController.logout);
router.get('/auth', authMiddleware, userController.check); // Проверка авторизации пользователя

router.post('/create', authMiddleware, checkRole('admin'), validate(userCreateSchema), userController.createUser); // Создание нового пользователя
router.get('/', userController.getAllUsers); // Получение всех пользователей
router.put('/:id', authMiddleware, checkRole('admin'), userController.updateUser); // Обновление данных пользователя по ID

router.get('/:userId/history', userController.getUserHistory); // Получение истории для конкретного пользователя
router.get('/delete', userController.getDeletedUsers);

router.delete('/:id', authMiddleware, checkRole('admin'), userController.deleteUser); // Удаление пользователя по ID

module.exports = router;
