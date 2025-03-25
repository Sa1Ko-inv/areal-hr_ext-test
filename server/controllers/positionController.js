const Position = require('../models/position');
const ApiError = require('../error/ApiError');

class PositionController {
    async createPosition(req, res, next) {
        const {name} = req.body;

        try {
            const position = await Position.create({name});
            return res.json(position);
        } catch (error) {
            console.log('Ошибка при создании должности', error);
            return next(ApiError.internal(error.message));
        }
    }

    async getAllPositions(req, res, next) {
        try {
            const positions = await Position.findAll({paranoid: false});
            return res.json(positions);
        } catch (error) {
            console.log('Ошибка при получении должностей', error);
            return next(ApiError.internal(error.message));
        }
    }
    async updatePosition(req, res, next) {
        const {id} = req.params;
        const {name} = req.body;

        try {
            const position = await Position.findByPk(id);
            if (!position) {
                return next(ApiError.badRequest('Должность не найдена'));
            }

            await position.update({name});

            return res.json(position);
        } catch (error) {
            console.log('Ошибка при обновлении должности', error);
            return next(ApiError.internal(error.message));
        }
    }

    async deletePosition(req, res, next) {
        const {id} = req.params;

        try {
            const position = await Position.findByPk(id);
            if (!position) {
                return next(ApiError.badRequest('Должность не найдена'));
            }

            await position.destroy();
            return res.json({message: 'Должность удалена'});
        } catch (error) {
            console.log('Ошибка при удалении должности', error);
            return next(ApiError.internal(error.message));
        }
    }
}

module.exports = new PositionController();