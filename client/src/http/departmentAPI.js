import {$host} from "@/http/index.js";

export const createDepartment = async (departmentData) => {
    const response = await $host.post('api/department', departmentData);
    return response.data;
};