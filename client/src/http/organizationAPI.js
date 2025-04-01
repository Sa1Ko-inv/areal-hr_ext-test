import {$host} from "@/http/index.js";

export const fetchOrganizations = async (page = 1, limit = 10) => {
    const response = await $host.get('api/organization', {
        params: {
            page: page,
            limit: limit
        }
    });
    return response;

}

export const fetchOrganizationWithDepartments = async (id) => {
    const response = await $host.get(`api/organization/${id}/departments`);
    console.log(response.data);
    return response.data;
};

export const createOrganization = async (name, comment) => {
    const response = await $host.post(`api/organization`, {name, comment});
    return response;
}
export const updateOrganization = async (id, name, comment) => {
    const response = await $host.put(`api/organization/${id}`, {name, comment});
    return response;
}

export const deleteOrganization = async (id) => {
    const response = await $host.delete(`api/organization/${id}`);
    return response;
}