const ApiError = require('../error/ApiError');
const User = require('../models/user');
const argon2 = require('argon2');
const sequelize = require('../db');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const historyService = require('./historyService');
const History = require('../models/history');

const generateJWT = (id, login, role, last_name, first_name, middle_name) => {
  return jwt.sign(
    {
      id,
      login,
      role,
      last_name,
      first_name,
      middle_name,
    },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  );
};

class UserController {
  async registration(req, res, next) {
    try {
      const { first_name, last_name, middle_name, login, password, role } = req.body;

      const hashedPassword = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 4,
        parallelism: 1,
      });

      const user = await User.create({
        first_name,
        last_name,
        middle_name,
        login,
        password: hashedPassword,
        role,
      });

      const token = generateJWT(user.id, user.login, user.role);

      // Устанавливаем токен в куки
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 часа
      });

      return res.json({
        message: 'Регистрация успешна',
        user: {
          id: user.id,
          login: user.login,
          role: user.role,
          last_name: user.last_name,
          first_name: user.first_name,
          middle_name: user.middle_name
        }
      });
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async login(req, res, next) {
    const { login, password } = req.body;

    try {
      const user = await User.findOne({ where: { login } });
      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден'));
      }
      const isValidPassword = await argon2.verify(user.password, password);
      if (!isValidPassword) {
        return next(ApiError.internal('Указан неверный пароль'));
      }
      const token = generateJWT(user.id, user.login, user.role, user.last_name, user.first_name, user.middle_name);

      // Устанавливаем токен в куки
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 часа
      });

      return res.json({
        message: 'Авторизация успешна',
        user: {
          id: user.id,
          login: user.login,
          role: user.role,
          last_name: user.last_name,
          first_name: user.first_name,
          middle_name: user.middle_name,
        },
      });
    } catch (error) {
      return next(ApiError.internal('Ошибка при авторизации', error.message));
    }
  }

  async logout(req, res) {
    res.clearCookie('jwt');
    return res.json({ message: 'Выход выполнен успешно' });
  }

  //Проверка токена
  async check(req, res) {
    const token = generateJWT(
      req.user.id,
      req.user.login,
      req.user.role,
      req.user.last_name,
      req.user.first_name,
      req.user.middle_name
    );

    // Обновляем токен в куках
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
    });

    return res.json({
      user: {
        id: req.user.id,
        login: req.user.login,
        role: req.user.role,
        last_name: req.user.last_name,
        first_name: req.user.first_name,
        middle_name: req.user.middle_name,
      },
    });
  }

  //Создание пользователя
  async createUser(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { first_name, last_name, middle_name, login, password, role } = req.body;

      // Хеширование пароля
      const hashPassword = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 4,
        parallelism: 1,
      });

      // Создание пользователя в транзакции
      const user = await User.create(
        {
          first_name,
          last_name,
          middle_name,
          login,
          password: hashPassword,
          role,
        },
        { transaction }
      );

      // Запись в историю
      await historyService.createHistoryEntry(
        'Пользователь',
        user.id,
        'create',
        {
          first_name: { old: null, new: first_name },
          last_name: { old: null, new: last_name },
          middle_name: { old: null, new: middle_name },
          login: { old: null, new: login },
          role: { old: null, new: role },
        },
        `${req.user.id} ${req.user.last_name} ${req.user.first_name} ${req.user.middle_name}`,
        transaction
      );

      await transaction.commit();
      return res.json(user);
    } catch (error) {
      await transaction.rollback();
      console.error('Ошибка при создании пользователя:', error.stack);
      return next(ApiError.internal('Ошибка при создании пользователя'));
    }
  }

  //Получение всех пользователей
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, sortOrder = 'ASC', search = '' } = req.query;
      const offset = (page - 1) * limit;

      // Сначала получаем всех пользователей без пагинации
      const allUser = await User.findAll({
        distinct: true,
      });

      // Преобразуем данные
      const userFilter = allUser.map((user) => {
        const usr = user.toJSON();
        return usr;
      });

      // Применяем поиск по ФИО, если параметр search указан
      let filteredUsers = userFilter;
      if (search && search.trim() !== '') {
        const searchLower = search.toLowerCase().trim();
        filteredUsers = userFilter.filter((user) => {
          const fullName = `${user.last_name} ${user.first_name} ${user.middle_name || ''}`.toLowerCase();
          const lastName = user.last_name.toLowerCase();
          const firstName = user.first_name.toLowerCase();
          const middleName = (user.middle_name || '').toLowerCase();

          return (
            fullName.includes(searchLower) ||
            lastName.includes(searchLower) ||
            firstName.includes(searchLower) ||
            middleName.includes(searchLower)
          );
        });
      }

      let sortedUser;
      sortedUser = [...filteredUsers].sort((a, b) => {
        return sortOrder.toUpperCase() === 'ASC'
          ? a.last_name.localeCompare(b.last_name)
          : b.last_name.localeCompare(a.last_name);
      });

      const paginatedUser = sortedUser.slice(offset, offset + limit);
      const totalCount = sortedUser.length;

      return res.json({
        count: totalCount,
        rows: paginatedUser,
      });
    } catch (error) {
      return next(ApiError.internal(error.message));
    }
  }

  //Обновление пользователя
  async updateUser(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { first_name, last_name, middle_name, login, password, role } = req.body;
      const user = await User.findByPk(req.params.id, { transaction });

      if (!user) {
        await transaction.rollback();
        return next(ApiError.badRequest('Пользователь не найден'));
      }

      // Сохраняем старые значения
      const oldValues = {
        first_name: user.first_name,
        last_name: user.last_name,
        middle_name: user.middle_name,
        login: user.login,
        role: user.role,
      };

      // Подготовка обновлений
      const updates = {};
      if (first_name) updates.first_name = first_name;
      if (last_name) updates.last_name = last_name;
      if (middle_name) updates.middle_name = middle_name;
      if (login) updates.login = login;
      if (role) updates.role = role;

      // Хеширование пароля, если он был изменен
      if (password) {
        updates.password = await argon2.hash(password, {
          type: argon2.argon2id,
          memoryCost: 2 ** 16,
          timeCost: 4,
          parallelism: 1,
        });
      }

      // Обновление пользователя
      await user.update(updates, { transaction });

      // Фильтрация измененных полей
      const changedFields = {};
      for (const key in updates) {
        if (oldValues[key] !== updates[key]) {
          changedFields[key] = {
            old: oldValues[key],
            new: updates[key],
          };
        }
      }

      // Запись в историю, если были изменения
      if (Object.keys(changedFields).length > 0) {
        await historyService.createHistoryEntry(
          'Пользователь',
          user.id,
          'update',
          changedFields,
          `${req.user.id} ${req.user.last_name} ${req.user.first_name} ${req.user.middle_name}`,
          transaction
        );
      }

      await transaction.commit();
      return res.json(user);
    } catch (error) {
      await transaction.rollback();
      console.error('Ошибка при обновлении пользователя:', error.stack);
      return next(ApiError.internal('Ошибка при обновлении пользователя'));
    }
  }

  // Удаление пользователя по ID
  async deleteUser(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId, { transaction });

      if (!user) {
        await transaction.rollback();
        return next(ApiError.badRequest('Пользователь не найден'));
      }

      if (user) {
        // Получаем старые данные пользователя для истории
        const oldValues = {
          first_name: user.first_name,
          last_name: user.last_name,
          middle_name: user.middle_name,
          login: user.login,
          role: user.role,
        };
        await user.destroy({ transaction });

        // Записываем в историю
        await historyService.createHistoryEntry(
          'Пользователь',
          userId,
          'delete',
          {
            first_name: { old: oldValues.first_name, new: null },
            last_name: { old: oldValues.last_name, new: null },
            middle_name: { old: oldValues.middle_name, new: null },
            login: { old: oldValues.login, new: null },
            role: { old: oldValues.role, new: null },
          },
          `${req.user.id} ${req.user.last_name} ${req.user.first_name} ${req.user.middle_name}`,
          transaction
        );

        await transaction.commit();
        return res.json({ message: 'Пользователь успешно удален' });
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Ошибка при удалении пользователя:', error.stack);
      return next(ApiError.internal('Ошибка при удалении пользователя'));
    }
  }

  // Получение истории для конкретного пользователя
  async getUserHistory(req, res, next) {
    const { userId } = req.params;
    const { page, limit } = req.query;
    try {
      const { count, rows } = await historyService.getHistoryForObject('Пользователь', userId, page, limit);
      return res.json({ count, rows });
    } catch (error) {
      console.error('Ошибка при получении истории пользователя:', error);
      return next(ApiError.internal('Ошибка при получении истории пользователя'));
    }
  }

  // Получение удаленных пользователей
  async getDeletedUsers(req, res, next) {
    try {
      let { page, limit } = req.query;
      page = page || 1;
      limit = limit || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await History.findAndCountAll({
        limit,
        offset,
        where: {
          object_type: 'Пользователь',
          operation_type: 'delete',
        },
      });
      return res.json({ count, rows });
    } catch (error) {
      console.error('Ошибка при получении удаленных пользователей:', error);
      return next(ApiError.internal(error.message));
    }
  }
}

module.exports = new UserController();
