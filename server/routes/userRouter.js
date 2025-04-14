const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const validate = require('../middleware/validateMiddleware');
const {userCreateSchema, userLoginSchema, userUpdateSchema,} = require('../validators/userValidator')

router.post('/registration', validate(userCreateSchema), userController.registration) // Регистрация пользователя
router.post('/login', validate(userLoginSchema), userController.login) // Авторизация пользователя
// router.get('/auth', userController.check) // Проверка авторизации пользователя

router.post('/create', validate(userCreateSchema), userController.createUser) // Создание нового пользователя
router.get('/', userController.getAllUsers) // Получение всех пользователей
router.put('/:id', validate(userUpdateSchema), userController.updateUser) // Обновление данных пользователя по ID
router.delete('/:id', userController.deleteUser) // Удаление пользователя по ID

module.exports = router;