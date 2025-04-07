import {$host} from "@/http/index.js";
// Получение всех организаций
export const fetchOrganizations = async (page = 1, limit = 10) => {
    const response = await $host.get('api/organization', {
        params: {
            page: page,
            limit: limit
        }
    });
    return response;

}
// Получение организации по ID с ее отделами
export const fetchOrganizationWithDepartments = async (id) => {
    const response = await $host.get(`api/organization/${id}/departments`);
    console.log(response.data);
    return response.data;
};
// Создание организации
export const createOrganization = async (name, comment) => {
    const response = await $host.post(`api/organization`, {name, comment});
    return response;
}
// Обновление организации
export const updateOrganization = async (id, name, comment) => {
    const response = await $host.put(`api/organization/${id}`, {name, comment});
    return response;
}
// Удаление организации
export const deleteOrganization = async (id) => {
    const response = await $host.delete(`api/organization/${id}`);
    return response;
}

// Получение истории изменений организации
export const fetchOrganizationHistory = async (id, page = 1, limit = 10) => {
    const response = await $host.get(`api/organization/${id}/history`, {
        params: {
            page: page,
            limit: limit
        }
    });
    return response.data;
}

export const fetchDeletedOrganizations = async (page = 1, limit = 10) => {
    const response = await $host.get('api/organization/delete', {
        params: {
            page: page,
            limit: limit
        }
    });
    return response.data;
}