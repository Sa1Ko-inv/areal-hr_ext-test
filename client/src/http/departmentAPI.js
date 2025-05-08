import { $authHost, $host } from '@/http/index.js';

export const fetchDepartments = async () => {
  const response = await $host.get(`/api/department/`);
  return response;
};

export const createDepartment = async (departmentData) => {
  const response = await $authHost.post('/api/department', departmentData);
  return response.data;
};

export const updateDepartment = async (departmentData) => {
  const response = await $authHost.put(
    `/api/department/${departmentData.id}`,
    departmentData
  );
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await $authHost.delete(`/api/department/${id}`);
  return response;
};

export const fetchDepartmentHistory = async (id, page = 1, limit = 10) => {
  const response = await $host.get(`/api/department/${id}/history`, {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response.data;
};
// Получение истории удаленных отделов
export const fetchDeletedDepartments = async (page = 1, limit = 10) => {
  const response = await $host.get('/api/department/delete', {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response.data;
}
