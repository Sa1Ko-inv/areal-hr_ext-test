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

// Добавьте этот метод в файл employeeAPI.js
export const changeDepartment = async (employeeId, data) => {
    const response = await $host.put(`api/hr_operation/department/${employeeId}`, data);
    return response.data;
}

export const fireEmployee = async (employeeId) => {
    const response = await $host.post(`api/hr_operation/fire/${employeeId}`);
    return response.data;
}


// Добавьте этот метод в файл
export const fetchEmployeeHRInfo = async (employeeId) => {
    const response = await $host.get(`api/hr_operation/employee/${employeeId}`);
    return response.data;
}
