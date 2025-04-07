const Position = require('../models/position');
const ApiError = require('../error/ApiError');
const historyService = require('./historyService');
const History = require('../models/history');

class PositionController {
    async createPosition(req, res, next) {
        const {name} = req.body;

        try {

            const position = await Position.create({name});
            // Записываем в историю
            await historyService.createHistoryEntry(
                'Должность',
                position.id,
                'create',
                {name: {old: null, new: name}}, // old: null для создания
                null // Пока нет авторизации
            );
            return res.json(position);
        } catch (error) {
            console.log('Ошибка при создании должности', error);
            return next(ApiError.internal(error.message));
        }
    }

    async getAllPositions(req, res, next) {
        try {
            let {page, limit} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;

            const {count, rows} = await Position.findAndCountAll({
                limit,
                offset,
                distinct: true,
                order: [['id', 'ASC']],
            });

            return res.json({count, rows});
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

            const oldName = position.name; // Получаем старое значение

            await position.update({name});

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Должность',
                id,
                'update',
                {name: {old: oldName, new: name}}, // old: oldName, new: name
                null // Пока нет авторизации
            );
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
            const oldName = position.name;
            await position.destroy();

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Должность',
                id,
                'delete',
                {name: {old: oldName, new: null}}, //При удалении новое значение null
                null // Пока нет авторизации
            );

            return res.json({message: 'Должность удалена'});
        } catch (error) {
            console.log('Ошибка при удалении должности', error);
            return next(ApiError.internal(error.message));
        }
    }

    async getPositionHistory(req, res, next) {
        const {id} = req.params;
        const {page, limit} = req.query;
        try {
            const {count, rows} = await historyService.getHistoryForObject('Должность', id, page, limit);
            return res.json({count, rows});
        } catch (error) {
            console.error("Ошибка при получении истории должности", error);
            return next(error); // Передаем ошибку дальше, централизованный обработчик её обработает
        }
    }

    async getDeletedPositions(req, res, next) {
        try {
            let {page, limit} = req.query;
            page = page || 1;
            limit = limit || 10;
            const offset = (page - 1) * limit;

            const {count, rows} = await History.findAndCountAll({
                limit,
                offset,
                distinct: true,
                order: [['operation_date', 'DESC']],
                where: {
                    object_type: 'Должность',
                    operation_type: 'delete'
                },
            });
            return res.json({count, rows});
        } catch (error) {
            console.log('Ошибка при получении удаленных должностей', error);
            return next(ApiError.internal(error.message));
        }
    }
}

module.exports = new PositionController();