const Joi = require('joi');

const departmentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.base': 'Название отдела должно быть строкой',
    'string.empty': 'Название отдела не может быть пустым',
    'string.min': 'Название отдела должно содержать минимум {#limit} символа',
    'string.max': 'Название отдела должно содержать максимум {#limit} символов',
    'any.required': 'Название отдела является обязательным полем',
  }),
  comment: Joi.string().allow('').max(500).optional().messages({
    'string.base': 'Комментарий должен быть строкой',
    'string.max': 'Комментарий должен содержать максимум {#limit} символов',
  }),
  organization_id: Joi.number()
    .integer()
    .positive()
    .when('parent_id', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    })
    .messages({
      'number.base': 'ID организации должен быть числом',
      'number.integer': 'ID организации должен быть целым числом',
      'number.positive': 'ID организации должен быть положительным числом',
      'any.required': 'ID организации является обязательным полем',
    }),
  parent_id: Joi.number().integer().positive().allow(null).optional().messages({
    'number.base': 'ID родительского отдела должен быть числом',
    'number.integer': 'ID родительского отдела должен быть целым числом',
    'number.positive': 'ID родительского отдела должен быть положительным числом',
  }),
});

const departmentUpdateSchema = departmentSchema.keys({
  name: Joi.string().min(2).max(100).optional().messages({
    'string.base': 'Название отдела должно быть строкой',
    'string.empty': 'Название отдела не может быть пустым',
    'string.min': 'Название отдела должно содержать минимум {#limit} символа',
    'string.max': 'Название отдела должно содержать максимум {#limit} символов',
  }),
  organization_id: Joi.number().integer().positive().optional().messages({
    'number.base': 'ID организации должен быть числом',
    'number.integer': 'ID организации должен быть целым числом',
    'number.positive': 'ID организации должен быть положительным числом',
  }),
});

module.exports = {
  departmentSchema,
  departmentUpdateSchema,
};
