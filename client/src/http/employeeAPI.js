import {$host} from "@/http/index.js";

export const fetchEmployees = async (page = 1, limit = 10,) => {
    const response = await $host.get('api/employee/', {
        params: {
            page: page,
            limit: limit,
        }
    });
    return response;
};

// Создание сотрудника
export const createEmployees = async (employeeData) => {
    const response = await $host.post("api/employee/", employeeData);
    return response.data;
};


// Загрузка файлов для существующего сотрудника
export const uploadEmployeeFiles = async (employeeId, formData) => {
    const response = await $host.post(`api/employee/${employeeId}/files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
};

// Удаление файла
export const deleteEmployeeFile = async (fileId) => {
    const response = await $host.delete(`api/employee/file/${fileId}`);
    return response.data;
};

// Редактирование сотрудника
export const updateEmployees = async (employeeId, employeeData) => {
    const response = await $host.put(`api/employee/${employeeId}`, employeeData);
    return response.data;
}

// Принятие сотрудника на работу
export const hireEmployee = async (data) => {
    const response = await $host.post('api/hr_operation/hire', data);
    return response.data;
}

// Изменение отдела сотрудника
export const changeDepartment = async (employeeId, data) => {
    const response = await $host.put(`api/hr_operation/department/${employeeId}`, data);
    return response.data;
}

// Изменение зарплаты сотрудника
export const changeSalary = async (employeeId, data) => {
    const response = await $host.put(`api/hr_operation/salary/${employeeId}`, data);
    return response.data;
}

// Уволить сотрудника
export const fireEmployee = async (employeeId) => {
    const response = await $host.post(`api/hr_operation/fire/${employeeId}`);
    return response.data;
}

// Получение истории сотрудника
export const fetchEmployeeHistory = async (employeeId,page = 1, limit = 10) => {
    const response = await $host.get(`api/employee/${employeeId}/history`, {
        params: {
            page: page,
            limit: limit
        }
    });
    return response.data;
}
// Получить историю уволенных сотрудников
export const fetchFiredHistory = async (page = 1, limit = 10) => {
    const response = await $host.get('api/hr_operation/fired-employees', {
        params: {
            page: page,
            limit: limit
        }
    });
    return response.data;
}

// Получить историю HR операций для конкретного сотрудника
export const fetchEmployeeHRInfo = async (employeeId, orderBy) => {
    const response = await $host.get(`api/hr_operation/employee/${employeeId}`, {
        params: {
            orderBy: orderBy
        }
    });
    return response.data;
}
