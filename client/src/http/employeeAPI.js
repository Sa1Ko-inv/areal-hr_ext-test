import {$host} from "@/http/index.js";

export const fetchEmployees = async (page = 1, limit = 10) => {
    const response = await $host.get('api/employee/', {
        params: {
            page: page,
            limit: limit
        }
    });
    console.log(response);
    return response;
}

export const updateEmployees = async (employeeData) => {
    const response = await $host.get(`api/employee/${employeeData.id}`, employeeData);
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


// Получить историю HR операций для конкретного сотрудника
export const fetchEmployeeHRInfo = async (employeeId) => {
    const response = await $host.get(`api/hr_operation/employee/${employeeId}`);
    return response.data;
}
