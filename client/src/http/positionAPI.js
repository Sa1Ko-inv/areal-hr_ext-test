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

export const createPosition = async (name) => {
  const response = await $authHost.post('api/position', { name });
  return response;
};

export const updatePosition = async (id, name) => {
  const response = await $host.put(`api/position/${id}`, { name });
  return response;
};

export const deletePosition = async (id) => {
  const response = await $host.delete(`api/position/${id}`);
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

export const fethcDeletedPositions = async (page = 1, limit = 10) => {
  const response = await $host.get('api/position/delete', {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response.data;
};
