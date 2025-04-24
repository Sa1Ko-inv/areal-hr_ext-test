const Joi = require('joi');

const hireSchema = Joi.object({
  employee_id: Joi.number().integer().positive().required().messages({
    'number.base': 'ID сотрудника должен быть числом',
    'number.integer': 'ID сотрудника должен быть целым числом',
    'number.positive': 'ID сотрудника должен быть положительным числом',
    'any.required': 'ID сотрудника является обязательным полем',
  }),
  department_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Отдела должен быть указан',
    'number.integer': 'ID отдела должен быть целым числом',
    'number.positive': 'ID отдела должен быть положительным числом',
    'any.required': 'ID отдела является обязательным полем',
  }),
  position_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Должность должна быть указана',
    'number.integer': 'ID должности должен быть целым числом',
    'number.positive': 'ID должности должен быть положительным числом',
    'any.required': 'ID должности является обязательным полем',
  }),
  salary: Joi.number().positive().required().messages({
    'number.base': 'Зарплата должна быть и указана в виде числа',
    'number.positive': 'Зарплата должна быть положительным числом',
    'any.required': 'Зарплата является обязательным полем',
  }),
});

const salaryChangeSchema = Joi.object({
  salary: Joi.number().positive().required().messages({
    'number.base': 'Новая зарплата должна быть числом',
    'number.positive': 'Новая зарплата должна быть положительным числом',
    'any.required': 'Новая зарплата является обязательным полем',
  }),
});

const departmentChangeSchema = Joi.object({
  department_id: Joi.number().integer().positive().required().messages({
    'number.base': 'ID нового отдела должен быть числом',
    'number.integer': 'ID нового отдела должен быть целым числом',
    'number.positive': 'ID нового отдела должен быть положительным числом',
    'any.required': 'ID нового отдела является обязательным полем',
  }),
});

module.exports = {
  hireSchema,
  salaryChangeSchema,
  departmentChangeSchema,
};
