import { $authHost, $host } from '@/http/index.js';
// Получение всех организаций
export const fetchOrganizations = async (page = 1, limit = 10) => {
  const response = await $host.get('/api/organization', {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response;
};
// Получение организации по ID с ее отделами
export const fetchOrganizationWithDepartments = async (id, page = 1, limit = 10) => {
  const response = await $host.get(`/api/organization/${id}/departments`, {
    params: {
      page,
      limit,
    },
  });
  console.log('Response',response);
  console.log('Response.data',response.data);
  console.log('Response.data.rows',response.data.rows);
  return response;
};
// Создание организации
export const createOrganization = async (name, comment) => {
  const response = await $authHost.post(`api/organization`, { name, comment });
  return response;
};
// Обновление организации
export const updateOrganization = async (id, name, comment) => {
  const response = await $authHost.put(`api/organization/${id}`, { name, comment });
  return response;
};
// Удаление организации
export const deleteOrganization = async (id) => {
  const response = await $authHost.delete(`api/organization/${id}`);
  return response;
};

// Получение истории изменений организации
export const fetchOrganizationHistory = async (id, page = 1, limit = 10) => {
  const response = await $host.get(`api/organization/${id}/history`, {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response.data;
};

// Получение истории удаленных организаций
export const fetchDeletedOrganizations = async (page = 1, limit = 10) => {
  const response = await $host.get('api/organization/delete', {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response.data;
};
