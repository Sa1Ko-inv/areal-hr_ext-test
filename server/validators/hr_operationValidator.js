const Joi = require('joi');
const Employee = require('../models/employees');
const Department = require('../models/department');
const Position = require('../models/position');

const hireSchema = Joi.object({
    employeeId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID сотрудника должен быть числом',
            'number.integer': 'ID сотрудника должен быть целым числом',
            'number.positive': 'ID сотрудника должен быть положительным числом',
            'any.required': 'ID сотрудника является обязательным полем'
        }),
    departmentId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID отдела должен быть числом',
            'number.integer': 'ID отдела должен быть целым числом',
            'number.positive': 'ID отдела должен быть положительным числом',
            'any.required': 'ID отдела является обязательным полем'
        }),
    positionId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID должности должен быть числом',
            'number.integer': 'ID должности должен быть целым числом',
            'number.positive': 'ID должности должен быть положительным числом',
            'any.required': 'ID должности является обязательным полем'
        }),
    salary: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Зарплата должна быть числом',
            'number.positive': 'Зарплата должна быть положительным числом',
            'any.required': 'Зарплата является обязательным полем'
        })
});

const salaryChangeSchema = Joi.object({
    newSalary: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Новая зарплата должна быть числом',
            'number.positive': 'Новая зарплата должна быть положительным числом',
            'any.required': 'Новая зарплата является обязательным полем'
        })
});

const departmentChangeSchema = Joi.object({
    newDepartmentId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID нового отдела должен быть числом',
            'number.integer': 'ID нового отдела должен быть целым числом',
            'number.positive': 'ID нового отдела должен быть положительным числом',
            'any.required': 'ID нового отдела является обязательным полем'
        }),

});

module.exports = {
    hireSchema,
    salaryChangeSchema,
    departmentChangeSchema
};