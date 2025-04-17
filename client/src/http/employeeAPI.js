import { $authHost, $host } from '@/http/index.js';

export const fetchEmployees = async (page = 1, limit = 10, sortBy = null, sortOrder = 'ASC', searchQuery = '') => {
  const params = {
    page,
    limit,
  };

  if (sortBy) {
    params.sortBy = sortBy;
    params.sortOrder = sortOrder;
  }

  if (searchQuery) {
    params.search = searchQuery;
  }

  const response = await $host.get('api/employee/', { params });
  return response;
};

// Создание сотрудника
export const createEmployees = async (employeeData) => {
  const response = await $authHost.post('api/employee/', employeeData);
  return response.data;
};

// Загрузка файлов для существующего сотрудника
export const uploadEmployeeFiles = async (employeeId, formData) => {
  const response = await $authHost.post(
    `api/employee/${employeeId}/files`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response;
};

// Удаление файла
export const deleteEmployeeFile = async (fileId) => {
  const response = await $authHost.delete(`api/employee/file/${fileId}`);
  return response.data;
};

// Редактирование сотрудника
export const updateEmployees = async (employeeId, employeeData) => {
  const response = await $authHost.put(`api/employee/${employeeId}`, employeeData);
  return response.data;
};

// Принятие сотрудника на работу
export const hireEmployee = async (data) => {
  const response = await $authHost.post('api/hr_operation/hire', data);
  return response.data;
};

// Изменение отдела сотрудника
export const changeDepartment = async (employeeId, data) => {
  const response = await $authHost.put(
    `api/hr_operation/department/${employeeId}`,
    data
  );
  return response.data;
};

// Изменение зарплаты сотрудника
export const changeSalary = async (employeeId, data) => {
  const response = await $authHost.put(
    `api/hr_operation/salary/${employeeId}`,
    data
  );
  return response.data;
};

// Уволить сотрудника
export const fireEmployee = async (employeeId) => {
  const response = await $authHost.post(`api/hr_operation/fire/${employeeId}`);
  return response.data;
};

// Получение истории сотрудника
export const fetchEmployeeHistory = async (
  employeeId,
  page = 1,
  limit = 10
) => {
  const response = await $host.get(`api/employee/${employeeId}/history`, {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response.data;
};
// Получить историю уволенных сотрудников
export const fetchFiredHistory = async (page = 1, limit = 10) => {
  const response = await $host.get('api/hr_operation/fired-employees', {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response.data;
};

// Получить историю HR операций для конкретного сотрудника
export const fetchEmployeeHRInfo = async (employeeId) => {
  const response = await $host.get(`api/hr_operation/employee/${employeeId}`);
  return response.data;
};
