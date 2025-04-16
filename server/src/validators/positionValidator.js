const Joi = require('joi');

const positionSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    // .external(async (value) => {
    //     const exists = await Position.findOne({ where: { name: value } });
    //     if (exists) {
    //         throw new Error('Должность с таким названием уже существует');
    //     }
    // })
    .messages({
      'string.base': 'Название должности должно быть строкой',
      'string.empty': 'Название должности не может быть пустым',
      'string.min':
        'Название должности должно содержать минимум {#limit} символа',
      'string.max':
        'Название должности должно содержать максимум {#limit} символов',
      'any.required': 'Название должности является обязательным полем',
    }),
});

const positionUpdateSchema = positionSchema.keys({
  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    // .external(async (value, helpers) => {
    //     // Получаем ID из параметров запроса
    //     const id = helpers.prefs.context.params.id;
    //
    //     // Проверяем, существует ли должность с таким именем, исключая текущую
    //     const exists = await Position.findOne({
    //         where: {
    //             name: value,
    //             id: { [Op.ne]: id } // Исключаем текущую должность из проверки
    //         }
    //     });
    //
    //     if (exists) {
    //         throw new Error('Должность с таким названием уже существует');
    //     }
    // })
    .messages({
      'string.base': 'Название должности должно быть строкой',
      'string.empty': 'Название должности не может быть пустым',
      'string.min':
        'Название должности должно содержать минимум {#limit} символа',
      'string.max':
        'Название должности должно содержать максимум {#limit} символов',
    }),
});

// const positionUpdateSchema = positionSchema.keys({
//     name: Joi.string()
//         .min(2)
//         .max(100)
//         .optional()
//         .external(async (value, helpers) => {
//             // Получаем ID из параметров запроса
//             const id = helpers.prefs.context.params.id;
//
//             // Проверяем, существует ли должность с таким именем, исключая текущую
//             const exists = await Position.findOne({
//                 where: {
//                     name: value,
//                     id: { [Op.ne]: id } // Исключаем текущую должность из проверки
//                 }
//             });
//
//             if (exists) {
//                 throw new Error('Должность с таким названием уже существует');
//             }
//         })
//         .messages({
//             'string.base': 'Название должности должно быть строкой',
//             'string.empty': 'Название должности не может быть пустым',
//             'string.min': 'Название должности должно содержать минимум {#limit} символа',
//             'string.max': 'Название должности должно содержать максимум {#limit} символов'
//         }),
//
// });

module.exports = {
  positionSchema,
  positionUpdateSchema,
};
