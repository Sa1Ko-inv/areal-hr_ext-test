const Joi = require('joi');
const User = require('../models/user');
const { Op } = require('sequelize');

// Схема для регистрации и создания пользователя
const userCreateSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).required().messages({
    'string.base': 'Имя должно быть строкой',
    'string.empty': 'Имя не может быть пустым',
    'string.min': 'Имя должно содержать минимум {#limit} символа',
    'string.max': 'Имя должно содержать максимум {#limit} символов',
    'any.required': 'Имя является обязательным полем',
  }),
  last_name: Joi.string().min(2).max(50).required().messages({
    'string.base': 'Фамилия должна быть строкой',
    'string.empty': 'Фамилия не может быть пустой',
    'string.min': 'Фамилия должна содержать минимум {#limit} символа',
    'string.max': 'Фамилия должна содержать максимум {#limit} символов',
    'any.required': 'Фамилия является обязательным полем',
  }),
  middle_name: Joi.string().min(2).max(50).required().messages({
    'string.base': 'Отчество должно быть строкой',
    'string.empty': 'Отчество не может быть пустым',
    'string.min': 'Отчество должно содержать минимум {#limit} символа',
    'string.max': 'Отчество должно содержать максимум {#limit} символов',
    'any.required': 'Отчество является обязательным полем',
  }),
  login: Joi.string()
    .min(3)
    .max(30)
    .required()
    .external(async (value) => {
      const exists = await User.findOne({ where: { login: value } });
      if (exists) {
        throw new Error('Пользователь с таким логином уже существует');
      }
    })
    .messages({
      'string.base': 'Логин должен быть строкой',
      'string.empty': 'Логин не может быть пустым',
      'string.min': 'Логин должен содержать минимум {#limit} символа',
      'string.max': 'Логин должен содержать максимум {#limit} символов',
      'any.required': 'Логин является обязательным полем',
    }),
  password: Joi.string().min(6).max(30).required().messages({
    'string.base': 'Пароль должен быть строкой',
    'string.empty': 'Пароль не может быть пустым',
    'string.min': 'Пароль должен содержать минимум {#limit} символов',
    'string.max': 'Пароль должен содержать максимум {#limit} символов',
    'any.required': 'Пароль является обязательным полем',
  }),
  role: Joi.string().valid('admin', 'hr_manager').required().messages({
    'string.base': 'Роль должна быть строкой',
    'string.empty': 'Роль не может быть пустой',
    'any.only': 'Роль должна быть одним из: admin, hr_manager',
    'any.required': 'Роль является обязательным полем',
  }),
});

// Схема для входа пользователя
const userLoginSchema = Joi.object({
  login: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Логин должен быть строкой',
    'string.empty': 'Логин не может быть пустым',
    'string.min': 'Логин должен содержать минимум {#limit} символа',
    'string.max': 'Логин должен содержать максимум {#limit} символов',
    'any.required': 'Логин является обязательным полем',
  }),
  password: Joi.string().min(6).max(30).required().messages({
    'string.base': 'Пароль должен быть строкой',
    'string.empty': 'Пароль не может быть пустым',
    'string.min': 'Пароль должен содержать минимум {#limit} символов',
    'string.max': 'Пароль должен содержать максимум {#limit} символов',
    'any.required': 'Пароль является обязательным полем',
  }),
});

// Схема для обновления пользователя (все поля optional)
const userUpdateSchema = userCreateSchema.keys({
  first_name: Joi.string().min(2).max(50).optional().messages({
    'string.base': 'Имя должно быть строкой',
    'string.empty': 'Имя не может быть пустым',
    'string.min': 'Имя должно содержать минимум {#limit} символа',
    'string.max': 'Имя должно содержать максимум {#limit} символов',
  }),
  last_name: Joi.string().min(2).max(50).optional().messages({
    'string.base': 'Фамилия должна быть строкой',
    'string.empty': 'Фамилия не может быть пустой',
    'string.min': 'Фамилия должна содержать минимум {#limit} символа',
    'string.max': 'Фамилия должна содержать максимум {#limit} символов',
  }),
  middle_name: Joi.string().min(2).max(50).optional().messages({
    'string.base': 'Отчество должно быть строкой',
    'string.empty': 'Отчество не может быть пустым',
    'string.min': 'Отчество должно содержать минимум {#limit} символа',
    'string.max': 'Отчество должно содержать максимум {#limit} символов',
  }),
  login: Joi.string()
    .min(3)
    .max(30)
    .optional()
    .external(async (value, helpers) => {
      if (typeof value === 'undefined') return;
      const id = helpers.prefs.context?.params?.id; // Получаем id пользователя из родительского контекста
      const exists = await User.findOne({
        where: {
          login: value,
          id: { [Op.ne]: id },
        },
      });
      if (exists) {
        throw new Error('Пользователь с таким логином уже существует');
      }
    })
    .messages({
      'string.base': 'Логин должен быть строкой',
      'string.empty': 'Логин не может быть пустым',
      'string.min': 'Логин должен содержать минимум {#limit} символа',
      'string.max': 'Логин должен содержать максимум {#limit} символов',
    }),
  password: Joi.string().min(6).max(30).optional().messages({
    'string.base': 'Пароль должен быть строкой',
    'string.empty': 'Пароль не может быть пустым',
    'string.min': 'Пароль должен содержать минимум {#limit} символов',
    'string.max': 'Пароль должен содержать максимум {#limit} символов',
  }),
});

module.exports = {
  userCreateSchema,
  userLoginSchema,
  userUpdateSchema,
};
