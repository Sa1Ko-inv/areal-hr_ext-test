import { $authHost, $host } from './index';

export const fetchPositions = async (page = 1, limit = 100) => {
  const response = await $host.get('api/position', {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response;
};
// Создание должности
export const createPosition = async (name) => {
  const response = await $authHost.post('api/position', { name });
  return response;
};

// Обновление должности по ID
export const updatePosition = async (id, name) => {
  const response = await $authHost.put(`api/position/${id}`, { name });
  return response;
};

// Удаление должности
export const deletePosition = async (id) => {
  const response = await $authHost.delete(`api/position/${id}`);
  return response;
};

// Получение истории должности
export const fetchPositionHistory = async (id, page = 1, limit = 10) => {
  const response = await $host.get(`api/position/${id}/history`, {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response.data;
};

// Получение истории удаленных должностей
export const fethcDeletedPositions = async (page = 1, limit = 10) => {
  const response = await $host.get('api/position/delete', {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response.data;
};
