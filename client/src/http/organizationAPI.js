import {$host} from "@/http/index.js";

export const fetchOrganizations = async () => {
    const response = await $host.get('api/organization');
    return response;

}

export const fetchOrganizationWithDepartments = async (id) => {
    const response = await $host.get(`api/organization/${id}/departments`);
    return response.data;
};