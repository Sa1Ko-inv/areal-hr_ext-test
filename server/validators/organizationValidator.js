const Joi = require('joi');
const Organization = require('../models/organization');

const organizationSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .external(async (value) => {
            const exists = await Organization.findOne({ where: { name: value } });
            if (exists) {
                throw new Error('организация с таким названием уже существует');
            }
        })
        .messages({
            'string.base': 'Название организации должно быть строкой',
            'string.empty': 'Название организации не может быть пустым',
            'string.min': 'Название организации должно содержать минимум {#limit} символа',
            'string.max': 'Название организации должно содержать максимум {#limit} символов',
            'any.required': 'Название организации является обязательным полем'
        }),
    comment: Joi.string()
        .allow('')
        .max(500)
        .optional()
        .messages({
            'string.base': 'Комментарий должен быть строкой',
            'string.max': 'Комментарий должен содержать максимум {#limit} символов'
        }),
});

const organizationUpdateSchema = organizationSchema.keys({
    name: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.base': 'Название отдела должно быть строкой',
            'string.empty': 'Название отдела не может быть пустым',
            'string.min': 'Название отдела должно содержать минимум {#limit} символа',
            'string.max': 'Название отдела должно содержать максимум {#limit} символов'
        }),

});

module.exports = {
    organizationSchema,
    organizationUpdateSchema
};