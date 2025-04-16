const History = require('../models/history');

class HistoryService {
  // Вспомогательная функция для очистки объекта от служебных полей
  _cleanObjectForHistory(obj) {
    if (!obj) return null;
    if (typeof obj !== 'object') return obj;

    // Создаем копию объекта, чтобы не изменять оригинал
    const cleanObj = { ...obj };

    // Удаляем служебные поля
    delete cleanObj.createdAt;
    delete cleanObj.updatedAt;
    delete cleanObj.deletedAt;

    // Обрабатываем вложенные объекты
    for (const key in cleanObj) {
      if (
        Object.prototype.hasOwnProperty.call(cleanObj, key) &&
        typeof cleanObj[key] === 'object' &&
        cleanObj[key] !== null
      ) {
        cleanObj[key] = this._cleanObjectForHistory(cleanObj[key]);
      }
    }

    return cleanObj;
  }

  // Очищает поля changed_fields от служебных полей
  _cleanChangedFields(changed_fields) {
    if (!changed_fields) return null;

    const cleanedFields = {};

    for (const key in changed_fields) {
      if (Object.prototype.hasOwnProperty.call(changed_fields, key)) {
        const field = changed_fields[key];

        cleanedFields[key] = {
          old: this._cleanObjectForHistory(field.old),
          new: this._cleanObjectForHistory(field.new),
        };
      }
    }

    return cleanedFields;
  }

  async createHistoryEntry(
    object_type,
    object_id,
    operation_type,
    changed_fields,
    changed_by = null
  ) {
    try {
      // Очищаем поля changed_fields от служебных полей
      const cleanedChangedFields = this._cleanChangedFields(changed_fields);

      const historyEntry = await History.create({
        object_type,
        object_id,
        operation_type,
        changed_fields: cleanedChangedFields,
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
        distinct: true,
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
        distinct: true,
      });
      return { count, rows };
    } catch (error) {
      console.error('Ошибка при получении истории по типу объекта:', error);
      throw error;
    }
  }

  // Новый метод для получения истории увольнений
  async getFiredEmployeesHistory(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      // Ищем записи с конкретным типом объекта и типом операции
      const { count, rows } = await History.findAndCountAll({
        where: {
          object_type: 'Сотрудник', // Убедитесь, что строка точно совпадает с той, что используется при записи
          operation_type: 'Увольнение', // Убедитесь, что строка точно совпадает с той, что используется при записи
        },
        order: [['operation_date', 'DESC']], // Сортируем по дате увольнения (дата записи в историю)
        limit,
        offset,
        distinct: true, // Обычно полезно с findAndCountAll
      });
      // Очистка данных не требуется здесь, так как мы читаем уже очищенное
      return { count, rows };
    } catch (error) {
      console.error(
        'Ошибка при получении истории уволенных сотрудников:',
        error
      );
      throw error; // Пробрасываем ошибку для обработки выше
    }
  }
}

module.exports = new HistoryService();
