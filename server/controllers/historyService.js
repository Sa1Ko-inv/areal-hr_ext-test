// services/historyService.js
const History = require('../models/history');

class HistoryService {
    async createHistoryEntry(object_type, object_id, operation_type, changed_fields, changed_by = null) {
        try {
            const historyEntry = await History.create({
                object_type,
                object_id,
                operation_type,
                changed_fields,
                changed_by,
            });
            return historyEntry;
        } catch (error) {
            console.error('Ошибка при записи в историю изменений:', error);
            // Важно: Здесь лучше пробрасывать ошибку выше, чтобы её обработал централизованный обработчик ошибок
            throw error;
        }
    }

    async getHistoryForObject(object_type, object_id, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const { count, rows } = await History.findAndCountAll({
                where: { object_type, object_id },
                order: [['operation_date', 'DESC']], // Сортировка по дате операции
                limit,
                offset,
                distinct: true
            });
            return { count, rows };
        } catch (error) {
            console.error('Ошибка при получении истории объекта:', error);
            throw error;
        }
    }

    async getHistoryByType(object_type, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const { count, rows } = await History.findAndCountAll({
                where: { object_type },
                order: [['operation_date', 'DESC']],
                limit,
                offset,
                distinct: true
            });
            return { count, rows };
        } catch (error) {
            console.error('Ошибка при получении истории по типу объекта:', error);
            throw error;
        }
    }
}

module.exports = new HistoryService();