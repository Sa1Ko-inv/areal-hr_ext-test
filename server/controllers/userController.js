const ApiError = require("../error/ApiError");
const User = require("../models/user");
const argon2 = require('argon2');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const historyService = require('./historyService');

const generateJWT = (id, login, role, last_name, first_name, middle_name ) => {
    return jwt.sign(
        {id, login, role, last_name, first_name, middle_name},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res) {
        const {first_name, last_name, middle_name, login, password, role} = req.body;

        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 4,
            parallelism: 1,
        });

        const user = await User.create({first_name, last_name, middle_name, login, password: hashedPassword, role});
        const token = generateJWT(user.id, user.login, user.role);
        return res.json({token}); //Передавать токен
    }

    async login(req, res, next) {
        const {login, password} = req.body;
        const user = await User.findOne({where: {login}});
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'));
        }
        const isValidPassword = await argon2.verify(user.password, password);
        if (!isValidPassword) {
            return next(ApiError.internal('Указан неверный пароль'));
        }
        const token = generateJWT(user.id, user.login, user.role, user.last_name, user.first_name, user.middle_name);
        return res.json({token}); //Передавать токен
    }

    //Проверка токена
    async check(req, res) {
        const token = generateJWT(req.user.id, req.user.login, req.user.role, req.user.last_name, req.user.first_name, req.user.middle_name);
        return res.json({
            token,
            id: req.user.id,
            login: req.user.login,
            role: req.user.role,
            last_name: req.user.last_name,
            first_name: req.user.first_name,
            middle_name: req.user.middle_name,
        });
    }

    //Создание пользователя
    async createUser(req, res, next) {
        const {first_name, last_name, middle_name, login, password, role} = req.body;
        const hashPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 4,
            parallelism: 1,
        })
        const user = await User.create({first_name, last_name, middle_name, login, password: hashPassword, role});

        await historyService.createHistoryEntry(
            'Пользователь',
            user.id,
            'create',
            {
                first_name: {old: null, new: first_name},
                last_name: {old: null, new: last_name},
                middle_name: {old: null, new: middle_name},
                login: {old: null, new: login},
                role: {old: null, new: role}
            },
            `${req.user.id} ${req.user.last_name} ${req.user.first_name} ${req.user.middle_name}`
        );

        return res.json(user)
    }

    //Получение всех пользователей
    async getAllUsers(req, res, next) {
        try {
            let {page, limit} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            const {count, rows} = await User.findAndCountAll({
                limit,
                offset,
                distinct: true,
                order: [['first_name', 'ASC']],
            });
            return res.json({count, rows});
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    //Обновление пользователя
    async updateUser(req, res, next) {
        try {
            const {first_name, last_name, middle_name, login, password, role} = req.body;
            const user = await User.findByPk(req.params.id);

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            // Получаем старые данные пользователя для истории
            const oldValues = {
                first_name: user.first_name,
                last_name: user.last_name,
                middle_name: user.middle_name,
                login: user.login,
                role: user.role,
            }

            // Обновляем данные пользователя
            if (first_name) user.first_name = first_name;
            if (last_name) user.last_name = last_name;
            if (middle_name) user.middle_name = middle_name;
            if (login) user.login = login;
            if (password) {
                const password = await argon2.hash(password, {
                    type: argon2.argon2id,
                    memoryCost: 2 ** 16,
                    timeCost: 4,
                    parallelism: 1,
                });
                user.password = password;
            }
            if (role) user.role = role;

            await user.save();

            // Получаем обновленные данные пользователя
            const newValues = {
                first_name: user.first_name,
                last_name: user.last_name,
                middle_name: user.middle_name,
                login: user.login,
                role: user.role,
            }

            // Фильтруем только измененные поля
            const changedFields = {}
            for (const key in newValues) {
                if (oldValues[key] !== newValues[key]) {
                    changedFields[key] = {old: oldValues[key], new: newValues[key]};
                }
            }

            if (Object.keys(changedFields).length > 0) {
                await historyService.createHistoryEntry(
                    'Пользователь',
                    user.id,
                    'update',
                    changedFields,
                    `${req.user.id} ${req.user.last_name} ${req.user.first_name} ${req.user.middle_name}`
                );
            }


            return res.json(user);

        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    // Удаление пользователя по ID
    async deleteUser(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);
            if (user) {
                // Получаем старые данные пользователя для истории
                const oldValues = {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    middle_name: user.middle_name,
                    login: user.login,
                    role: user.role,
                }
                await user.destroy();

                // Записываем в историю
                await historyService.createHistoryEntry(
                    'Пользователь',
                    userId,
                    'delete',
                    {
                        first_name: {old: oldValues.first_name, new: null},
                        last_name: {old: oldValues.last_name, new: null},
                        middle_name: {old: oldValues.middle_name, new: null},
                        login: {old: oldValues.login, new: null},
                        role: {old: oldValues.role, new: null}
                    },
                    `${req.user.id} ${req.user.last_name} ${req.user.first_name} ${req.user.middle_name}`
                );

                return res.json({message: 'Пользователь успешно удален'});


            } else {
                return next(ApiError.badRequest('Пользователь не найден'));
            }
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении пользователя'));
        }
    }
}

module.exports = new UserController();