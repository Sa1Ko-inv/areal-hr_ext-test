const validate = (schema) => async (req, res, next) => {
    try {
        // Добавляем stripUnknown: true для автоматического удаления не указанных в схеме полей
        req.body = await schema.validateAsync(req.body, {
            abortEarly: false,
            // stripUnknown: true
        });
        next();
    } catch (error) {
        // Обрабатываем Joi-ошибки
        if (error.isJoi) {
            const errors = error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message
            }));
            return res.status(400).json({ errors });
        }

        // Обработка кастомных ошибок
        return res.status(400).json({
            errors: [{
                field: error.path || 'Общая ошибка',
                message: error.message
            }]
        });
    }
};

module.exports = validate;