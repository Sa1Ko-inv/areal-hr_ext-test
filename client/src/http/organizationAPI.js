import {$host} from "@/http/index.js";

export const fetchOrganizations = async () => {
    const response = await $host.get('api/organization');
    return response;

}